export const ENV = {
  appId: process.env.VITE_APP_ID ?? "self-hosted",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Self-hosted mode: disable OAuth if OAUTH_SERVER_URL is not set
  isSelfHosted: !process.env.OAUTH_SERVER_URL,
  siteUrl: process.env.SITE_URL ?? "http://localhost:3000",
};
