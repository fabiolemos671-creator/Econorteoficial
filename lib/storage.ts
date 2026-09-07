import { getStore } from '@netlify/blobs';

// Netlify's Next.js runtime supplies the Blobs credentials automatically.
// No public token, Cloudflare account, or R2 binding is required.
export function quoteStore() {
  return getStore('econorte-quotes', { consistency: 'strong' });
}
