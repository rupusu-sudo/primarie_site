import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Quote, Eye, ShieldCheck, FileText, Send, Calendar, Clock, MapPin, Phone, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";

const atributiiVice = [
  "Îndeplinește atribuțiile delegate de către primar, în condițiile legii",
  "Coordonează realizarea serviciilor publice de interes local prestate prin intermediul aparatului de specialitate",
  "Urmărește realizarea măsurilor de asigurare a igienei și salubrității publice",
  "Contribuie la buna organizare și desfășurare a activităților culturale, sportive, de tineret și educative",
  "Răspunde de inventarierea și administrarea bunurilor care aparțin domeniului public și domeniului privat al comunei",
];

const Viceprimar = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formRef.current!, 'YOUR_PUBLIC_KEY')
      .then(() => {
        toast({ title: "Cerere trimisă!", description: "Solicitarea de audiență a fost înregistrată." });
        formRef.current?.reset();
      })
      .catch(() => {
        toast({ title: "Eroare", description: "Vă rugăm să încercați telefonic.", variant: "destructive" });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Primăria", href: "/primaria" },
        { label: "Viceprimar" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16">
        
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <UserCheck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic italic">VICEPRIMAR</h1>
              <p className="text-blue-100 mt-2 font-bold uppercase text-[10px] tracking-[0.4em] opacity-80 italic italic">
                Viceprimarul Comunei Almăj • Executiv Local
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 lg:p-10 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100 relative overflow-hidden">
              <Quote className="absolute right-8 top-8 w-20 h-20 text-slate-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-700" />
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic italic">Responsabilitate și Dezvoltare</h2>
                </div>
                <div className="space-y-4 text-slate-600 font-medium leading-relaxed italic border-l-4 border-blue-100 pl-6 lg:pl-8 text-lg">
                  <p>Viceprimarul îndeplinește atribuțiile care îi sunt delegate de primar, în condițiile legii, și asigură implementarea proiectelor de interes comunitar.</p>
                  <p>Obiectivul nostru principal este creșterea calității vieții cetățenilor prin monitorizarea atentă a serviciilor publice locale.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 lg:p-10 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic italic">Atribuții Delegate</h2>
              </div>
              <ul className="space-y-4">
                {atributiiVice.map((atributie, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-slate-600 text-sm font-medium leading-relaxed italic italic">{atributie}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-blue-700 text-white">
              <div className="flex items-center gap-2 mb-8">
                <Calendar className="w-5 h-5 text-blue-200" />
                <h3 className="font-black uppercase tracking-widest text-[10px] italic">Programare Audiență</h3>
              </div>
              <form ref={formRef} onSubmit={handleBooking} className="space-y-4">
                <input name="user_name" type="text" placeholder="Nume Complet" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 font-bold text-xs outline-none focus:bg-white/20" />
                <input name="user_phone" type="tel" placeholder="Număr Telefon" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 font-bold text-xs outline-none focus:bg-white/20" />
                <input name="requested_date" type="date" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 font-bold text-xs outline-none focus:bg-white/20" />
                <Button disabled={isSubmitting} className="w-full h-14 bg-white text-blue-700 hover:bg-blue-50 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-2xl transition-all italic">
                   Trimite Solicitarea
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Viceprimar;