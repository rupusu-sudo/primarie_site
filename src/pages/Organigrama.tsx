import React, { useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Maximize2, Network } from "lucide-react";
import { gsap } from "gsap";

const Organizare = () => {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-in", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație", href: "/primaria" }, { label: "Organigramă" }]}>      
      <section ref={pageRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* TITLU */}
        <div className="fade-in flex flex-col items-center text-center space-y-4 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
            <Network className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Structura Administrativă</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Organigrama Primăriei
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl">
            Reprezentarea grafică a ierarhiei și compartimentelor din aparatul de specialitate al primarului comunei.
          </p>
        </div>

        {/* POZA ORGANIGRAMEI */}
        <div className="fade-in border-t border-slate-200 pt-4 sm:pt-6 space-y-4 group">
          <div className="relative w-full overflow-hidden bg-slate-50 flex items-center justify-center min-h-[300px] sm:min-h-[500px] border border-slate-200 p-2 sm:p-6">
            
            {/* Calea actualizată exact la numele și extensia ta */}
            <img 
              src="/poze/ORGANIGRAMA.jpg" 
              alt="Organigrama Primăriei Almăj"
              className="w-full h-auto max-h-[850px] object-contain transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />
            
            {/* Overlay invizibil pentru click pe Desktop */}
            <a 
              href="/poze/ORGANIGRAMA.jpg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 hidden sm:flex items-center justify-center bg-slate-900/0 hover:bg-slate-900/5 transition-colors cursor-zoom-in"
              title="Faceți click pentru a mări imaginea"
            >
              <div className="opacity-0 group-hover:opacity-100 bg-white/95 backdrop-blur-sm text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 transition-all translate-y-4 group-hover:translate-y-0">
                <Maximize2 className="w-4 h-4" /> Click pentru a mări imaginea
              </div>
            </a>
          </div>

          {/* Buton clar pentru Mobile */}
          <div className="sm:hidden flex justify-center px-2 pb-2">
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-blue-700 border-blue-200 active:bg-blue-50" asChild>
              <a href="/poze/ORGANIGRAMA.jpg" target="_blank" rel="noopener noreferrer">
                <Maximize2 className="w-4 h-4 mr-2" /> Deschide imaginea mărită
              </a>
            </Button>
          </div>
        </div>

      </section>
    </PageLayout>
  );
};

export default Organizare;
