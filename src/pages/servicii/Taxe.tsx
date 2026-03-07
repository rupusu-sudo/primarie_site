import { Calculator, CalendarDays, Landmark, MapPin, Phone } from "lucide-react";
import {
  ServicePageLayout,
  type ServicePageConfig,
} from "@/components/servicii/ServicePageLayout";

const config: ServicePageConfig = {
  servicePage: "impozite-si-taxe",
  title: "Impozite și Taxe",
  titleIcon: Calculator,
  mobileTitleLines: ["Impozite", "și", "Taxe"],
  badgeLabel: "Servicii fiscale locale",
  subtitle: "Plată, declarații fiscale și documente utile pentru contribuabili.",
  description:
    "Pagina reunește informațiile esențiale despre plata taxelor locale, termenele importante, actele folosite frecvent și contactul compartimentului responsabil.",
  introShort:
    "Compartimentul de impozite și taxe sprijină contribuabilii cu informații clare despre declarare, plată și eliberarea documentelor fiscale.",
  introLong:
    "Compartimentul de impozite și taxe sprijină contribuabilii cu informații clare despre declarare, plată și eliberarea documentelor fiscale. Pentru o soluționare rapidă, este recomandat să verificați înainte actele necesare, modalitatea de plată potrivită și programul de lucru al ghișeului. Plata online și documentele pregătite corect reduc timpul petrecut la sediul primăriei.",
  locality: "Primăria Almăj, biroul de impozite și taxe locale",
  phone: "0251 449 234",
  email: "primariaalmaj@gmail.com",
  heroActions: [
    { label: "Vezi documentele", href: "#documente" },
    { label: "Plată online", href: "https://www.ghiseul.ro", external: true },
  ],
  facts: [
    { label: "Program ghișeu", value: "Luni - Joi 08:00 - 16:30", icon: CalendarDays },
    { label: "Locație", value: "Parter, biroul taxe și impozite", icon: MapPin },
    { label: "Contact", value: "0251 449 234", icon: Phone },
    { label: "Repere utile", value: "Bonificație la plata integrală în termen", icon: Landmark },
  ],
  overview: {
    badgeLabel: "Ghid de lucru",
    title: "Cum rezolvi rapid o solicitare fiscală",
    description:
      "Fluxul este gândit pentru plata obligațiilor, declararea bunurilor și obținerea documentelor fiscale fără pași inutili.",
    chips: ["Plată la ghișeu", "Plată online", "Transfer bancar", "Certificate fiscale"],
    steps: [
      "Verifică tipul solicitării: plată, declarație fiscală, certificat sau actualizare date.",
      "Pregătește actele de proprietate, documentul de identitate și formularele aferente situației tale.",
      "Alege metoda de plată potrivită: ghișeu, transfer bancar sau Ghișeul.ro.",
      "Pentru certificate și clarificări, contactează compartimentul înainte de deplasare dacă dosarul este complex.",
    ],
  },
  requirements: {
    badgeLabel: "Documente și condiții",
    title: "Ce trebuie pregătit",
    description:
      "Cele mai frecvente cereri fiscale au fost grupate clar, după tipul bunului sau al documentului solicitat.",
    items: [
      {
        title: "Declarare clădire sau teren",
        content:
          "Declarația fiscală se depune după dobândirea bunului sau după orice modificare care influențează impozitul local.",
        items: [
          "Act de proprietate în original și copie",
          "Act de identitate al proprietarului",
          "Document cadastral sau schiță",
          "Declarație fiscală tip ITL",
          "Certificat fiscal de la fostul proprietar, dacă este cazul",
        ],
      },
      {
        title: "Înregistrare mijloc de transport",
        content:
          "Dosarul trebuie să permită identificarea vehiculului și a noului proprietar pentru evidența fiscală locală.",
        items: [
          "Contract de înstrăinare-dobândire",
          "Cartea de identitate a vehiculului",
          "Actul de identitate al noului proprietar",
          "Certificat fiscal de la vânzător",
          "Fișă de înmatriculare",
        ],
      },
      {
        title: "Certificat de atestare fiscală",
        content:
          "Se eliberează la cerere, după verificarea obligațiilor fiscale și a datelor de identificare ale contribuabilului.",
        items: ["Cerere pentru certificat fiscal", "Act de identitate", "Împuternicire, dacă solicitarea este depusă de altă persoană"],
        footer: "Pentru persoane juridice pot fi necesare documente suplimentare de reprezentare.",
      },
    ],
  },
  faq: {
    badgeLabel: "Întrebări frecvente",
    title: "Repere utile pentru contribuabili",
    description:
      "Răspunsuri concise pentru cele mai comune situații legate de termene, plată și documentele fiscale.",
    items: [
      {
        title: "Cum pot plăti fără să vin la primărie?",
        content:
          "Puteți folosi platforma Ghișeul.ro sau transferul bancar. Pentru identificarea corectă a plății este important să menționați numele contribuabilului și tipul obligației.",
      },
      {
        title: "Când sunt termenele principale de plată?",
        content:
          "Termenele orientative sunt 31 martie și 30 septembrie. Plata integrală până la primul termen poate beneficia de bonificația stabilită anual prin hotărâre locală.",
      },
      {
        title: "Ce fac dacă am vândut un bun impozabil?",
        content:
          "Anunțați compartimentul și depuneți documentele care dovedesc transferul de proprietate, astfel încât evidența fiscală să fie actualizată corect.",
      },
    ],
  },
  documentsDescription:
    "Formularele și fișierele publicate pentru acest serviciu sunt încărcate din baza de date și pot fi deschise direct de pe telefon sau desktop.",
  documentsEmptyMessage:
    "Nu există încă documente publicate pentru pagina Impozite și Taxe.",
};

const TaxeImpozite = () => <ServicePageLayout config={config} />;

export default TaxeImpozite;
