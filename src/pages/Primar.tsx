import React, { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  ArrowRight,
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
    "Prioritatea mandatului este să livrăm servicii publice rapide, corecte și transparente pentru fiecare locuitor al comunei Almăj.",
  messageLong:
    "Vă asigur că echipa primăriei tratează cu seriozitate fiecare sesizare. Investim în infrastructură, digitalizare și dialog constant cu cetățenii. Vă încurajez să programați audiențe și să folosiți formularele online pentru a primi răspuns rapid și documentat.",
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
    {
      question: "Cum mă programez în audiență?",
      answer: "Completează formularul de pe pagină; primești confirmare pe email/telefon.",
    },
    {
      question: "În cât timp primesc răspuns la o sesizare?",
      answer: "În mod obișnuit 48-72h lucrătoare, în funcție de complexitate.",
    },
    {
      question: "Unde are loc audiența?",
      answer: "În biroul Primarului, la Primăria Almăj. Primești detalii în confirmare.",
    },
  ] as FAQItem[],
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
      gsap.from("[data-hero]", { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" });

      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.07,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-form]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("user_name"),
      phone: data.get("user_phone"),
      email: data.get("user_email"),
      message: data.get("message"),
    };
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact-primar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Network error");
      toast({ title: "Solicitare trimisă", description: "Veți primi confirmare pe email." });
      formRef.current?.reset();
    } catch (err) {
      toast({ title: "Eroare", description: "Nu am putut trimite solicitarea.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație", href: "/primaria" }, { label: "Primar" }]}>      
      <section ref={pageRef} className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-10">
        {/* Hero */}
        <Card
          data-hero
          className="relative overflow-hidden rounded-3xl border-slate-100 bg-white shadow-[0_18px_60px_-40px_rgba(0,0,0,0.35)] p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />
          <div className="relative flex gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Primăria Almăj</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">{mayorData.name}</h1>
              <p className="text-sm font-semibold text-slate-600">{mayorData.role}</p>
              <div className="flex flex-col gap-2 text-sm text-slate-700 pt-1">
                <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> {mayorData.locality}</span>
                <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" /> {mayorData.phone}</span>
                <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> {mayorData.email}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button size="lg" className="h-12 rounded-xl text-base font-bold">
              <a href="#audienta">Programează audiență</a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-xl text-base font-bold border-blue-200 text-blue-700 hover:bg-blue-50">
              <a href="mailto:primariaalmaj@gmail.com">Trimite mesaj</a>
            </Button>
          </div>
        </Card>

        {/* Audiență */}
        <section id="audienta" className="space-y-3" aria-labelledby="audienta-title">
          <h2 id="audienta-title" className="text-lg font-black text-slate-900 tracking-tight">Programează audiență</h2>
          <div data-form className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 sm:p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-500">Nume complet</label>
                <Input name="user_name" required className="h-12 text-sm" placeholder="Nume și prenume" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">Telefon</label>
                  <Input name="user_phone" type="tel" inputMode="tel" pattern="^07[0-9]{8}$" required className="h-12 text-sm" placeholder="07xxxxxxxx" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">Email</label>
                  <Input name="user_email" type="email" inputMode="email" required className="h-12 text-sm" placeholder="email@exemplu.ro" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-500">Mesaj</label>
                <Textarea name="message" rows={3} className="text-sm" placeholder="Descrie pe scurt subiectul" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-base font-bold bg-slate-900 hover:bg-blue-700">
                {submitting ? "Se trimite..." : "Trimite solicitarea"}
              </Button>
            </form>
          </div>
        </section>

        {/* Quick facts */}
        <section className="space-y-3" aria-labelledby="facts-title">
          <h2 id="facts-title" className="text-lg font-black text-slate-900 tracking-tight">Informații rapide</h2>
          <div data-card className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{
              label: "Program audiențe",
              value: mayorData.audienceSchedule,
              icon: Calendar,
            }, {
              label: "Locație",
              value: mayorData.location,
              icon: MapPin,
            }, {
              label: "Contact",
              value: `${mayorData.phone} • ${mayorData.email}`,
              icon: Phone,
            }, {
              label: "Timp răspuns",
              value: mayorData.responseTime,
              icon: FileText,
            }].map((fact, idx) => (
              <Card key={idx} className="p-4 rounded-2xl border-slate-100 shadow-sm bg-white flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <fact.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase font-bold tracking-[0.16em] text-slate-500">{fact.label}</p>
                  <p className="text-sm font-semibold text-slate-800 leading-tight break-words">{fact.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Mesaj */}
        <section className="space-y-3" aria-labelledby="msg-title">
          <h2 id="msg-title" className="text-lg font-black text-slate-900 tracking-tight">Mesajul primarului</h2>
          <Card data-card className="rounded-2xl border-slate-100 shadow-sm bg-white">
            <div className="p-5 sm:p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {expandedMessage ? mayorData.messageLong : mayorData.messageShort}
              </p>
              <Button
                type="button"
                variant="ghost"
                className="px-3 py-2 text-blue-700 hover:bg-blue-50 w-fit inline-flex items-center gap-2"
                onClick={() => setExpandedMessage((v) => !v)}
              >
                {expandedMessage ? "Ascunde" : "Citește mai mult"}
                <ArrowRight className={`w-4 h-4 transition-transform ${expandedMessage ? "-rotate-90" : "rotate-0"}`} />
              </Button>
            </div>
          </Card>
        </section>

        {/* Duties + transparency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-3" aria-labelledby="duties-title">
            <h2 id="duties-title" className="text-lg font-black text-slate-900 tracking-tight">Atribuții și responsabilități</h2>
            <div data-card className="bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Accordion type="single" collapsible>
                {mayorData.duties.map((duty, idx) => (
                  <AccordionItem key={idx} value={`duty-${idx}`} className="px-4 sm:px-5">
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-800">
                      {duty}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-slate-600 text-sm leading-relaxed">
                      {duty}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          <Card data-card className="rounded-2xl border-slate-100 shadow-sm bg-white p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Transparență
            </h3>
            <div className="space-y-3">
              {mayorData.transparencyLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </a>
              ))}
            </div>
          </Card>
        </div>

        {/* FAQ */}
        <section className="space-y-3" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-lg font-black text-slate-900 tracking-tight">Întrebări frecvente</h2>
          <div data-card className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Accordion type="single" collapsible>
              {mayorData.faq.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="px-4 sm:px-5">
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-800">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-slate-600 text-sm leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </section>
    </PageLayout>
  );
};

export default Primar;
