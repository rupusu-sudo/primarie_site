// src/data/transparencyData.ts

// Definim cum arată structura unui document
export interface DocumentItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: "buget" | "hotarari" | "declaratii" | "achizitii" | "urbanism";
  year: string;
  pdfUrl: string; // Link către fișier (poate fi local în folderul public sau extern)
}

// Aici adaugi documentele tale. Poți adăuga oricâte vrei.
export const documents: DocumentItem[] = [
  // --- BUGET ---
  {
    id: "b1",
    title: "Proiect de Buget Local 2025",
    date: "2025-01-15",
    description: "Proiectul de buget pentru anul în curs, supus dezbaterii publice.",
    category: "buget",
    year: "2025",
    pdfUrl: "/documents/buget_2025.pdf" // Asigură-te că ai fișierul în folderul public/documents
  },
  {
    id: "b2",
    title: "Execuția Bugetară Trimestrul IV 2024",
    date: "2024-12-31",
    description: "Raport privind veniturile și cheltuielile la final de an.",
    category: "buget",
    year: "2024",
    pdfUrl: "#"
  },

  // --- HOTĂRÂRI ---
  {
    id: "h1",
    title: "HCL Nr. 12/2025 - Aprobare Taxe Locale",
    date: "2025-02-01",
    description: "Hotărâre privind indexarea taxelor și impozitelor locale.",
    category: "hotarari",
    year: "2025",
    pdfUrl: "#"
  },
  {
    id: "h2",
    title: "HCL Nr. 45/2024 - Modernizare Iluminat",
    date: "2024-11-20",
    description: "Aprobarea proiectului de modernizare a iluminatului public.",
    category: "hotarari",
    year: "2024",
    pdfUrl: "#"
  },

  // --- DECLARAȚII AVERE ---
  {
    id: "d1",
    title: "Declarație Avere - Primar",
    date: "2024-06-15",
    description: "Declarație anuală de avere și interese.",
    category: "declaratii",
    year: "2024",
    pdfUrl: "#"
  },

  // --- URBANISM ---
  {
    id: "u1",
    title: "Certificat Urbanism - Extindere Rețea Apă",
    date: "2024-09-10",
    description: "Documentație tehnică pentru extinderea rețelei în satul Moșneni.",
    category: "urbanism",
    year: "2024",
    pdfUrl: "#"
  }
];