// Centralize API endpoints so the frontend can switch between environments.
export const API_URL = import.meta.env.VITE_API_URL || 'https://proiectul-tau.up.railway.app';

export const withApiBase = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};
