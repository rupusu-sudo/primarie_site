import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { CreditCard, FileText, Building2, Bell, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const containerRef = useRef(null);
  const bgImageRef = useRef(null);
  const titleLinesRef = useRef([]);

  const addToTitleLines = (el) => {
    if (el && !titleLinesRef.current.includes(el)) {
      titleLinesRef.current.push(el);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(bgImageRef.current, { scale: 1.1 });

    tl.to(bgImageRef.current, {
      scale: 1, 
      duration: 2.5,
      ease: "power2.inOut"
    }, 0)
    .from(titleLinesRef.current, {
      y: "120%", 
      duration: 1.4,
      stagger: 0.15,
      ease: "power4.out"
    }, 0.3)
    .from(".hero-fade-in", {
      y: 20,
      opacity: 0,
      duration: 1,
      stagger: 0.1
    }, "-=0.8")
    .from(".hero-card", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "back.out(1.2)" 
    }, "-=0.8");

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      // --- FIX AICI ---
      // 1. pt-20: Pe mobil avem padding mai mic (80px), suficient cât să treacă de navbar.
      // 2. md:pt-32: Pe desktop păstrăm spațiul aerisit.
      // 3. pb-12 md:pb-12: Padding jos consistent.
      className="relative w-full min-h-[auto] lg:min-h-[700px] flex flex-col justify-center items-center overflow-hidden bg-slate-50 pt-20 md:pt-32 pb-12"
    >
      
      {/* --- STRAT 1: FUNDAL --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div ref={bgImageRef} className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
            alt="Peisaj Almăj" 

            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/80"></div>
          
          {/* Fade Out în Alb Pur */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
        </div>

        <div className="absolute inset-0 opacity-[0.3] mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
        </div>
      </div>

      {/* --- STRAT 2: CONȚINUT --- */}
      <div className="content-layer relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="hero-fade-in inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-blue-900 shadow-sm mb-0 md:mb-0 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Portal Oficial Digital
        </div>

        {/* Titluri */}
        <div className="mb-8 relative flex flex-col items-center">
          <div className="overflow-hidden px-4 pt-4 -mb-1 md:mb-0"> 
            <h1 ref={addToTitleLines} className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              PRIMĂRIA
            </h1>
          </div>
          <div className="overflow-hidden px-0 pt-0 pb-2">
            <h1 ref={addToTitleLines} className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 leading-[1.1]">
              ALMĂJ
            </h1>
          </div>
        </div>

        {/* Subtitlu */}
        <p className="hero-fade-in text-lg md:text-xl text-slate-600 max-w-2xl text-center leading-relaxed font-medium mb-12">
          Administrație transparentă, la un click distanță. <br className="hidden md:block"/>
          Rezolvă problemele comunității direct de pe telefon.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
          <ModernCard to="/servicii/taxe" icon={<CreditCard />} title="Taxe" subtitle="Plătește Online" accent="blue" />
          <ModernCard to="/monitorul-oficial" icon={<FileText />} title="Acte" subtitle="Monitor Oficial" accent="indigo" />
          <ModernCard to="/servicii/urbanism" icon={<Building2 />} title="Urbanism" subtitle="Autorizații" accent="emerald" />
          <ModernCard to="/anunturi" icon={<Bell />} title="Avizier" subtitle="Noutăți" accent="amber" />
        </div>

        {/* Link Secundar */}
        <div className="hero-fade-in">
           <Button asChild className="rounded-full px-8 py-6 text-md bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
             <Link to="/servicii">
               Vezi toate serviciile <ChevronRight className="ml-2 w-4 h-4" />
             </Link>
           </Button>
        </div>

      </div>
    </section>
  );
};

const ModernCard = ({ to, icon, title, subtitle, accent }) => {
    const cardRef = useRef(null);
    const iconRef = useRef(null);
    const colors = {
        blue: "text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
        indigo: "text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
        emerald: "text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
        amber: "text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
    };

    const onMouseEnter = () => {
        gsap.to(cardRef.current, { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)" });
        gsap.to(iconRef.current, { scale: 1.2, rotate: 5, duration: 0.3 });
    };
    const onMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.4, ease: "power2.out", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" });
        gsap.to(iconRef.current, { scale: 1, rotate: 0, duration: 0.3 });
    };

    return (
        <Link 
            to={to} 
            ref={cardRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="hero-card group relative bg-white/70 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-4 transition-colors"
        >
            <div ref={iconRef} className={`p-4 rounded-2xl bg-white shadow-sm border border-slate-100 transition-colors duration-300 ${colors[accent]}`}>
                {React.cloneElement(icon, { size: 28, strokeWidth: 2 })}
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
            </div>
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </Link>
    );
};

export default HeroSection;