import { useEffect, useMemo, useState, useRef } from "react";
import { 
  Quote, 
  Clock, 
  Camera, 
  Map, 
  Users, 
  Landmark, 
  Castle, 
  Home, 
  MapPin,
  BookOpen,
  ZoomIn
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PageLayout from "@/components/PageLayout";
import { ServiceInfoGrid } from "@/components/servicii/ServiceInfoGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
gsap.registerPlugin(ScrollTrigger);

type StorySlide = {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
};

type StoryChapter = {
  id: string;
  label: string;
  title: string;
  summary: string;
  chronology?: string;
  quote?: string;
  slides: StorySlide[];
  icon: React.ElementType;
  source?: {
    label: string;
    href: string;
  };
  photoCredit?: {
    label: string;
    href: string;
  };
};

type SlideshowOptions = {
  intervalMs?: number;
  randomize?: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
};

const BASE_CHAPTER_IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 600px";

const CULA_POENARU_SLIDES: StorySlide[] = [
  {
    src: "/assets/history/Cula-Poenaru-Almaj-DJ-la-inc.-sec.-XX.jpg",
    alt: "Cula Poenaru din Almaj la inceputul secolului XX",
    sizes: BASE_CHAPTER_IMAGE_SIZES,
  },
  {
    src: "/assets/history/Cula-Poenaru-Almaj-DJ-in-anul-1962.jpg",
    alt: "Cula Poenaru din Almaj in anul 1962",
    sizes: BASE_CHAPTER_IMAGE_SIZES,
  },
  {
    src: "/assets/history/Cula-Poenaru-Almaj-DJ-02.jpg",
    alt: "Cula Poenaru, cadru exterior",
    sizes: BASE_CHAPTER_IMAGE_SIZES,
  },
];

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "originile-zonei",
    label: "CAPITOLUL I",
    title: "Originile zonei",
    icon: Map,
    summary:
      "Pe teritoriul actual al comunei Almăj apar urme de locuire din începutul Epocii Bronzului, aproximativ 3200-2800 î.Hr. Sunt menționate fragmente ceramice apropiate culturii Coțofeni, apoi descoperiri din intervalul 2500-2000 î.Hr. Urmele continuă spre epoca fierului și perioada dacică târzie. Firul istoric arată o prezență umană constantă, anterioară documentelor administrative moderne.",
    chronology: "3200-2800 î.Hr.; 2500-2000 î.Hr.; perioada dacică târzie",
    slides: [
      { src: "/assets/about-3.webp", alt: "Repere arheologice locale din comuna Almaj" },
      { src: "/assets/about-2.webp", alt: "Cadru natural din zona comunei Almaj" },
    ],
  },
  {
    id: "evolutia-comunitatii",
    label: "CAPITOLUL II",
    title: "Evoluția comunității",
    icon: Users,
    summary:
      "La sfârșitul secolului al XIX-lea, comuna era în plasa Jiul de Sus din județul Dolj, cu 2.125 locuitori (1892). În anul 1925 sunt consemnați 2.007 locuitori, iar în 1931 sunt menționate administrativ satele Almăj și Șitoaia. Reorganizarea din 1950 mută comuna în raionul Craiova, iar din 1968 aceasta revine în județul Dolj. Aceste etape explică structura administrativă actuală.",
    slides: [
      { src: "/assets/about-1.webp", alt: "Comunitatea rurala din comuna Almaj" },
      { src: "/assets/about-5.webp", alt: "Drum local din comuna Almaj" },
    ],
  },
  {
    id: "patrimoniu-si-monumente",
    label: "CAPITOLUL III",
    title: "Patrimoniu și monumente",
    icon: Landmark,
    summary:
      "Patrimoniul comunei reunește clădiri de cult și repere civile cu valoare istorică. În satul Almăj se află Biserica Sfinții Voievozi (1787-1789), iar în satul Șitoaia Biserica Adormirea Maicii Domnului (1819) și o cruce de piatră datată 1833. În aceeași arie este inventariat situl arheologic de la Almăj. Aceste obiective leagă istoria religioasă, viața comunitară și memoria locului.",
    chronology: "1787-1789; 1819; 1833",
    slides: [
      { src: "/assets/about-5.webp", alt: "Patrimoniu construit in comuna Almaj" },
      { src: "/assets/about-4.webp", alt: "Peisaj cultural din comuna Almaj" },
    ],
  },
  {
    id: "cula-poenaru",
    label: "CAPITOLUL IV",
    title: "Cula Poenaru - reper istoric",
    icon: Castle,
    summary:
      "Cula Poenaru, ridicată în 1795 de Barbu Poenaru, este unul dintre reperele definitorii ale comunei. Conform sursei Cule în Lumină, clădirea a fost incendiată în 1801 și în 1844. După aceste episoade, construcția a pierdut nivelurile superioare. Forma păstrată este cea cu pivniță, parter și pod înalt.",
    chronology: "1795, 1801, 1844",
    slides: CULA_POENARU_SLIDES,
    source: {
      label: "culeinlumina.ro/cula-poenaru",
      href: "https://culeinlumina.ro/cula-poenaru/",
    },
    photoCredit: {
      label: "Cule în Lumină",
      href: "https://culeinlumina.ro/cula-poenaru/",
    },
  },
  {
    id: "viata-traditionala",
    label: "CAPITOLUL V",
    title: "Viața tradițională în Almăj",
    icon: Home,
    summary:
      "Viața tradițională din Almăj, Bogea, Moșneni și Șitoaia s-a format în jurul gospodăriilor agricole, al muncii sezoniere și al sărbătorilor religioase. La sfârșitul secolului al XIX-lea sunt menționate în comună trei biserici și o școală mixtă, semn al unei comunități rurale bine organizate. Obiceiurile de familie, claca și hramurile au susținut coeziunea socială peste generații.",
    chronology: "Secolul XIX - secolul XX",
    slides: [
      { src: "/assets/about-4.webp", alt: "Viata traditionala in satele comunei Almaj" },
      { src: "/assets/about-2.webp", alt: "Cadru rural din comuna Almaj" },
    ],
  },
  {
    id: "almaj-astazi",
    label: "CAPITOLUL VI",
    title: "Almăj astăzi",
    icon: MapPin,
    summary:
      "Comuna Almăj este alcătuită astăzi din patru sate: Almăj, Bogea, Moșneni și Șitoaia, pe 28,02 km². La recensământul din 2021 au fost înregistrați 1.792 locuitori, față de 1.974 la recensământul din 2011. Diferența dintre satul reședință și comună rămâne esențială pentru citirea corectă a datelor. Comunitatea continuă tradițiile locale prin proiecte culturale, educaționale și administrative.",
    chronology: "2011: 1.974 locuitori; 2021: 1.792 locuitori",
    slides: [
      {
        src: "/hero/hero-1280.webp",
        srcSet: "/hero/hero-768.webp 768w, /hero/hero-1280.webp 1280w, /hero/hero-1920.webp 1920w",
        sizes: BASE_CHAPTER_IMAGE_SIZES,
        alt: "Panorama comunei Almaj in prezent",
      },
      { src: "/assets/about-1.webp", alt: "Comuna Almaj in prezent" },
    ],
  },
];

const getSlideDelay = (options: SlideshowOptions) => {
  if (!options.randomize) {
    return options.intervalMs ?? 6000;
  }

  const min = Math.min(options.minIntervalMs ?? 5000, options.maxIntervalMs ?? 7000);
  const max = Math.max(options.minIntervalMs ?? 5000, options.maxIntervalMs ?? 7000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const startAutoSlideshow = (
  imageUrls: string[],
  onSlideChange: (index: number) => void,
  options: SlideshowOptions = {},
) => {
  if (typeof window === "undefined" || imageUrls.length < 2) {
    return () => undefined;
  }

  let activeIndex = 0;
  let timeoutId: number | undefined;

  const queueNext = () => {
    timeoutId = window.setTimeout(() => {
      activeIndex = (activeIndex + 1) % imageUrls.length;
      onSlideChange(activeIndex);
      queueNext();
    }, getSlideDelay(options));
  };

  queueNext();

  return () => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  };
};

type HistoryChapterCardProps = {
  chapter: StoryChapter;
  prioritizeFirstSlide?: boolean;
  index: number;
};

const HistoryChapterCard = ({ chapter, prioritizeFirstSlide = false, index }: HistoryChapterCardProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  
  const slideUrls = useMemo(() => chapter.slides.map((slide) => slide.src), [chapter.slides]);
  const ChapterIcon = chapter.icon;

  // Verificăm dacă rândul este par pentru a face alternanța stânga-dreapta pe PC
  const isEven = index % 2 === 0;

  useEffect(() => {
    setActiveSlide(0);
    return startAutoSlideshow(slideUrls, setActiveSlide, {
      randomize: true,
      minIntervalMs: 5000,
      maxIntervalMs: 7000,
    });
  }, [slideUrls]);

  // Animația GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        gsap.utils.toArray(".gsap-reveal"),
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
      
      gsap.fromTo(
        ".gsap-image",
        { scale: 1.05, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <article 
      ref={containerRef}
      id={chapter.id}
      className="scroll-mt-24 border-b border-slate-200 py-12 last:border-0 md:py-20"
    >
      {/* Alternăm rândurile pe desktop folosind lg:flex-row-reverse */}
      <div className={`flex w-full flex-col gap-8 lg:items-center lg:gap-16 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        
        {/* Secțiunea de imagini */}
        <div className="flex w-full flex-1 flex-col justify-center space-y-3 lg:w-5/12 xl:w-2/5">
          {/* Format 4:3 pe mobil (aspect-[4/3]), și 4:4 (aspect-square) pe desktop */}
          <div 
            className="gsap-image group relative flex-1 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg aspect-[4/3] lg:aspect-square ring-1 ring-slate-900/5 cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            role="button"
            aria-label="Mărește imaginea"
          >
            {chapter.slides.map((slide, i) => (
              <img
                key={`${chapter.id}-${slide.src}`}
                src={slide.src}
                srcSet={slide.srcSet}
                sizes={slide.sizes ?? BASE_CHAPTER_IMAGE_SIZES}
                alt={slide.alt}
                loading={prioritizeFirstSlide && i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  i === activeSlide ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              />
            ))}
            
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
              <ZoomIn className="h-12 w-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 drop-shadow-lg" />
            </div>
          </div>

          {chapter.photoCredit && (
            <div className="gsap-reveal flex items-center gap-1.5 px-1 text-xs text-slate-500 mt-2">
              <Camera className="h-3.5 w-3.5" />
              <span>
                Foto:{" "}
                <a
                  href={chapter.photoCredit.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-slate-700 underline underline-offset-2 transition-colors hover:text-blue-600"
                >
                  {chapter.photoCredit.label}
                </a>
              </span>
            </div>
          )}
        </div>

        {/* Secțiunea de text */}
        <div className="flex w-full flex-1 flex-col justify-center lg:w-7/12 xl:w-3/5">
          <div className="gsap-reveal flex items-center gap-3">
            <span className="h-px w-8 bg-blue-600"></span>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">{chapter.label}</p>
          </div>
          
          <h2 className="gsap-reveal mt-4 flex items-center gap-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            <ChapterIcon className="h-8 w-8 text-blue-600 shrink-0" strokeWidth={2.5} />
            <span>{chapter.title}</span>
          </h2>
          
          <div className="gsap-reveal mt-6 text-lg leading-relaxed text-slate-700">
            <p className="first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600">
              {chapter.summary}
            </p>
          </div>

          {chapter.chronology && (
            <div className="gsap-reveal mt-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <span className="block mb-1 text-sm font-bold uppercase tracking-wide text-blue-900">
                  Repere cronologice
                </span> 
                <span className="text-base font-medium text-slate-800">
                  {chapter.chronology}
                </span>
              </div>
            </div>
          )}

          {chapter.quote && (
            <blockquote className="gsap-reveal mt-8 relative rounded-r-xl border-l-4 border-blue-600 bg-slate-50 py-5 pl-6 pr-6 italic text-slate-700">
              <div className="flex gap-4">
                <Quote className="mt-1 h-6 w-6 shrink-0 text-blue-300" />
                <p className="text-xl leading-relaxed text-slate-800 font-medium">
                  {chapter.quote}
                </p>
              </div>
            </blockquote>
          )}

          {chapter.source && (
            <div className="gsap-reveal mt-8 flex items-center gap-2 text-sm text-slate-500">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>
                Sursa:{" "}
                <a
                  href={chapter.source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-slate-700 underline underline-offset-2 transition-colors hover:text-blue-600"
                >
                  {chapter.source.label}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        {/* [&>button]:hidden ascunde acel X; onClick asigură închiderea la click oriunde pe fundal */}
        <DialogContent 
          className="max-w-screen-xl border-none bg-transparent p-0 shadow-none outline-none [&>button]:hidden"
          onClick={() => setLightboxOpen(false)}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Imagine extinsă - {chapter.title}</DialogTitle>
            <DialogDescription>Vizualizare la dimensiune completă a imaginii din secțiunea {chapter.title}</DialogDescription>
          </DialogHeader>
          
          <div className="relative flex h-[90vh] w-full items-center justify-center p-4">
            <img
              src={chapter.slides[activeSlide]?.src}
              alt={chapter.slides[activeSlide]?.alt}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/20 cursor-default"
              onClick={(e) => e.stopPropagation()} // Dacă apasă FIX pe imagine, nu se închide (se închide doar afară)
            />
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
};

const Istoric = () => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Istorie și Tradiții" },
      ]}
    >
      <main className="w-full py-8">
        <section
          ref={headerRef}
          className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
            <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
              <div className="fade-in-left gsap-optimize inline-flex">
                <Badge className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md border-0">
                  Istorie și patrimoniu
                </Badge>
              </div>

              <h1 className="fade-in-left gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                Istorie și Tradiție
              </h1>

              <div className="fade-in-left gsap-optimize flex w-full flex-col items-stretch justify-center gap-3 pt-4 sm:flex-row sm:items-center sm:gap-4 lg:hidden">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5" asChild>
                  <a href="#originile-zonei">Explorează istoria</a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold border-blue-300 text-blue-700 hover:bg-blue-50 transition-all hover:-translate-y-0.5" asChild>
                  <a href="#viata-traditionala">Tradiții locale</a>
                </Button>
              </div>
            </div>

            <div className="order-3 lg:order-2 fade-in-right gsap-optimize flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
              <div>
                <p
                  className="hidden text-base font-medium leading-relaxed text-slate-800 lg:block sm:text-lg"
                  style={{ textIndent: "1.5rem" }}
                >
                  Comuna Almăj păstrează o istorie bogată și tradiții autentice care reflectă identitatea comunității locale. De-a lungul timpului, locuitorii au transmis din generație în generație obiceiuri, valori și povești care definesc spiritul locului.
                </p>
                <p
                  className="text-base font-medium leading-relaxed text-slate-800 lg:hidden sm:text-lg"
                  style={{ textIndent: "1.5rem" }}
                >
                  Comuna Almăj păstrează o istorie bogată și tradiții autentice care reflectă identitatea comunității locale. De-a lungul timpului, locuitorii au transmis din generație în generație obiceiuri, valori și povești care definesc spiritul locului.
                </p>
              </div>

              <div className="hidden lg:flex pt-6 gap-4">
                <Button size="lg" className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5" asChild>
                  <a href="#originile-zonei">Explorează istoria</a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold border-blue-300 text-blue-700 hover:bg-blue-50 transition-all hover:-translate-y-0.5" asChild>
                  <a href="#viata-traditionala">Tradiții locale</a>
                </Button>
              </div>
            </div>
          </div>

          <section className="stagger-container" aria-labelledby="facts-title">
            <h2 id="facts-title" className="sr-only">Informații rapide</h2>
            <ServiceInfoGrid
              items={[
                { label: "Prima atestare", value: "sec. XV", icon: Clock },
                { label: "Patrimoniu local", value: "Biserici și monumente", icon: Landmark },
                { label: "Tradiții", value: "Obiceiuri și sărbători", icon: Home },
                { label: "Comunitate", value: "Identitate culturală", icon: Users },
              ]}
            />
          </section>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="flex w-full flex-col">
            {STORY_CHAPTERS.map((chapter, index) => (
              <HistoryChapterCard
                key={chapter.id}
                chapter={chapter}
                prioritizeFirstSlide={index === 0}
                index={index}
              />
            ))}
          </section>
        </section>
      </main>
    </PageLayout>
  );
};

export default Istoric;
