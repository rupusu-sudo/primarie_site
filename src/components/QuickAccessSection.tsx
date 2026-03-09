import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGsapSectionReveal } from "@/hooks/useGsapSectionReveal";

const contactDetails = [
  { label: "Adresă", value: "Comuna Almăj, județul Dolj, România", icon: MapPin },
  { label: "Program", value: "Luni – Vineri: 08:00 – 16:00", icon: Clock3 },
];

const quickLinks = [
  {
    title: "Contact",
    description: "Formularul oficial și datele complete ale instituției.",
    href: "/contact",
  },
  {
    title: "Monitorul Oficial Local",
    description: "Dispoziții, regulamente și documente publice actualizate.",
    href: "/monitorul-oficial",
  },
  {
    title: "Transparență administrativă",
    description: "Buget, hotărâri, declarații și alte informații publice.",
    href: "/transparenta",
  },
  {
    title: "Plata taxelor online",
    description: "Acces direct către serviciile fiscale locale.",
    href: "/servicii/taxe",
  },
];

export default function QuickAccessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsapSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-10 sm:py-12 lg:py-16"
      aria-labelledby="quick-access-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div>
            <div data-reveal="copy">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
                Contact și acces rapid
              </p>
              <h2
                id="quick-access-title"
                className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
              >
                Informațiile esențiale ale instituției și legăturile directe sunt reunite într-un
                singur loc.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
                Aici găsiți rapid datele administrative de bază și accesul către cele mai utile
                pagini ale portalului.
              </p>
            </div>

            <div className="mt-6 space-y-5" data-reveal="group">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-4 text-slate-900">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-blue-700">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-relaxed text-slate-900 sm:text-base">
                      {item.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div data-reveal="copy">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
                Acces rapid
              </p>
            </div>

            <div className="mt-4 border-t border-slate-200" data-reveal="group">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex items-start justify-between gap-4 border-b border-slate-200 py-5"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-black text-slate-900 transition-colors group-hover:text-blue-800 sm:text-lg">
                      {item.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-700" />
                </Link>
              ))}
            </div>

            <div className="mt-6" data-reveal="item">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
              >
                Deschide pagina de contact
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
