import { CalendarDays, Home, MapPin, Phone } from "lucide-react";

import {
  ServicePageLayout,
  type ServicePageConfig,
} from "@/components/servicii/ServicePageLayout";

const config: ServicePageConfig = {
  servicePage: "fond-locativ",
  title: "Fond Locativ",
  titleIcon: Home,
  badgeLabel: "Servicii locative",
  subtitle: "Cereri, criterii, proceduri și documente pentru locuințe și solicitări locative.",
  description:
    "Pagina explică tipurile de cereri locative, documentele necesare și reperele administrative pentru locuințe sociale, ANL sau alte solicitări din fondul locativ.",
  introShort:
    "Solicitările din fondul locativ se bazează pe criterii clare, dosare complete și verificarea situației locative și a veniturilor declarate.",
  introLong:
    "Solicitările din fondul locativ se bazează pe criterii clare, dosare complete și verificarea situației locative și a veniturilor declarate. Structura paginii urmează același model ca pagina Primar: introducere, repere rapide, pași esențiali, întrebări frecvente și documentele publicate pentru această zonă administrativă.",
  locality: "Primăria Almăj, compartimentul fond locativ",
  phone: "0251 447 113",
  email: "primariaalmaj@yahoo.com",
  heroActions: [
    { label: "Vezi documentele", href: "#documente" },
    { label: "Listări și proceduri", href: "#cerinte" },
  ],
  facts: [
    { label: "Program", value: "Luni - Joi 08:00 - 16:30", icon: CalendarDays },
    { label: "Locație", value: "Compartiment fond locativ", icon: MapPin },
    { label: "Contact", value: "0251 447 113", icon: Phone },
    { label: "Repere utile", value: "Adeverințele de venit se actualizează periodic", icon: Home },
  ],
  overview: {
    badgeLabel: "Pași esențiali",
    title: "Cum pregătești o cerere locativă",
    description:
      "Dosarele trebuie pregătite în funcție de tipul locuinței și de criteriile aplicabile pentru solicitant.",
    chips: ["Locuințe sociale", "Locuințe ANL", "Actualizare dosar", "Vânzare fond de stat"],
    steps: [
      "Alege tipul solicitării: locuință socială, ANL, actualizare dosar sau cumpărare locuință din fondul de stat.",
      "Verifică documentele privind veniturile, situația locativă actuală și componența familiei.",
      "Pregătește cererea și actele justificative necesare pentru evaluarea dosarului.",
      "Urmărește listele și procedurile publicate de primărie pentru punctaje, clarificări și termene.",
    ],
  },
  requirements: {
    badgeLabel: "Documente și condiții",
    title: "Acte pentru principalele cereri locative",
    description:
      "Criteriile și documentele de bază sunt grupate pentru cele mai frecvente tipuri de solicitări.",
    items: [
      {
        title: "Locuințe sociale",
        content:
          "Dosarul trebuie să arate situația locativă actuală, veniturile și elementele necesare pentru stabilirea punctajului sau a eligibilității.",
        items: [
          "Cerere tip pentru locuință socială",
          "Acte de identitate",
          "Adeverințe de venit pentru ultimele 12 luni",
          "Certificat fiscal și documente privind situația locativă",
        ],
      },
      {
        title: "Locuințe ANL pentru tineri",
        content:
          "Solicitarea este analizată în raport cu vârsta, locul de muncă și lipsa unei alte locuințe în proprietate.",
        items: [
          "Cerere tip ANL",
          "Copie act de identitate",
          "Adeverință loc de muncă în localitate",
          "Declarație notarială privind lipsa unei locuințe în proprietate",
        ],
      },
      {
        title: "Cumpărare locuință din fondul de stat",
        content:
          "Procedura privește chiriașii actuali și necesită dovezi privind contractul și obligațiile achitate la zi.",
        items: [
          "Cerere de cumpărare",
          "Contract de închiriere valabil",
          "Dovada achitării chiriei",
          "Documente suplimentare cerute în procedura de evaluare",
        ],
      },
    ],
  },
  faq: {
    badgeLabel: "Întrebări frecvente",
    title: "Clarificări pentru solicitările locative",
    description:
      "Cele mai comune întrebări despre criterii, actualizarea dosarului și listele publicate de primărie.",
    items: [
      {
        title: "Trebuie actualizat dosarul după depunere?",
        content:
          "Da, atunci când apar schimbări privind veniturile, componența familiei sau alte date relevante pentru evaluarea cererii.",
      },
      {
        title: "Unde verific listele și punctajele?",
        content:
          "Listele și informațiile administrative se publică de primărie. Este recomandat să urmăriți periodic pagina relevantă și documentele afișate.",
      },
      {
        title: "Există termene pentru depunerea adeverințelor de venit?",
        content:
          "Pentru anumite situații, cum sunt chiriașii ANL, adeverințele de venit trebuie depuse anual pentru recalcularea chiriei, conform procedurii în vigoare.",
      },
    ],
  },
  documentsDescription:
    "Documentele publicate pentru fondul locativ sunt încărcate din baza de date și pot include cereri, actualizări de dosar și liste administrative.",
  documentsEmptyMessage: "Nu există încă documente publicate pentru pagina Fond Locativ.",
};

const FondLocativ = () => <ServicePageLayout config={config} />;

export default FondLocativ;
