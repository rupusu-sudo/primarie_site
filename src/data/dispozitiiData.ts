// src/data/dispozitiiData.ts

export interface Dispozitie {
  id: string;
  number: string;
  date: string;
  description: string;
  documentUrl?: string; // Poate fi undefined dacă nu avem PDF
}

export const dispozitiiData: Dispozitie[] = [
  // --- 2025 ---
  {
    id: "d-2025-5",
    number: "5",
    date: "10.02.2025",
    description: "Dispoziție privind convocarea Consiliului Local în ședință ordinară.",
    documentUrl: "/documents/dispozitii/2025/disp_5.pdf"
  },
  {
    id: "d-2025-1",
    number: "1",
    date: "05.01.2025",
    description: "Dispoziție privind constituirea comisiei de inventariere pe anul 2025.",
    documentUrl: "/documents/dispozitii/2025/disp_1.pdf"
  },
  // --- 2024 ---
  {
    id: "d-2024-100",
    number: "100",
    date: "20.12.2024",
    description: "Dispoziție privind programul de lucru cu publicul de sărbători.",
    documentUrl: "/documents/dispozitii/2024/disp_100.pdf"
  },
  {
    id: "d-2024-50",
    number: "50",
    date: "15.06.2024",
    description: "Dispoziție privind numirea responsabilului cu protecția datelor.",
    // Exemplu fără document atașat:
    // documentUrl: "/documents/dispozitii/2024/disp_50.pdf" 
  }
];