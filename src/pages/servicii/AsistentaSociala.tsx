import { CalendarDays, HandHeart, MapPin, Phone } from "lucide-react";

import {
  ServicePageLayout,
  type ServicePageConfig,
} from "@/components/servicii/ServicePageLayout";

const config: ServicePageConfig = {
  servicePage: "asistenta-sociala",
  title: "Asistență Socială",
  titleIcon: HandHeart,
  badgeLabel: "Servicii de sprijin social",
  subtitle: "Beneficii, eligibilitate, documente și sprijin pentru persoane vulnerabile.",
  description:
    "Pagina oferă un traseu clar pentru principalele beneficii sociale, documentele de bază, eligibilitatea orientativă și contactul compartimentului responsabil.",
  introShort:
    "Asistența socială presupune verificarea eligibilității, a veniturilor și a documentelor care susțin situația persoanei sau a familiei.",
  introLong:
    "Asistența socială presupune verificarea eligibilității, a veniturilor și a documentelor care susțin situația persoanei sau a familiei. Pentru a evita deplasări repetate, pagina este structurată ca restul secțiunii: repere rapide, pași principali, documente și întrebări frecvente, urmate de formularele publicate în baza de date.",
  locality: "Primăria Almăj, compartiment Asistență Socială",
  phone: "0251 449 234",
  email: "primariaalmaj@gmail.com",
  heroActions: [
    { label: "Vezi documentele", href: "#documente" },
    { label: "Contact compartiment", href: "#intrebari" },
  ],
  facts: [
    { label: "Program", value: "Luni - Joi 08:00 - 16:30", icon: CalendarDays },
    { label: "Locație", value: "Compartiment Asistență Socială", icon: MapPin },
    { label: "Contact", value: "0251 449 234", icon: Phone },
    { label: "Repere utile", value: "Verifică veniturile și actele familiei", icon: HandHeart },
  ],
  overview: {
    badgeLabel: "Cum începi",
    title: "Pașii pentru depunerea unui dosar social",
    description:
      "Dosarele sociale trebuie pregătite în funcție de tipul de ajutor solicitat și de documentele justificative disponibile.",
    chips: ["Ajutor social", "Alocație familie", "Ajutor încălzire", "Indemnizație handicap"],
    steps: [
      "Identifică beneficiul potrivit situației tale și verifică dacă îndeplinești condițiile de bază.",
      "Pregătește actele de identitate, documentele privind veniturile și dovezile pentru componența familiei.",
      "Completează cererea și declarațiile cerute pentru tipul de sprijin solicitat.",
      "Depune dosarul complet și cere clarificări dacă situația necesită anchetă socială sau documente suplimentare.",
    ],
  },
  requirements: {
    badgeLabel: "Documente și condiții",
    title: "Acte pentru cele mai frecvente beneficii",
    description:
      "Cerințele au fost grupate pentru principalele dosare sociale gestionate la nivelul primăriei.",
    items: [
      {
        title: "Ajutor social / venit minim de incluziune",
        content:
          "Eligibilitatea se verifică pe baza cererii, a declarației și a documentelor privind veniturile și componența familiei.",
        items: [
          "Cerere și declarație pe propria răspundere",
          "Acte de identitate pentru membrii familiei",
          "Certificate de naștere ale copiilor",
          "Adeverințe de venit și alte documente justificative",
        ],
      },
      {
        title: "Alocație de susținere a familiei",
        content:
          "Dosarul se analizează în funcție de veniturile nete, componența familiei și, după caz, frecventarea școlii de către copii.",
        items: [
          "Cerere tip pentru alocație",
          "Acte de identitate ale părinților",
          "Certificate de naștere ale copiilor",
          "Adeverințe de școală și adeverințe de venit",
        ],
      },
      {
        title: "Indemnizație handicap și sprijin asociat",
        content:
          "Solicitarea se face în baza certificatului de încadrare în grad de handicap și a actelor beneficiarului sau reprezentantului legal.",
        items: [
          "Cerere pentru indemnizație sau însoțitor",
          "Certificat de încadrare în grad de handicap",
          "Acte de identitate relevante",
          "Extras de cont pentru plată prin virament",
        ],
      },
    ],
  },
  faq: {
    badgeLabel: "Întrebări frecvente",
    title: "Clarificări pentru dosarele sociale",
    description:
      "Răspunsuri scurte pentru verificarea eligibilității, a termenelor și a documentelor obligatorii.",
    items: [
      {
        title: "Cum aflu ce tip de ajutor mi se potrivește?",
        content:
          "Compartimentul poate oferi informații orientative înainte de depunerea dosarului, însă eligibilitatea finală depinde de actele prezentate și de situația legală a solicitantului.",
      },
      {
        title: "Când se depun cererile pentru ajutorul de încălzire?",
        content:
          "Perioada orientativă de depunere este 15 octombrie - 20 noiembrie, pentru a beneficia de plata integrală, conform procedurilor aplicabile.",
      },
      {
        title: "Trebuie actualizate veniturile declarate?",
        content:
          "Da. Documentele privind veniturile și componența familiei trebuie actualizate ori de câte ori intervin schimbări relevante pentru dosar.",
      },
    ],
  },
  documentsDescription:
    "Formularele publicate pentru asistență socială sunt încărcate din baza de date și pot include cereri, declarații și modele folosite la dosarele sociale.",
  documentsEmptyMessage:
    "Nu există încă documente publicate pentru pagina Asistență Socială.",
};

const AsistentaSociala = () => <ServicePageLayout config={config} />;

export default AsistentaSociala;
