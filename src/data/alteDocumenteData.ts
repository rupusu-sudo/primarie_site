// src/data/alteDocumenteData.ts

export interface AlteDocumenteItem {
  id: string;
  year: string;
  title: string;
  date: string;
  category: string;
  documentUrl: string; // Am pus-o obligatorie ca să nu ai erori la onClick
}

export const alteDocumenteData: AlteDocumenteItem[] = [
  {
    id: "a1",
    year: "2024",
    title: "Raportul de activitate al Primarului pe anul 2023",
    date: "10.02.2024",
    category: "Rapoarte",
    documentUrl: "/documents/diverse/2024/raport_primar.pdf"
  },
  {
    id: "a2",
    year: "2024",
    title: "Publicație căsătorie: Popescu - Ionescu",
    date: "15.03.2024",
    category: "Stare Civilă",
    documentUrl: "/documents/diverse/2024/casatorie_1.pdf"
  },
  {
    id: "a3",
    year: "2023",
    title: "Minuta ședinței publice din 12.12.2023",
    date: "13.12.2023",
    category: "Minute",
    documentUrl: "/documents/diverse/2023/minuta_dec.pdf"
  }
];