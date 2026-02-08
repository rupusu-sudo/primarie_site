import { useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox"; 
import { 
  Phone, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Building2,
  Send,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";

const MAYOR_DATA = {
  name: "Gorjan Alin-Mădălin",
  role: "Primarul Comunei Almăj",
  shortRole: "Primar • Mandat 2024-2028",
  email: "primariaalmaj@gmail.com",
  phone: "0251 449 234",
  quote: "Vreau să aduc viitorul în prezentul comunei Almăj. Sunt un om tânăr și am energia necesară pentru a transforma 'casa noastră' într-o localitate modernă.",
  program: "Luni: 9:00 - 11:00"
};

const priorities = [
  { title: "Digitalizare", desc: "Plata taxelor online și documente digitale.", icon: <FileText className="w-5 h-5 text-blue-600" /> },
  { title: "Infrastructură", desc: "Asfaltarea drumurilor și rețele de utilități.", icon: <TrendingUp className="w-5 h-5 text-emerald-600" /> },
  { title: "Tineri", desc: "Crearea de oportunități pentru tinerele familii.", icon: <Users className="w-5 h-5 text-purple-600" /> }
];

const Primar = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gdprAccepted) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('user_name'),
        phone: formData.get('user_phone'),
        email: formData.get('user_email'),
        message: formData.get('message'),
    };

    try {
        const response = await fetch('http://localhost:3001/api/contact-primar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            toast({ title: "Solicitare trimisă!", description: "Veți primi o confirmare prin email.", className: "bg-green-600 text-white" });
            formRef.current?.reset();
            setGdprAccepted(false);
        }
    } catch (error) {
        toast({ title: "Eroare", description: "Nu s-a putut contacta serverul.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație", href: "/primaria" }, { label: "Primar" }]}>
      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-12 space-y-8 lg:space-y-12 overflow-x-hidden">
        
        {/* --- HERO: Adaptiv pentru ecrane mici --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border-none shadow-lg rounded-[1.5rem] lg:rounded-[2.5rem] p-5 lg:p-10 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 lg:w-64 lg:h-64 bg-blue-50/50 rounded-bl-full opacity-60 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-2xl bg-slate-100 shadow-inner flex items-center justify-center text-slate-300 shrink-0 border-2 border-white">
                  <Users className="w-12 h-12 lg:w-16 lg:h-16 opacity-20" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight break-words">{MAYOR_DATA.name}</h1>
                <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-1">{MAYOR_DATA.shortRole}</p>
                <p className="text-slate-600 italic text-sm lg:text-base mt-4 leading-relaxed max-w-prose">"{MAYOR_DATA.quote}"</p>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-[1.5rem] bg-blue-600 text-white p-5 border-none shadow-md">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-blue-100 shrink-0" />
                <div className="min-w-0">
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Program Audiențe</p>
                  <p className="text-base lg:text-lg font-black truncate">{MAYOR_DATA.program}</p>
                </div>
              </div>
            </Card>
            <Button asChild variant="destructive" className="w-full h-14 rounded-2xl bg-red-50 text-red-600 border-red-100 hover:bg-red-100 group">
              <a href={`mailto:${MAYOR_DATA.email}`} className="flex items-center justify-between w-full px-2">
                <span className="font-bold flex items-center gap-2 text-xs sm:text-sm lg:text-base"><AlertTriangle className="w-4 h-4 shrink-0" /> Semnalează o problemă</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* --- CONTENT GRID: 1 coloană pe mobil --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <Building2 className="w-6 h-6 text-blue-600 shrink-0" />
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 uppercase">Priorități</h2>
              </div>
              <div className="grid gap-4">
                {priorities.map((item, i) => (
                  <Card key={i} className="border-none bg-white shadow-sm border border-slate-100 p-1 hover:border-blue-100 transition-colors">
                    <CardHeader className="pb-2 flex flex-row items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{item.icon}</div>
                      <CardTitle className="text-base font-bold text-slate-800">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-500 leading-relaxed break-words">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* --- FORMULAR INTEGRAT --- */}
            <section id="programare-audienta" className="space-y-6 pt-4">
              <div className="flex items-center gap-3 px-1">
                <Calendar className="w-6 h-6 text-blue-600 shrink-0" />
                <h2 className="text-xl lg:text-1xl font-black text-slate-900 uppercase">Înscrie-te în Audiență</h2>
              </div>
              <Card className="border-none shadow-sm border border-slate-100 bg-white rounded-[1.5rem] lg:rounded-[2rem]">
                <CardContent className="p-5 lg:p-8">
                  <form ref={formRef} onSubmit={handleBooking} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nume Complet</label>
                        <input name="user_name" required className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-black-400 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Telefon</label>
                        <input name="user_phone" type="tel" required pattern="^07[0-9]{8}$" className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-black-400 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Email Confirmare</label>
                      <input name="user_email" type="email" required className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-black-400 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Mesaj / Motiv</label>
                      <textarea name="message" rows={3} className="w-full p-4 rounded-xl bg-slate-50 border border-black-400 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium resize-none" />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <Checkbox id="gdpr" checked={gdprAccepted} onCheckedChange={(c) => setGdprAccepted(c as boolean)} className="mt-0.5" />
                      <label htmlFor="gdpr" className="text-[11px] lg:text-xs leading-relaxed text-slate-500 italic cursor-pointer select-none">
                        Sunt de acord cu prelucrarea datelor mele personale conform politicii GDPR a Primăriei Almăj.
                      </label>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !gdprAccepted} className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]">
                      {isSubmitting ? "Se trimite..." : <span className="flex items-center gap-2">Trimite Solicitarea <Send className="w-4 h-4" /></span>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 uppercase">Atribuții</h2>
              </div>
              <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 p-6 lg:p-8 shadow-sm space-y-5">
                 {["Reprezentarea localității în relații externe", "Gestionarea bugetului local", "Ofițer de stare civilă", "Coordonarea serviciilor publice"].map((task, idx) => (
                    <div key={idx} className="flex gap-4 items-start min-w-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium break-words leading-tight">{task}</span>
                    </div>
                 ))}
                 <Separator />
                 <a href="/monitorul/statut" className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-2 group">
                    VEZI STATUTUL COMPLET 
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>
            </section>

            <section className="bg-slate-900 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
               <h3 className="text-lg lg:text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> Transparență
               </h3>
               <div className="space-y-3">
                  <a href="https://primariaalmaj.ro/declavere23/DA%20GORJAN%20ALIN%20MADALIN%202023.pdf" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                    <span className="text-xs sm:text-sm font-medium">Declarație Avere 2024</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </a>
                  <a href="https://primariaalmaj.ro/declavere23/DI%20GORJAN%20ALIN%20MADALIN%202023.pdf" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                    <span className="text-xs sm:text-sm font-medium">Declarație Interese 2024</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </a>
               </div>
            </section>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Primar;