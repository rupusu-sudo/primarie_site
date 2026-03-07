import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Briefcase,
  Eye,
  FileSignature,
  Gavel,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "Hotărâri Consiliu (HCL)",
    desc: "Registrul proiectelor de hotărâri și al deciziilor adoptate de plenul Consiliului.",
    icon: Gavel,
    href: "/transparenta/hcl",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Achiziții Publice",
    desc: "Programul anual al achizițiilor, licitații în curs și contracte semnate.",
    icon: ShoppingBag,
    href: "/transparenta/achizitii",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Buget și Finanțe",
    desc: "Planificarea financiară anuală, bilanțuri contabile și execuție bugetară.",
    icon: Wallet,
    href: "/transparenta/buget",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Cariere & Concursuri",
    desc: "Anunțuri privind posturile vacante, rezultate probe și liste de concurs.",
    icon: Briefcase,
    href: "/transparenta/cariere",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Contracte Publice",
    desc: "Contractele de închiriere, concesiune și vânzare a bunurilor publice.",
    icon: FileSignature,
    href: "/transparenta/contracte",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Transparență Salarială",
    desc: "Lista funcțiilor și a drepturilor salariale conform Legii 153/2017.",
    icon: Eye,
    href: "/monitorul-oficial/declaratii",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
];

const Transparenta = () => {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(pageRef);
      const heroItems = q(".hero-item");
      const mobileList = q(".mobile-list");
      const mobileItems = q(".mobile-item");
      const desktopList = q(".desktop-list");
      const desktopItems = q(".desktop-item");

      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        );
      }

      if (mobileItems.length) {
        gsap.fromTo(
          mobileItems,
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mobileList[0] || mobileItems[0],
              start: "top 90%",
            },
          },
        );
      }

      if (desktopItems.length) {
        gsap.fromTo(
          desktopItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: desktopList[0] || desktopItems[0],
              start: "top 85%",
            },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Portal Transparență" }]}>
      <section ref={pageRef} className="relative mx-auto min-h-[80vh] max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-slate-50 via-white to-blue-50/50 sm:rounded-[2.5rem]" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] opacity-[0.22] mix-blend-overlay sm:rounded-[2.5rem]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")',
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 sm:gap-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10">
            <div className="flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:pr-5 lg:text-left xl:pr-7">
              <div className="hero-item inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-900 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                </span>
                Conform Legii 544/2001
              </div>

              <h1 className="hero-item text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Transparență
              </h1>

              <div className="hero-item flex w-full flex-col gap-3 pt-2 sm:max-w-md lg:max-w-none">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Informații publice și acces la documente administrative.
                </p>
                <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                  Accesați hotărâri, contracte, bugete, achiziții și alte informații publice într-un spațiu digital
                  clar, coerent și ușor de consultat.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col border-t-4 border-blue-100 pt-5 text-center lg:border-l-4 lg:border-t-0 lg:justify-between lg:pl-6 lg:py-1 lg:text-left xl:pl-8">
              <div className="hero-item">
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <span className="h-px w-10 bg-blue-600" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Portal public</p>
                </div>
                <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900 xl:text-4xl">
                  Informații oficiale într-un format clar și ușor de parcurs.
                </h2>
              </div>

              <p
                className="hero-item mt-6 text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                Pagina centralizează principalele categorii de documente și informații publice ale administrației
                locale, într-o structură unitară și ușor de urmărit pe orice dispozitiv.
              </p>

              <div className="hero-item mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-blue-200 px-6 text-sm font-bold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Link to="/transparenta/hcl">Vezi hotărârile publicate</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mobile-list -mx-8 grid grid-cols-2 gap-3 sm:mx-0 sm:gap-4 lg:hidden">
            {sections.map((section, idx) => (
              <Link
                key={idx}
                to={section.href}
                className="mobile-item group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-3.5 shadow-sm backdrop-blur-xl transition-all duration-300 outline-none active:scale-[0.99] active:shadow-none sm:min-h-[232px] sm:p-4"
              >
                <div className="mb-2.5 flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-300 sm:h-12 sm:w-12 ${section.color} ${section.hoverBg} group-active:text-white`}
                  >
                    <section.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-active:-translate-y-0.5 group-active:translate-x-0.5" />
                </div>

                <h3 className="text-sm font-black leading-tight text-slate-900 line-clamp-3 sm:text-base">
                  {section.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">
                  {section.desc}
                </p>
              </Link>
            ))}
          </div>

          <div className="desktop-list hidden grid-cols-3 gap-6 lg:grid xl:gap-8">
            {sections.map((section, idx) => (
              <Link key={idx} to={section.href} className="desktop-item group block h-full outline-none">
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-white hover:shadow-[0_22px_45px_-20px_rgba(15,23,42,0.35)] ${section.hoverBorder}`}
                >
                  <div className={`absolute left-0 top-0 h-1 w-full opacity-0 transition-opacity duration-500 ${section.hoverBg} group-hover:opacity-100`} />

                  <div className="mb-6 flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-500 ${section.color} ${section.hoverBg} group-hover:text-white`}
                    >
                      <section.icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-900 group-hover:opacity-100" />
                  </div>

                  <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
                    {section.title}
                  </h3>

                  <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-slate-500">{section.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Transparenta;
