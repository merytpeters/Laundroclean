import config from '../../../config/config.js';

/**
 * Geocode an address string to latitude and longitude using OpenStreetMap Nominatim.
 * Returns null if no result is found.
 */
async function getLatLonFromAddress(
	address: string
): Promise<{ lat: number; lon: number } | null> {
	if (!address || typeof address !== 'string') return null;

	const query = encodeURIComponent(address.trim());
	const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
	const userAgent = `${config.APP_NAME}/${config.APP_VERSION} (${config.GEOCODER_USER_AGENT})`;

	const headers: Record<string, string> = {
		'Accept-Language': 'en',
		'User-Agent': userAgent,
	};

	let res: Response;
	try {
		res = await fetch(url, { headers });
	} catch (_err) {
		return null;
	}

	if (!res.ok) return null;

	try {
		const data = await res.json();
		if (!Array.isArray(data) || data.length === 0) return null;

		const first = data[0];
		const lat = Number(first.lat);
		const lon = Number(first.lon);

		if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
	} catch {
		return null;
	}

	return null;
}

async function getAreaBound(
	name: string
): Promise< { minLat: number; minLon: number; maxLat: number; maxLon: number } | null> {

	const query = encodeURIComponent(name.trim());
	const url  = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
	const userAgent = `${config.APP_NAME}/${config.APP_VERSION} (${config.GEOCODER_USER_AGENT})`;
	const headers: Record<string, string> = {
		'Accept-Language': 'en',
		'User-Agent': userAgent,
	};

	let res: Response;
	try {
		res = await fetch(url, { headers });
	} catch (_err) {
		return null;
	}

	if (!res.ok) return null;

	try {
		const data = await res.json();
		if (!Array.isArray(data) || data.length === 0) return null;

		const [minLat, maxLat, minLon, maxLon] = data[0].boundingbox;

		if (Number.isFinite(minLat) && Number.isFinite(minLon) && Number.isFinite(maxLat) && Number.isFinite(maxLon)) return { minLat, maxLat, minLon, maxLon };
	} catch {
		return null;
	}

	return null;
}

export default {
	getLatLonFromAddress,
	getAreaBound
};

// This function will be moved to the client side 