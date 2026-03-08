import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import PageLayout from "@/components/PageLayout";
import { ServiceInfoGrid } from "@/components/servicii/ServiceInfoGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  ShieldCheck,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { API_URL } from "@/config/api";

interface FAQItem {
  question: string;
  answer: string;
}

gsap.registerPlugin(ScrollTrigger);

const mayorData = {
  name: "Gorjan Alin-Mădălin",
  role: "Primarul Comunei Almăj",
  shortRole: "Primar • Mandat 2024-2028",
  locality: "Comuna Almăj, jud. Dolj",
  email: "primariaalmaj@gmail.com",
  phone: "0251 449 234",
  audienceSchedule: "Luni: 09:00 - 11:00",
  location: "Primăria Almăj – Biroul Primarului",
  responseTime: "Răspuns estimat: 48-72h",
  messageShort:
    "Prioritatea mandatului meu este să livrăm servicii publice rapide, corecte și transparente pentru fiecare locuitor al comunei Almăj. Echipa primăriei tratează cu maximă seriozitate fiecare sesizare primită.",
  messageLong:
    "Prioritatea mandatului meu este să livrăm servicii publice rapide, corecte și transparente pentru fiecare locuitor al comunei Almăj. Vă asigur că echipa primăriei tratează cu maximă seriozitate fiecare sesizare primită. Investim în infrastructură, digitalizare și dialog constant cu cetățenii. Vă încurajez să programați audiențe și să folosiți formularele online pentru a primi un răspuns rapid și documentat.",
  transparencyLinks: [
    { label: "Declarație de avere 2024", href: "https://primariaalmaj.ro/declavere23/DA%20GORJAN%20ALIN%20MADALIN%202023.pdf" },
    { label: "Declarație de interese 2024", href: "https://primariaalmaj.ro/declavere23/DI%20GORJAN%20ALIN%20MADALIN%202023.pdf" },
  ],
  duties: [
    "Reprezintă UAT în relațiile cu instituțiile și cetățenii",
    "Gestionează bugetul local și prioritizarea investițiilor",
    "Coordonează serviciile publice și situațiile de urgență",
    "Asigură transparența decizională și consultarea comunității",
    "Ofițer de stare civilă și emitent de dispoziții administrative",
  ],
  faq: [
    { question: "Cum mă programez în audiență?", answer: "Completează formularul de pe pagină; primești confirmare pe email/telefon." },
    { question: "În cât timp primesc răspuns la o sesizare?", answer: "În mod obișnuit 48-72h lucrătoare, în funcție de complexitate." },
    { question: "Unde are loc audiența?", answer: "În biroul Primarului, la Primăria Almăj. Primești detalii în confirmare." },
  ] as FAQItem[],
};

const EMAILJS_SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim() || "service_kz54w39";
const EMAILJS_TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim() || "template_8c1l8s9";
const EMAILJS_PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim() || "dLtErg83Eo9yKtvTD";

interface AudiencePayload {
  name: string; phone: string; email: string; message: string;
}

const sendAudienceFallbackEmail = async (payload: AudiencePayload) => {
  const templateParams = {
    subject: `AUDIENTA: ${payload.name}`,
    from_name: payload.name, contact_email: payload.email, phone: payload.phone,
    description: payload.message || "Fara detalii suplimentare.", category: "Primar / Audiente",
    submission_date: new Date().toLocaleDateString("ro-RO"), contract_type: "Transmitere online",
  };
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
};

const Primar = () => {
  const pageRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(false);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });
      
      tl.fromTo(".fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 })
        .fromTo(".fade-in-right", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "-=0.4");

      gsap.fromTo(".stagger-item", 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: ".stagger-container", start: "top 85%" } }
      );

      gsap.utils.toArray<HTMLElement>(".fade-up-scroll").forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } }
        );
      });

    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: AudiencePayload = {
      name: String(data.get("user_name") || "").trim(), phone: String(data.get("user_phone") || "").trim(),
      email: String(data.get("user_email") || "").trim(), message: String(data.get("message") || "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.email) {
      toast({ title: "Date incomplete", description: "Vă rugăm să completați datele de contact.", variant: "destructive" }); return;
    }

    setSubmitting(true);
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20000);
      try {
        const res = await fetch(`${API_URL}/api/contact-primar`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal,
        });
        if (!res.ok) throw new Error(`backend_${res.status}`);
        toast({ title: "Solicitare trimisă", description: "Vei primi o confirmare în curând." });
        formRef.current?.reset();
      } finally { window.clearTimeout(timeoutId); }
    } catch (backendError) {
      try {
        await sendAudienceFallbackEmail(payload);
        toast({ title: "Solicitare trimisă", description: "Formularul a fost transmis cu succes." });
        formRef.current?.reset();
      } catch (fallbackError) {
        toast({ title: "Eroare de trimitere", description: "Vă rugăm să ne contactați telefonic.", variant: "destructive" });
      }
    } finally { setSubmitting(false); }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație", href: "/primaria" }, { label: "Primar" }]}>      
      <section ref={pageRef} className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="fade-in-left gsap-optimize inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                Primăria Almăj
              </span>
            </div>
            
            <h1 className="fade-in-left gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              {mayorData.name}
            </h1>
            
            <div className="fade-in-left gsap-optimize">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                {mayorData.role}
              </span>
            </div>
            
            <div className="fade-in-left gsap-optimize flex w-full flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <MapPin className="w-5 h-5 text-blue-500" /> {mayorData.locality}
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Phone className="w-5 h-5 text-blue-500" /> 
                <a href={`tel:${mayorData.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 transition-colors">{mayorData.phone}</a>
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Mail className="w-5 h-5 text-blue-500" /> 
                <a href={`mailto:${mayorData.email}`} className="hover:text-blue-600 transition-colors break-all">{mayorData.email}</a>
              </span>
            </div>

            <div className="fade-in-left gsap-optimize flex w-full justify-center gap-4 pt-4 lg:hidden">
              <Button size="lg" className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5" asChild>
                <a href="#audienta">Programează audiență</a>
              </Button>
            </div>
          </div>
          <div className="order-3 lg:order-2 fade-in-right gsap-optimize flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="hidden text-base font-medium leading-relaxed text-slate-800 lg:block sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {mayorData.messageLong}
              </p>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 lg:hidden sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {expandedMessage ? mayorData.messageLong : mayorData.messageShort}
              </p>
              <button 
                onClick={() => setExpandedMessage(!expandedMessage)}
                className="group self-start mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-2 lg:hidden"
              >
                <MessageSquare className="w-4 h-4" />
                {expandedMessage ? "Restrânge textul" : "Citește tot mesajul"}
              </button>
            </div>

            <div className="hidden lg:flex pt-6">
              <Button size="lg" className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5" asChild>
                <a href="#audienta">Programează audiență</a>
              </Button>
            </div>
          </div>

        </div>
        <section className="stagger-container" aria-labelledby="facts-title">
          <h2 id="facts-title" className="sr-only">Informații rapide</h2>
          <ServiceInfoGrid
            items={[
              { label: "Program audiențe", value: mayorData.audienceSchedule, icon: Calendar },
              { label: "Locație", value: mayorData.location, icon: MapPin },
              { label: "Contact", value: mayorData.phone, icon: Phone },
              { label: "Timp răspuns", value: mayorData.responseTime, icon: FileText },
            ]}
          />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">
          <section id="audienta" className="fade-up-scroll gsap-optimize scroll-mt-24 lg:col-start-1" aria-labelledby="audienta-title">
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <Calendar className="h-3.5 w-3.5" />
                  Solicitare online
                </span>
                <h2 id="audienta-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Solicită o audiență</h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">Completați formularul pentru a programa o discuție directă la primărie.</p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700">
                  Program: {mayorData.audienceSchedule}
                </span>
                <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700">
                  Răspuns: {mayorData.responseTime}
                </span>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 border-t border-slate-200 pt-5 sm:pt-6">
                <div className="space-y-2">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Nume complet</label>
                  <Input name="user_name" required className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base" placeholder="Ex: Popescu Ion" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Telefon</label>
                    <Input name="user_phone" type="tel" inputMode="tel" pattern="^07[0-9]{8}$" required className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base" placeholder="07xxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Email</label>
                    <Input name="user_email" type="email" inputMode="email" required className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base" placeholder="email@exemplu.ro" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Motivul solicitării</label>
                  <Textarea name="message" rows={4} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl resize-none text-base p-4" placeholder="Descrieți pe scurt motivul pentru care doriți audiența..." />
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors mt-2">
                  {submitting ? "Se procesează..." : "Trimite solicitarea"}
                </Button>
              </form>
            </div>
          </section>
          <section className="fade-up-scroll gsap-optimize lg:col-start-2" aria-labelledby="duties-title">
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Cadru legal
                </span>
                <h2 id="duties-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Atribuții oficiale</h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium">Responsabilitățile funcției de primar, conform legislației.</p>
              </div>

              <Accordion type="single" collapsible className="border-t border-slate-200">
                {mayorData.duties.map((duty, idx) => (
                  <AccordionItem key={idx} value={`duty-${idx}`} className="border-slate-200">
                    <AccordionTrigger className="py-4 sm:py-5 text-left text-sm sm:text-base font-semibold text-slate-800 hover:text-blue-600 hover:no-underline transition-colors">
                      <span className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-600">
                          {idx + 1}
                        </span>
                        <span>{duty}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 sm:pb-5 pl-9 text-slate-600 text-sm leading-relaxed font-medium border-l border-slate-200 ml-3">
                      Prevedere aplicabilă la nivelul Unității Administrativ Teritoriale Almăj.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
          <section className="fade-up-scroll gsap-optimize lg:col-start-1" aria-labelledby="faq-title">
            <div className="space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  FAQ Primărie
                </span>
                <h2 id="faq-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Întrebări frecvente</h2>
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  Cele mai des întâlnite solicitări despre audiențe, răspunsuri și comunicarea cu primăria.
                </p>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {mayorData.faq.length} întrebări esențiale
                </div>
              </div>

              <Accordion type="single" collapsible className="border-t border-slate-200">
                {mayorData.faq.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="group border-slate-200"
                  >
                    <AccordionTrigger className="py-4 sm:py-5 text-left text-sm sm:text-base font-bold text-slate-800 hover:text-blue-700 hover:no-underline transition-colors">
                      <span className="flex items-start gap-3 sm:gap-4">
                        <span className="mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                          {idx + 1}
                        </span>
                        <span>{item.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 sm:pb-5 pl-9 sm:pl-11 text-slate-600 text-sm sm:text-base leading-relaxed font-medium border-l border-slate-200 ml-3 sm:ml-3.5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
          <section className="fade-up-scroll gsap-optimize lg:col-start-2" aria-labelledby="transparency-title">
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <FileText className="h-3.5 w-3.5" />
                  Documente publice
                </span>
                <h2 id="transparency-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Transparență</h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium">Documente oficiale publicate pentru informarea cetățenilor.</p>
              </div>

              <div className="border-t border-slate-200">
                {mayorData.transparencyLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start justify-between gap-4 border-b border-slate-200 py-4 sm:py-5 transition-colors hover:border-blue-300"
                  >
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        <FileText className="w-4 h-4" />
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-700 group-hover:text-slate-900 leading-snug">{link.label}</span>
                    </div>
                    <ChevronRight className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

      </section>
    </PageLayout>
  );
};

export default Primar;
