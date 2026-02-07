import { Users, Building2, User, Briefcase, FileText, Shield, Tractor, Heart, BookOpen, ChevronRight, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";

const Organizare = () => {
  const conducere = [
    {
      titlu: "Primar",
      nume: "GORJAN ALIN-MĂDĂLIN",
      icon: User,
      color: "bg-slate-900",
      link: "/primar"
    },
    {
      titlu: "Viceprimar",
      nume: "UȚOIU LAURENȚIU-CONSTANTIN",
      icon: User,
      color: "bg-blue-700",
      link: "/viceprimar"
    },
    {
      titlu: "Secretar General",
      nume: "NIȚU ALIN COSMIN",
      icon: Briefcase,
      color: "bg-blue-600",
      link: "/secretar"
    },
  ];

  const compartimente = [
    {
      nume: "Compartiment Financiar-Contabil",
      responsabilitati: ["Buget local", "Taxe și impozite", "Execuție bugetară"],
      icon: FileText,
      color: "text-green-600 bg-green-50"
    },
    {
      nume: "Compartiment Urbanism",
      responsabilitati: ["Certificate urbanism", "Autorizații construire", "Amenajarea teritoriului"],
      icon: Building2,
      color: "text-blue-600 bg-blue-50"
    },
    {
      nume: "Compartiment Agricol",
      responsabilitati: ["Registru agricol", "Atestate producător", "Fond funciar"],
      icon: Tractor,
      color: "text-amber-600 bg-amber-50"
    },
    {
      nume: "Compartiment Asistență Socială",
      responsabilitati: ["Ajutoare sociale", "Alocații", "Anchete sociale"],
      icon: Heart,
      color: "text-red-600 bg-red-50"
    },
    {
      nume: "Compartiment Stare Civilă",
      responsabilitati: ["Acte naștere", "Acte căsătorie", "Acte deces"],
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50"
    },
    {
      nume: "Compartiment Juridic și Administrativ",
      responsabilitati: ["Acte normative", "Registratură", "Arhivă"],
      icon: Shield,
      color: "text-cyan-600 bg-cyan-50"
    },
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Primăria", href: "/primaria" },
        { label: "Organigramă" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Tema Acasa */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Landmark className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">ORGANIGRAMĂ</h1>
              <p className="text-blue-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Structura Organizatorică • Comuna Almăj
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Secțiunea Conducere */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Conducerea Primăriei</h2>
              </div>
              <div className="grid gap-4">
                {conducere.map((persoana, index) => (
                  <Link key={index} to={persoana.link}>
                    <Card className={`p-6 border-none shadow-sm rounded-[2rem] ${persoana.color} text-white group hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                      <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                        <persoana.icon className="w-16 h-16" />
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <persoana.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 leading-none mb-1">{persoana.titlu}</p>
                            <h3 className="text-lg font-black italic uppercase tracking-tight">{persoana.nume}</h3>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Secțiunea Compartimente */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Compartimente Funcționale</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {compartimente.map((comp, index) => (
                  <Card key={index} className="p-6 border-none shadow-sm rounded-[2rem] bg-white border border-slate-50 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${comp.color} flex items-center justify-center shrink-0`}>
                        <comp.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight mt-1 italic">{comp.nume}</h3>
                    </div>
                    <ul className="space-y-2 pl-14">
                      {comp.responsabilitati.map((resp, i) => (
                        <li key={i} className="text-[11px] font-bold text-slate-500 flex items-center gap-2 italic">
                          <span className="w-1 h-1 rounded-full bg-blue-700 opacity-30"></span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Consiliul & Legalitate */}
          <div className="space-y-6">
            <Link to="/consiliul-local">
              <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-amber-500 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                  <Users className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-black uppercase tracking-tighter italic mb-2">Consiliul Local</h3>
                  <p className="text-xs font-bold opacity-80 italic leading-relaxed mb-6">
                    Autoritatea deliberativă formată din 11 consilieri locali.
                  </p>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                    Vezi componența <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Card>
            </Link>

            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6 border-b pb-4">Baza Legală</h3>
              <p className="text-xs font-bold text-slate-600 italic leading-relaxed">
                Structura este stabilită conform <span className="text-blue-700">OUG 57/2019</span> privind Codul administrativ. Organigrama și statul de funcții sunt aprobate anual prin HCL.
              </p>
            </Card>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default Organizare;