import { CreditCard, FileText, Building2, Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  // Imagine statică de fundal (Peisaj rural deschis)
  const heroImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="relative w-full overflow-hidden bg-white pt-12 pb-16 lg:pt-32 lg:pb-40 min-h-[600px] flex flex-col justify-center">
      
      {/* --- FUNDAL STATIC --- */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={heroImage} 
          alt="Peisaj Comuna Almăj" 
          className="w-full h-full object-cover"
        />
        
        {/* --- GRADIENT OVERLAY (Esențial pentru citire) --- */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center">
        
        {/* Badge Instituțional */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] sm:text-xs font-bold text-blue-800 shadow-sm mb-6 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Portal Oficial
        </div>

        {/* Titlu */}
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl md:text-7xl mb-4 text-center leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Primăria <br className="block sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
            Almăj
          </span>
        </h1>

        {/* Subtitlu */}
        <p className="text-base sm:text-lg text-slate-700 max-w-xl text-center leading-relaxed font-semibold mb-8 sm:mb-12 px-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Administrație digitală la un click distanță. Rezolvă problemele rapid, direct de pe telefon.
        </p>

        {/* --- GRID BUTOANE (Mobile Friendly) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <MobileActionCard 
            to="/servicii/taxe" 
            icon={<CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />} 
            title="Taxe" 
            subtitle="Plătește online"
            color="blue"
          />
          <MobileActionCard 
            to="/monitorul-oficial" 
            icon={<FileText className="w-5 h-5 sm:w-6 sm:h-6" />} 
            title="Acte" 
            subtitle="Monitor Oficial"
            color="indigo"
          />
          <MobileActionCard 
            to="/servicii/urbanism" 
            icon={<Building2 className="w-5 h-5 sm:w-6 sm:h-6" />} 
            title="Urbanism" 
            subtitle="Autorizații"
            color="emerald"
          />
          <MobileActionCard 
            to="/anunturi" 
            icon={<Bell className="w-5 h-5 sm:w-6 sm:h-6" />} 
            title="Avizier" 
            subtitle="Noutăți"
            color="amber"
          />
        </div>

        {/* Link-uri Secundare */}
        <div className="mt-8 sm:mt-12 flex flex-col w-full sm:w-auto gap-3 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-xl bg-blue-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-slate-900/10 h-12 text-base font-bold">
            <Link to="/servicii">
              Toate Serviciile <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Componentă Card
interface MobileCardProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    color: 'blue' | 'indigo' | 'emerald' | 'amber';
}

const MobileActionCard = ({ to, icon, title, subtitle, color }: MobileCardProps) => {
  const theme = {
    blue: "text-blue-600 bg-blue-50 border-blue-200 group-hover:bg-blue-600 group-hover:text-white",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white",
    amber: "text-amber-600 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white",
  };

  return (
    <Link 
      to={to} 
      className="group relative flex flex-col items-center justify-center p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 active:scale-95 active:shadow-inner transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-200"
    >
      <div className={`p-3 rounded-xl mb-2 sm:mb-3 transition-colors duration-300 ${theme[color]}`}>
        {icon}
      </div>
      <h3 className="text-sm sm:text-lg font-bold text-slate-800 leading-tight text-center group-hover:text-slate-900">{title}</h3>
      <p className="text-[10px] sm:text-sm font-medium text-slate-500 text-center leading-tight mt-0.5">{subtitle}</p>
    </Link>
  );
};

export default HeroSection;