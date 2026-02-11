// Centralize API endpoints so the frontend can switch between environments.
// In production we expect VITE_API_URL to be set (e.g. the Railway domain).
// In development we fall back to localhost.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : '');

export const withApiBase = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (!API_URL) return undefined;
  return `${API_URL}${url}`;
};
