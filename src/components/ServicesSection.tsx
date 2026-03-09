import {
  ArrowRight,
  Banknote,
  Calendar,
  FileText,
  HardHat,
  HeartHandshake,
  MessageSquare,
  ScrollText,
  Tractor,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGsapSectionReveal } from "@/hooks/useGsapSectionReveal";

const services = [
  {
    title: "Acte și formulare",
    description: "Documente și cereri utilizate frecvent în relația cu primăria.",
    href: "/servicii",
    icon: FileText,
  },
  {
    title: "Taxe și impozite locale",
    description: "Plata taxelor, informații despre termene și servicii fiscale.",
    href: "/servicii/taxe",
    icon: Banknote,
  },
  {
    title: "Urbanism și construcții",
    description:
      "Certificate de urbanism, autorizații și informații despre documentațiile necesare.",
    href: "/servicii/urbanism",
    icon: HardHat,
  },
  {
    title: "Registrul agricol",
    description: "Adeverințe, înscrieri și informații pentru terenuri și exploatații agricole.",
    href: "/servicii/registru-agricol",
    icon: Tractor,
  },
  {
    title: "Asistență socială",
    description: "Beneficii sociale, ajutoare și servicii oferite comunității.",
    href: "/servicii/asistenta-sociala",
    icon: HeartHandshake,
  },
  {
    title: "Programări și sesizări online",
    description: "Trimite solicitări, sesizări sau programează o audiență.",
    href: "/contact",
    icon: MessageSquare,
  },
  {
    title: "Stare civilă",
    description: "Informații despre certificate, căsătorii și alte proceduri.",
    href: "/servicii/stare-civila",
    icon: Calendar,
  },
  {
    title: "Hotărâri și decizii locale",
    description: "Acces la hotărârile consiliului local și alte documente oficiale.",
    href: "/transparenta/hcl",
    icon: ScrollText,
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsapSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-slate-50 pt-6 pb-10 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16"
      aria-labelledby="services-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl" data-reveal="copy">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
              Servicii publice
            </p>
            <h2
              id="services-title"
              className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
            >
              Serviciile principale sunt prezentate direct, fără pași inutili de navigare.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              Homepage-ul funcționează ca un punct de orientare rapidă, de unde cetățenii pot ajunge
              imediat la cele mai căutate secțiuni ale portalului.
            </p>
          </div>

          <Link
            to="/servicii"
            data-reveal="item"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
          >
            Vezi toate serviciile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-x-8 lg:grid-cols-2" data-reveal="group">
          {services.map((service) => (
            <Link
              key={service.href}
              to={service.href}
              className="group flex items-start gap-4 border-t border-slate-200 py-5 transition-colors"
            >
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700">
                <service.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-4">
                  <span className="text-base font-black text-slate-900 transition-colors group-hover:text-blue-800 sm:text-lg">
                    {service.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-700" />
                </span>
                <span className="mt-2 block max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {service.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
