// src/data/consultationsData.ts

export interface Consultation {
  id: string;
  title: string;
  publishDate: string; 
  deadlineDate: string; 
  description: string;
  status: "In Dezbatere" | "Incheiat" | "Aprobat";
  documentUrl: string; 
}

export const consultationsData: Consultation[] = [
  {
    id: "c1",
    title: "Proiect de hotărâre privind impozitele și taxele locale pentru anul 2025",
    publishDate: "05.11.2024",
    deadlineDate: "20.12.2024",
    description: "Se supune dezbaterii publice proiectul de hotărâre privind indexarea taxelor și impozitelor locale cu rata inflației.",
    status: "In Dezbatere",
    documentUrl: "/documents/consultari/2024/proiect_taxe_2025.pdf"
  },
  {
    id: "c2",
    title: "Proiect de hotărâre privind aprobarea Bugetului Local 2024",
    publishDate: "15.01.2024",
    deadlineDate: "05.02.2024",
    description: "Proiectul bugetului de venituri și cheltuieli al Comunei Almăj pentru anul curent.",
    status: "Aprobat",
    documentUrl: "/documents/consultari/2024/proiect_buget_2024.pdf"
  },
  {
    id: "c3",
    title: "PUZ - Construire Parc Fotovoltaic în extravilan",
    publishDate: "10.03.2024",
    deadlineDate: "25.03.2024",
    description: "Consultare publică privind Planul Urbanistic Zonal pentru obiectivul de investiții energie verde.",
    status: "Incheiat",
    documentUrl: "/documents/consultari/2024/puz_fotovoltaic.pdf"
  },
  {
    id: "c4",
    title: "Regulament de organizare și funcționare al aparatului de specialitate",
    publishDate: "01.02.2024",
    deadlineDate: "15.02.2024",
    description: "Propunere de modificare a organigramei și a regulamentului intern.",
    status: "Aprobat",
    documentUrl: "/documents/consultari/2024/rof_primarie.pdf"
  }
];