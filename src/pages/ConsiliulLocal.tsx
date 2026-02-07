import { Users, Gavel, FileText, UserCheck, Eye, ShieldCheck, Download, Scale, BookOpen, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const consilieri = [
  { nume: "BITOLEANU BOGDAN-NICUȘOR", partid: "PSD", comisie: "Buget-Finanțe", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "CĂLINOIU CONSTANTIN", partid: "PSD", comisie: "Agricultură", avere: "https://primariaalmaj.ro/declavere23/DA%20CALINOIU%20CONSTANTIN%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20CALINOIU%20CONSTANTIN%202023.pdf" },
  { nume: "ISTUDOR ILARION", partid: "PNL", comisie: "Urbanism", avere: "https://primariaalmaj.ro/declavere23/DA%20ISTUDOR%20ILARION%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20ISTUDOR%20ILARION%202023.pdf" },
  { nume: "MORUJU GRIGORE-DANIEL", partid: "PSD", comisie: "Buget-Finanțe", avere: "https://primariaalmaj.ro/declavere23/DA%20MORUJU%20DANIEL%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20MORUJU%20GRIGORIE%20DANIEL%202023.pdf" },
  { nume: "NICA ION", partid: "PNL", comisie: "Învățământ", avere: "https://primariaalmaj.ro/declavere23/DA%20NICA%20ION%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20NICA%20ION%202023.pdf" },
  { nume: "PÎRVULESCU DORINA-CRISTINA", partid: "USR", comisie: "Învățământ", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "PĂUNA MARIUS-VALENTIN", partid: "PSD", comisie: "Agricultură", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "STAN LAURENȚIU-IONUȚ", partid: "PSD", comisie: "Urbanism", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "TĂLĂBAN ROBERT-IONUȚ", partid: "PSD", comisie: "Buget-Finanțe", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "TOTORA SIMION-CRISTIAN", partid: "SENS", comisie: "Agricultură", avere: "https://primariaalmaj.ro/declavere23/DA%20TOTORA%20SIMION%20CRISTIAN%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20TOTORA%20SIMION%20CRISTIAN%20.pdf" },
  { nume: "UȚOIU LAURENȚIU-CONSTANTIN", partid: "PSD", comisie: "Urbanism", avere: "https://primariaalmaj.ro/declavere23/DA%20UTOIU%20CTIN%20LAURENTIU%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20UTOIU%20LAURENTIU%20CONSTANTIN%202023.pdf" },
];

const atributiiLegale = [
  "Aprobă bugetul local, împrumuturile, contul de încheiere a exercițiului bugetar și utilizarea rezervei bugetare",
  "Aprobă strategiile de dezvoltare economică, socială și de mediu a unității administrativ-teritoriale",
  "Hotărăște darea în administrare, concesionarea sau închirierea bunurilor proprietate publică a comunei",
  "Inițiază și aprobă proiecte de hotărâri (HCL) privind dezvoltarea infrastructurii și serviciilor publice",
  "Aprobă planurile urbanistice (PUG, PUZ) și documentațiile de amenajare a teritoriului",
  "Alege viceprimarul din rândul consilierilor locali, la propunerea primarului sau a consilierilor"
];

const getPartidBadge = (partid: string) => {
  switch (partid) {
    case 'PSD': return 'bg-red-50 text-red-700 border-red-100';
    case 'PNL': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'USR': return 'bg-sky-50 text-sky-700 border-sky-100';
    case 'SENS': return 'bg-purple-50 text-purple-700 border-purple-100';
    default: return 'bg-slate-50 text-slate-700 border-slate-100';
  }
};

const ConsiliulLocal = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Primăria", href: "/primaria" },
        { label: "Consiliul Local" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16 px-4">
        
        {/* Header - Identic cu tematica Acasa */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Users className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic italic">CONSILIUL LOCAL</h1>
              <p className="text-blue-100 mt-3 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80 italic">
                Autoritatea Deliberativă Almăj • Mandatul 2024-2028
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main List - Consilieri */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-6 h-6 text-blue-700" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Componența Consiliului</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {consilieri.map((c, index) => (
                <Card key={index} className="p-6 border-none shadow-sm rounded-[2rem] bg-white border border-slate-50 group hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-all duration-500">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 truncate">{c.nume}</h3>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getPartidBadge(c.partid)}`}>
                        {c.partid}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                      <Gavel className="w-3 h-3 text-blue-700" /> {c.comisie}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" className="flex-1 h-10 rounded-xl bg-slate-50 text-blue-700 hover:bg-blue-700 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest" asChild>
                        <a href={c.avere} target="_blank" rel="noopener noreferrer"><Download className="w-3 h-3 mr-2" /> Avere</a>
                      </Button>
                      <Button variant="ghost" className="flex-1 h-10 rounded-xl bg-slate-50 text-blue-700 hover:bg-blue-700 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest" asChild>
                        <a href={c.interese} target="_blank" rel="noopener noreferrer"><Download className="w-3 h-3 mr-2" /> Interese</a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Atribuții Administrative conform Legii */}
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-blue-700" />
                <h3 className="font-black uppercase tracking-tighter text-lg text-slate-900 italic">Rol Legislativ</h3>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 leading-relaxed">
                Conform OUG 57/2019 privind Codul Administrativ
              </p>
              
              <div className="space-y-5">
                {atributiiLegale.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-100 mt-1.5 shrink-0 group-hover:bg-blue-700 transition-colors"></div>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-50">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 group" asChild>
                  <a href="/transparenta" className="flex items-center justify-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Vezi ROI Consiliu</span>
                  </a>
                </Button>
              </div>
            </Card>

            {/* Card Info ANI */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ShieldCheck className="w-32 h-32" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Transparență ANI</h3>
               <p className="text-xs font-bold italic text-slate-300 leading-relaxed relative z-10">
                 Declarațiile de avere și interese sunt actualizate anual conform Legii nr. 176/2010. Originalele pot fi consultate pe portalul oficial al Agenției Naționale de Integritate.
               </p>
            </Card>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default ConsiliulLocal;