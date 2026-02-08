import { useState, useEffect, useRef, useCallback } from "react";
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
  Info
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
  fileUrl?: string;
  createdAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Urgent': return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
    case 'General': return <FileText className="w-3.5 h-3.5 mr-1" />;
    case 'Informativ': return <Info className="w-3.5 h-3.5 mr-1" />;
    default: return <Megaphone className="w-3.5 h-3.5 mr-1" />;
  }
};

const AnnouncementsSection = () => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Stări pentru auto-scroll (activ doar pe mobil, practic)
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fetchAnnouncements = useCallback(async (isBackground = false) => {
    try {
      const response = await fetch('http://localhost:3001/api/announcements');
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Sortăm descrescător după dată
        const sorted = data.sort((a: Announcement, b: Announcement) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // --- MODIFICARE: Luăm primele 9 anunțuri în loc de 3 ---
        const topRecent = sorted.slice(0, 9);
        
        setAnnouncements(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(topRecent)) return topRecent;
            return prev;
        });
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      if (!isBackground) setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(false);
    // Polling la 15 secunde pentru date noi
    const interval = setInterval(() => fetchAnnouncements(true), 15000);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  // Auto-scroll logic (Efectiv mai mult pe mobil)
  useEffect(() => {
    if (isInitialLoading || announcements.length === 0 || isPaused) return;

    const scrollInterval = setInterval(() => {
        // Verificăm dacă suntem pe mobil (unde există scroll orizontal)
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Dacă nu avem scroll (de ex pe Desktop unde e grid), nu facem nimic
            if (container.scrollWidth <= container.clientWidth) return;

            const cardWidth = container.firstElementChild?.clientWidth || 0;
            const gap = 20;
            const nextSlide = (activeSlide + 1) % announcements.length;
            const scrollPos = nextSlide * (cardWidth + gap);

            if (nextSlide === 0) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
            setActiveSlide(nextSlide);
        }
    }, 4000);

    return () => clearInterval(scrollInterval);
  }, [activeSlide, announcements.length, isPaused, isInitialLoading]);

  // Animații GSAP Header
  useGSAP(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-header",
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });

    tl.from(".reveal-text", { y: "120%", duration: 0.8, ease: "power3.out", stagger: 0.1 })
      .from(".header-desc", { opacity: 0, y: 10, duration: 0.6 }, "-=0.4")
      .from(".header-btn", { opacity: 0, x: -10, duration: 0.6, ease: "power2.out" }, "-=0.4");
  }, { scope: containerRef });

  // Animații GSAP Cards
  useGSAP(() => {
    if (isInitialLoading || announcements.length === 0) return;

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
            stagger: 0.1, // Stagger mic pentru a apărea frumos în grilă
            ease: "back.out(1.1)", 
            clearProps: "all" 
        });
    });

    return () => ctx.revert();

  }, { scope: containerRef, dependencies: [isInitialLoading, announcements] });

  return (
    <section ref={containerRef} className="pt-8 pb-12 md:py-16 bg-white relative z-20 -mt-8 md:-mt-4 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Header Secțiune --- */}
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
                
                {/* Indicatorii de slide (Doar vizuali, relevanți mai mult pe mobil) */}
                <div className="flex items-center gap-1 mt-1 md:hidden">
                    {announcements.map((_, idx) => (
                        <div key={idx} className="h-1 rounded-full transition-all duration-500" 
                             style={{ 
                                 width: activeSlide === idx ? '24px' : '8px',
                                 backgroundColor: activeSlide === idx ? '#2563eb' : '#e2e8f0' 
                             }} 
                        />
                    ))}
                </div>
            </div>
          </div>

          <div className="header-btn w-full md:w-auto opacity-0">
             <Link to="/anunturi" className="w-full md:w-auto inline-block">
                <Button variant="ghost" className="w-full md:w-auto group text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-6 border border-slate-100 hover:border-blue-100 rounded-xl justify-between md:justify-center">
                   <span className="font-semibold">Vezi arhiva completă</span> 
                   <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
             </Link>
          </div>
        </div>

        {/* --- Lista Carduri --- */}
        {isInitialLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : announcements.length === 0 ? (
             <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Nu există anunțuri recente.</p>
             </div>
        ) : (
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)} 
            ref={scrollContainerRef}
            // PE DESKTOP (md:): Grid cu 3 coloane
            // PE MOBIL: Flex cu scroll orizontal
            className="cards-container flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory touch-pan-x pb-8 -mx-4 px-4 md:pb-0 md:mx-0 md:px-0 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {announcements.map((announcement) => (
              <Link 
                key={announcement.id} 
                to="/anunturi" 
                className="announcement-card min-w-[85vw] md:min-w-0 snap-center group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full"
              >
                {/* Linie colorată sus */}
                <div className={cn("absolute top-0 left-0 w-full h-1 transition-all duration-300", 
                    announcement.category === 'Urgent' ? "bg-red-500" : "bg-blue-500 group-hover:h-1.5"
                )}></div>

                <div className="flex items-center justify-between mb-3 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      announcement.category === 'Urgent' 
                        ? "bg-red-50 text-red-700 border-red-100" 
                        : "bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-colors"
                    )}
                  >
                    {getCategoryIcon(announcement.category)}
                    {announcement.category}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(announcement.createdAt).toLocaleDateString('ro-RO')}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                  {announcement.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 font-medium flex-grow">
                  {announcement.content}
                </p>
                
                <div className="pt-3 border-t border-slate-100 flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all mt-auto">
                  Citește <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;