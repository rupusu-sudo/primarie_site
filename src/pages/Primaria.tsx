import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  User,
  Users,
  Landmark,
  Gavel,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const navigationCards = [
  {
    icon: User,
    title: "Primarul Comunei",
    description: "Conducerea executivă și coordonare",
    href: "/primaria/primar",
  },
  {
    icon: Users,
    title: "Viceprimarul Comunei",
    description: "Sprijin în administrația locală",
    href: "/primaria/viceprimar",
  },
  {
    icon: Landmark,
    title: "Secretar General",
    description: "Garantul legalității actelor",
    href: "/primaria/secretar-general",
  },
  {
    icon: Gavel,
    title: "Consiliul Local",
    description: "Autoritatea deliberativă a comunei",
    href: "/consiliul-local",
  },
];

const contactInfo = [
  { label: "Telefon", value: "0251 468 001", icon: Phone, link: "tel:0251468001" },
  { label: "Email", value: "primaria@almaj.ro", icon: Mail, link: "mailto:primaria@almaj.ro" },
  { label: "Sediu", value: "Comuna Almăj, Județul Dolj", icon: MapPin },
];

const Primaria = () => {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });
      
      tl.fromTo(".fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 })
        .fromTo(".fade-in-right", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "-=0.4");

      gsap.fromTo(".stagger-item", 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: ".stagger-container", start: "top 85%" } }
      );

      gsap.utils.toArray<HTMLElement>(".fade-up-scroll").forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } }
        );
      });

    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație" }]}>      
      <section ref={pageRef} className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="fade-in-left gsap-optimize inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                Administrație Publică
              </span>
            </div>
            
            <h1 className="fade-in-left gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Primăria Almăj
            </h1>
            
            <div className="fade-in-left gsap-optimize">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                Instituția Executivă a Comunei
              </span>
            </div>
            
            <div className="fade-in-left gsap-optimize flex w-full flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Building2 className="w-5 h-5 text-blue-500" /> Sediul Central
              </span>
            </div>
          </div>

          <div className="order-3 lg:order-2 fade-in-right gsap-optimize flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-center">
            <p className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg" style={{ textIndent: "1.5rem" }}>
              Primăria Comunei Almăj funcționează ca autoritate executivă, având rolul fundamental de a implementa hotărârile Consiliului Local în beneficiul comunității și de a asigura bunul mers al vieții publice. Ne ghidăm după principiile transparenței, eficienței și respectului față de cetățean.
            </p>
          </div>

        </div>

        {/* 2. GRID NAVIGARE (Echivalentul "Informațiilor Rapide") */}
        <section className="stagger-container" aria-labelledby="nav-title">
          <h2 id="nav-title" className="sr-only">Structura Administrativă</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {navigationCards.map((card, idx) => (
              <Link key={idx} to={card.href} className="stagger-item gsap-optimize outline-none group block h-full">
                <div className="h-full flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="pt-0.5 flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. INFORMAȚII INSTITUȚIONALE (Split Layout 50/50 exact ca la Primar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 lg:gap-7 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">
          
          {/* STÂNGA: Informații Directe (Contact) */}
          <section className="fade-up-scroll gsap-optimize lg:col-start-1" aria-labelledby="contact-title">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-5 sm:p-7 lg:p-8 h-full">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <MapPin className="h-3.5 w-3.5" />
                    Informații Publice
                  </span>
                  <h2 id="contact-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Contact Rapid</h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Suntem aici pentru a vă răspunde promt și transparent tuturor solicitărilor.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {contactInfo.map((item, idx) => (
                    <div key={idx} className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:text-blue-600 transition-colors">
                          <item.icon className="w-5 h-5" />
                        </span>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                          {item.link ? (
                            <a href={item.link} className="text-sm sm:text-base font-bold text-slate-700 hover:text-blue-700 transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-slate-700">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* DREAPTA: Program de funcționare */}
          <section className="fade-up-scroll gsap-optimize lg:col-start-2" aria-labelledby="program-title">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 p-5 sm:p-6 lg:p-8 h-full">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                    <Clock className="h-3.5 w-3.5" />
                    Program Instituție
                  </span>
                  <h2 id="program-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Program de Lucru</h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium">Orele de funcționare ale registratura și birourilor primăriei.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_-20px_rgba(15,23,42,0.55)]">
                  <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-600">1</span>
                      <span className="text-sm sm:text-base font-semibold text-slate-800">Luni - Joi</span>
                    </div>
                    <span className="font-black text-slate-900">08:00-16:30</span>
                  </div>
                  <div className="flex justify-between items-center p-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-600">2</span>
                      <span className="text-sm sm:text-base font-semibold text-slate-800">Vineri</span>
                    </div>
                    <span className="font-black text-slate-900">08:00-14:00</span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-blue-50/50 p-4 border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                    Pentru audiențe, vă rugăm să folosiți formularele de pe paginile dedicate funcțiilor de conducere (Primar, Viceprimar, Secretar).
                  </p>
                </div>

              </div>
            </div>
          </section>

        </div>
      </section>
    </PageLayout>
  );
};

export default Primaria;
