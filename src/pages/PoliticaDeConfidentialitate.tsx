import { Link } from "react-router-dom";
import {
  CalendarDays,
  Cookie,
  FileText,
  LockKeyhole,
  Mail,
  Scale,
  Server,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import LegalPageShell, {
  LegalContactCard,
  LegalNumberBadge,
  LegalPanel,
  LegalSection,
} from "@/components/legal/LegalPageShell";

const collectedData = [
  "Nume și prenume",
  "Adresă de e-mail",
  "Număr de telefon",
  "Informații transmise prin formulare și solicitări online",
  "Date tehnice precum IP, browser sau tip de dispozitiv, în măsura necesară funcționării și securității site-ului",
];

const purposes = [
  "Comunicarea cu cetățenii și transmiterea răspunsurilor la solicitări.",
  "Gestionarea formularelor și a cererilor trimise prin portalul instituției.",
  "Îmbunătățirea serviciilor publice digitale și a modului de utilizare a site-ului.",
  "Asigurarea securității, mentenanței și funcționării tehnice a platformei.",
];

const rights = [
  {
    title: "Dreptul de acces",
    description:
      "Persoana vizată poate solicita informații privind datele prelucrate și modul în care acestea sunt utilizate de instituție.",
  },
  {
    title: "Dreptul la rectificare",
    description:
      "Datele inexacte sau incomplete pot fi corectate la cererea persoanei vizate, în condițiile aplicabile.",
  },
  {
    title: "Dreptul la ștergere",
    description:
      "În situațiile prevăzute de lege, se poate solicita ștergerea unor date personale care nu mai sunt necesare scopului prelucrării.",
  },
  {
    title: "Dreptul la restricționare",
    description:
      "Persoana vizată poate cere limitarea prelucrării anumitor date, atunci când există temei pentru o astfel de măsură.",
  },
  {
    title: "Dreptul la opoziție",
    description:
      "Pot fi formulate obiecții privind anumite operațiuni de prelucrare, în funcție de particularitățile situației concrete.",
  },
  {
    title: "Dreptul de a depune plângere",
    description:
      "Există posibilitatea sesizării autorității competente dacă se apreciază că prelucrarea datelor afectează drepturile persoanei vizate.",
  },
];

export default function PoliticaDeConfidentialitate() {
  return (
    <LegalPageShell
      title="Politica de Confidențialitate"
      subtitle="Primăria Comunei Almăj respectă și protejează datele cu caracter personal, urmărind o prelucrare responsabilă, transparentă și adecvată contextului instituțional."
      lastUpdated="8 martie 2026"
      lead="Portalul oficial al instituției este administrat cu respect pentru viața privată a utilizatorilor și pentru protecția datelor personale. Informațiile transmise prin formulare, solicitări sau interacțiuni tehnice necesare funcționării site-ului sunt tratate cu seriozitate, într-un cadru limitat la scopuri administrative, de comunicare publică și de securitate tehnică."
      note="Această pagină are caracter informativ și trebuie revizuită și adaptată în funcție de activitățile reale de prelucrare desfășurate de instituție, de formularele disponibile și de infrastructura tehnică utilizată în producție."
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Politica de Confidențialitate" },
      ]}
      infoItems={[
        { label: "Document", value: "Protecția datelor personale", icon: ShieldCheck },
        { label: "Actualizare", value: "8 martie 2026", icon: CalendarDays },
        { label: "Domeniu", value: "Comunicare și formulare online", icon: FileText },
        { label: "Contact", value: "primaria@almaj.ro", icon: Mail },
      ]}
      actions={[
        {
          label: "Politica de Cookies",
          href: "/politica-cookies",
          variant: "secondary",
        },
        { label: "Termeni și condiții", href: "/termeni-si-conditii" },
      ]}
    >
      <LegalSection
        id="introducere"
        badge="Introducere"
        icon={ShieldCheck}
        title="Introducere"
        description="Instituția tratează confidențialitatea datelor ca parte esențială a relației cu cetățenii și utilizatorii platformei."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Prelucrarea datelor cu caracter personal se realizează responsabil, în legătură cu furnizarea serviciilor publice digitale, gestionarea solicitărilor adresate primăriei și menținerea funcționării sigure a portalului oficial.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Datele nu sunt colectate în mod excesiv și nu sunt utilizate în alte scopuri decât cele legitime, administrative și tehnice, compatibile cu activitatea instituției.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="date-personale-colectate"
        badge="Date colectate"
        icon={UserCheck}
        title="Ce date cu caracter personal pot fi colectate?"
        description="În funcție de serviciul folosit și de natura solicitării, pot fi prelucrate următoarele categorii de date."
        className="lg:col-start-2"
        accent="slate"
      >
        <div className="grid grid-cols-1 gap-4">
          {collectedData.map((item, index) => (
            <LegalPanel key={item} className="flex items-start gap-3">
              <div className="mt-1">
                <LegalNumberBadge value={index + 1} />
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-800">
                {item}
              </p>
            </LegalPanel>
          ))}
        </div>
      </LegalSection>

      <LegalSection
        id="scopul-colectarii-datelor"
        badge="Utilizare"
        icon={FileText}
        title="Scopul colectării datelor"
        description="Datele pot fi utilizate numai în legătură cu activitatea administrativă și funcționarea platformei."
        className="lg:col-span-2"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {purposes.map((purpose, index) => (
            <LegalPanel key={purpose} className="flex items-start gap-4">
              <div className="mt-0.5">
                <LegalNumberBadge value={index + 1} />
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                {purpose}
              </p>
            </LegalPanel>
          ))}
        </div>
      </LegalSection>

      <LegalSection
        id="temeiul-prelucrarii"
        badge="Temei"
        icon={Scale}
        title="Temeiul prelucrării"
        description="Prelucrarea se realizează într-un cadru instituțional clar și numai pentru scopuri legitime."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Datele personale pot fi prelucrate în baza obligațiilor legale ale instituției, în interes public, pentru soluționarea cererilor adresate de cetățeni sau, acolo unde este necesar, în baza consimțământului exprimat prin formularele disponibile.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Modalitatea concretă de aplicare trebuie analizată în raport cu fiecare flux real de lucru utilizat de primărie.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="stocarea-si-protectia-datelor"
        badge="Protecție"
        icon={Server}
        title="Stocarea și protecția datelor"
        description="Datele sunt păstrate în condiții de securitate adecvate și protejate împotriva accesului neautorizat."
        className="lg:col-start-2"
        accent="slate"
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Instituția urmărește implementarea unor măsuri tehnice și organizatorice rezonabile pentru prevenirea pierderii, modificării, divulgării nepermise sau accesului neautorizat la date.
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-relaxed text-slate-700">
            Durata de păstrare este limitată la perioada necesară îndeplinirii scopurilor administrative, tehnice sau legale aplicabile.
          </div>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="divulgarea-datelor"
        badge="Divulgare"
        icon={LockKeyhole}
        title="Divulgarea datelor"
        description="Datele cu caracter personal nu sunt vândute și nu sunt utilizate în scopuri comerciale."
        className="lg:col-span-2"
        accent="slate"
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Comunicarea datelor poate avea loc numai atunci când există obligații legale, solicitări legitime din partea autorităților competente sau necesitatea implicării unor furnizori autorizați care sprijină funcționarea tehnică a serviciilor digitale.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Orice astfel de partajare trebuie analizată în raport cu necesitatea, proporționalitatea și cadrul legal aplicabil fiecărei activități desfășurate de instituție.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="drepturile-persoanei-vizate"
        badge="Drepturi"
        icon={UserCheck}
        title="Drepturile persoanei vizate"
        description="Persoanele ale căror date sunt prelucrate beneficiază, în condițiile legii, de drepturi clare și opozabile."
        className="lg:col-span-2"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rights.map((right) => (
            <LegalPanel key={right.title} className="space-y-3">
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                {right.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                {right.description}
              </p>
            </LegalPanel>
          ))}
        </div>
        <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 px-5 py-5 text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">
          Pentru exercitarea acestor drepturi, persoana vizată poate contacta instituția prin canalele oficiale. Dacă apreciază că prelucrarea datelor afectează drepturile sale, aceasta poate formula o plângere către autoritatea competentă.
        </div>
      </LegalSection>

      <LegalSection
        id="cookie-uri"
        badge="Legături utile"
        icon={Cookie}
        title="Cookie-uri"
        description="Pentru informații specifice despre modulele cookie utilizate și opțiunile de control disponibile, consultați pagina dedicată."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Politica de confidențialitate trebuie citită împreună cu politica de cookies, mai ales atunci când site-ul utilizează tehnologii de analiză, preferințe sau autentificare.
          </p>
          <Link
            to="/politica-cookies"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-blue-200 hover:text-blue-700"
          >
            Vezi Politica de Cookies
          </Link>
        </LegalPanel>
      </LegalSection>

      <LegalContactCard className="lg:col-start-2" />
    </LegalPageShell>
  );
}
