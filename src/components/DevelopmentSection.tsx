import { ArrowRight, Building2, Leaf, MapPin, TrendingUp, Zap } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGsapSectionReveal } from "@/hooks/useGsapSectionReveal";

const quickFacts = [
  { label: "Acces principal", value: "Conexiune rutiera prin DN6", icon: MapPin },
  { label: "Proximitate urbana", value: "Aproximativ 18 km pana la Craiova", icon: TrendingUp },
  { label: "Utilitati", value: "Apa, gaz si electricitate disponibile", icon: Zap },
  { label: "Cadru administrativ", value: "Dialog direct pentru proiecte noi", icon: Building2 },
];

const pillars = [
  {
    title: "Industrie si productie",
    description:
      "Zona ramane relevanta pentru activitati productive, extinderea investitiilor si parteneriate cu angajatori activi in proximitate.",
    points: [
      "sprijin administrativ pentru documentatii",
      "orientare catre infrastructura si utilitati",
      "legatura rapida cu serviciile de urbanism",
    ],
    icon: Building2,
  },
  {
    title: "Energie si sustenabilitate",
    description:
      "Proiectele de energie verde si valorificarea resurselor locale pot sustine dezvoltarea pe termen lung a comunei.",
    points: [
      "interes pentru investitii verzi",
      "aliniere cu obiective de eficienta energetica",
      "deschidere pentru proiecte compatibile cu finantari actuale",
    ],
    icon: Leaf,
  },
  {
    title: "Logistica si conectivitate",
    description:
      "Pozitionarea favorabila fata de Craiova si coridoarele rutiere majore sustine activitati logistice si fluxuri regionale.",
    points: [
      "acces usor pentru distributie regionala",
      "pozitionare buna pentru servicii complementare",
      "puncte de acces institutional pentru investitori",
    ],
    icon: Zap,
  },
];

export default function DevelopmentSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsapSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-slate-50 py-10 sm:py-12 lg:py-16"
      aria-labelledby="development-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <div data-reveal="copy">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
              Proiecte si dezvoltare
            </p>
            <h2
              id="development-title"
              className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
            >
              Directiile de dezvoltare trebuie explicate simplu, cu prioritati clare si acces rapid
              la informatii relevante.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              In locul unor blocuri separate, sectiunea pune in acelasi flux contextul local,
              avantajele comunei si legaturile catre paginile unde proiectele pot fi urmarite in
              detaliu.
            </p>

            </div>

            <div className="mt-6 space-y-3" data-reveal="item">
              <Link
                to="/oportunitati-de-dezvoltare"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
              >
                Vezi oportunitatile de dezvoltare
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div>
                <Link
                  to="/servicii/urbanism"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-slate-900"
                >
                  Acces rapid catre urbanism
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 gap-6 border-y border-slate-200 py-6 sm:grid-cols-2"
            data-reveal="group"
          >
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <div className="flex items-center gap-2 text-slate-500">
                  <fact.icon className="h-4 w-4 text-blue-700" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                    {fact.label}
                  </span>
                </div>
                <p className="mt-2 text-base font-bold leading-relaxed text-slate-900 sm:text-lg">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3" data-reveal="group">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="border-t border-slate-200 pt-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-700">
                  <pillar.icon className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-black text-slate-900">{pillar.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {pillar.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
