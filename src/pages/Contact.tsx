import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Clock3,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Navigation,
  Phone,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react";

import PageLayout from "@/components/PageLayout";
import { API_URL } from "@/config/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

gsap.registerPlugin(ScrollTrigger);

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const heroDetails = [
  {
    label: "Telefon",
    value: "+40 251 449 234",
    href: "tel:+400251449234",
    icon: Phone,
  },
  {
    label: "Email",
    value: "primariaalmaj@gmail.com",
    href: "mailto:primariaalmaj@gmail.com",
    icon: Mail,
  },
  {
    label: "Locație",
    value: "Primăria Almăj, Comuna Almăj, Județul Dolj",
    icon: MapPin,
  },
  {
    label: "Program",
    value: "Luni – Vineri, 08:00 – 16:00",
    icon: Clock3,
  },
];

const Contact = () => {
  const pageRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const rootElement = document.getElementById("root");
    document.documentElement.classList.add("contact-scrollbar-hidden");
    document.body.classList.add("contact-scrollbar-hidden");
    rootElement?.classList.add("contact-scrollbar-hidden");

    return () => {
      document.documentElement.classList.remove("contact-scrollbar-hidden");
      document.body.classList.remove("contact-scrollbar-hidden");
      rootElement?.classList.remove("contact-scrollbar-hidden");
    };
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTimeline
        .fromTo(".contact-hero-badge", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 })
        .fromTo(".contact-hero-title", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.12")
        .fromTo(".contact-hero-detail", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, "-=0.35")
        .fromTo(".contact-hero-subtitle", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.4")
        .fromTo(".contact-hero-divider", { opacity: 0, scaleX: 0.85 }, { opacity: 1, scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
        .fromTo(".contact-hero-description", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.15");

      gsap.fromTo(
        ".contact-nav-copy",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-navigation-section",
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        ".contact-nav-button",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-nav-actions",
            start: "top 90%",
          },
        },
      );

      gsap.fromTo(
        ".contact-form-header",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-form-section",
            start: "top 84%",
          },
        },
      );

      gsap.fromTo(
        ".contact-form-reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-form-section",
            start: "top 80%",
          },
        },
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!gdprAccepted) {
      toast({
        title: "Acord necesar",
        description: "Bifați acordul GDPR pentru a putea trimite solicitarea.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload: ContactPayload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      phone: String(formData.get("phone") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast({
        title: "Date incomplete",
        description: "Completați toate câmpurile obligatorii înainte de trimitere.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`CONTACT_${response.status}`);
      }

      toast({ title: "Mesajul a fost trimis cu succes." });
      formRef.current?.reset();
      setGdprAccepted(false);
    } catch {
      toast({
        title: "Eroare la trimiterea mesajului. Vă rugăm încercați din nou.",
        variant: "destructive",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Contact" }]}>
      <main className="w-full pt-0 pb-8">
        <section
          ref={pageRef}
          className="max-w-[92rem] mx-auto -mt-2 px-3 sm:-mt-3 sm:px-5 lg:px-6 xl:px-8 py-0 sm:py-2 flex flex-col gap-10 lg:gap-12 overflow-x-hidden"
        >
          <section className="mx-auto w-full max-w-6xl py-0 sm:py-1 lg:py-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
              <div className="order-1 flex w-full flex-col items-center space-y-4 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
                <Badge className="contact-hero-badge gsap-optimize border-0 bg-blue-50/60 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 rounded-md">
                  Primăria Almăj
                </Badge>
                <h1 className="contact-hero-title gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                  Contact
                </h1>
                <div className="w-full max-w-xl border-t border-slate-200 pt-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {heroDetails.map((detail) => (
                      <div
                        key={detail.label}
                        className="contact-hero-detail gsap-optimize flex items-start gap-3 text-left"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <detail.icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {detail.label}
                          </p>
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="mt-1 block text-sm font-semibold leading-relaxed text-slate-800 transition-colors hover:text-blue-700 break-words"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-800">
                              {detail.value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-3 lg:order-2 contact-hero-subtitle gsap-optimize flex w-full flex-col border-t-4 border-blue-100 pt-4 text-center lg:border-t-0 lg:pl-6 xl:pl-8 lg:py-0 lg:justify-between lg:text-left">
                <div>
                  <div className="flex items-center justify-center gap-3 lg:justify-start">
                    <span className="h-px w-8 bg-blue-600" />
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Date oficiale</p>
                    <span className="h-px w-8 bg-blue-600" />
                  </div>
                  <h2 className="contact-hero-description gsap-optimize mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Informații de contact
                  </h2>
                  <p className="contact-hero-description gsap-optimize mt-4 text-base sm:text-lg leading-relaxed text-slate-800">
                    Suntem aici pentru a răspunde întrebărilor și solicitărilor dumneavoastră.
                  </p>
                  <p className="contact-hero-description gsap-optimize mt-4 text-base sm:text-lg leading-relaxed text-slate-800">
                    Pentru informații, sesizări sau propuneri legate de activitatea administrației locale, ne puteți
                    contacta folosind formularul de mai jos sau prin datele oficiale ale primăriei.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="contact-navigation-section border-t border-slate-200 pt-8 lg:pt-10"
            aria-labelledby="navigation-title"
          >
            <div className="mx-auto max-w-4xl text-center">
              <div className="contact-nav-copy gsap-optimize flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-blue-600" />
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Localizare</p>
                  <span className="h-px w-8 bg-blue-600" />
                </div>
                <h2 id="navigation-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Cum ajungeți la Primărie
                </h2>
                <p className="max-w-3xl text-sm sm:text-base font-medium leading-relaxed text-slate-700">
                  Deschideți rapid traseul către sediul primăriei în aplicația de navigație preferată, fără a încărca o
                  hartă integrată în pagină.
                </p>
              </div>

              <div className="contact-nav-actions mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="contact-nav-button gsap-optimize h-12 w-full rounded-xl px-8 text-sm font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 sm:h-14 sm:w-auto sm:text-base"
                >
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Primaria+Almaj+Dolj"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPinned className="h-4 w-4" />
                    Deschide în Google Maps
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="contact-nav-button gsap-optimize h-12 w-full rounded-xl px-8 text-sm font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 sm:h-14 sm:w-auto sm:text-base"
                >
                  <a href="https://waze.com/ul?q=Primaria%20Almaj%20Dolj" target="_blank" rel="noreferrer">
                    <Navigation className="h-4 w-4" />
                    Navighează cu Waze
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section className="contact-form-section border-t border-slate-200 pt-8 lg:pt-10" aria-labelledby="form-title">
            <div className="mx-auto max-w-4xl">
              <div className="contact-form-header gsap-optimize flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-blue-600" />
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Formular online</p>
                  <span className="h-px w-8 bg-blue-600" />
                </div>
                <h2 id="form-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Trimite un mesaj
                </h2>
                <p className="max-w-3xl text-sm sm:text-base font-medium leading-relaxed text-slate-700">
                  Formularul păstrează același flux de trimitere și aceeași logică de backend, într-o prezentare mai
                  aerisită și mai apropiată de pagina de istorie.
                </p>
              </div>

              <div className="contact-form-reveal gsap-optimize mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="space-y-2">
                      <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 sm:text-xs">
                        Nume
                      </label>
                      <Input
                        name="name"
                        required
                        autoComplete="name"
                        minLength={2}
                        maxLength={80}
                        placeholder="Ex: Popescu Ion"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/80 text-base transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:h-14"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 sm:text-xs">
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        maxLength={120}
                        placeholder="nume@exemplu.ro"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/80 text-base transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:h-14"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="space-y-2">
                      <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 sm:text-xs">
                        Telefon (optional)
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        maxLength={50}
                        placeholder="+40 7XX XXX XXX"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/80 text-base transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:h-14"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 sm:text-xs">
                        Subiect
                      </label>
                      <Input
                        name="subject"
                        required
                        minLength={3}
                        maxLength={160}
                        placeholder="Ex: Solicitare informații"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/80 text-base transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 sm:h-14"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 sm:text-xs">
                      Mesaj
                    </label>
                    <Textarea
                      name="message"
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={6}
                      placeholder="Scrieți mesajul dumneavoastră aici..."
                      className="resize-none rounded-xl border-slate-200 bg-slate-50/80 px-4 py-3 text-base leading-relaxed transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="gdpr-contact"
                        checked={gdprAccepted}
                        onCheckedChange={(checked) => setGdprAccepted(checked === true)}
                        className="mt-1 h-5 w-5 rounded-md border-slate-300 data-[state=checked]:border-blue-700 data-[state=checked]:bg-blue-700"
                      />
                      <label
                        htmlFor="gdpr-contact"
                        className="cursor-pointer text-sm font-medium leading-relaxed text-slate-700"
                      >
                        Sunt de acord cu procesarea datelor personale pentru a primi răspuns la solicitarea transmisă.
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm font-medium leading-relaxed text-slate-700">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700" />
                    Mesajele sunt transmise prin canalul oficial al primăriei și procesate conform fluxului existent.
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting || !gdprAccepted}
                    className="mt-2 h-12 w-full rounded-xl bg-slate-900 text-sm font-bold text-white transition-colors hover:bg-blue-600 sm:h-14 sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Se trimite...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="h-4 w-4" />
                        Trimite mesajul
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </section>
      </main>
    </PageLayout>
  );
};

export default Contact;
