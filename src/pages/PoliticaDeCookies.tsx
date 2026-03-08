import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LegalPageShell, {
  LegalContactCard,
  LegalNumberBadge,
  LegalPanel,
  LegalSection,
} from "@/components/legal/LegalPageShell";
import {
  CalendarDays,
  Cookie,
  Gauge,
  Mail,
  Phone,
  Settings2,
  ShieldCheck,
} from "lucide-react";

const cookieTypes = [
  {
    title: "Cookie-uri strict necesare",
    description:
      "Sunt folosite pentru funcționarea corectă a paginilor, securitatea sesiunilor și accesul la funcționalitățile esențiale ale portalului.",
  },
  {
    title: "Cookie-uri de performanță",
    description:
      "Pot susține optimizarea vitezei de încărcare, stabilitatea paginilor și evaluarea modului în care serviciile digitale răspund în utilizare.",
  },
  {
    title: "Cookie-uri de analiză / statistică",
    description:
      "Pot fi utilizate pentru a înțelege traficul și interacțiunile cu site-ul, numai în măsura în care astfel de instrumente sunt configurate efectiv.",
  },
  {
    title: "Cookie-uri de funcționalitate",
    description:
      "Ajută la memorarea unor preferințe de utilizare și la oferirea unei experiențe de navigare mai clare pe dispozitive diferite.",
  },
  {
    title: "Cookie-uri terțe părți",
    description:
      "Apar doar dacă site-ul integrează servicii externe, conținut încorporat sau platforme furnizate de alți operatori.",
  },
];

export default function PoliticaDeCookies() {
  return (
    <LegalPageShell
      title="Politica de Cookies"
      subtitle="Acest site utilizează cookie-uri pentru funcționarea corectă a serviciilor digitale, îmbunătățirea experienței de utilizare și analiza performanței, acolo unde este cazul."
      lastUpdated="Martie 2026"
      lead="Portalul oficial al Primăriei Comunei Almăj folosește tehnologii de tip cookie pentru a susține funcționalitatea de bază a platformei, pentru a păstra anumite preferințe de navigare și pentru a oferi o experiență digitală coerentă, sigură și ușor de utilizat de către cetățeni."
      note="Acest document are caracter informativ și trebuie revizuit în raport cu cookie-urile și tehnologiile similare utilizate efectiv pe site, precum și cu eventualele instrumente de analiză sau integrare active în producție."
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Politica de Cookies" },
      ]}
      infoItems={[
        { label: "Document", value: "Politică privind cookie-urile", icon: Cookie },
        { label: "Actualizare", value: "8 martie 2026", icon: CalendarDays },
        { label: "Aplicabilitate", value: "Portal oficial al instituției", icon: ShieldCheck },
        { label: "Contact", value: "0251 449 234", icon: Phone },
      ]}
      actions={[
        {
          label: "Politica de Confidențialitate",
          href: "/politica-de-confidentialitate",
          variant: "secondary",
        },
        { label: "Contact instituțional", href: "#contact" },
      ]}
    >
      <LegalSection
        id="ce-sunt-cookie-urile"
        badge="Definiție"
        icon={Cookie}
        title="Ce sunt cookie-urile?"
        description="Cookie-urile sunt fișiere de mici dimensiuni stocate pe dispozitivul utilizatorului atunci când acesta accesează un site web."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Acestea pot reține informații limitate despre sesiunea de navigare, despre preferințele utilizatorului sau despre funcționalitățile necesare bunei utilizări a platformei.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            În mediul instituțional, cookie-urile sunt utilizate într-un cadru restrâns și au rolul de a susține funcționarea tehnică, securitatea și, după caz, evaluarea generală a performanței serviciilor digitale.
          </p>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="tipuri-cookie-uri"
        badge="Categorii"
        icon={ShieldCheck}
        title="Ce tipuri de cookie-uri folosim?"
        description="Categorii uzuale de cookie-uri care pot fi întâlnite pe un portal public instituțional."
        className="lg:col-start-2"
        accent="slate"
      >
        <Accordion type="single" collapsible className="border-t border-slate-200">
          {cookieTypes.map((item, index) => (
            <AccordionItem key={item.title} value={`cookie-${index}`} className="border-slate-200">
              <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-800 transition-colors hover:text-blue-700 hover:no-underline sm:py-5 sm:text-base">
                <span className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <LegalNumberBadge value={index + 1} />
                  </div>
                  <span>{item.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="ml-3 border-l border-slate-200 pb-4 pl-9 text-sm font-medium leading-relaxed text-slate-600 sm:pb-5">
                {item.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </LegalSection>

      <LegalSection
        id="control-cookie-uri"
        badge="Control"
        icon={Settings2}
        title="Cum pot controla cookie-urile?"
        description="Utilizatorii au posibilitatea de a gestiona preferințele privind cookie-urile direct din browserul utilizat."
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Setările browserului permit, de regulă, acceptarea, limitarea sau ștergerea cookie-urilor deja stocate. Mecanismele exacte diferă în funcție de aplicația folosită și de dispozitiv.
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium leading-relaxed text-slate-700">
            Dezactivarea unor cookie-uri poate afecta afișarea corectă a unor pagini, menținerea sesiunii sau disponibilitatea anumitor funcționalități ale site-ului.
          </div>
        </LegalPanel>
      </LegalSection>

      <LegalSection
        id="durata-stocare"
        badge="Durată"
        icon={Gauge}
        title="Durata de stocare"
        description="Durata diferă în funcție de rolul tehnic al fiecărui cookie."
        className="lg:col-start-2"
        accent="slate"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LegalPanel className="space-y-3">
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              Cookie-uri de sesiune
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-700">
              Sunt eliminate automat la închiderea browserului și sunt utilizate pentru funcționalități temporare din timpul navigării.
            </p>
          </LegalPanel>
          <LegalPanel className="space-y-3">
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              Cookie-uri persistente
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-700">
              Rămân stocate pentru o perioadă limitată, stabilită de scopul lor tehnic și de configurația reală a platformei.
            </p>
          </LegalPanel>
        </div>
      </LegalSection>

      <LegalSection
        id="actualizari-politica-cookies"
        badge="Revizuire"
        icon={Mail}
        title="Actualizări ale politicii"
        description="Conținutul acestei politici poate fi revizuit periodic pentru a reflecta schimbări tehnice sau administrative."
        className="lg:col-span-2"
        accent="slate"
      >
        <LegalPanel className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Orice modificare relevantă va fi publicată pe această pagină, iar data ultimei actualizări va fi revizuită în mod corespunzător pentru a facilita consultarea versiunii curente.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold leading-relaxed text-slate-700">
            Înainte de publicarea finală, acest text trebuie comparat cu cookie-urile efectiv utilizate de site și cu eventualul mecanism de consimțământ implementat.
          </div>
        </LegalPanel>
      </LegalSection>

      <LegalContactCard className="lg:col-span-2" />
    </LegalPageShell>
  );
}
