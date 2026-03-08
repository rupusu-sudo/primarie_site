import { Link } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  Globe,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";

import LegalPageShell, {
  LegalContactCard,
  LegalNumberBadge,
  LegalPanel,
  LegalSection,
} from "@/components/legal/LegalPageShell";

const publicationPurpose = [
  "Informarea publicului cu privire la activitatea administrației locale.",
  "Publicarea documentelor, anunțurilor și informațiilor de interes public.",
  "Facilitarea comunicării dintre cetățeni și instituție prin servicii digitale.",
];

const usageResponsibilities = [
  "Utilizarea site-ului într-un mod legal, fără afectarea funcționării platformei sau a securității acesteia.",
  "Transmiterea unor informații reale și complete atunci când sunt folosite formulare sau canale de contact.",
  "Evitarea oricărei acțiuni care ar putea compromite disponibilitatea, integritatea sau confidențialitatea serviciilor digitale ale instituției.",
];

export default function TermeniSiConditii() {
  return (
    <LegalPageShell
      title="Termeni și Condiții"
      subtitle="Acest document stabilește regulile generale pentru utilizarea site-ului oficial al Primăriei Comunei Almăj și pentru consultarea informațiilor publicate pe portal."
      lastUpdated="8 martie 2026"
      lead="Website-ul instituției este un canal oficial de informare și comunicare publică. Utilizarea lui presupune consultarea responsabilă a conținutului publicat, respectarea cadrului legal aplicabil și folosirea serviciilor digitale într-un mod care nu afectează buna funcționare a platformei sau activitatea administrativă a instituției."
      note="Conținutul acestei pagini trebuie revizuit și adaptat în funcție de serviciile digitale active, formularele publicate, fluxurile administrative și relațiile contractuale reale ale instituției."
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Termeni și Condiții" },
      ]}
      infoItems={[
        { label: "Document", value: "Condiții de utilizare", icon: Scale },
        { label: "Actualizare", value: "8 martie 2026", icon: CalendarDays },
        { label: "Acces", value: "Portal public permanent", icon: Globe },
        { label: "Contact", value: "primaria@almaj.ro", icon: Mail },
      ]}
      actions={[
        {
          label: "Politica de Confidențialitate",
          href: "/politica-de-confidentialitate",
          variant: "secondary",
        },
        { label: "Politica de Cookies", href: "/politica-cookies" },
      ]}
    >
      <LegalSection
        id="introducere"
        badge="Cadru general"
        icon={FileText}
        title="Introducere"
        description="Acești termeni reglementează accesul și utilizarea portalului oficial al Primăriei Comunei Almăj."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Site-ul are rol informativ și administrativ, fiind destinat publicării de documente, anunțuri, informații despre servicii publice și date de interes pentru cetățeni.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Accesarea și utilizarea paginilor implică respectarea regulilor stabilite în acest document și a legislației aplicabile în vigoare.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="acceptarea-termenilor"
        badge="Utilizare"
        icon={ShieldCheck}
        title="Acceptarea termenilor"
        description="Continuarea navigării pe site presupune acceptarea regulilor generale de utilizare a platformei."
        className="lg:col-start-2"
        accent="slate"
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Prin utilizarea portalului, vizitatorii acceptă să folosească serviciile digitale și informațiile publicate într-un mod legal, rezonabil și compatibil cu scopul public al site-ului.
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-relaxed text-slate-700">
            Dacă nu sunteți de acord cu aceste condiții, vă recomandăm să încetați utilizarea secțiunilor care presupun interacțiune sau transmitere de date.
          </div>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="scopul-informatiilor-publicate"
        badge="Informare publică"
        icon={Globe}
        title="Scopul informațiilor publicate pe site"
        description="Conținutul publicat urmărește informarea cetățenilor și susținerea relației dintre instituție și comunitate."
        className="lg:col-span-2"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {publicationPurpose.map((item, index) => (
            <LegalPanel key={item} className="space-y-3">
              <LegalNumberBadge value={index + 1} />
              <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                {item}
              </p>
            </LegalPanel>
          ))}
        </div>
      </LegalSection>

      <LegalSection
        id="drepturi-de-autor"
        badge="Conținut"
        icon={FileText}
        title="Drepturi de autor și utilizarea conținutului"
        description="Textele, documentele, elementele grafice și structura site-ului sunt utilizate în context instituțional și pot fi protejate conform cadrului legal aplicabil."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Reproducerea, distribuirea sau reutilizarea conținutului trebuie realizată cu respectarea scopului public al informațiilor și a eventualelor mențiuni privind sursa, integritatea și caracterul oficial al documentelor.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Este interzisă folosirea conținutului publicat într-un mod înșelător, denaturat sau care ar putea crea impresia existenței unei poziții oficiale inexistente din partea instituției.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="responsabilitati-utilizare"
        badge="Obligații"
        icon={Scale}
        title="Responsabilități privind utilizarea site-ului"
        description="Utilizarea portalului trebuie realizată cu bună-credință și cu respectarea scopului public al platformei."
        className="lg:col-start-2"
        accent="slate"
      >
        <div className="space-y-4">
          {usageResponsibilities.map((item, index) => (
            <LegalPanel key={item} className="flex items-start gap-4">
              <div className="mt-0.5">
                <LegalNumberBadge value={index + 1} />
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                {item}
              </p>
            </LegalPanel>
          ))}
        </div>
      </LegalSection>

      <LegalSection
        id="limitarea-raspunderii"
        badge="Răspundere"
        icon={ShieldCheck}
        title="Limitarea răspunderii"
        description="Instituția urmărește actualizarea și corectitudinea informațiilor, însă nu poate garanta lipsa oricărei erori materiale sau indisponibilități temporare."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Primăria Comunei Almăj poate actualiza, corecta sau reorganiza conținutul publicat fără notificare prealabilă, în funcție de nevoile administrative și de evoluția informațiilor publice.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Utilizarea informațiilor publicate se face cu discernământ, iar pentru situații administrative concrete se recomandă verificarea documentelor oficiale și contactarea instituției.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="linkuri-terte"
        badge="Resurse externe"
        icon={Globe}
        title="Linkuri către site-uri terțe"
        description="Portalul poate conține trimiteri către alte site-uri sau platforme administrate de terți."
        className="lg:col-start-2"
        accent="slate"
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Aceste linkuri sunt oferite exclusiv pentru informare sau acces facil la resurse complementare și nu implică asumarea responsabilității pentru conținutul, politica de confidențialitate sau securitatea site-urilor respective.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Utilizatorii sunt încurajați să consulte termenii proprii ai acelor platforme înainte de a le folosi.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="protectia-datelor-si-cookie-uri"
        badge="Conformitate"
        icon={Mail}
        title="Protecția datelor și cookie-uri"
        description="Utilizarea portalului este completată de documentele privind confidențialitatea datelor și cookie-urile."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            În măsura în care site-ul prelucrează date personale sau utilizează tehnologii de tip cookie, aceste aspecte sunt prezentate separat în paginile dedicate, care trebuie consultate împreună cu prezentul document.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/politica-de-confidentialitate"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-blue-200 hover:text-blue-700"
            >
              Politica de Confidențialitate
            </Link>
            <Link
              to="/politica-cookies"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-blue-200 hover:text-blue-700"
            >
              Politica de Cookies
            </Link>
          </div>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="modificari-termeni"
        badge="Revizuire"
        icon={CalendarDays}
        title="Modificări ale termenilor"
        description="Instituția poate actualiza acest document ori de câte ori apar schimbări administrative, tehnice sau juridice relevante."
        className="lg:col-start-2"
        accent="slate"
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Versiunea publicată pe site reprezintă forma curentă a termenilor de utilizare. Data ultimei actualizări este afișată în partea superioară a paginii pentru a facilita consultarea documentului valabil.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold leading-relaxed text-slate-700">
            Pentru situații concrete sau nelămuriri privind utilizarea platformei, se recomandă contactarea directă a instituției.
          </div>
        </LegalPanel>
      </LegalSection>

      <LegalContactCard className="lg:col-span-2" />
    </LegalPageShell>
  );
}
