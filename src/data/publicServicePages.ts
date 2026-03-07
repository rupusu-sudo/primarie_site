import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Building2,
  CalendarDays,
  HandHeart,
  Home,
  Landmark,
  MapPin,
  Phone,
  ScrollText,
  Tractor,
  Users,
} from "lucide-react";

export type ServiceFact = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type ServiceHeroAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type ServiceAccordionEntry = {
  title: string;
  content: string;
  items?: string[];
  footer?: string;
};

export type PublicServicePageConfig = {
  servicePage: string;
  title: string;
  titleIcon: LucideIcon;
  badgeLabel: string;
  subtitle: string;
  description: string;
  introShort: string;
  introLong: string;
  locality: string;
  phone: string;
  email: string;
  heroActions: ServiceHeroAction[];
  facts: ServiceFact[];
  overview: {
    badgeLabel: string;
    title: string;
    description: string;
    chips: string[];
    steps: string[];
  };
  requirements: {
    badgeLabel: string;
    title: string;
    description: string;
    items: ServiceAccordionEntry[];
  };
  faq: {
    badgeLabel: string;
    title: string;
    description: string;
    items: ServiceAccordionEntry[];
  };
  documentsDescription: string;
  documentsEmptyMessage: string;
};

export const publicServicePages: Record<string, PublicServicePageConfig> = {
  taxe: {
    servicePage: "impozite-si-taxe",
    title: "Impozite și Taxe",
    titleIcon: Banknote,
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
          items: [
            "Cerere pentru certificat fiscal",
            "Act de identitate",
            "Împuternicire, dacă solicitarea este depusă de altă persoană",
          ],
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
  },
  urbanism: {
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
    documentsEmptyMessage:
      "Nu există încă documente publicate pentru pagina Urbanism.",
  },
  stareCivila: {
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
    documentsEmptyMessage:
      "Nu există încă documente publicate pentru pagina Stare Civilă.",
  },
  registruAgricol: {
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
    email: "primariaalmaj@yahoo.com",
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
  },
  asistentaSociala: {
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
  },
  fondLocativ: {
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
    documentsEmptyMessage:
      "Nu există încă documente publicate pentru pagina Fond Locativ.",
  },
};
