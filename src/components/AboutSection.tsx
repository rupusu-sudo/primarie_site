import { useState, useRef } from "react";
import { MapPin, Users, Home, Navigation, ArrowRight, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = [
    {
      url: 'https://primariaalmaj.ro/images/primarie1.jpg',
      title: "Primăria Almăj",
      desc: "Sediul administrativ al comunei"
    },
    {
      url: "https://primariaalmaj.ro/images/bis_almaj.jpg",
      title: "Biserica Ortodoxă",
      desc: "Monument de spiritualitate locală"
    },
    {
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000",
      title: "Peisaj Sitoaia",
      desc: "Natura și dealurile verzi ale Doljului"
    }
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const stats = [
    { label: "Locuitori", value: "2.211", icon: <Users className="w-4 h-4" /> },
    { label: "Gospodării", value: "672", icon: <Home className="w-4 h-4" /> },
    { label: "Sate", value: "4", icon: <MapPin className="w-4 h-4" /> },
    { label: "Craiova", value: "18 km", icon: <Navigation className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      {/* Partea Stângă - Carousel Imersiv */}
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-[3rem] shadow-2xl border-8 border-white"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="min-w-full h-[550px] relative snap-start">
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-10 text-white">
                <span className="bg-blue-600 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full mb-3 inline-block">
                  Galerie Foto
                </span>
                <h4 className="text-3xl font-black uppercase tracking-tighter">{img.title}</h4>
                <p className="text-sm font-medium opacity-70 mt-1">{img.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Butoane Navigare Carousel */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <button 
            onClick={() => scroll("left")}
            className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white pointer-events-auto hover:bg-white hover:text-blue-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white pointer-events-auto hover:bg-white hover:text-blue-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicator vizual */}
        <div className="absolute top-8 right-10 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2">
          <Camera className="w-4 h-4 text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Glisează pozele</span>
        </div>
      </div>

      {/* Partea Dreaptă - Conținut */}
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            <span className="text-blue-700 font-black uppercase text-[10px] tracking-[0.3em]">Comuna Almăj, Dolj</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-8">
            Administrație <br />
            <span className="text-blue-700 italic font-serif lowercase tracking-normal">pentru</span> oameni
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed text-lg italic border-l-4 border-blue-100 pl-6">
            "Situată la granița dintre istorie și modernitate, Comuna Almăj este casa a peste 2.000 de locuitori care definesc spiritul Olteniei."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-100">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 leading-none">{stat.value}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Link to="/istoric">
            <Button className="bg-blue-700 hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] px-10 h-14 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center gap-4">
              Descoperă Comuna Almăj <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;