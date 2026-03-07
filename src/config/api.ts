const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");
const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const fallbackApiUrl = import.meta.env.DEV
  ? "http://localhost:3001"
  : "https://primariesite-production.up.railway.app";

export const API_URL = normalizeBaseUrl(configuredApiUrl || fallbackApiUrl);

export const withApiBase = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (!API_URL) return undefined;
  // Asigură-te că nu ai dublu slash dacă url începe cu /
  const sanitizedUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_URL}${sanitizedUrl}`;
};
