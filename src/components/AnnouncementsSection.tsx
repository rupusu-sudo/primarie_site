import { ArrowRight, Loader2, Megaphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/config/api";
import { useGsapSectionReveal } from "@/hooks/useGsapSectionReveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const FETCH_INTERVAL = 30 * 60 * 1000;

const previewAnnouncements: Announcement[] = [
  {
    id: -1,
    title: "Exemplu de anunț: întrerupere temporară a alimentării cu apă",
    content:
      "În data de 12 martie 2026, în intervalul 09:00 – 14:00, alimentarea cu apă va fi întreruptă temporar pentru lucrări de mentenanță în rețeaua locală.",
    category: "Model de afișare",
    createdAt: "2026-03-12",
  },
  {
    id: -2,
    title: "Exemplu de anunț: program special pentru depunerea declarațiilor",
    content:
      "În perioada 18 – 22 martie 2026, programul cu publicul pentru preluarea documentelor fiscale va fi extins până la ora 18:00.",
    category: "Model de afișare",
    createdAt: "2026-03-18",
  },
  {
    id: -3,
    title: "Exemplu de anunț: consultare publică pentru proiect local",
    content:
      "Primăria invită locuitorii să transmită observații privind propunerea de amenajare a spațiului public din zona centrală a comunei.",
    category: "Model de afișare",
    createdAt: "2026-03-20",
  },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const formatToday = (value: Date) =>
  new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(value)
    .toLocaleUpperCase("ro-RO");

const getExcerpt = (value: string, maxLength = 170) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

function AnnouncementEntry({
  announcement,
  compact = false,
}: {
  announcement: Announcement;
  compact?: boolean;
}) {
  return (
    <article
      className={
        compact
          ? "flex h-full flex-col rounded-[28px] border border-slate-200 bg-slate-50/80 p-5"
          : "flex h-full flex-col border-t border-slate-200 pt-5 md:min-h-[260px]"
      }
    >
      <Link to="/anunturi" className="group flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
          <span className="text-blue-700">{announcement.category || "Informare"}</span>
          <span>{formatDate(announcement.createdAt)}</span>
        </div>

        <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-800 sm:text-2xl">
          {announcement.title}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {getExcerpt(announcement.content)}
        </p>

        <div className="mt-auto pt-6">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors group-hover:text-blue-700">
            Citește anunțul
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();
  const today = new Date();
  const todayLabel = formatToday(today);
  const todayIso = today.toISOString().slice(0, 10);
  const hasLiveAnnouncements = announcements.length > 0;
  const visibleAnnouncements = hasLiveAnnouncements ? announcements : previewAnnouncements;

  useGsapSectionReveal(sectionRef, { dependencies: [isLoading, visibleAnnouncements.length] });

  const fetchAnnouncements = useCallback(async (background = false) => {
    try {
      const response = await fetch(`${API_URL}/api/announcements`);
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        setAnnouncements([]);
        return;
      }

      const latest = data
        .slice()
        .sort(
          (a: Announcement, b: Announcement) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      setAnnouncements(latest);
    } catch (error) {
      console.error("Announcement fetch error:", error);
      if (!background) {
        setAnnouncements([]);
      }
    } finally {
      if (!background) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(false);
    const intervalId = window.setInterval(() => fetchAnnouncements(true), FETCH_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [fetchAnnouncements]);

  useEffect(() => {
    if (!mobileApi) {
      return;
    }

    const handleSelect = () => {
      setSelectedIndex(mobileApi.selectedScrollSnap());
    };

    handleSelect();
    mobileApi.on("select", handleSelect);
    mobileApi.on("reInit", handleSelect);

    return () => {
      mobileApi.off("select", handleSelect);
      mobileApi.off("reInit", handleSelect);
    };
  }, [mobileApi]);

  useEffect(() => {
    if (!isMobile || !mobileApi || visibleAnnouncements.length < 2) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const autoplayId = window.setInterval(() => {
      mobileApi.scrollNext();
    }, 3800);

    return () => window.clearInterval(autoplayId);
  }, [isMobile, mobileApi, visibleAnnouncements.length]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-10 sm:py-12 lg:py-16"
      aria-labelledby="announcements-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl" data-reveal="copy">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
              <Megaphone className="h-3.5 w-3.5" />
              Anunțuri și informări
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 sm:text-[15px]">
              <span>Astăzi</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
              <time dateTime={todayIso} className="text-slate-700">
                {todayLabel}
              </time>
            </div>
            <h2
              id="announcements-title"
              className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
            >
              Anunțurile recente prezintă cele mai noi informații publicate de primărie.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              Aici puteți găsi rapid actualizări despre program, lucrări, decizii administrative și
              alte noutăți importante pentru comunitate.
            </p>
          </div>

          <Link
            to="/anunturi"
            data-reveal="item"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
          >
            Vezi toate anunțurile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-8 flex items-center gap-3 text-slate-500" data-reveal="item">
            <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
            <span className="text-sm font-medium">Se încarcă ultimele anunțuri...</span>
          </div>
        ) : (
          <>
            {!hasLiveAnnouncements ? (
              <p className="mt-8 text-sm font-medium text-slate-500" data-reveal="item">
                Model de afișare pentru secțiunea de anunțuri.
              </p>
            ) : null}

            <div className="mt-8 hidden md:grid md:grid-cols-3 md:gap-6" data-reveal="group">
              {visibleAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className={index === 0 ? "" : "md:border-l md:border-slate-200 md:pl-6"}
                >
                  <AnnouncementEntry announcement={announcement} />
                </div>
              ))}
            </div>

            <div className="mt-8 md:hidden" data-reveal="item">
              <Carousel
                setApi={setMobileApi}
                opts={{ align: "start", loop: visibleAnnouncements.length > 1 }}
                className="w-full"
              >
                <CarouselContent>
                  {visibleAnnouncements.map((announcement) => (
                    <CarouselItem key={announcement.id}>
                      <AnnouncementEntry announcement={announcement} compact />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {visibleAnnouncements.length > 1 ? (
                <div className="mt-5 flex justify-center gap-2">
                  {visibleAnnouncements.map((announcement, index) => (
                    <button
                      key={announcement.id}
                      type="button"
                      onClick={() => mobileApi?.scrollTo(index)}
                      aria-label={`Afișează anunțul ${index + 1}`}
                      aria-pressed={selectedIndex === index}
                      className={`h-2 rounded-full transition-all ${
                        selectedIndex === index ? "w-6 bg-blue-600" : "w-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
