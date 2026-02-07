import { Link } from "react-router-dom";
import { 
  Tractor, 
  FileText, 
  Download, 
  CheckCircle2,
  Wheat,
  TreePine,
  AlertTriangle,
  Info,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const RegistruAgricol = () => {
  // Datele pentru secțiunile principale
  const categoriiAgricole = [
    {
      titlu: "Înscriere Registru Agricol",
      icon: Wheat,
      acte: [
        "Cerere tip pentru înscriere date",
        "Act de identitate (original + copie)",
        "Titlu de proprietate / contract arendă",
        "Extras Carte Funciară (actualizat)",
        "Declarație suprafețe și culturi",
        "Declarație efective animale",
        "Adeverință APIA (dacă e cazul)"
      ]
    },
    {
      titlu: "Atestat Producător",
      icon: TreePine,
      acte: [
        "Cerere eliberare atestat",
        "Copie BI/CI solicitant",
        "Adeverință Registru Agricol",
        "Dovada suprafeței agricole",
        "Aviz consultativ asociație producători",
        "Aviz DSVSA (produse animale)"
      ]
    },
    {
      titlu: "Adeverințe Agricole",
      icon: FileText,
      acte: [
        "Cerere eliberare adeverință",
        "Act identitate solicitant",
        "Certificat de moștenitor (după caz)",
        "Certificat de căsătorie (schimbare nume)",
        "Taxă eliberare adeverință (la casierie)"
      ]
    }
  ];

  const formulare = [
    { nume: "Cerere Înscriere Registru", link: "#" },
    { nume: "Cerere Atestat Producător", link: "#" },
    { nume: "Cerere Adeverință Agricolă", link: "#" },
    { nume: "Declarație Terenuri", link: "#" },
    { nume: "Declarație Animale", link: "#" },
    { nume: "Cerere Carnet Comercializare", link: "#" },
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: "Registru Agricol" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Stil Identic Taxe (Hero Gradient) */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          {/* Background Blur Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Tractor className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">
                REGISTRU AGRICOL
              </h1>
              <p className="text-green-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Evidență Funciară • Atestate • Subvenții
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CTA Card - Tematica Verde pentru Agricultură */}
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-green-700 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Wheat className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
                  Campania APIA 2024
                </h2>
                <p className="text-green-100 font-bold italic text-sm mb-6 max-w-md leading-relaxed">
                  Perioada de depunere a cererilor unice de plată a început. 
                  Asigurați-vă că datele din Registrul Agricol sunt actualizate înainte de a merge la APIA.
                </p>
                <div className="flex gap-3">
                   <Button className="rounded-2xl bg-white text-green-700 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] px-6 py-4 h-auto shadow-lg" asChild>
                    <a href="tel:0251447113">
                      <Phone className="mr-2 w-4 h-4" /> Contactează Biroul
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-3 mt-12 mb-2">
              <Info className="w-6 h-6 text-green-700" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Documente Necesare
              </h2>
            </div>

            <div className="grid gap-6">
              {categoriiAgricole.map((cat, idx) => (
                <Card key={idx} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <cat.icon className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">
                        {cat.titlu}
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-1 gap-4">
                    {cat.acte.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
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
                <FileText className="w-5 h-5 text-green-700" />
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-900">
                  Formulare Tipizate
                </h3>
              </div>
              <div className="space-y-3">
                {formulare.map((f, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-between h-12 rounded-xl bg-slate-50 hover:bg-green-50 hover:text-green-700 transition-all group px-4" asChild>
                    <a href={f.link} download>
                      <span className="text-[10px] font-bold italic truncate mr-2">{f.nume}</span>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-green-700" />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Info Contact - Stil Card Negru (cum e la Taxe) */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-green-400" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">
                  Program & Contact
                </h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-green-500 pl-4 py-1">
                  <p className="text-[10px] font-black text-green-400 uppercase">Luni - Joi</p>
                  <p className="text-xs font-bold italic">08:00 - 16:30</p>
                </div>
                <div className="border-l-2 border-slate-700 pl-4 py-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Vineri</p>
                  <p className="text-xs font-bold italic">08:00 - 14:00</p>
                </div>
                
                <div className="pt-2 space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold italic text-slate-300">
                      <Phone className="w-4 h-4 text-green-400" />
                      <a href="tel:0251447113" className="hover:text-white transition-colors">0251 447 113</a>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold italic text-slate-300">
                      <Mail className="w-4 h-4 text-green-400" />
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
                   Termen Legal
                 </p>
                 <p className="text-[10px] font-bold text-amber-800 italic leading-snug">
                   Declarațiile anuale privind suprafețele de teren și efectivele de animale se depun până la data de <strong>15 Mai</strong> a anului în curs.
                 </p>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default RegistruAgricol;