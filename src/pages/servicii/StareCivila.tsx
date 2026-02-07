import { Baby, Heart, Church, FileSignature, FileDown, Info, Clock, Download, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const proceduriStareCivila = [
  {
    titlu: "Înregistrarea Nașterii",
    icon: Baby,
    color: "text-blue-600",
    acte: [
      "Certificat medical constatator al născutului",
      "Actele de identitate ale părinților",
      "Certificatul de căsătorie al părinților (dacă este cazul)",
      "Termen: 30 de zile de la data nașterii"
    ]
  },
  {
    titlu: "Căsătorie (Oficiere)",
    icon: Heart,
    color: "text-red-600",
    acte: [
      "Actele de identitate ale viitorilor soți",
      "Certificatele de naștere (original și copie)",
      "Certificate medicale prenupțiale (valabile 14 zile)",
      "Declarația de căsătorie (se face personal la sediu)"
    ]
  },
  {
    titlu: "Înregistrarea Decesului",
    icon: FileSignature,
    color: "text-slate-600",
    acte: [
      "Certificatul medical constatator al decesului",
      "Actul de identitate al persoanei decedate",
      "Certificatul de naștere și căsătorie al decedatului",
      "Actul de identitate al declarantului"
    ]
  }
];

const formulareDescarcare = [
  { nume: "Cerere eliberare duplicat certificat", link: "#" },
  { nume: "Cerere extras multilingv", link: "#" },
  { nume: "Declarație nume copil", link: "#" },
  { nume: "Cerere divorț administrativ", link: "#" },
];

const StareCivila = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: "Stare Civilă" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Tema Acasa */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Church className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">STARE CIVILĂ</h1>
              <p className="text-blue-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Evidența Persoanelor • Evenimente de Viață • Acte Oficiale
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Proceduri Evenimente Viata */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-blue-700" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Ghidul Procedurilor</h2>
            </div>

            <div className="grid gap-6">
              {proceduriStareCivila.map((proc, idx) => (
                <Card key={idx} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50 group hover:shadow-md transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${proc.color} group-hover:scale-110 transition-transform`}>
                      <proc.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{proc.titlu}</h3>
                  </div>
                  <div className="grid md:grid-cols-1 gap-3">
                    {proc.acte.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50">
                        <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span className="text-sm font-bold text-slate-600 italic leading-relaxed">{act}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Descarcare & Contact */}
          <div className="space-y-6">
            
            {/* Formulare Rapide */}
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <FileDown className="w-24 h-24" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-[10px] mb-8 text-blue-400">Documente și Cereri</h3>
              <div className="space-y-3 relative z-10">
                {formulareDescarcare.map((f, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-between h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white hover:text-slate-900 transition-all group px-5" asChild>
                    <a href={f.link} download>
                      <span className="text-[10px] font-black uppercase tracking-tight">{f.nume}</span>
                      <Download className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Info Sediu */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <MapPin className="w-5 h-5 text-blue-700" />
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-900">Unde ne găsiți?</h3>
              </div>
              <p className="text-xs font-bold text-slate-600 italic leading-relaxed mb-6">
                Compartimentul Stare Civilă se află la parterul Primăriei Almăj, acces direct din strada principală.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-black uppercase text-[10px] tracking-widest">Program de lucru</span>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold text-slate-600">
                     <span>Luni - Vineri:</span>
                     <span className="text-slate-900 font-black">08:00 - 12:00</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-slate-600">
                     <span>După-amiază:</span>
                     <span className="text-slate-400 italic">Doar urgențe</span>
                   </div>
                </div>
              </div>
            </Card>

            {/* Nota Informativa */}
            <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-start gap-4">
               <Info className="w-5 h-5 text-blue-700 shrink-0 mt-1" />
               <p className="text-[10px] font-bold text-blue-800 italic leading-snug">
                 Oficierea căsătoriilor în zilele de sâmbătă și duminică se face cu programare prealabilă de minim 2 săptămâni.
               </p>
            </div>

          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default StareCivila;