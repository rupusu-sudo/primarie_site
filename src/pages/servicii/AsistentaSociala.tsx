import { Link } from "react-router-dom";
import { 
  Heart, 
  FileText, 
  Download, 
  CheckCircle2,
  Users,
  HandHeart,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  AlertTriangle,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const AsistentaSociala = () => {
  // Datele pentru secțiunile principale
  const categoriiAjutor = [
    {
      titlu: "Ajutor Social (VMG)",
      icon: HandHeart,
      acte: [
        "Cerere și declarație pe propria răspundere",
        "Actele de identitate (original + copii)",
        "Certificatele de naștere copii",
        "Adeverințe de venit (membri majori)",
        "Adeverință AJOFM (șomaj)",
        "Adeverință venituri ANAF"
      ]
    },
    {
      titlu: "Alocație Susținere Familie",
      icon: Users,
      acte: [
        "Cerere tip pentru alocație",
        "Buletine părinți (original + copii)",
        "Certificate naștere copii",
        "Adeverințe școală (pentru elevi)",
        "Declarație componență familie",
        "Adeverințe de venit net"
      ]
    },
    {
      titlu: "Indemnizație Handicap",
      icon: Heart,
      acte: [
        "Cerere indemnizație / însoțitor",
        "Certificat încadrare handicap (grav)",
        "Act identitate beneficiar",
        "Act identitate reprezentant legal",
        "Extras de cont (pentru virament)",
        "Dispoziție de curatelă (dacă e cazul)"
      ]
    }
  ];

  const formulare = [
    { nume: "Cerere Ajutor Social (VMG)", link: "#" },
    { nume: "Cerere Alocație Familie", link: "#" },
    { nume: "Cerere Indemnizație Handicap", link: "#" },
    { nume: "Declarație pe Propria Răspundere", link: "#" },
    { nume: "Anchetă Socială Tip", link: "#" },
    { nume: "Cerere Ajutor Încălzire", link: "#" },
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: "Asistență Socială" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Stil Identic Taxe (Hero Gradient) */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          {/* Background Blur Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">
                ASISTENȚĂ SOCIALĂ
              </h1>
              <p className="text-pink-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Protecție Socială • Alocații • Sprijin Comunitar
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CTA Card - Stil Identic (Card Albastru/Roz la Taxe) */}
            {/* Aici l-am facut un roz închis/roșu pentru tematica Social, dar păstrând structura */}
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-pink-700 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Heart className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
                  Ai nevoie de ajutor?
                </h2>
                <p className="text-pink-100 font-bold italic text-sm mb-6 max-w-md leading-relaxed">
                  Direcția de Asistență Socială oferă consiliere și suport pentru persoanele vulnerabile. 
                  Contactează-ne pentru o evaluare a cazului.
                </p>
                <div className="flex gap-3">
                   <Button className="rounded-2xl bg-white text-pink-700 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] px-6 py-4 h-auto shadow-lg" asChild>
                    <a href="tel:0251449234">
                      <Phone className="mr-2 w-4 h-4" /> Sună Acum
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-3 mt-12 mb-2">
              <Info className="w-6 h-6 text-pink-700" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Acte Necesare Dosare
              </h2>
            </div>

            <div className="grid gap-6">
              {categoriiAjutor.map((cat, idx) => (
                <Card key={idx} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <cat.icon className="w-6 h-6 text-pink-600" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">
                        {cat.titlu}
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-1 gap-4">
                    {cat.acte.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
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
                <FileText className="w-5 h-5 text-pink-700" />
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-900">
                  Formulare Tipizate
                </h3>
              </div>
              <div className="space-y-3">
                {formulare.map((f, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-between h-12 rounded-xl bg-slate-50 hover:bg-pink-50 hover:text-pink-700 transition-all group px-4" asChild>
                    <a href={f.link} download>
                      <span className="text-[10px] font-bold italic truncate mr-2">{f.nume}</span>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-pink-700" />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Info Contact - Stil Card Negru (cum e la Taxe) */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-pink-400" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">
                  Program & Contact
                </h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-pink-500 pl-4 py-1">
                  <p className="text-[10px] font-black text-pink-400 uppercase">Luni - Joi</p>
                  <p className="text-xs font-bold italic">08:00 - 16:30</p>
                </div>
                <div className="border-l-2 border-slate-700 pl-4 py-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Vineri</p>
                  <p className="text-xs font-bold italic">08:00 - 14:00</p>
                </div>
                
                <div className="pt-2 space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold italic text-slate-300">
                      <Phone className="w-4 h-4 text-pink-400" />
                      0251 449 234  
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold italic text-slate-300">
                      <Mail className="w-4 h-4 text-pink-400" />
                      primariaalmaj@gmail.com
                   </div>
                </div>
              </div>
            </Card>

            {/* Alerta - Stil Card Amber */}
            <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
               <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
               <div>
                 <p className="text-[11px] font-black uppercase text-amber-900 mb-1">
                   Termen Depunere
                 </p>
                 <p className="text-[10px] font-bold text-amber-800 italic leading-snug">
                   Cererile pentru ajutorul de încălzire se depun în perioada <strong>15 Octombrie - 20 Noiembrie</strong> pentru a beneficia de plata integrală.
                 </p>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default AsistentaSociala;