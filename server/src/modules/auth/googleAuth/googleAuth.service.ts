import crypto from 'crypto';
import { type Profile, type User } from '@prisma/client';
import prisma from '../../../config/prisma.js';
import config from '../../../config/config.js';
import authUtils from '../auth.utils.js';
import tokenService from '../../token/token.service.js';
import { ConflictError, NotFoundError, ServiceUnavailableError, UnauthenticatedError } from '../../../middlewares/errorHandler.js';

type GoogleTokenResponse = {
	access_token?: string;
	expires_in?: number;
	scope?: string;
	token_type?: string;
	id_token?: string;
	refresh_token?: string;
	error?: string;
	error_description?: string;
};

type GoogleUserInfo = {
	id: string;
	email: string;
	verified_email?: boolean;
	name?: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
};

type GoogleAuthSession = {
	user: Omit<User, 'password'>;
	profile: Profile;
	accessToken: string;
	refreshToken: string;
	redirectUrl: string;
};

const getRequiredGoogleEnv = () => {
	const clientId = config.GOOGLE_CLIENT_ID;
	const clientSecret = config.GOOGLE_CLIENT_SECRET;
	const redirectUri = config.GOOGLE_REDIRECT_URI;

	if (!clientId || !clientSecret || !redirectUri) {
		throw new ServiceUnavailableError('Google auth is not configured');
	}

	return { clientId, clientSecret, redirectUri };
};

const getAuthorizationUrl = () => {
	const { clientId, redirectUri } = getRequiredGoogleEnv();

	const url = new URL(config.GOOGLE_AUTH_ENDPOINT);
	url.searchParams.set('client_id', clientId);
	url.searchParams.set('redirect_uri', redirectUri);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('scope', 'openid email profile');
	url.searchParams.set('access_type', 'offline');
	url.searchParams.set('prompt', 'select_account');

	return url.toString();
};

const exchangeCodeForTokens = async (code: string) => {
	const { clientId, clientSecret, redirectUri } = getRequiredGoogleEnv();

	const body = new URLSearchParams({
		code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUri,
		grant_type: 'authorization_code',
	});

	const response = await fetch(config.GOOGLE_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body,
	});

	const payload = await response.json() as GoogleTokenResponse;

	if (!response.ok || !payload.access_token) {
		throw new UnauthenticatedError(payload.error_description || payload.error || 'Failed to exchange Google code');
	}

	return payload;
};

const fetchGoogleUserInfo = async (accessToken: string) => {
	const response = await fetch(config.GOOGLE_USERINFO_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const profile = await response.json() as GoogleUserInfo & { error?: string; error_description?: string };

	if (!response.ok || !profile.email) {
		throw new UnauthenticatedError(profile.error_description || profile.error || 'Failed to fetch Google profile');
	}

	return profile;
};

const splitName = (name?: string, givenName?: string, familyName?: string) => {
	if (givenName || familyName) {
		return {
			firstName: givenName ?? null,
			lastName: familyName ?? null,
		};
	}

	if (!name) {
		return {
			firstName: null,
			lastName: null,
		};
	}

	const parts = name.trim().split(/\s+/);

	return {
		firstName: parts[0] ?? null,
		lastName: parts.slice(1).join(' ') || null,
	};
};

const getUserWithRole = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { role: true },
	});

	if (!user) {
		throw new NotFoundError('User not found');
	}

	return user;
};

const ensureProfile = async (userId: string, picture?: string) => {
	return prisma.profile.upsert({
		where: { userId },
		create: {
			userId,
			avatarUrl: picture ?? null,
			phoneNumber: null,
			addressLine1: null,
			addressLine2: null,
			city: null,
			state: null,
			postalCode: null,
			paymentMethodToken: null,
		},
		update: {
			...(picture ? { avatarUrl: picture } : {}),
		},
	});
};

const createGoogleUserIfNeeded = async (googleUser: GoogleUserInfo) => {
	const existingUser = await prisma.user.findUnique({
		where: { email: googleUser.email },
		include: { role: true },
	});

	if (existingUser && !existingUser.isActive) {
		throw new ConflictError('Account is inactive');
	}

	const { firstName, lastName } = splitName(googleUser.name, googleUser.given_name, googleUser.family_name);

	if (!existingUser) {
		const hashedPassword = await authUtils.hashPassword(crypto.randomBytes(32).toString('hex'));

		const createdUser = await prisma.user.create({
			data: {
				email: googleUser.email,
				password: hashedPassword,
				type: 'CLIENT',
				firstName,
				lastName,
			},
			include: { role: true },
		});

		const profile = await ensureProfile(createdUser.id, googleUser.picture);

		return {
			user: createdUser,
			profile,
		};
	}

	const updatedUser = await prisma.user.update({
		where: { id: existingUser.id },
		data: {
			...(firstName && !existingUser.firstName ? { firstName } : {}),
			...(lastName && !existingUser.lastName ? { lastName } : {}),
		},
		include: { role: true },
	});

	const profile = await ensureProfile(updatedUser.id, googleUser.picture);

	return {
		user: updatedUser,
		profile,
	};
};

const handleGoogleCallback = async (code: string): Promise<GoogleAuthSession> => {
	const tokenResponse = await exchangeCodeForTokens(code);
	const googleProfile = await fetchGoogleUserInfo(tokenResponse.access_token as string);

	const { user, profile } = await createGoogleUserIfNeeded(googleProfile);
	const freshUser = await getUserWithRole(user.id);

	const accessToken = await tokenService.createAccessToken(freshUser.id);
	const refreshToken = await tokenService.createRefreshToken(freshUser.id);
	await tokenService.saveRefreshToken(freshUser.id, refreshToken);

	const { password: _password, ...safeUser } = freshUser;

	return {
		user: safeUser,
		profile,
		accessToken,
		refreshToken,
		redirectUrl: freshUser.type === 'CLIENT'
			? `${config.CLIENT_URL}/user/dashboard`
			: freshUser.role?.title === 'ADMIN'
				? `${config.CLIENT_URL}/admin/dashboard#overview`
				: `${config.CLIENT_URL}/staff/dashboard#overview`,
	};
};

export default {
	getAuthorizationUrl,
	handleGoogleCallback,
};
