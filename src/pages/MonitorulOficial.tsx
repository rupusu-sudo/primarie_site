import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/components/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  FileText, Scale, Wallet, ScrollText, Building2, Megaphone, 
  Plus, FileCheck, ArrowRight, ShieldCheck, Search
} from "lucide-react";
import { toast } from "sonner";

const MonitorulOficial = () => {
  const { user } = useAuth();
  const isAdmin = !!user;

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState("docs_hcl");

  const handleSave = () => {
    if (!title || !date) {
      toast.error("Vă rugăm să completați titlul și data.");
      return;
    }

    const existingData = localStorage.getItem(category);
    const docs = existingData ? JSON.parse(existingData) : [];

    const newDoc = {
      id: Date.now(),
      title,
      date,
      number,
      description: `Publicat oficial la data de ${new Date(date).toLocaleDateString('ro-RO')}`
    };

    localStorage.setItem(category, JSON.stringify([newDoc, ...docs]));
    toast.success("Documentul a fost publicat în Monitorul Oficial!");
    setTitle(""); setDate(""); setNumber(""); setOpen(false);
  };

  const sections = [
    {
      title: "Statutul Comunei",
      desc: "Actul fundamental ce reglementează organizarea localității.",
      icon: Building2,
      href: "/monitorul-oficial/statut",
      color: "indigo"
    },
    {
      title: "Regulamente Locale",
      desc: "Norme juridice obligatorii la nivelul întregii comune.",
      icon: ScrollText,
      href: "/monitorul-oficial/regulamente",
      color: "slate"
    },
    {
      title: "Hotărâri Consiliu (HCL)",
      desc: "Arhiva deciziilor luate de plenul Consiliului Local.",
      icon: Scale,
      href: "/transparenta",
      color: "blue"
    },
    {
      title: "Dispoziții Primar",
      desc: "Actele administrative emise de autoritatea executivă.",
      icon: Megaphone,
      href: "/dispozitii",
      color: "emerald"
    },
    {
      title: "Buget și Finanțe",
      desc: "Transparența resurselor financiare și a cheltuielilor.",
      icon: Wallet,
      href: "/buget",
      color: "amber"
    },
    {
      title: "Alte Documente",
      desc: "Rapoarte, declarații de avere și anunțuri oficiale.",
      icon: FileText,
      href: "/monitorul-oficial/alte-documente",
      color: "slate"
    }
  ];

  return (
    <PageLayout 
        title="Monitorul Oficial" 
        breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Monitorul Oficial Local" }]}
    >
      <div className="container mx-auto px-4 py-16 min-h-screen">
        
        {/* HEADER MODERNIZAT */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-20">
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
              Conform Codului Administrativ
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">
              Monitorul Oficial <span className="text-blue-600">Local</span>
            </h1>
            <p className="text-slate-500 max-w-2xl text-lg font-medium italic">
              Platforma centralizată pentru asigurarea transparenței decizionale și accesul cetățenilor la actele administrative ale Comunei Almăj.
            </p>
          </div>

          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="group h-16 px-8 rounded-3xl bg-slate-900 hover:bg-blue-600 text-white shadow-2xl transition-all hover:scale-105 gap-3">
                  <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-black uppercase text-[10px] tracking-widest">Publică Act Nou</span>
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[550px] rounded-[2rem] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Publicare Document</DialogTitle>
                  <DialogDescription className="font-medium italic">
                    Acest document va fi arhivat oficial în baza de date a Monitorului Local.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6 text-left">
                  <div className="grid gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria de Arhivare</label>
                    <Select onValueChange={setCategory} defaultValue="docs_hcl">
                      <SelectTrigger className="rounded-2xl border-slate-100 h-12">
                        <SelectValue placeholder="Alege secțiunea" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docs_hcl">Hotărâri Consiliu (HCL)</SelectItem>
                        <SelectItem value="docs_dispozitii">Dispoziții Primar</SelectItem>
                        <SelectItem value="docs_buget">Buget și Finanțe</SelectItem>
                        <SelectItem value="docs_regulamente">Regulamente</SelectItem>
                        <SelectItem value="docs_alte">Alte Documente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Titlul Oficial al Actului</label>
                    <Input 
                      placeholder="Ex: Hotărârea nr. 45 din 2024..." 
                      className="rounded-2xl border-slate-100 h-12"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Număr Act</label>
                      <Input placeholder="Nr. 10" className="rounded-2xl border-slate-100 h-12" value={number} onChange={(e) => setNumber(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Data Adoptării</label>
                      <Input type="date" className="rounded-2xl border-slate-100 h-12" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-slate-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <FileCheck className="w-10 h-10 mb-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Încarcă document PDF scanat</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleSave} className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-200">
                    Confirmă Publicarea
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* GRIDUL DE NAVIGARE - CARDURI MARI (Stil Portal Servicii) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Link key={section.title} to={section.href} className="group outline-none">
              <Card className="h-full border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white overflow-hidden text-left relative">
                <CardHeader className="pt-10 px-8 pb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <section.icon className="w-7 h-7 text-slate-900" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                  <CardDescription className="text-slate-500 text-sm font-medium italic mb-6 leading-relaxed">
                    {section.desc}
                  </CardDescription>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-all">
                    Vezi documente <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck className="w-24 h-24 -mr-8 -mt-8" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </PageLayout>
  );
};

export default MonitorulOficial;