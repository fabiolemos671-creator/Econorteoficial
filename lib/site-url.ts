export function siteUrl() {
  const value = process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:3000';
  return new URL(value).origin;
}
