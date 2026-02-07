import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Quote, Eye, ShieldCheck, FileText, Send, Calendar, Clock, MapPin, Phone, UserCheck, Gavel } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";

const atributiiSecretar = [
  "Avizează proiectele de hotărâri și contrasemnează pentru legalitate hotărârile consiliului local și dispozițiile primarului",
  "Participă la ședințele consiliului local și asigură gestionarea procedurilor administrative legate de acestea",
  "Asigură gestionarea procedurilor administrative privind participarea cetățenilor la procesul de luare a deciziilor",
  "Asigură comunicarea către autoritățile competente a actelor administrative emise de primar sau consiliul local",
  "Pregătește lucrările supuse dezbaterii consiliului local și comisiilor de specialitate ale acestuia",
  "Eliberează extrase sau copii de pe orice act din arhiva consiliului local, în afara celor cu caracter secret",
  "Asigură transparența decizională și accesul la informațiile de interes public conform legii",
  "Coordonează activitățile de stare civilă și autoritate tutelară la nivelul unității administrativ-teritoriale",
];

const Secretar = () => {
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
        { label: "Secretar General" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16">
        
        {/* Header Profil Executiv */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <UserCheck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">SECRETAR GENERAL</h1>
              <p className="text-blue-100 mt-2 font-bold uppercase text-[10px] tracking-[0.4em] opacity-80 italic">
                UAT Comuna Almăj • Garantul Legalității Actelor Administrative
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Mesaj Administrativ */}
            <Card className="p-8 lg:p-10 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100 relative overflow-hidden">
              <Quote className="absolute right-8 top-8 w-20 h-20 text-slate-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Gavel className="w-6 h-6 text-blue-700" />
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic text-italic">Legalitate și Transparență</h2>
                </div>
                <div className="space-y-4 text-slate-600 font-medium leading-relaxed italic border-l-4 border-blue-100 pl-6 lg:pl-8 text-lg">
                  <p>Secretarul general al comunei este funcționar public de conducere, cu studii juridice sau administrative, asigurând respectarea principiului legalității în adoptarea actelor administrative.</p>
                  <p>Misiunea noastră este să oferim suport tehnic și juridic consiliului local și primarului, garantând în același timp dreptul cetățenilor de a fi informați corect cu privire la deciziile autorităților locale.</p>
                </div>
              </div>
            </Card>

            {/* Atribuții Legale */}
            <Card className="p-8 lg:p-10 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic text-italic">Atribuții Principale</h2>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Conform Art. 243 din OUG 57/2019 privind Codul Administrativ</p>
              <ul className="space-y-4">
                {atributiiSecretar.map((atributie, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-slate-600 text-sm font-medium leading-relaxed italic italic">{atributie}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar - Audiențe & Documente */}
          <div className="space-y-6">
            
            {/* Formular Programare Audienta */}
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-blue-700 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                  <Calendar className="w-5 h-5 text-blue-200" />
                  <h3 className="font-black uppercase tracking-widest text-[10px] italic">Programare Audiență</h3>
                </div>
                
                <form ref={formRef} onSubmit={handleBooking} className="space-y-4">
                  <input name="user_name" type="text" placeholder="Nume Complet" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 font-bold text-xs outline-none focus:bg-white/20" />
                  <input name="user_phone" type="tel" placeholder="Număr Telefon" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 font-bold text-xs outline-none focus:bg-white/20" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-blue-200 ml-2 italic">Data solicitată</p>
                    <input name="requested_date" type="date" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 font-bold text-xs outline-none focus:bg-white/20" />
                  </div>
                  <Button disabled={isSubmitting} className="w-full h-14 bg-white text-blue-700 hover:bg-blue-50 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-2xl transition-all italic">
                    {isSubmitting ? "Se trimite..." : "Solicită Audiență"}
                  </Button>
                </form>

                <div className="mt-6 flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Clock className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold italic leading-tight text-blue-100">Cererile de audiență pentru secretarul general se prelucrează conform programului de lucru al instituției.</p>
                </div>
              </div>
            </Card>

            {/* Documente Relevante */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <h3 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-400 border-b pb-4">Activitate Juridică</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-slate-100 group" asChild>
                  <a href="/transparenta" className="flex items-center">
                    <Eye className="w-4 h-4 mr-3 text-blue-700 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">Registru Proiecte Hotărâri</span>
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-slate-100 group" asChild>
                  <a href="/organizare" className="flex items-center">
                    <Eye className="w-4 h-4 mr-3 text-blue-700 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">Dispoziții Primar</span>
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Secretar;