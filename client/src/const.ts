export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Self-Hosted mode: OAuth is disabled, using Magic Link login instead
// This function returns null to indicate OAuth is not available
export const getLoginUrl = (): string | null => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // If OAuth is not configured, return null (Self-Hosted mode)
  if (!oauthPortalUrl || !appId) {
    return null;
  }
  
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// Check if OAuth is available (for conditional rendering)
export const isOAuthEnabled = (): boolean => {
  return !!(import.meta.env.VITE_OAUTH_PORTAL_URL && import.meta.env.VITE_APP_ID);
};
