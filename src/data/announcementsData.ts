// src/data/announcementsData.ts

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: "Administrație" | "Urbanism" | "Evenimente" | "Licitații" | "Diverse";
  description: string;
  documentUrl?: string; // Link către PDF sau imagine
  isImportant?: boolean;
}

// AICI ADAUGI ANUNȚURILE NOI. ELE VOR APĂREA AUTOMAT PESTE TOT.
export const announcementsData: Announcement[] = [
  {
    id: "1",
    title: "Ședință Ordinară a Consiliului Local",
    date: "25 Martie 2024",
    category: "Administrație",
    description: "Convocare ședință ordinară pentru aprobarea bugetului local pe anul 2024. Prezența consilierilor este obligatorie. Ședința va avea loc în sala de consiliu.",
    isImportant: true,
    documentUrl: "https://pdfobject.com/pdf/sample.pdf" // Exemplu de PDF
  },
  {
    id: "2",
    title: "Anunț privind plata taxelor locale cu reducere",
    date: "15 Martie 2024",
    category: "Diverse",
    description: "Reamintim cetățenilor că termenul limită pentru plata taxelor cu reducere de 10% este 31 Martie. Plățile se pot efectua și online prin Ghiseul.ro.",
    isImportant: false,
  },
  {
    id: "3",
    title: "Întrerupere furnizare apă potabilă",
    date: "10 Martie 2024",
    category: "Urbanism",
    description: "În data de 12.03.2024 se va opri furnizarea apei pe strada Principală între orele 09:00 - 14:00 pentru lucrări de mentenanță la rețea.",
    isImportant: true,
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
  {
    id: "4",
    title: "Concurs de angajare - Post Șofer",
    date: "01 Martie 2024",
    category: "Administrație",
    description: "Primăria Comunei Almăj organizează concurs pentru ocuparea postului vacant de șofer microbuz școlar. Dosarele se depun până la data de 15 Martie.",
    isImportant: false,
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
  {
    id: "5",
    title: "Festivalul Toamnei - Ediția 2024",
    date: "20 Februarie 2024",
    category: "Evenimente",
    description: "Invităm toți locuitorii comunei să participe la organizarea Festivalului Toamnei. Înscrierile pentru producători locali sunt deschise.",
    isImportant: false,
  }
];