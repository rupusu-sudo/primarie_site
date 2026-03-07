import React, { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
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
  ChevronRight,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { API_URL } from "@/config/api";

interface FAQItem {
  question: string;
  answer: string;
}

gsap.registerPlugin(ScrollTrigger);

const viceprimarData = {
  name: "Uțoiu Laurențiu-Constantin",
  role: "Viceprimarul Comunei Almăj",
  shortRole: "Executiv Local",
  locality: "Comuna Almăj, jud. Dolj",
  email: "primariaalmaj@gmail.com",
  phone: "0251 449 234",
  audienceSchedule: "Luni - Joi: 09:00 - 12:00",
  location: "Primăria Almăj – Biroul Viceprimarului",
  responseTime: "Răspuns estimat: 48-72h",
  messageShort:
    "Obiectivul principal al aparatului executiv este îmbunătățirea calității vieții cetățenilor prin monitorizarea atentă a serviciilor publice locale.",
  messageLong:
    "Obiectivul principal al aparatului executiv îl reprezintă creșterea constantă a calității vieții cetățenilor, printr-o administrare responsabilă, eficientă și orientată spre rezultate concrete. Ne concentrăm pe monitorizarea atentă și continuă a serviciilor publice locale – de la infrastructură, utilități și transport, până la educație, sănătate și asistență socială – pentru a ne asigura că acestea funcționează la standarde ridicate și răspund nevoilor reale ale comunității.",
  transparencyLinks: [
    { label: "Declarație de avere 2024", href: "#" },
    { label: "Declarație de interese 2024", href: "#" },
  ],
  duties: [
    "Îndeplinește atribuțiile delegate de către primar, în condițiile legii.",
    "Coordonează realizarea serviciilor publice locale prin aparatul de specialitate.",
    "Urmărește implementarea măsurilor privind igiena și salubritatea publică.",
    "Contribuie la organizarea activităților culturale, sportive, educative și pentru tineret.",
    "Răspunde de inventarierea și administrarea bunurilor din domeniul public și privat al comunei.",
  ],
  faq: [
    { question: "Cum mă programez în audiență?", answer: "Alegeți o dată în formularul de pe pagină; veți primi confirmare telefonică sau pe email." },
    { question: "Unde are loc audiența?", answer: "În biroul Viceprimarului, la sediul Primăriei Almăj. Detaliile exacte le primiți în confirmare." },
    { question: "Pot solicita audiență pentru orice problemă?", answer: "În principal pentru probleme ce țin de infrastructură, salubritate și atribuțiile delegate." },
  ] as FAQItem[],
};

interface AudiencePayload {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const Viceprimar = () => {
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
    
    // Concatenăm data dorită la mesaj pentru Nodemailer
    const combinedMessage = `[Data dorită: ${data.get("requested_date")}]\n\nMotiv: ${data.get("message")}`;

    const payload: AudiencePayload = {
      name: String(data.get("user_name") || "").trim(), 
      phone: String(data.get("user_phone") || "").trim(),
      email: String(data.get("user_email") || "").trim(), 
      message: combinedMessage.trim(),
    };

    if (!payload.name || !payload.phone) {
      toast({ title: "Date incomplete", description: "Vă rugăm să completați numele și telefonul.", variant: "destructive" }); return;
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
      toast({ title: "Eroare de trimitere", description: "Vă rugăm să ne contactați telefonic.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație", href: "/primaria" }, { label: "Viceprimar" }]}>      
      <section ref={pageRef} className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden">
        
        {/* 1. HERO Widescreen (Identic cu Primarul) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          
          {/* Stânga: Identitate + contact */}
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="fade-in-left gsap-optimize inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                Primăria Almăj
              </span>
            </div>
            
            <h1 className="fade-in-left gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Uțoiu Laurențiu-Constantin
            </h1>
            
            <div className="fade-in-left gsap-optimize">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                {viceprimarData.shortRole}
              </span>
            </div>
            
            <div className="fade-in-left gsap-optimize flex w-full flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <MapPin className="w-5 h-5 text-blue-500" /> {viceprimarData.locality}
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Phone className="w-5 h-5 text-blue-500" /> 
                <a href={`tel:${viceprimarData.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 transition-colors">{viceprimarData.phone}</a>
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Mail className="w-5 h-5 text-blue-500" /> 
                <a href={`mailto:${viceprimarData.email}`} className="hover:text-blue-600 transition-colors break-all">{viceprimarData.email}</a>
              </span>
            </div>

            <div className="fade-in-left gsap-optimize flex w-full justify-center gap-4 pt-4 lg:hidden">
              <Button size="lg" className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5" asChild>
                <a href="#audienta">Programează audiență</a>
              </Button>
            </div>
          </div>

          {/* Dreapta: Mesaj Editorial */}
          <div className="order-3 lg:order-2 fade-in-right gsap-optimize flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="hidden text-base font-medium leading-relaxed text-slate-800 lg:block sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {viceprimarData.messageLong}
              </p>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 lg:hidden sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {expandedMessage ? viceprimarData.messageLong : viceprimarData.messageShort}
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

        {/* 2. INFORMAȚII RAPIDE */}
        <section className="stagger-container" aria-labelledby="facts-title">
          <h2 id="facts-title" className="sr-only">Informații rapide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: "Program audiențe", value: viceprimarData.audienceSchedule, icon: Calendar },
              { label: "Locație", value: viceprimarData.location, icon: MapPin },
              { label: "Contact", value: viceprimarData.phone, icon: Phone },
              { label: "Timp răspuns", value: viceprimarData.responseTime, icon: FileText }
            ].map((fact, idx) => (
              <div key={idx} className="stagger-item gsap-optimize flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <fact.icon className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="text-[11px] uppercase font-bold tracking-widest text-slate-500 mb-1">{fact.label}</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SOLICITĂRI + INFORMAȚII (Layout 2x2 Simetric) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">

          {/* STÂNGA SUS: Formular (Cu Data Dorită adăugată) */}
          <section id="audienta" className="fade-up-scroll gsap-optimize scroll-mt-24 lg:col-start-1" aria-labelledby="audienta-title">
            <div className="space-y-4 sm:space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <Calendar className="h-3.5 w-3.5" />
                    Solicitare online
                  </span>
                  <h2 id="audienta-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Programare audiență</h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">Completați formularul pentru a programa o discuție directă.</p>
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
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Data dorită</label>
                        <Input name="requested_date" type="date" required className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base text-slate-700" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Email (Opțional)</label>
                      <Input name="user_email" type="email" inputMode="email" className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base" placeholder="email@exemplu.ro" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Motivul solicitării</label>
                      <Textarea name="message" rows={3} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl resize-none text-base p-4" placeholder="Descrieți pe scurt subiectul discuției..." />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors mt-2">
                      {submitting ? "Se procesează..." : "Trimite solicitarea"}
                    </Button>
                </form>
            </div>
          </section>

          {/* DREAPTA SUS: Atribuții */}
          <section className="fade-up-scroll gsap-optimize lg:col-start-2" aria-labelledby="duties-title">
            <div className="space-y-4">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Cadru legal
                  </span>
                  <h2 id="duties-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Atribuții Delegate</h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium">Principalele arii de responsabilitate conform dispozițiilor primarului.</p>
                </div>

                <Accordion type="single" collapsible className="border-t border-slate-200">
                  {viceprimarData.duties.map((duty, idx) => (
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

          {/* STÂNGA JOS: FAQ */}
          <section className="fade-up-scroll gsap-optimize lg:col-start-1" aria-labelledby="faq-title">
            <div className="space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <MessageSquare className="h-3.5 w-3.5" />
                    FAQ
                  </span>
                  <h2 id="faq-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Întrebări frecvente</h2>
                  <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                    Detalii despre programări și comunicarea cu viceprimarul.
                  </p>
                </div>

                <Accordion type="single" collapsible className="border-t border-slate-200">
                  {viceprimarData.faq.map((item, idx) => (
                    <AccordionItem
                      key={idx} value={`faq-${idx}`}
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

          {/* DREAPTA JOS: Transparență */}
          <section className="fade-up-scroll gsap-optimize lg:col-start-2" aria-labelledby="transparency-title">
            <div className="space-y-4">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <FileText className="h-3.5 w-3.5" />
                    Documente publice
                  </span>
                  <h2 id="transparency-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Transparență</h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium">Declarații oficiale publicate conform legii.</p>
                </div>

                <div className="border-t border-slate-200">
                  {viceprimarData.transparencyLinks.map((link, idx) => (
                    <a
                      key={idx} href={link.href} target="_blank" rel="noreferrer"
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

export default Viceprimar;
