import { MapPin, Bell, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    // Folosim 'hero-gradient' pentru fundalul standard albastru definit în index.css
    <section className="hero-gradient relative overflow-hidden min-h-[500px] flex items-center justify-center">
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        {/* Am scos grid-ul și am pus totul într-un container centrat */}
        <div className="max-w-4xl mx-auto text-center text-primary-foreground animate-in zoom-in-95 fade-in duration-700">
          
          {/* Badge Locație */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mx-auto hover:bg-white/20 transition-colors cursor-default">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Județul Dolj, România</span>
          </div>
          
          {/* Titlu Principal */}
          <h1 className="text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 leading-tight drop-shadow-md">
            Primăria Comunei
            <br />
            <span className="text-blue-100 opacity-95">Almăj</span>
          </h1>
          
          {/* Descriere */}
          <p className="text-lg md:text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Administrație publică transparentă și dedicată cetățenilor. <br className="hidden md:block" />
            Acces facil la servicii, informații și documente publice.
          </p>
          
          {/* Butoane */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/anunturi">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-blue-900">
                <Bell className="w-5 h-5 mr-2 text-blue-700" />
                Anunțuri importante
                <ArrowRight className="w-4 h-4 ml-2 text-blue-700 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/servicii">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm font-semibold">
                <Users className="w-5 h-5 mr-2" />
                Servicii cetățeni
              </Button>
            </Link>
          </div>
          
          {/* Statistici (Centrate și ele) */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-white/20 pt-10 opacity-90">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="stat-dot bg-green-400 w-2 h-2 rounded-full shadow-[0_0_8px_#4ade80]"></span>
                <span className="font-bold text-2xl leading-none">2.211</span>
              </div>
              <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">Locuitori</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="stat-dot bg-blue-300 w-2 h-2 rounded-full shadow-[0_0_8px_#93c5fd]"></span>
                <span className="font-bold text-2xl leading-none">4</span>
              </div>
              <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">Sate</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="stat-dot bg-yellow-400 w-2 h-2 rounded-full shadow-[0_0_8px_#facc15]"></span>
                <span className="font-bold text-2xl leading-none">672</span>
              </div>
              <span className="text-blue-100 text-xs uppercase tracking-wider opacity-80">Gospodării</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorațiune Wave (Val) jos - Păstrată din designul original */}
      <div className="absolute bottom-0 left-0 right-0 h-16 hero-wave opacity-100"></div>
    </section>
  );
};

export default HeroSection;