import { CalendarDays, MapPin, Phone, ScrollText, Users } from "lucide-react";

import {
  ServicePageLayout,
  type ServicePageConfig,
} from "@/components/servicii/ServicePageLayout";

const config: ServicePageConfig = {
  servicePage: "stare-civila",
  title: "Stare Civilă",
  titleIcon: ScrollText,
  badgeLabel: "Servicii administrative",
  subtitle: "Nașteri, căsătorii, decese, duplicate și proceduri de stare civilă.",
  description:
    "Pagina concentrează informațiile utile pentru principalele evenimente de viață și pentru actele administrative gestionate de compartimentul de stare civilă.",
  introShort:
    "Serviciul de stare civilă este organizat pe proceduri clare, astfel încât cetățenii să poată identifica rapid actele, termenele și pașii necesari.",
  introLong:
    "Serviciul de stare civilă este organizat pe proceduri clare, astfel încât cetățenii să poată identifica rapid actele, termenele și pașii necesari. Pentru nașteri, căsătorii, decese și eliberarea duplicatelor este importantă prezentarea documentelor corecte și respectarea termenelor administrative prevăzute de lege.",
  locality: "Compartimentul Stare Civilă, parterul Primăriei Almăj",
  phone: "0251 449 234",
  email: "primariaalmaj@gmail.com",
  heroActions: [
    { label: "Vezi documentele", href: "#documente" },
    { label: "Informații utile", href: "#cerinte" },
  ],
  facts: [
    { label: "Program", value: "Luni - Vineri 08:00 - 12:00", icon: CalendarDays },
    { label: "Locație", value: "Parter, acces direct din strada principală", icon: MapPin },
    { label: "Contact", value: "0251 449 234", icon: Phone },
    { label: "Repere utile", value: "După-amiază doar pentru urgențe", icon: Users },
  ],
  overview: {
    badgeLabel: "Flux administrativ",
    title: "Cum pregătești solicitarea",
    description:
      "Pentru fiecare eveniment sau act solicitat, dosarul trebuie organizat în ordinea corectă și depus la compartimentul dedicat.",
    chips: ["Naștere", "Căsătorie", "Deces", "Duplicate și extrase"],
    steps: [
      "Identifică procedura potrivită: înregistrare, oficiere, declarare sau eliberare duplicat.",
      "Pregătește actele în original și copie, conform situației administrative.",
      "Verifică termenul legal și programul de lucru înainte de prezentare.",
      "Solicită clarificări telefonic dacă dosarul implică reprezentare legală sau documente speciale.",
    ],
  },
  requirements: {
    badgeLabel: "Documente și condiții",
    title: "Acte necesare pentru serviciile frecvente",
    description:
      "Cerințele de bază sunt grupate pe cele mai comune proceduri de stare civilă.",
    items: [
      {
        title: "Înregistrare naștere",
        content:
          "Nașterea se declară în termenul legal, pe baza documentelor medicale și a actelor părinților.",
        items: [
          "Certificat medical constatator al născutului",
          "Actele de identitate ale părinților",
          "Certificat de căsătorie, dacă este cazul",
          "Alte documente solicitate de funcționar, după situație",
        ],
      },
      {
        title: "Declarație și oficiere căsătorie",
        content:
          "Viitorii soți depun personal declarația și dosarul pentru stabilirea datei de oficiere.",
        items: [
          "Actele de identitate ale viitorilor soți",
          "Certificatele de naștere",
          "Certificate medicale prenupțiale valabile",
          "Declarația de căsătorie depusă personal",
        ],
      },
      {
        title: "Declarare deces și duplicate",
        content:
          "Pentru declararea decesului sau eliberarea duplicatelor sunt necesare actele persoanei vizate și, după caz, documentele declarantului ori reprezentantului legal.",
        items: [
          "Certificat medical constatator al decesului",
          "Actele de identitate relevante",
          "Cerere pentru duplicat sau extras",
        ],
      },
    ],
  },
  faq: {
    badgeLabel: "Întrebări frecvente",
    title: "Clarificări pentru procedurile de stare civilă",
    description:
      "Răspunsuri utile despre programări, termene și modul de depunere al cererilor.",
    items: [
      {
        title: "Se pot programa căsătorii pentru weekend?",
        content:
          "Da, însă programările pentru weekend se stabilesc în avans și este recomandată o solicitare făcută cu cel puțin două săptămâni înainte.",
      },
      {
        title: "Cine poate solicita un duplicat de certificat?",
        content:
          "Titularul actului, reprezentantul legal sau persoana împuternicită, potrivit regulilor aplicabile fiecărei situații.",
      },
      {
        title: "Unde se depun actele?",
        content:
          "La compartimentul Stare Civilă, situat la parterul Primăriei Almăj, în programul de lucru afișat pe pagină.",
      },
    ],
  },
  documentsDescription:
    "Documentele publicate pentru stare civilă sunt încărcate din baza de date și pot include cereri, formulare și modele administrative utile.",
  documentsEmptyMessage: "Nu există încă documente publicate pentru pagina Stare Civilă.",
};

const StareCivila = () => <ServicePageLayout config={config} />;

export default StareCivila;
