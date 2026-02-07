import { User, Users, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const leaders = [
  {
    role: "Primar",
    title: "Gorjan Alin-Madalin",
    subtitle: "Primar Comuna Almăj",
    description: "Conducerea administrației locale.",
    link: "/primaria/primar",
  },
  {
    role: "Viceprimar",
    title: "Echipa Administrativă",
    subtitle: "Viceprimar Comuna Almăj",
    description: "Servicii publice și investiții.",
    link: "/primaria/viceprimar",
  },
  {
    role: "Consiliul Local",
    title: "Consiliul Local Almăj",
    subtitle: "For Deliberativ",
    description: "Reprezentarea cetățenilor.",
    linkText: "Vezi componența",
    link: "/primaria/consiliu-local",
  },
];

const LeadershipSection = () => {
  return (
    /* py-12 în loc de py-24 pentru a reduce înălțimea la jumătate */
    <section className="w-full bg-slate-50 border-y border-slate-100 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        
        {/* Header Secțiune mai compact */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span className="text-blue-700 font-black uppercase text-[9px] tracking-[0.3em]">Conducere</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Executivul <span className="text-blue-700">Local</span>
          </h2>
        </div>

        {/* Grid-ul de Lideri cu carduri mai mici */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaders.map((leader, index) => (
            <Link key={index} to={leader.link} className="group h-full">
              <Card className="p-6 h-full bg-white border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] text-center flex flex-col items-center">
                
                {/* Icon Circle mai mic */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
                  {leader.role === "Consiliul Local" ? (
                    <Users className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors" />
                  ) : (
                    <User className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors" />
                  )}
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-2">
                  {leader.role}
                </span>

                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-700 transition-colors">
                  {leader.title}
                </h3>
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {leader.subtitle}
                </p>

                <p className="text-slate-500 text-xs leading-relaxed mb-6 italic line-clamp-2">
                  {leader.description}
                </p>

                <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-center gap-2 text-blue-700 font-black uppercase text-[9px] tracking-widest group-hover:gap-3 transition-all">
                  {leader.linkText || "Detalii"}
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Cardul cu Citat mai subțire */}
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden p-8 md:p-12 bg-blue-700 text-white rounded-[2.5rem] border-none shadow-xl shadow-blue-100">
            <Quote className="absolute -top-4 -left-4 w-24 h-24 text-white opacity-10 rotate-12" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <blockquote className="text-lg md:text-xl font-black uppercase tracking-tighter leading-tight mb-6 italic">
                "Suntem aici pentru a servi interesele cetățenilor și pentru a asigura o dezvoltare sustenabilă a fiecărui sat din comuna noastră."
              </blockquote>
              <div className="flex flex-col items-center">
                <div className="h-0.5 w-12 bg-blue-400 rounded-full mb-3" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-100 opacity-80">
                  Primăria Almăj
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;