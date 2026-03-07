export type MemberDocument = {
  label: string;
  url: string | null;
};

export type CouncilMember = {
  name: string;
  role: string;
  party?: string;
  photoUrl?: string;
  documents: MemberDocument[];
};

export type MandateYearBlock = {
  id: string;
  title: string;
  members: CouncilMember[];
};

export type MandateBlock = {
  id: string;
  label: string;
  years: MandateYearBlock[];
};

export const OLD_PAGE_URL = "https://primariaalmaj.ro/index.php?pagina=declar";
const OLD_SITE_BASE = "https://primariaalmaj.ro/";

export const oldDoc = (path: string): string | null => {
  if (!path || path === "#") {
    return null;
  }

  return new URL(path, OLD_SITE_BASE).toString();
};
