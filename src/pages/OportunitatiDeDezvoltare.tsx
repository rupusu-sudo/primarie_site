import React, { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ServiceInfoGrid } from "@/components/servicii/ServiceInfoGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe,
  Leaf,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  TrendingUp,
  Zap,
} from "lucide-react";
import { API_URL } from "@/config/api";

interface Partner {
  name: string;
  sector: string;
  description: string;
  location: string;
  website?: string;
  logoUrl?: string;
  iconUrl?: string;
  email?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface InvestmentPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  topic?: string;
}

gsap.registerPlugin(ScrollTrigger);

const quickFacts = [
  { label: "Acces principal", value: "DN6, conexiune directă", icon: MapPin },
  { label: "Proximitate urbană", value: "18 km până la Craiova", icon: TrendingUp },
  { label: "Utilități", value: "Apă, Gaz, Electricitate", icon: Zap },
  { label: "Terenuri", value: "Disponibile pentru investiții", icon: Building2 },
];

const partners: Partner[] = [
  {
    iconUrl: "https://media.licdn.com/dms/image/v2/C4D0BAQF8feRbfHpSRQ/company-logo_200_200/company-logo_200_200/0/1630486665749/diehl_aviation_logo?e=2147483647&v=beta&t=bH2yAGAMYyUBWijH4sUZCC22_TXkvZoxqG6gbGHY3Do",
    name: "Diehl Aviation Almăj",
    sector: "Industrie",
    description: "Producție de componente pentru industria aeronautică și lanțuri de furnizare europene.",
    location: "Zona industrială Almăj",
    website: "https://www.diehl.com",
    email: "office@diehl.com",
  },
  {
    name: "Genesis Biopartner",
    sector: "Energie verde",
    description: "Proiect de cogenerare din biogaz, orientat spre economie circulară și valorificarea biomasei.",
    location: "Perimetrul estic Almăj",
    website: "https://genesisbiopartner.ro",
    iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr64A2ldrI9B5NNhg4t9ZavZ0qULNN2hVLVw&s",
    email: "contact@genesisbiopartner.ro",
  },
  {
    name: "Profi Logistic Hub",
    sector: "Logistică",
    description: "Depozitare și distribuție regională, susținând fluxurile comerciale pentru sud-vestul țării.",
    location: "Nod logistic DN6",
    website: "https://www.profi.ro",
    iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTh2lqKLVuBWz3RYEB5OJFFHXoM7uYpaQvhQ&s",
  },
];

const strategicPillars = [
  {
    title: "Industrie",
    icon: Building2,
    points: [
      "Extinderea capacităților de producție pe coridorul DN6",
      "Parteneriate pentru formare tehnică și angajare locală",
      "Flux administrativ rapid pentru autorizații și avize",
    ],
  },
  {
    title: "Energie verde",
    icon: Leaf,
    points: [
      "Investiții în cogenerare și valorificare resurse locale",
      "Reducerea costurilor energetice pentru activități industriale",
      "Proiecte compatibile cu finanțări verzi și standarde ESG",
    ],
  },
  {
    title: "Logistică",
    icon: Zap,
    points: [
      "Poziționare strategică pentru distribuție regională",
      "Acces facil la rute județene și naționale",
      "Spații adaptabile pentru depozitare și operațiuni mixte",
    ],
  },
];

const resources = [
  {
    title: "Urbanism și PUG",
    description: "Certificate de urbanism, reglementări, documentații tehnice.",
    href: "/servicii/urbanism",
  },
  {
    title: "Achiziții Publice",
    description: "Informații despre proceduri, anunțuri și documente relevante.",
    href: "/transparenta/achizitii",
  },
  {
    title: "Monitorul Oficial Local",
    description: "Dispoziții, regulamente și alte documente publice.",
    href: "/monitorul-oficial",
  },
  {
    title: "Contact instituțional",
    description: "Canale oficiale pentru discuții tehnice și întâlniri directe.",
    href: "/contact",
  },
];

const faqItems: FAQItem[] = [
  {
    question: "Cum pot solicita informații pentru o investiție?",
    answer: "Completați formularul de pe pagină și includeți pe scurt tipul investiției, suprafața estimată și intervalul de implementare.",
  },
  {
    question: "Ce documente sunt necesare în etapa inițială?",
    answer: "Pentru analiză preliminară recomandăm: descriere proiect, date firmă, necesar utilități și, dacă există, schiță de amplasament.",
  },
  {
    question: "În cât timp răspunde primăria?",
    answer: "În mod uzual, răspunsul inițial este transmis în 2-3 zile lucrătoare, în funcție de complexitatea solicitării.",
  },
  {
    question: "Se pot programa întâlniri tehnice la primărie?",
    answer: "Da. După analiza solicitării, echipa administrativă propune un interval pentru discuție tehnică și pașii următori.",
  },
];
const getPartnerInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

const OportunitatiDeDezvoltare = () => {
  const pageRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const featuredPartners = partners.slice(0, 6);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });

      tl.fromTo(".fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 }).fromTo(
        ".fade-in-right",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0 },
        "-=0.4",
      );

      gsap.fromTo(
        ".stagger-item",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".stagger-container", start: "top 85%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".fade-up-scroll").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
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
    const payload: InvestmentPayload = {
      name: String(data.get("investor_name") || "").trim(),
      company: String(data.get("investor_company") || "").trim() || undefined,
      email: String(data.get("investor_email") || "").trim(),
      phone: String(data.get("investor_phone") || "").trim() || undefined,
      message: String(data.get("message") || "").trim(),
      topic: String(data.get("investor_topic") || "").trim() || undefined,
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast({
        title: "Date incomplete",
        description: "Vă rugăm să completați numele, emailul și mesajul.",
        variant: "destructive",
      });
      return;
    }

    payload.email = payload.email.toLowerCase();

    if (payload.name.length < 2 || payload.name.length > 80) {
      toast({
        title: "Date invalide",
        description: "Numele trebuie să aibă între 2 și 80 de caractere.",
        variant: "destructive",
      });
      return;
    }

    if (payload.email.length < 5 || payload.email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      toast({
        title: "Date invalide",
        description: "Adresa de email nu este validă.",
        variant: "destructive",
      });
      return;
    }

    if (payload.message.length < 10 || payload.message.length > 2000) {
      toast({
        title: "Date invalide",
        description: "Mesajul trebuie să aibă între 10 și 2000 de caractere.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      // Exemplu body: { name, company?, email, phone?, message, topic? }
      const res = await fetch(`${API_URL}/api/oportunitati/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        let backendMessage = "Verificați datele introduse și încercați din nou.";
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) backendMessage = data.error;
        } catch {
          // fallback pe mesaj generic
        }

        if (res.status === 400) {
          toast({
            title: "Date invalide",
            description: backendMessage,
            variant: "destructive",
          });
          return;
        }

        if (res.status === 502 || res.status === 503) {
          toast({
            title: "Serviciu temporar indisponibil",
            description: "Nu am putut trimite solicitarea acum. Vă rugăm să încercați din nou.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Eroare de trimitere",
          description: "Solicitarea nu a putut fi trimisă momentan.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Solicitare transmisă",
        description: "Echipa de dezvoltare economică vă va contacta în curând.",
      });
      formRef.current?.reset();
    } catch {
      toast({
        title: "Eroare de conexiune",
        description: "Conexiunea cu serverul a eșuat. Încercați din nou în câteva momente.",
        variant: "destructive",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Oportunități de dezvoltare" }]}>
      <section
        ref={pageRef}
        className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="fade-in-left gsap-optimize inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/70 px-3 py-1 rounded-md">
                Dezvoltare economică
              </span>
            </div>

            <h1 className="fade-in-left gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Oportunități de dezvoltare
            </h1>

            <p className="fade-in-left gsap-optimize text-sm sm:text-base lg:text-lg font-medium text-slate-700 leading-relaxed max-w-xl">
              Almăj oferă acces rutier strategic, utilități funcționale și deschidere instituțională pentru proiecte noi în
              industrie, energie verde și logistică.
            </p>

            <div className="fade-in-left gsap-optimize flex w-full flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                asChild
              >
                <a href="#contact-investitii" aria-label="Salt la formularul de contact pentru investiții">
                  Contact pentru investiții
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold border-slate-300 hover:border-blue-500 hover:text-blue-700"
                asChild
              >
                <a href="#parteneri" aria-label="Salt la secțiunea parteneri">
                  Vezi partenerii
                </a>
              </Button>
            </div>
          </div>

          <div className="order-2 fade-in-right gsap-optimize rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-5 sm:p-6 lg:p-7 shadow-[0_20px_70px_-50px_rgba(15,23,42,0.45)]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                <Building2 className="h-3.5 w-3.5" />
                Profil investițional
              </span>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Investitorii interesați primesc suport pentru identificarea amplasamentului, clarificarea pașilor
                administrativi și coordonarea documentației de bază.
              </p>
              <div className="space-y-3 pt-1">
                {[
                  "Punct de contact dedicat în primărie",
                  "Suport pentru traseul avizelor principale",
                  "Dialog direct cu partenerii economici locali",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="mailto:primariaalmaj@gmail.com"
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  <Mail className="mr-2 h-4 w-4" /> primariaalmaj@gmail.com
                </a>
                <a
                  href="tel:0251449234"
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  <Phone className="mr-2 h-4 w-4" /> 0251 449 234
                </a>
              </div>
            </div>
          </div>
        </div>

        <section className="stagger-container" aria-labelledby="facts-title">
          <h2 id="facts-title" className="sr-only">
            Indicatori rapizi pentru investiții
          </h2>
          <ServiceInfoGrid items={quickFacts} />
        </section>

        <section id="parteneri" className="fade-up-scroll gsap-optimize border-t border-slate-200 pt-8 lg:pt-10" aria-labelledby="partners-title">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Parteneri activi
            </span>
            <h2 id="partners-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Firme și parteneri locali
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-3xl">
              O selecție de companii active în comună și în proximitate, implicate în proiecte de producție, logistică,
              energie și servicii tehnice.
            </p>
          </div>

          <div className="relative mt-6">
            <Carousel opts={{ align: "start", loop: false }} className="w-full" aria-label="Carousel parteneri economici">
              <CarouselContent className="items-stretch">
                {featuredPartners.map((partner) => (
                  <CarouselItem key={partner.name} className="basis-[88%] sm:basis-1/2 xl:basis-1/3">
                    <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 pb-16 shadow-[0_14px_50px_-40px_rgba(15,23,42,0.45)]">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {partner.iconUrl || partner.logoUrl ? (
                            <img
                              src={partner.iconUrl || partner.logoUrl}
                              alt={`Logo ${partner.name}`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-black tracking-wide text-slate-600">{getPartnerInitials(partner.name)}</span>
                          )}
                        </div>
                        <div className="min-w-0 space-y-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{partner.name}</h3>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] uppercase tracking-wider">
                            {partner.sector}
                          </Badge>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-slate-700 font-medium leading-relaxed">{partner.description}</p>

                      <div className="mt-4 space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-slate-600 font-semibold">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          {partner.location}
                        </p>
                        {partner.email ? (
                          <a
                            href={`mailto:${partner.email}`}
                            className="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-blue-700 transition-colors"
                          >
                            <Mail className="w-4 h-4 text-slate-500" />
                            {partner.email}
                          </a>
                        ) : null}
                      </div>

                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
                          aria-label={`Website ${partner.name}`}
                        >
                          <Globe className="w-4 h-4" /> Website
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      ) : null}
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                aria-label="Partener anterior"
                className="!left-2 !top-auto !bottom-4 !translate-y-0 h-9 w-9 border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              />
              <CarouselNext
                aria-label="Partener următor"
                className="!right-2 !top-auto !bottom-4 !translate-y-0 h-9 w-9 border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              />
            </Carousel>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl border-slate-300 font-semibold" asChild>
              <a href="#all-partners" aria-label="Vezi lista completă de parteneri">
                Vezi toți partenerii
              </a>
            </Button>
            <Button variant="ghost" className="rounded-xl font-semibold text-slate-700 hover:text-blue-700" asChild>
              <a href="#contact-investitii" aria-label="Trimite o solicitare de investiții">
                Programează discuție
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
        </section>

        <section id="all-partners" className="fade-up-scroll gsap-optimize" aria-labelledby="all-partners-title">
          <div className="space-y-3">
            <h3 id="all-partners-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Lista extinsă parteneri
            </h3>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              Inventar orientativ al partenerilor economici din ecosistemul local.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {partners.map((partner) => (
              <article key={`${partner.name}-list`} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-bold text-slate-900 leading-snug">{partner.name}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{partner.location}</p>
                <Badge variant="secondary" className="mt-2 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] uppercase tracking-wider">
                  {partner.sector}
                </Badge>
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10">
          <section className="fade-up-scroll gsap-optimize" aria-labelledby="piloni-title">
            <div className="space-y-3 mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                <Zap className="h-3.5 w-3.5" />
                Direcții strategice
              </span>
              <h2 id="piloni-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                3 piloni de dezvoltare
              </h2>
            </div>

            <div className="space-y-4">
              {strategicPillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <pillar.icon className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">{pillar.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {pillar.points.map((point) => (
                      <li key={point} className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="fade-up-scroll gsap-optimize" aria-labelledby="resources-title">
            <div className="space-y-3 mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                <FileText className="h-3.5 w-3.5" />
                Documente și resurse
              </span>
              <h2 id="resources-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Resurse utile pentru investitori
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                Acces rapid către documentația necesară etapelor de analiză și implementare.
              </p>
            </div>

            <div className="border-t border-slate-200">
              {resources.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.href}
                  className="group flex items-start justify-between gap-4 border-b border-slate-200 py-4 sm:py-5 transition-colors hover:border-blue-300"
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block text-sm sm:text-base font-bold text-slate-700 group-hover:text-slate-900 leading-snug">
                        {resource.title}
                      </span>
                      <span className="block mt-1 text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                        {resource.description}
                      </span>
                    </span>
                  </div>
                  <ChevronRight className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10">
          <section id="contact-investitii" className="fade-up-scroll gsap-optimize scroll-mt-24" aria-labelledby="contact-title">
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <Calendar className="h-3.5 w-3.5" />
                  Contact investiții
                </span>
                <h2 id="contact-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Trimite o solicitare
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  Completați formularul și revenim cu un răspuns preliminar în 2-3 zile lucrătoare.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700">
                  Canal: Fomular Online
                </span>
                <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700">
                  Timp estimat: 48-72h
                </span>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 border-t border-slate-200 pt-5 sm:pt-6">
                <input type="hidden" name="investor_topic" value="Investiții" />
                <div className="space-y-2">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Nume complet</label>
                  <Input
                    name="investor_name"
                    required
                    className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base"
                    placeholder="Ex: Popescu Andrei"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Firmă</label>
                  <Input
                    name="investor_company"
                    className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base"
                    placeholder="Ex: Compania Exemplu SRL"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Email</label>
                    <Input
                      name="investor_email"
                      type="email"
                      inputMode="email"
                      required
                      className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base"
                      placeholder="office@companie.ro"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Telefon</label>
                    <Input
                      name="investor_phone"
                      type="tel"
                      inputMode="tel"
                      className="h-12 sm:h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl text-base"
                      placeholder="07xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Mesaj</label>
                  <Textarea
                    name="message"
                    rows={4}
                    required
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all rounded-xl resize-none text-base p-4"
                    placeholder="Descrieți pe scurt investiția propusă: domeniu, suprafață estimată, necesar utilități, interval de implementare."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors mt-2"
                >
                  {submitting ? "Se procesează..." : "Trimite solicitarea"}
                </Button>
              </form>
            </div>
          </section>

          <section className="fade-up-scroll gsap-optimize" aria-labelledby="faq-title">
            <div className="space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  FAQ Investiții
                </span>
                <h2 id="faq-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Întrebări frecvente
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  Informațiile de bază pentru companii interesate de dezvoltare în comuna Almăj.
                </p>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {faqItems.length} întrebări esențiale
                </div>
              </div>

              <Accordion type="single" collapsible className="border-t border-slate-200">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={item.question} value={`faq-${idx}`} className="group border-slate-200">
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
        </div>
      </section>
    </PageLayout>
  );
};

export default OportunitatiDeDezvoltare;
