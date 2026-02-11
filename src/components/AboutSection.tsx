import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Users,
  Home,
  MapPin,
  Navigation,
  Clock,
  FileText,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Paperclip,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type InfoCard = { title: string; desc: string; icon: React.ReactNode };
type Stat = { label: string; value: number; suffix?: string; icon: React.ReactNode };
type Faq = { id: string; q: string; a: string };

const infoCards: InfoCard[] = [
  { title: "Misiune", desc: "Servicii publice corecte, rapide și accesibile pentru fiecare locuitor.", icon: <Paperclip className="w-5 h-5" /> },
  { title: "Viziune", desc: "O administrație digitală, transparentă și aproape de comunitate.", icon: <Eye className="w-5 h-5" /> },
  { title: "Transparență", desc: "Publicăm hotărârile, bugetele și proiectele în timp util.", icon: <FileText className="w-5 h-5" /> },
  { title: "Program", desc: "Luni–Vineri, 08:00–16:00. Audiențe: Luni 09:00–11:00.", icon: <Clock className="w-5 h-5" /> },
  { title: "Contact rapid", desc: "Telefon: 0251 449 234 • Email: primariaalmaj@gmail.com", icon: <Phone className="w-5 h-5" /> },
  { title: "Locație", desc: "Str. Principală nr. 248, Almăj, Dolj", icon: <Navigation className="w-5 h-5" /> },
];

const stats: Stat[] = [
  { label: "Locuitori", value: 2211, icon: <Users className="w-4 h-4" /> },
  { label: "Gospodării", value: 672, icon: <Home className="w-4 h-4" /> },
  { label: "Sate aparținătoare", value: 4, icon: <MapPin className="w-4 h-4" /> },
  { label: "Distanță de Craiova", value: 18, suffix: " km", icon: <Navigation className="w-4 h-4" /> },
];

const faqs: Faq[] = [
  { id: "faq1", q: "Cum programez o audiență?", a: "Completezi formularul online sau suni la 0251 449 234. Confirmare în 24–48h." },
  { id: "faq2", q: "Cum depun o sesizare?", a: "Prin formularul dedicat sau la registratură. Primești număr de înregistrare automat." },
  { id: "faq3", q: "Unde găsesc hotărârile de consiliu?", a: "În secțiunea Transparență / HCL, organizate pe ani și luni." },
  { id: "faq4", q: "Care este programul cu publicul?", a: "Luni–Vineri 08:00–16:00. Audiențe: Luni 09:00–11:00, cu programare." },
];

const images = [
  { id: 1, src: "/assets/about-1.webp", alt: "Primăria Almăj" },
  { id: 2, src: "/assets/about-2.webp", alt: "Biserica Ortodoxă" },
  { id: 3, src: "/assets/about-3.webp", alt: "Peisaj Sitoaia" },
  { id: 4, src: "/assets/about-4.webp", alt: "Apus peste Jiul de Sus" },
  { id: 5, src: "/assets/about-5.webp", alt: "Casă tradițională restaurată" },
];

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);
  const faqRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const getCardVars = useCallback(
    (index: number): React.CSSProperties => {
      const total = images.length;
      let offset = index - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOffset = Math.abs(offset);
      const direction = offset === 0 ? 0 : offset > 0 ? 1 : -1;

      return {
        "--offset": String(offset),
        "--abs-offset": String(absOffset),
        "--direction": String(direction),
        "--active": offset === 0 ? "1" : "0",
      } as React.CSSProperties;
    },
    [activeIndex, images.length]
  );

  const stopAutoplay = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3200);
  }, [images.length, stopAutoplay]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Mobile card indicator
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const handler = () => {
      const cardWidth = el.firstElementChild?.clientWidth ?? 1;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveCard(Math.min(infoCards.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // ScrollTrigger animations
  useGSAP(
    () => {
      if (prefersReduced) return;

      const ctx = gsap.context(() => {
        gsap.from(".about-hero", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".about-hero", start: "top 85%" },
        });

        gsap.from(".info-card", {
          opacity: 0,
          scale: 0.98,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".info-cards", start: "top 85%" },
        });

        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const obj = { val: 0 };
          gsap.fromTo(
            obj,
            { val: 0 },
            {
              val: target,
              duration: 1.1,
              ease: "power1.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
              onUpdate: () => {
                el.textContent = Math.round(obj.val).toLocaleString("ro-RO");
              },
            }
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [prefersReduced] }
  );

  // FAQ micro animation
  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      faqs.forEach((item) => {
        const el = faqRefs.current[item.id];
        if (!el) return;
        gsap.to(el, {
          height: openFaq === item.id ? "auto" : 0,
          opacity: openFaq === item.id ? 1 : 0,
          duration: 0.25,
          ease: "power2.out",
          immediateRender: false,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [openFaq, prefersReduced]);

  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
    startAutoplay();
  };

  useEffect(() => {
    if (prefersReduced) return;
    startAutoplay();
    return stopAutoplay;
  }, [prefersReduced, startAutoplay, stopAutoplay]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-blue-50/60 shadow-[0_18px_80px_-48px_rgba(15,23,42,0.35)] p-6 sm:p-8 lg:p-12"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.10),transparent_32%),radial-gradient(circle_at_82%_30%,rgba(15,23,42,0.06),transparent_42%)]" />

      <div className="relative space-y-10">
        {/* Hero + Carousel */}
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-[1.05fr,0.95fr] about-hero">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-12 h-1 bg-blue-600 rounded-full" />
              <span className="text-blue-700 font-black uppercase text-[10px] tracking-[0.3em]">Comuna Almăj, Dolj</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
              PRIMĂRIA ALMĂJ <br />
              <span className="text-blue-700 italic font-serif  tracking-normal">Administrație</span> modernitate pentru cetățeni
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed text-base sm:text-lg italic border-l-4 border-blue-100 pl-5">
              Servicii digitale, transparență și răspuns rapid pentru comunitatea din Almăj. Tot ce ai nevoie, într-un singur loc.
            </p>
          </div>

          <div className="relative flex justify-center">
            <div
              className="about-coverflow"
              onMouseEnter={stopAutoplay}
              onMouseLeave={startAutoplay}
            >

              <div className="coverflow-viewport">
                {images.map((image, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={image.id}
                      style={getCardVars(index)}
                      className="coverflow-card-container"
                      onClick={() => handleIndicatorClick(index)}
                      aria-hidden={!isActive}
                    >
                      <div className={`coverflow-card ${isActive ? "active" : ""}`}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {images.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => handleIndicatorClick(index)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${index === activeIndex ? "w-6 bg-blue-600" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="info-cards">
          <div
            ref={cardsRef}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {infoCards.map((card, idx) => (
              <article
                key={card.title}
                className="info-card group relative min-w-[80%] sm:min-w-[60%] md:min-w-0 rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur shadow-[0_14px_60px_-40px_rgba(15,23,42,0.35)] p-5 md:p-6 snap-start will-change-transform"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    {card.icon}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{card.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
                <span className="absolute right-5 top-5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-500/70">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
              </article>
            ))}
          </div>

          {/* Mobile dots */}
          <div className="flex md:hidden justify-center gap-2 mt-4" aria-hidden="true">
            {infoCards.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${activeCard === idx ? "w-6 bg-blue-700" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 about-stats">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="about-stat rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur p-4 shadow-[0_10px_38px_-32px_rgba(15,23,42,0.45)] flex items-center gap-3"
            >
              <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                {stat.icon}
              </span>
              <div className="leading-tight">
                <div className="stat-value text-2xl font-black text-slate-900 flex items-baseline gap-1">
                  <span
                    className="stat-number"
                    data-target={stat.value}
                    aria-label={stat.value.toLocaleString("ro-RO")}
                  >
                    {stat.value.toLocaleString("ro-RO")}
                  </span>
                  {stat.suffix ? (
                    <span className="text-base font-bold text-slate-800 leading-none">{stat.suffix.trim()}</span>
                  ) : null}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur shadow-[0_14px_60px_-44px_rgba(15,23,42,0.35)] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-700 font-black uppercase text-[10px] tracking-[0.26em]">Întrebări frecvente</p>
              <h3 className="text-xl font-black text-slate-900">Informații rapide</h3>
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs">
              <ChevronLeft className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {faqs.map((item) => (
              <div key={item.id} className="py-3">
                <button
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1"
                  onClick={() => setOpenFaq((prev) => (prev === item.id ? null : item.id))}
                  aria-expanded={openFaq === item.id}
                >
                  <span>{item.q}</span>
                  <span className={`transition-transform duration-200 ${openFaq === item.id ? "rotate-90" : "rotate-0"}`}>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </span>
                </button>
                <div
                  ref={(el) => (faqRefs.current[item.id] = el)}
                  className="faq-content overflow-hidden text-slate-600 text-sm leading-relaxed"
                  style={{ height: openFaq === item.id ? "auto" : 0, opacity: openFaq === item.id ? 1 : 0 }}
                >
                  <div className="pt-2 pr-1">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

