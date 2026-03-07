import { Building2, CalendarDays, MapPin, Phone } from "lucide-react";

import {
  ServicePageLayout,
  type ServicePageConfig,
} from "@/components/servicii/ServicePageLayout";

const config: ServicePageConfig = {
  servicePage: "urbanism",
  title: "Urbanism",
  titleIcon: Building2,
  badgeLabel: "Servicii de urbanism",
  subtitle: "Certificate, autorizații și formulare pentru lucrări și reglementări locale.",
  description:
    "Pagina adună în același loc informațiile utile pentru certificate de urbanism, autorizații de construire, dosare tehnice și documentele administrative aferente.",
  introShort:
    "Pentru urbanism este esențial ca dosarul să fie pregătit corect din prima, cu avizele și documentația tehnică cerută pentru tipul lucrării.",
  introLong:
    "Pentru urbanism este esențial ca dosarul să fie pregătit corect din prima, cu avizele și documentația tehnică cerută pentru tipul lucrării. Pagina urmărește același flux simplu ca restul site-ului: ce serviciu cauți, ce acte sunt necesare, care sunt întrebările frecvente și unde găsești formularele publicate de primărie.",
  locality: "Primăria Almăj, compartiment urbanism",
  phone: "0251 449 234",
  email: "primariaalmaj@gmail.com",
  heroActions: [
    { label: "Vezi documentele", href: "#documente" },
    { label: "Contact urbanism", href: "#intrebari" },
  ],
  facts: [
    { label: "Depunere dosare", value: "Luni - Miercuri 08:30 - 12:00", icon: CalendarDays },
    { label: "Locație", value: "Compartiment urbanism, sediul primăriei", icon: MapPin },
    { label: "Contact", value: "0251 449 234", icon: Phone },
    { label: "Repere utile", value: "Verifică avizele stabilite prin certificat", icon: Building2 },
  ],
  overview: {
    badgeLabel: "Pași esențiali",
    title: "Cum pregătești un dosar complet",
    description:
      "Ordinea corectă a pașilor ajută la evitarea refacerii documentației și la depunerea rapidă a cererii.",
    chips: ["Certificat de urbanism", "Autorizație de construire", "Avize", "Documentație tehnică"],
    steps: [
      "Identifică dacă ai nevoie de certificat de urbanism sau direct de completarea unui dosar de autorizare.",
      "Verifică planurile cadastrale, extrasul de carte funciară și memoriul tehnic, dacă sunt necesare pentru cerere.",
      "Pregătește avizele și acordurile cerute prin certificat înainte de depunerea dosarului de autorizare.",
      "Consultă formularele publicate și verifică programul compartimentului înainte de prezentare.",
    ],
  },
  requirements: {
    badgeLabel: "Documente și condiții",
    title: "Documente pentru principalele proceduri",
    description:
      "Structura dosarului diferă în funcție de tipul solicitării, însă cerințele de bază sunt grupate mai jos.",
    items: [
      {
        title: "Certificat de urbanism",
        content:
          "Solicitarea se depune pe baza cererii-tip și a documentelor cadastrale sau topografice prevăzute de lege.",
        items: [
          "Cerere-tip pentru certificat de urbanism",
          "Plan de încadrare în zonă și plan de situație",
          "Extras de carte funciară actualizat",
          "Dovada achitării taxei",
          "Memoriu tehnic justificativ, după caz",
        ],
      },
      {
        title: "Autorizație de construire",
        content:
          "Dosarul de autorizare se depune în baza certificatului de urbanism și a avizelor sau acordurilor stabilite prin acesta.",
        items: [
          "Certificat de urbanism în termen",
          "Document care atestă dreptul asupra imobilului",
          "Proiect pentru autorizarea executării lucrărilor",
          "Avizele și acordurile cerute",
          "Dovada achitării taxei de autorizare",
        ],
      },
      {
        title: "Prelungiri și notificări",
        content:
          "Pentru prelungirea certificatului sau a autorizației, respectiv pentru notificări legate de începerea ori finalizarea lucrărilor, folosiți formularele dedicate publicate de primărie.",
        footer:
          "Toate copiile trebuie prezentate împreună cu originalele pentru conformitate, atunci când este necesar.",
      },
    ],
  },
  faq: {
    badgeLabel: "Întrebări frecvente",
    title: "Ce trebuie verificat înainte de depunere",
    description:
      "Cele mai utile clarificări pentru dosarele de urbanism și documentația tehnică aferentă.",
    items: [
      {
        title: "Pot depune autorizația fără certificat de urbanism?",
        content:
          "Nu. Autorizația de construire se întocmește în baza certificatului de urbanism și a avizelor sau acordurilor impuse prin acesta.",
      },
      {
        title: "Cât de recente trebuie să fie documentele cadastrale?",
        content:
          "Extrasul de carte funciară și documentele tehnice trebuie să fie actualizate conform cerințelor legale și ale procedurii aplicabile.",
      },
      {
        title: "Pot completa formularele înainte de a veni la primărie?",
        content:
          "Da. Este recomandat să descărcați formularele din listă și să le pregătiți în avans, pentru a scurta timpul de verificare la ghișeu.",
      },
    ],
  },
  documentsDescription:
    "Lista documentelor publicate pentru urbanism este încărcată din baza de date și poate include cereri, notificări, modele și fișiere PDF aferente procedurilor.",
  documentsEmptyMessage: "Nu există încă documente publicate pentru pagina Urbanism.",
};

const Urbanism = () => <ServicePageLayout config={config} />;

export default Urbanism;
