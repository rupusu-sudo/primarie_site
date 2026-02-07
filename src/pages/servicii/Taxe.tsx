import { Wallet, CreditCard, FileText, Info, Download, CheckCircle2, Landmark, Clock, ExternalLink, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const proceduriTaxe = [
  {
    titlu: "Declarare Imobil / Teren",
    acte: [
      "Actul de proprietate (original și copie)",
      "Actul de identitate al proprietarului",
      "Cadastru / Schița imobilului",
      "Declarația tip (ITL) completată",
      "Certificat de atestare fiscală de la vechiul proprietar"
    ]
  },
  {
    titlu: "Înregistrare Mijloace de Transport",
    acte: [
      "Contract de înstrăinare-dobândire (Vânzare-Cumpărare)",
      "Cartea de identitate a vehiculului (CIV)",
      "Actul de identitate al noului proprietar",
      "Certificat de atestare fiscală de la vânzător",
      "Fișa de înmatriculare"
    ]
  }
];

const formulareFiscale = [
  { nume: "Declarație ITL - Clădiri", link: "#" },
  { nume: "Declarație ITL - Terenuri", link: "#" },
  { nume: "Declarație ITL - Auto", link: "#" },
  { nume: "Cerere eliberare certificat fiscal", link: "#" },
  { nume: "Cerere scutire taxe (cazuri speciale)", link: "#" },
];

const TaxeImpozite = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: "Taxe și Impozite" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Tema Acasa */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Wallet className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">TAXE ȘI IMPOZITE</h1>
              <p className="text-blue-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Sistem Fiscal Local • Plăți • Declarații
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Proceduri */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CTA Plata Online - Cel mai important element */}
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-blue-700 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <CreditCard className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Plătește Online prin Ghișeul.ro</h2>
                <p className="text-blue-100 font-bold italic text-sm mb-6 max-w-md leading-relaxed">
                  Simplu, rapid și sigur. Poți achita impozitul pe clădiri, terenuri, auto sau amenzile direct cu cardul bancar, fără comision.
                </p>
                <Button className="rounded-2xl bg-white text-blue-700 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] px-8 py-6 h-auto shadow-lg" asChild>
                  <a href="https://www.ghiseul.ro" target="_blank" rel="noreferrer">
                    Accesează Platforma <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Card>

            <div className="flex items-center gap-3 mt-12 mb-2">
              <Landmark className="w-6 h-6 text-blue-700" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Ghid de Declarare Bunuri</h2>
            </div>

            <div className="grid gap-6">
              {proceduriTaxe.map((proc, idx) => (
                <Card key={idx} className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50 relative">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 italic">
                    {proc.titlu}
                  </h3>
                  <div className="grid md:grid-cols-1 gap-4">
                    {proc.acte.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                        <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                        <span className="text-sm font-bold text-slate-700 italic">{act}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Descarcare & Program */}
          <div className="space-y-6">
            
            {/* Card Descarcare Formulare Fiscale */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-900">Formulare Fiscale</h3>
              </div>
              <div className="space-y-3">
                {formulareFiscale.map((f, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-between h-12 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-all group px-4" asChild>
                    <a href={f.link} download>
                      <span className="text-[10px] font-bold italic truncate mr-2">{f.nume}</span>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Info Termene */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">Termene de Plată</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase">Semestrul I</p>
                  <p className="text-xs font-bold italic">Până la 31 Martie</p>
                  <p className="text-[9px] text-slate-400 mt-1">Bonificație 10% la plata integrală.</p>
                </div>
                <div className="border-l-2 border-slate-700 pl-4 py-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Semestrul II</p>
                  <p className="text-xs font-bold italic">Până la 30 Septembrie</p>
                </div>
              </div>
            </Card>

            {/* Alerta Amenzi */}
            <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
               <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
               <div>
                 <p className="text-[11px] font-black uppercase text-amber-900 mb-1">Atenție la Amenzi</p>
                 <p className="text-[10px] font-bold text-amber-800 italic leading-snug">
                   Amenzile se plătesc în termen de 15 zile pentru a beneficia de reducerea de 50%.
                 </p>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default TaxeImpozite;