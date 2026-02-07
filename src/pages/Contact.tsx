import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Phone, Mail, MapPin, Send, ShieldCheck, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    // Validare suplimentară în funcție, deși butonul este blocat
    if (!gdprAccepted) {
      toast({
        title: "Acord necesar",
        description: "Bifați căsuța de mai jos pentru a putea trimite mesajul.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    emailjs.sendForm(
      'service_ei626td', 
      'template_8c1l8s9', 
      formRef.current!, 
      'dLtErg83Eo9yKtvTD'
    )
    .then(() => {
      toast({
        title: "Mesaj trimis!",
        description: "Solicitarea dumneavoastră a ajuns la Primăria Almăj.",
      });
      formRef.current?.reset();
      setGdprAccepted(false);
    })
    .catch(() => {
      toast({
        title: "Eroare la trimitere",
        description: "Vă rugăm să încercați din nou mai târziu.",
        variant: "destructive",
      });
    })
    .finally(() => setIsSubmitting(false));
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span className="text-blue-700 font-black uppercase text-[10px] tracking-[0.3em]">Portal Contact</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Contact <span className="text-blue-700">Oficial</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Info Carduri */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Adresă", text: "Str. Principală, Almăj, Dolj" },
              { icon: Phone, title: "Telefon", text: "0251 449 234" },
              { icon: Mail, title: "Email", text: "primariaalmaj@gmail.com" }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border-none shadow-sm flex items-center gap-4 rounded-[2rem] bg-white">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{item.title}</h4>
                  <p className="text-sm font-bold text-slate-500 italic leading-none mt-1">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Formular */}
          <div className="lg:col-span-2">
            <Card className="p-8 md:p-10 border-none shadow-2xl rounded-[3rem] bg-white">
              <form ref={formRef} onSubmit={handleSend} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="from_name" type="text" placeholder="Nume Prenume" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none font-bold text-xs" />
                  <input name="reply_to" type="email" placeholder="Email" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none font-bold text-xs" />
                </div>
                
                <input name="subject" type="text" placeholder="Subiectul solicitării" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none font-bold text-xs" />

                <textarea name="message" placeholder="Mesajul dumneavoastră..." required className="w-full h-40 p-6 rounded-[2rem] bg-slate-50 border-none font-bold text-xs resize-none" />

                {/* --- SECTIUNE GDPR VIZIBILA --- */}
                <div className={`p-5 rounded-2xl transition-all duration-300 border-2 ${gdprAccepted ? 'bg-blue-50/50 border-blue-100' : 'bg-amber-50/50 border-amber-100 animate-pulse'}`}>
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      id="gdpr" 
                      checked={gdprAccepted}
                      onCheckedChange={(checked) => setGdprAccepted(checked === true)}
                      className="mt-1 w-5 h-5 border-slate-300 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                    />
                    <div className="space-y-1">
                      <label htmlFor="gdpr" className="text-[11px] leading-relaxed font-bold text-slate-700 cursor-pointer">
                        Sunt de acord cu prelucrarea datelor cu caracter personal conform Regulamentului GDPR.
                      </label>
                      <p className="text-[10px] text-slate-500 italic leading-snug">
                        Fără bifarea acestei căsuțe, solicitarea dumneavoastră nu poate fi transmisă prin portalul web.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!gdprAccepted || isSubmitting}
                  className={`w-full h-16 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                    gdprAccepted 
                    ? 'bg-blue-700 hover:bg-slate-900 cursor-pointer' 
                    : 'bg-slate-300 cursor-not-allowed grayscale'
                  }`}
                >
                  {isSubmitting ? "Se trimite..." : "Trimite Mesaj"}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
                
                {!gdprAccepted && (
                  <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-600">
                    <AlertCircle className="w-3 h-3" />
                    Bifați acordul pentru a debloca butonul
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;