import { ArrowRight, Building2, Clock3, MapPinned, Users } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const localFacts = [
  { label: "Locuitori", value: "2.211", target: 2211, icon: Users },
  { label: "Gospodării", value: "672", target: 672, icon: Building2 },
  { label: "Sate aparținătoare", value: "4", target: 4, icon: MapPinned },
  { label: "Program cu publicul", value: "08:00 - 16:00", icon: Clock3 },
];

const images = [
  { id: 1, src: "/assets/about-1.webp", alt: "Primăria Almăj" },
  { id: 2, src: "/assets/about-2.webp", alt: "Biserica din comuna Almăj" },
  { id: 3, src: "/assets/about-3.webp", alt: "Peisaj din Șitoaia" },
  { id: 4, src: "/assets/about-4.webp", alt: "Apus în zona Almăj" },
  { id: 5, src: "/assets/about-5.webp", alt: "Casă tradițională restaurată" },
];

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const autoRef = useRef<number | null>(null);

  const stopAutoplay = useCallback(() => {
    if (autoRef.current !== null) {
      window.clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    stopAutoplay();
    autoRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3200);
  }, [stopAutoplay]);

  const getCardVars = useCallback(
    (index: number): CSSProperties => {
      const total = images.length;
      let offset = index - activeIndex;

      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOffset = Math.abs(offset);
      const direction = offset === 0 ? 0 : offset > 0 ? 1 : -1;

      return {
        ["--offset" as const]: String(offset),
        ["--abs-offset" as const]: String(absOffset),
        ["--direction" as const]: String(direction),
        ["--active" as const]: offset === 0 ? "1" : "0",
      };
    },
    [activeIndex],
  );

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return;
      }

      gsap.from(".about-stat-item", {
        opacity: 0,
        y: 18,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 85%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const counter = { value: 0 };

        gsap.fromTo(
          counter,
          { value: 0 },
          {
            value: target,
            duration: 1.1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = Math.round(counter.value).toLocaleString("ro-RO");
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white pt-8 pb-4 sm:pt-10 sm:pb-6 lg:pt-12 lg:pb-8"
      aria-labelledby="about-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:gap-12">
          <div className="lg:pr-4">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
              Administrație și comunitate
            </p>
            <h2
              id="about-title"
              className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Administrație locală
              <br />
              <span className="text-blue-700 font-serif text-[1.02em] font-bold italic tracking-normal">
                mai simplă și mai aproape
              </span>{" "}
              de comunitate.
            </h2>
            <div className="mt-5 max-w-[38rem] space-y-3 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p>
                Portalul Primăriei Almăj oferă un punct unic de acces la informații publice,
                servicii administrative și noutăți importante pentru locuitori.
              </p>
              <p>
                Homepage-ul este conceput pentru a oferi orientare rapidă: unde găsiți documente,
                cum accesați serviciile primăriei și cum puteți urmări deciziile care privesc
                comuna.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                to="/primaria"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
              >
                Despre instituție
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/istoric"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-slate-900"
              >
                Istoria comunei
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <div
              className="about-coverflow"
              onMouseEnter={stopAutoplay}
              onMouseLeave={startAutoplay}
              onTouchStart={stopAutoplay}
              onTouchEnd={startAutoplay}
            >
              <div className="coverflow-viewport">
                {images.map((image, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={image.id}
                      style={getCardVars(index)}
                      className="coverflow-card-container"
                      onClick={() => setActiveIndex(index)}
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
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Afișează imaginea ${index + 1}`}
                    aria-pressed={index === activeIndex}
                    className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-6 bg-blue-600" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>

            <div className="about-stats mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-slate-200 py-5">
              {localFacts.map((item) => (
                <div key={item.label} className="about-stat-item min-w-0">
                  <div className="flex items-center gap-2 text-slate-500">
                    <item.icon className="h-4 w-4 text-blue-700" />
                    <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {"target" in item ? (
                      <span
                        className="stat-number"
                        data-target={item.target}
                        aria-label={item.target.toLocaleString("ro-RO")}
                      >
                        {item.value}
                      </span>
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
