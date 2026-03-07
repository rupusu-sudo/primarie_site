import React, { useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import { Briefcase } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";
import { gsap } from "gsap";

const Cariere = () => {
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
    <PageLayout 
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Portal Transparență", href: "/transparenta" }, 
        { label: "Cariere" }
      ]}
    >
      <section ref={pageRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 sm:gap-12">
        <div className="fade-in flex flex-col items-center text-center space-y-4 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
            <Briefcase className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Resurse Umane</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Cariere & Concursuri
          </h1>
          
          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl">
            Alăturați-vă echipei noastre. Aici găsiți toate informațiile oficiale privind posturile vacante, bibliografiile de concurs și rezultatele probelor de examinare.
          </p>
        </div>
        <div className="fade-in">
          <AdminDocumentManager 
            categoryKey="cariere-si-concursuri-almaj"
            title="Portal Angajări"
            icon={Briefcase}
            enableYearFilter={true}
            customCategories={[
              "Anunțuri Concurs", 
              "Rezultate Selecție Dosare", 
              "Rezultate Probă Scrisă", 
              "Rezultate Finale", 
              "Arhivă Concursuri"
            ]}
          />
        </div>
        
      </section>
    </PageLayout>
  );
};

export default Cariere;