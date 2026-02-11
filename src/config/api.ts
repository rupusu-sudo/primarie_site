export const API_URL = 'https://primariesite-production.up.railway.app';

export const withApiBase = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (!API_URL) return undefined;
  // Asigură-te că nu ai dublu slash dacă url începe cu /
  const sanitizedUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_URL}${sanitizedUrl}`;
};