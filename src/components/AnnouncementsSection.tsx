import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ArrowRight,
  Megaphone,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  fileUrl?: string | null;
  createdAt: string;
}

const chunk = <T,>(items: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Urgent":
      return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
    case "General":
      return <FileText className="w-3.5 h-3.5 mr-1" />;
    case "Informativ":
      return <Info className="w-3.5 h-3.5 mr-1" />;
    default:
      return <Megaphone className="w-3.5 h-3.5 mr-1" />;
  }
};

const AnnouncementsSection = () => {
  const containerRef = useRef(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fetchAnnouncements = useCallback(async (isBackground = false) => {
    try {
      const response = await fetch("http://localhost:3001/api/announcements");
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const sorted = data
          .slice()
          .sort(
            (a: Announcement, b: Announcement) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        const topNine = sorted.slice(0, 9);

        setAnnouncements((prev) =>
          JSON.stringify(prev) === JSON.stringify(topNine) ? prev : topNine
        );
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      if (!isBackground) setIsInitialLoading(false);
    }
  }, []);

  // Interval mare pentru a evita spam-ul rețelei: 30 de minute
  const FETCH_INTERVAL = 30 * 60 * 1000;

  useEffect(() => {
    fetchAnnouncements(false);
    const interval = setInterval(() => fetchAnnouncements(true), FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const visibleAnnouncements = useMemo(() => {
    const limit = isMobile ? 3 : 9;
    return announcements.slice(0, limit);
  }, [announcements, isMobile]);

  const itemsPerSlide = isMobile ? 1 : 3;
  const slides = useMemo(
    () => chunk(visibleAnnouncements, itemsPerSlide),
    [visibleAnnouncements, itemsPerSlide]
  );
  const totalSlides = slides.length;

  useEffect(() => {
    setActiveSlide(0);
  }, [itemsPerSlide, visibleAnnouncements.length]);

  useEffect(() => {
    if (activeSlide >= totalSlides && totalSlides > 0) {
      setActiveSlide(0);
    }
  }, [activeSlide, totalSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const autoDelay = Math.max(4000, Math.round(11000 / Math.max(1, totalSlides)));
    const timer = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % totalSlides),
      autoDelay
    );
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-header",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".reveal-text", {
      y: "120%",
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    })
      .from(".header-desc", { opacity: 0, y: 10, duration: 0.6 }, "-=0.4")
      .from(
        ".header-btn",
        { opacity: 0, x: -10, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
  }, { scope: containerRef });

  useGSAP(
    () => {
      if (isInitialLoading || visibleAnnouncements.length === 0) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.refresh();
        gsap.from(".announcement-card", {
          scrollTrigger: {
            trigger: ".cards-container",
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.1)",
          clearProps: "all",
        });
      });

      return () => ctx.revert();
    },
    { scope: containerRef, dependencies: [isInitialLoading, visibleAnnouncements] }
  );

  return (
    <section
      ref={containerRef}
      className="pt-8 pb-12 md:py-16 bg-white relative z-20 -mt-8 md:-mt-4 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="section-header flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl overflow-hidden relative">
            <div className="flex items-center gap-2 mb-2 reveal-text">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 text-blue-600">
                <Megaphone className="w-3.5 h-3.5" />
              </span>
              <span className="text-blue-600 font-bold tracking-widest text-[10px] uppercase">
                Informații Utile
              </span>
              {!isPaused && (
                <span className="flex h-2 w-2 ml-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </div>

            <div className="overflow-hidden pb-1">
              <h2 className="reveal-text text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Ultimele <span className="text-blue-600">Anunțuri</span>
              </h2>
            </div>

            <div className="header-desc mt-3 flex flex-col gap-3">
              <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
                Rămâneți conectați cu deciziile administrative și noutățile din comunitate, actualizate în timp real.
              </p>

            </div>
          </div>

          <div className="header-btn w-full md:w-auto opacity-0">
            <Link to="/anunturi" className="w-full md:w-auto inline-block">
              <Button
                variant="ghost"
                className="w-full md:w-auto group text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-6 border border-slate-100 hover:border-blue-100 rounded-xl justify-between md:justify-center"
              >
                <span className="font-semibold">Vezi arhiva completă</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {isInitialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : visibleAnnouncements.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nu există anunțuri recente.</p>
          </div>
        ) : (
          <div
            className="cards-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                className="carousel-track flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((group, slideIdx) => (
                  <div
                    key={slideIdx}
                    className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-5 pb-6"
                  >
                    {group.map((announcement) => (
                      <Link
                        key={announcement.id}
                        to="/anunturi"
                        className="announcement-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-slate-100/60 p-5 shadow-[0_16px_60px_-42px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_80px_-40px_rgba(37,99,235,0.35)]"
                      >
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/6 via-transparent to-blue-600/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span
                          className={cn(
                            "absolute right-4 top-4 h-2 w-2 rounded-full shadow-[0_0_0_6px_rgba(59,130,246,0.08)] transition-transform duration-300",
                            announcement.category === "Urgent"
                              ? "bg-red-500"
                              : "bg-blue-500 group-hover:scale-110"
                          )}
                        />

                        <div className="flex items-center justify-between mb-3 mt-1 relative z-10">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border bg-white/70 backdrop-blur",
                              announcement.category === "Urgent"
                                ? "text-red-700 border-red-100 bg-red-50/80"
                                : "text-blue-700 border-blue-100 hover:bg-blue-50"
                            )}
                          >
                            {getCategoryIcon(announcement.category)}
                            {announcement.category}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 bg-white/60 backdrop-blur px-2 py-1 rounded-full border border-slate-200/70">
                            <Clock className="w-3 h-3" />
                            {new Date(announcement.createdAt).toLocaleDateString("ro-RO")}
                          </span>
                        </div>

                        <h3 className="relative z-10 text-lg font-extrabold text-slate-900 mb-2 leading-snug line-clamp-2 transition-colors group-hover:text-blue-700">
                          {announcement.title}
                        </h3>

                        <p className="relative z-10 text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 font-medium flex-grow">
                          {announcement.content}
                        </p>

                        <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-3 border-t border-slate-200/70">
                          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 group-hover:text-blue-700 transition-colors">
                            Citește
                          </span>
                          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200/70 text-blue-600 bg-white/70 backdrop-blur transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {totalSlides > 1 && (
              <div className="flex items-center gap-2 mt-4 md:mt-6 justify-start md:justify-end pr-1">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Sari la slide-ul ${idx + 1}`}
                    onClick={() => setActiveSlide(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      activeSlide === idx
                        ? "w-6 bg-blue-600"
                        : "w-2 bg-slate-200 hover:bg-slate-300"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;

