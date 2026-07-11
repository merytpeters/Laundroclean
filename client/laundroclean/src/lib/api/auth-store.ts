let accessToken: string | null = null;

const accessTokenCookieName = "accessToken";

const isBrowser = () => typeof document !== "undefined";

const syncAccessTokenCookie = (token: string | null) => {
    if (!isBrowser()) return;

    if (!token) {
        document.cookie = `${accessTokenCookieName}=; Max-Age=0; path=/; SameSite=Lax`;
        return;
    }

    document.cookie = `${accessTokenCookieName}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
};

const readAccessTokenCookie = () => {
    if (!isBrowser()) return null;

    const cookie = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith(`${accessTokenCookieName}=`));

    if (!cookie) return null;

    return decodeURIComponent(cookie.split("=")[1] ?? "");
};

export const setAccessToken = (token: string | null) => {
    accessToken = token;
    syncAccessTokenCookie(token);
};

export const clearAccessToken = () => {
    accessToken = null;
    syncAccessTokenCookie(null);
};

export const hasAccessToken = () => Boolean(getAccessToken());

export const getAccessToken = () => accessToken ?? readAccessTokenCookie();