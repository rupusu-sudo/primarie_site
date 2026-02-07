import { Map, Ruler, FileDown, Info, HardHat, FileText, ChevronRight, Download, CheckCircle2, ClipboardList, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const dosarNecesar = [
  {
    titlu: "Dosar Certificat de Urbanism",
    acte: [
      "Cerere-tip (se descarcă din dreapta)",
      "Planuri cadastrale/topografice (scara 1:500 și 1:2000)",
      "Extras de Carte Funciară (actualizat, nu mai vechi de 30 zile)",
      "Dovada achitării taxei de eliberare",
      "Memoriu tehnic justificativ (după caz)"
    ]
  },
  {
    titlu: "Dosar Autorizație de Construire",
    acte: [
      "Certificatul de Urbanism (copie)",
      "Dovada titlului asupra imobilului (teren și/sau construcții)",
      "Proiectul pentru Autorizarea Executării Lucrărilor (P.A.C.)",
      "Avizele și acordurile stabilite prin C.U.",
      "Dovada achitării taxei de autorizare (1% din valoarea lucrărilor)"
    ]
  }
];

const formulareDescarcare = [
  { nume: "Cerere Certificat Urbanism", link: "https://primariaalmaj.ro/formulare/cerere_cu.pdf" },
  { nume: "Cerere Autorizație Construire", link: "https://primariaalmaj.ro/formulare/cerere_ac.pdf" },
  { nume: "Anunț Începere Lucrări", link: "#" },
  { nume: "Anunț Finalizare Lucrări", link: "#" },
  { nume: "Cerere Nomenclatură Stradală", link: "#" },
  { nume: "Cerere Prelungire C.U./A.C.", link: "#" },
];

const Urbanism = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: "Urbanism" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Premium Style */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Map className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic italic">URBANISM</h1>
              <p className="text-blue-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic italic">
                Documentații Tehnice • Avize • Autorizații
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Partea Stângă - DOSARUL (Ce acte trebuie să aducă) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="w-6 h-6 text-blue-700" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Documente Necesare pentru Dosar</h2>
            </div>

            <div className="grid gap-6">
              {dosarNecesar.map((sectiune, idx) => (
                <Card key={idx} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText className="w-24 h-24" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2 italic italic">
                    <span className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs not-italic">{idx + 1}</span>
                    {sectiune.titlu}
                  </h3>
                  <ul className="space-y-4">
                    {sectiune.acte.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                        <span className="text-sm font-bold text-slate-600 italic leading-relaxed group-hover:text-slate-900 transition-colors">
                          {act}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Partea Dreaptă - FORMULARE (Descarcă de aici) */}
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileDown className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs italic">Descarcă Formulare</h3>
                </div>

                <div className="space-y-3">
                  {formulareDescarcare.map((f, i) => (
                    <Button key={i} variant="outline" className="w-full justify-between h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white hover:text-slate-900 transition-all group px-5" asChild>
                      <a href={f.link} download>
                        <span className="text-[10px] font-black uppercase tracking-tight">{f.nume}</span>
                        <Download className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Program & Info */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-blue-700" />
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-900">Program Depunere Dosare</h3>
              </div>
              <div className="space-y-3 text-xs font-bold text-slate-600 italic">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Luni - Miercuri:</span>
                  <span className="text-slate-900 font-black">08:30 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Vineri:</span>
                  <span className="text-slate-900 font-black">Fără public</span>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 flex items-start gap-3 border border-blue-100">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-blue-800 leading-tight italic">
                  Toate copiile după actele de proprietate trebuie prezentate împreună cu originalele pentru conformitate.
                </p>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default Urbanism;