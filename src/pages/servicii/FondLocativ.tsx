import { Link } from "react-router-dom";
import { 
  Home, 
  Key, 
  FileText, 
  Download, 
  CheckCircle2,
  HardHat,
  Phone,
  Mail,
  Clock,
  Info,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const FondLocativ = () => {
  // Datele pentru secțiunile principale
  const categoriiLocuinte = [
    {
      titlu: "Locuințe Sociale",
      icon: Home,
      descriere: "Destinate persoanelor sau familiilor cu un venit mediu net lunar pe persoană sub nivelul câștigului salarial mediu net.",
      acte: [
        "Cerere tip pentru locuință socială",
        "Actele de identitate (original + copii)",
        "Adeverințe de venit (net, ultimele 12 luni)",
        "Certificat fiscal (fără proprietăți)",
        "Contract de închiriere actual (unde locuiți acum)",
        "Diplome de studii (pentru punctaj)",
        "Certificat medical (dacă e cazul)"
      ]
    },
    {
      titlu: "Locuințe ANL (Tineri)",
      icon: Key,
      descriere: "Pentru tineri cu vârsta de până la 35 de ani la data depunerii cererii, care lucrează în localitate.",
      acte: [
        "Cerere tip ANL",
        "Copie act identitate solicitant (vârsta < 35 ani)",
        "Adeverință loc de muncă (în localitate)",
        "Declarație notarială (nu deține locuință)",
        "Acte stare civilă (căsătorie, naștere copii)",
        "Diplome de studii (pentru stabilire punctaj)"
      ]
    },
    {
      titlu: "Vânzare Locuințe Fond Stat",
      icon: FileText,
      descriere: "Procedura de cumpărare a locuințelor deținute de stat de către chiriașii actuali.",
      acte: [
        "Cerere de cumpărare",
        "Contractul de închiriere valabil",
        "Dovada achitării chiriei la zi",
        "Adeverință asociație proprietari (fără datorii)",
        "Declarație notarială",
        "Taxă evaluare imobil"
      ]
    }
  ];

  const formulare = [
    { nume: "Cerere Locuință Socială", link: "#" },
    { nume: "Cerere Locuință ANL", link: "#" },
    { nume: "Actualizare Dosar", link: "#" },
    { nume: "Declarație Venituri", link: "#" },
    { nume: "Cerere Schimb Locuință", link: "#" },
    { nume: "Cerere Cumpărare", link: "#" },
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: "Fond Locativ" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Stil Identic Taxe (Hero Gradient) */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          {/* Background Blur Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Home className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">
                FOND LOCATIV
              </h1>
              <p className="text-orange-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Locuințe Sociale • ANL • Administrare
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CTA Card - Tematica Portocalie */}
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-orange-600 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <HardHat className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
                  Lista de Priorități 2024
                </h2>
                <p className="text-orange-100 font-bold italic text-sm mb-6 max-w-md leading-relaxed">
                  Lista provizorie cu punctajele pentru locuințele ANL și Sociale a fost publicată. 
                  Verificați poziția dumneavoastră și depuneți contestații în termen de 7 zile.
                </p>
                <div className="flex gap-3">
                   <Button className="rounded-2xl bg-white text-orange-700 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] px-6 py-4 h-auto shadow-lg" asChild>
                    <Link to="/transparenta">
                      <ArrowRight className="mr-2 w-4 h-4" /> Vezi Listele
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-3 mt-12 mb-2">
              <Info className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Dosare și Criterii
              </h2>
            </div>

            <div className="grid gap-6">
              {categoriiLocuinte.map((cat, idx) => (
                <Card key={idx} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50 relative">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                        <cat.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">
                            {cat.titlu}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1 leading-snug">
                            {cat.descriere}
                        </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-1 gap-3">
                    {cat.acte.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                        <span className="text-sm font-bold text-slate-700 italic">{act}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Stil Identic */}
          <div className="space-y-6">
            
            {/* Card Descarcare Formulare */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-900">
                  Formulare Tipizate
                </h3>
              </div>
              <div className="space-y-3">
                {formulare.map((f, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-between h-12 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-700 transition-all group px-4" asChild>
                    <a href={f.link} download>
                      <span className="text-[10px] font-bold italic truncate mr-2">{f.nume}</span>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-orange-700" />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Info Contact - Stil Card Negru */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-orange-400" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">
                  Program & Contact
                </h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-orange-500 pl-4 py-1">
                  <p className="text-[10px] font-black text-orange-400 uppercase">Luni - Joi</p>
                  <p className="text-xs font-bold italic">08:00 - 16:30</p>
                </div>
                <div className="border-l-2 border-slate-700 pl-4 py-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Vineri</p>
                  <p className="text-xs font-bold italic">08:00 - 14:00</p>
                </div>
                
                <div className="pt-2 space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold italic text-slate-300">
                      <Phone className="w-4 h-4 text-orange-400" />
                      <a href="tel:0251447113" className="hover:text-white transition-colors">0251 447 113</a>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold italic text-slate-300">
                      <Mail className="w-4 h-4 text-orange-400" />
                      <a href="mailto:primariaalmaj@yahoo.com" className="hover:text-white transition-colors">primariaalmaj@yahoo.com</a>
                   </div>
                </div>
              </div>
            </Card>

            {/* Alerta - Stil Card Amber */}
            <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
               <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
               <div>
                 <p className="text-[11px] font-black uppercase text-amber-900 mb-1">
                   Actualizare Dosare
                 </p>
                 <p className="text-[10px] font-bold text-amber-800 italic leading-snug">
                   Chiriașii ANL au obligația de a depune anual, până la data de <strong>31 Ianuarie</strong>, adeverințele de venit pentru recalcularea chiriei.
                 </p>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default FondLocativ;