import { CalendarDays, MapPin, Phone, Tractor } from "lucide-react";

import {
  ServicePageLayout,
  type ServicePageConfig,
} from "@/components/servicii/ServicePageLayout";

const config: ServicePageConfig = {
  servicePage: "registru-agricol",
  title: "Registru Agricol",
  titleIcon: Tractor,
  badgeLabel: "Evidență agricolă locală",
  subtitle: "Declarații, adeverințe, atestate și formulare pentru evidența agricolă.",
  description:
    "Pagina explică rolul registrului agricol, cine trebuie să declare modificările și ce acte sunt folosite pentru adeverințe sau atestate.",
  introShort:
    "Registrul agricol susține evidența locală a terenurilor, culturilor și animalelor și este baza pentru adeverințe și alte documente administrative.",
  introLong:
    "Registrul agricol susține evidența locală a terenurilor, culturilor și animalelor și este baza pentru adeverințe și alte documente administrative. Actualizarea corectă a datelor este importantă pentru solicitările către APIA, pentru atestatele de producător și pentru orice procedură care cere confirmarea situației agricole declarate.",
  locality: "Primăria Almăj, compartimentul Registru Agricol",
  phone: "0251 447 113",
  email: "primariaalmaj@gmail.com",
  heroActions: [
    { label: "Vezi documentele", href: "#documente" },
    { label: "Contact compartiment", href: "#intrebari" },
  ],
  facts: [
    { label: "Program", value: "Luni - Joi 08:00 - 16:30", icon: CalendarDays },
    { label: "Locație", value: "Compartiment Registru Agricol", icon: MapPin },
    { label: "Contact", value: "0251 447 113", icon: Phone },
    { label: "Repere utile", value: "Actualizează datele înainte de cererile APIA", icon: Tractor },
  ],
  overview: {
    badgeLabel: "Pași esențiali",
    title: "Cum actualizezi datele agricole",
    description:
      "Fluxul de lucru urmărește actualizarea corectă a evidențelor și pregătirea actelor pentru adeverințe sau atestate.",
    chips: ["Declarații", "Adeverințe", "Atestat producător", "APIA"],
    steps: [
      "Stabilește dacă ai nevoie de înscriere, actualizare, adeverință sau atestat de producător.",
      "Pregătește actele care dovedesc terenurile, culturile, animalele și situația solicitantului.",
      "Verifică datele deja declarate înainte de depunerea unei noi cereri sau adeverințe.",
      "Solicită clarificări dacă dosarul privește moșteniri, schimbări de nume sau reprezentare legală.",
    ],
  },
  requirements: {
    badgeLabel: "Documente și condiții",
    title: "Acte pentru cele mai frecvente solicitări",
    description:
      "Documentele au fost grupate după principalele servicii oferite de compartimentul registru agricol.",
    items: [
      {
        title: "Înscriere și actualizare în registru",
        content:
          "Se folosește pentru terenuri, culturi, animale și alte modificări necesare evidenței agricole locale.",
        items: [
          "Cerere tip pentru înscriere sau actualizare",
          "Act de identitate",
          "Titlu de proprietate, contract de arendă sau alt document justificativ",
          "Declarații privind suprafețele și culturile",
          "Declarații privind efectivele de animale",
        ],
      },
      {
        title: "Atestat de producător",
        content:
          "Este necesar pentru producătorii agricoli care comercializează produse și au nevoie de documentele prevăzute de lege.",
        items: [
          "Cerere pentru eliberarea atestatului",
          "Copie BI/CI solicitant",
          "Adeverință din registrul agricol",
          "Dovezi privind suprafața agricolă sau efectivele de animale",
        ],
      },
      {
        title: "Adeverințe agricole",
        content:
          "Adeverințele confirmă datele din registrul agricol pentru instituții, dosare administrative sau alte proceduri legale.",
        items: [
          "Cerere pentru adeverință",
          "Act de identitate al solicitantului",
          "Documente care justifică situația cerută, dacă este cazul",
        ],
      },
    ],
  },
  faq: {
    badgeLabel: "Întrebări frecvente",
    title: "Ce trebuie verificat înainte de depunere",
    description:
      "Răspunsuri rapide despre actualizarea datelor, termene și documentele folosite frecvent.",
    items: [
      {
        title: "Cine trebuie să depună declarații?",
        content:
          "Proprietarii sau deținătorii de terenuri, persoanele care declară culturi ori animale și solicitanții de adeverințe sau atestate agricole.",
      },
      {
        title: "De ce este importantă actualizarea registrului?",
        content:
          "Datele actualizate sunt folosite pentru APIA, adeverințe, atestate și alte proceduri administrative. O evidență neactualizată poate întârzia soluționarea cererilor.",
      },
      {
        title: "Există termene orientative pentru declarațiile anuale?",
        content:
          "Da. Pentru multe situații administrative este recomandată depunerea declarațiilor până la 15 mai, în funcție de procedura aplicabilă.",
      },
    ],
  },
  documentsDescription:
    "Documentele publicate pentru registrul agricol sunt preluate din baza de date și pot include cereri, declarații și modele administrative utile pentru fermieri și gospodării.",
  documentsEmptyMessage:
    "Nu există încă documente publicate pentru pagina Registru Agricol.",
};

const RegistruAgricol = () => <ServicePageLayout config={config} />;

export default RegistruAgricol;
