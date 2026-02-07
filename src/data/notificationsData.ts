// src/data/notificationsData.ts

export interface Notification {
  id: string;
  title: string;
  date: string;
  description: string;
  category: "Taxe" | "Mediu" | "Agricol" | "Urgent" | "General";
  documentUrl?: string; 
}

export const notificationsData: Notification[] = [
  {
    id: "n1",
    title: "Înștiințare privind plata impozitelor și taxelor locale 2024",
    date: "15 Ianuarie 2024",
    category: "Taxe",
    description: "Vă aducem la cunoștință că impozitele și taxele locale pentru anul 2024 se pot achita începând cu data de 15.01.2024. Pentru plata integrală până la 31 martie se acordă o bonificație de 10%.",
    documentUrl: "/documents/instiintari/plata_taxe_2024.pdf"
  },
  {
    id: "n2",
    title: "Campania de curățenie de primăvară",
    date: "01 Martie 2024",
    category: "Mediu",
    description: "Rugăm toți cetățenii comunei Almăj să procedeze la curățarea șanțurilor, rigolelor și a spațiilor verzi din dreptul proprietăților lor. Colectarea deșeurilor vegetale se va face conform programului atașat.",
    documentUrl: "/documents/instiintari/campanie_curatenie.pdf"
  },
  {
    id: "n3",
    title: "Depunere cereri APIA - Campania 2024",
    date: "20 Februarie 2024",
    category: "Agricol",
    description: "Fermierii sunt invitați la sediul primăriei pentru vizarea adeverințelor necesare la APIA. Programul de lucru cu publicul pentru registrul agricol este zilnic între 08:30 - 12:00.",
  },
  {
    id: "n4",
    title: "Interzicerea arderii resturilor vegetale",
    date: "10 Martie 2024",
    category: "Urgent",
    description: "Vă reamintim că arderea miriștilor, a vegetației uscate și a resturilor vegetale este STRICT INTERZISĂ. Nerespectarea acestei prevederi se sancționează cu amenzi drastice conform legislației în vigoare.",
    documentUrl: "/documents/instiintari/interzis_ardere.pdf"
  },
  {
    id: "n5",
    title: "Eliberare abonamente transport elevi",
    date: "05 Septembrie 2023",
    category: "General",
    description: "Elevii navetiști sunt așteptați la secretariatul școlii pentru vizarea carnetelor și eliberarea adeverințelor necesare pentru transportul gratuit.",
  }
];