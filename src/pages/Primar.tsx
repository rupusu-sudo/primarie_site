import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Quote, Eye, ShieldCheck, FileText, Send, Calendar, Clock, MapPin, Phone, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";

const atributii = [
  "Reprezintă unitatea administrativ-teritorială în relațiile cu alte autorități publice, cu persoanele fizice sau juridice române ori străine, precum și în justiție",
  "Îndeplinește funcția de ofițer de stare civilă și de autoritate tutelară și asigură funcționarea serviciilor publice locale de profil",
  "Îndeplinește atribuții privind organizarea și desfășurarea alegerilor, referendumului și a recensământului",
  "Exercită funcția de ordonator principal de credite",
  "Întocmește proiectul bugetului unității administrativ-teritoriale și contul de încheiere a exercițiului bugetar și le supune spre aprobare consiliului local",
  "Inițiază, în condițiile legii, negocieri pentru contractarea de împrumuturi și emiterea de titluri de valoare în numele unității administrativ-teritoriale",
  "Verifică, prin compartimentele de specialitate, corecta înregistrare fiscală a contribuabililor la organul fiscal teritorial, atât a sediului social principal, cât și a sediului secundar",
  "Asigură ordinea publică și liniștea locuitorilor, prin intermediul poliției locale, a jandarmeriei, a poliției, a pompierilor și al altor unități specializate",
  "Ia măsuri pentru prevenirea și, după caz, gestionarea situațiilor de urgență",
  "Asigură elaborarea planurilor urbanistice prevăzute de lege, le supune aprobării consiliului local și acționează pentru respectarea prevederilor acestora",
  "Emite avizele, acordurile și autorizațiile date în competența sa prin lege și alte acte normative",
  "Asigură realizarea lucrărilor și ia măsurile necesare conformării cu prevederile angajamentelor asumate în procesul de integrare europeană în domeniul protecției mediului și gospodăririi apelor pentru serviciile furnizate cetățenilor",
];

const Primar = () => {
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
        { label: "Primar" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16">
        
        {/* Header - Identic cu tematica Acasa */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <UserCheck className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">GORJAN ALIN-MĂDĂLIN</h1>
              <p className="text-blue-100 mt-2 font-bold uppercase text-[10px] tracking-[0.4em] opacity-80 italic">
                Primarul Comunei Almăj • Ordonator Principal de Credite
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Mesajul Primarului */}
            <Card className="p-8 lg:p-10 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100 relative overflow-hidden">
              <Quote className="absolute right-8 top-8 w-20 h-20 text-slate-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-700" />
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Mesajul Primarului</h2>
                </div>
                <div className="space-y-4 text-slate-600 font-medium leading-relaxed italic border-l-4 border-blue-100 pl-6 lg:pl-8 text-lg">
                  <p className="text-slate-900 font-black not-italic tracking-tight">Stimați cetățeni ai comunei Almăj,</p>
                  <p>Vă urez bun venit pe site-ul oficial al Primăriei Comunei Almăj. Acest portal reprezintă un instrument modern de comunicare prin care dorim să vă oferim acces facil la informațiile de interes public.</p>
                  <p>Comuna Almăj este situată în jumătatea de nord a județului Dolj, comunitatea noastră fiind formată din 2211 locuitori, răspândiți în cele 4 sate: Almăj, Bogea, Moșneni și Sitoaia.</p>
                  <p>Ne angajăm să oferim servicii de calitate și transparență deplină. Suntem aici pentru a servi interesele cetățenilor și pentru dezvoltarea comunității noastre.</p>
                  <div className="pt-6">
                    <p className="font-black text-slate-900 uppercase tracking-tighter text-sm not-italic leading-none">Gorjan Alin-Mădălin</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-700 not-italic mt-1">Primarul Comunei Almăj</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Atribuții Legale */}
            <Card className="p-8 lg:p-10 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-700" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Atribuții Legale</h2>
              </div>
              <ul className="space-y-4">
                {atributii.map((atributie, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-slate-600 text-sm font-medium leading-relaxed italic">{atributie}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Formular Programare Audienta */}
            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-blue-700 text-white">
              <div className="flex items-center gap-2 mb-8">
                <Calendar className="w-5 h-5 text-blue-200" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">Programare Audiență</h3>
              </div>
              
              <form ref={formRef} onSubmit={handleBooking} className="space-y-4">
                <input name="user_name" type="text" placeholder="Nume Complet" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 font-bold text-xs outline-none focus:bg-white/20" />
                <input name="user_phone" type="tel" placeholder="Număr Telefon" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 font-bold text-xs outline-none focus:bg-white/20" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-blue-200 ml-2 italic">Data audienței</p>
                  <input name="requested_date" type="date" required className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 font-bold text-xs outline-none focus:bg-white/20" />
                </div>
                <Button disabled={isSubmitting} className="w-full h-14 bg-white text-blue-700 hover:bg-blue-50 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-2xl transition-all">
                  {isSubmitting ? "Se trimite..." : "Solicită Audiență"}
                </Button>
              </form>
              <div className="mt-6 flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Clock className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold italic leading-tight text-blue-100 italic">Audiențele au loc în fiecare Luni, între orele 10:00 - 12:00.</p>
              </div>
            </Card>

            {/* Declaratii de Avere */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <h3 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-400 border-b pb-4">Documente Oficiale</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-slate-100 group" asChild>
                  <a href="https://primariaalmaj.ro/declavere23/DA%20GORJAN%20ALIN%20MADALIN%202023.pdf" target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-3 text-blue-700 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">Avere 2023</span>
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-slate-100 group" asChild>
                  <a href="https://primariaalmaj.ro/declavere23/DI%20GORJAN%20ALIN%20MADALIN%202023.pdf" target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-3 text-blue-700 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">Interese 2023</span>
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

export default Primar;