import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { ServiceInfoGrid, type ServiceInfoItem } from "@/components/servicii/ServiceInfoGrid";
import { API_URL, withApiBase } from "@/config/api";
import { useServiceDocuments } from "@/hooks/useServiceDocuments";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  ChevronRight,
  FileDown,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export type ServiceFact = {
  label: ServiceInfoItem["label"];
  value: ServiceInfoItem["value"];
  icon: ServiceInfoItem["icon"];
};

export type ServiceHeroAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type ServiceAccordionEntry = {
  title: string;
  content: string;
  items?: string[];
  footer?: string;
};

export type ServicePageConfig = {
  servicePage: string;
  title: string;
  titleIcon: LucideIcon;
  mobileTitleLines?: string[];
  titleClassName?: string;
  heroGridClassName?: string;
  badgeLabel: string;
  subtitle: string;
  description: string;
  introShort: string;
  introLong: string;
  locality: string;
  phone: string;
  email: string;
  heroActions: ServiceHeroAction[];
  facts: ServiceFact[];
  overview: {
    badgeLabel: string;
    title: string;
    description: string;
    chips: string[];
    steps: string[];
  };
  requirements: {
    badgeLabel: string;
    title: string;
    description: string;
    items: ServiceAccordionEntry[];
  };
  faq: {
    badgeLabel: string;
    title: string;
    description: string;
    items: ServiceAccordionEntry[];
  };
  documentsDescription: string;
  documentsEmptyMessage: string;
};

type ServicePageLayoutProps = {
  config: ServicePageConfig;
};

const renderActionHref = (href: string) => {
  if (href.startsWith("http")) return href;
  if (href.startsWith("#")) return href;
  if (href.startsWith("/")) return href;
  return `${API_URL}${href.startsWith("/") ? href : `/${href}`}`;
};

const PublicServiceAccordion = ({
  items,
  idPrefix,
}: {
  items: ServiceAccordionEntry[];
  idPrefix: string;
}) => (
  <Accordion type="single" collapsible className="border-t border-slate-200">
    {items.map((item, index) => (
      <AccordionItem key={item.title} value={`${idPrefix}-${index}`} className="border-slate-200">
        <AccordionTrigger className="py-4 sm:py-5 text-left text-sm sm:text-base font-bold text-slate-800 hover:text-blue-700 hover:no-underline transition-colors">
          <span className="flex items-start gap-3 sm:gap-4">
            <span className="mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
              {index + 1}
            </span>
            <span>{item.title}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-4 sm:pb-5 pl-9 sm:pl-11 text-slate-600 text-sm sm:text-base leading-relaxed font-medium border-l border-slate-200 ml-3 sm:ml-3.5 space-y-3">
          <p>{item.content}</p>
          {item.items?.length ? (
            <ul className="space-y-2">
              {item.items.map((detail) => (
                <li key={detail} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {item.footer ? <p className="text-slate-500">{item.footer}</p> : null}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export const ServicePageLayout = ({ config }: ServicePageLayoutProps) => {
  const pageRef = useRef<HTMLElement>(null);
  const [expandedIntro, setExpandedIntro] = useState(false);
  const { documents, isLoading, error } = useServiceDocuments(config.servicePage);
  const TitleIcon = config.titleIcon;

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });

      timeline
        .fromTo(".service-fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 })
        .fromTo(".service-fade-in-right", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "-=0.4");

      gsap.fromTo(
        ".service-stagger-item",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".service-stagger-container", start: "top 85%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".service-fade-up-scroll").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 85%" },
          },
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii", href: "/servicii" },
        { label: config.title },
      ]}
    >
      <section
        ref={pageRef}
        className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
      >
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10",
            config.heroGridClassName,
          )}
        >
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="service-fade-in-left inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                {config.badgeLabel}
              </span>
            </div>

            <div className="service-fade-in-left flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-blue-700 shadow-sm">
                <TitleIcon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <h1
                className={cn(
                  "text-center text-4xl sm:hidden font-black text-slate-900 leading-[1.05] tracking-tight",
                  config.titleClassName,
                )}
              >
                {config.mobileTitleLines?.length ? (
                  config.mobileTitleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                ) : (
                  config.title
                )}
              </h1>
              <h1
                className={cn(
                  "hidden text-center sm:block sm:text-5xl lg:text-left lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight",
                  config.titleClassName,
                )}
              >
                {config.title}
              </h1>
            </div>

            <div className="service-fade-in-left max-w-[34rem]">
              <span className="block text-center text-base sm:text-lg font-semibold text-slate-700 lg:text-left">
                {config.subtitle}
              </span>
            </div>

            <div className="service-fade-in-left flex w-full max-w-[30rem] flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex w-full items-center justify-center gap-3 lg:justify-start">
                <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
                <span className="text-center leading-snug lg:text-left">{config.locality}</span>
              </span>
              <span className="flex w-full items-center justify-center gap-3 lg:justify-start">
                <Phone className="h-5 w-5 shrink-0 text-blue-500" />
                <a
                  href={`tel:${config.phone.replace(/\s/g, "")}`}
                  className="text-center hover:text-blue-600 transition-colors lg:text-left"
                >
                  {config.phone}
                </a>
              </span>
              <span className="flex w-full items-center justify-center gap-3 lg:justify-start">
                <Mail className="h-5 w-5 shrink-0 text-blue-500" />
                <a
                  href={`mailto:${config.email}`}
                  className="text-center hover:text-blue-600 transition-colors break-all lg:text-left"
                >
                  {config.email}
                </a>
              </span>
            </div>

            <div className="service-fade-in-left flex w-full flex-wrap justify-center gap-3 pt-4 lg:hidden">
              {config.heroActions.map((action, index) => (
                <Button
                  key={action.label}
                  size="lg"
                  variant={index === 0 ? "default" : "outline"}
                  className={
                    index === 0
                      ? "h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                      : "h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                  }
                  asChild
                >
                  <a
                    href={renderActionHref(action.href)}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noreferrer" : undefined}
                  >
                    {action.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="order-3 lg:order-2 service-fade-in-right flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="hidden text-base font-medium leading-relaxed text-slate-800 lg:block sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {config.introLong}
              </p>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 lg:hidden sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {expandedIntro ? config.introLong : config.introShort}
              </p>
              <button
                onClick={() => setExpandedIntro((current) => !current)}
                className="group self-start mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-2 lg:hidden"
              >
                <MessageSquare className="w-4 h-4" />
                {expandedIntro ? "Restrânge textul" : "Citește tot"}
              </button>
            </div>

            <div className="hidden lg:flex flex-wrap gap-3 pt-6">
              {config.heroActions.map((action, index) => (
                <Button
                  key={action.label}
                  size="lg"
                  variant={index === 0 ? "default" : "outline"}
                  className={
                    index === 0
                      ? "h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                      : "h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                  }
                  asChild
                >
                  <a
                    href={renderActionHref(action.href)}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noreferrer" : undefined}
                  >
                    {action.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <section className="service-stagger-container" aria-labelledby="service-facts-title">
          <h2 id="service-facts-title" className="sr-only">
            Informații rapide
          </h2>
          <ServiceInfoGrid items={config.facts} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">
          <section className="service-fade-up-scroll scroll-mt-24 lg:col-start-1" aria-labelledby="procedura-title">
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <Calendar className="h-3.5 w-3.5" />
                  {config.overview.badgeLabel}
                </span>
                <h2 id="procedura-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {config.overview.title}
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  {config.overview.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {config.overview.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-5 sm:pt-6">
                {config.overview.steps.map((step, index) => (
                  <article key={step} className="flex items-start gap-3 sm:gap-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-700">
                      {step}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="cerinte" className="service-fade-up-scroll lg:col-start-2" aria-labelledby="cerinte-title">
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {config.requirements.badgeLabel}
                </span>
                <h2 id="cerinte-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {config.requirements.title}
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium">
                  {config.requirements.description}
                </p>
              </div>

              <PublicServiceAccordion items={config.requirements.items} idPrefix={`${config.servicePage}-requirements`} />
            </div>
          </section>

          <section id="intrebari" className="service-fade-up-scroll lg:col-start-1" aria-labelledby="faq-title">
            <div className="space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {config.faq.badgeLabel}
                </span>
                <h2 id="faq-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {config.faq.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {config.faq.description}
                </p>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {config.faq.items.length} răspunsuri esențiale
                </div>
              </div>

              <PublicServiceAccordion items={config.faq.items} idPrefix={`${config.servicePage}-faq`} />
            </div>
          </section>

          <section id="documente" className="service-fade-up-scroll lg:col-start-2" aria-labelledby="documents-title">
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <FileText className="h-3.5 w-3.5" />
                  Documente utile
                </span>
                <h2 id="documents-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Documente publice
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium">
                  {config.documentsDescription}
                </p>
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm font-semibold text-slate-500">
                  Se încarcă documentele publicate pentru acest serviciu...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : documents.length > 0 ? (
                <div className="border-t border-slate-200">
                  {documents.map((document) => {
                    const documentUrl = withApiBase(document.fileUrl);
                    if (!documentUrl) return null;

                    return (
                      <div
                        key={document.id}
                        className="flex flex-col gap-4 border-b border-slate-200 py-4 sm:py-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                              <FileText className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm sm:text-base font-bold text-slate-700 leading-snug">
                                {document.title}
                              </p>
                              {document.content ? (
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                  {document.content}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <ChevronRight className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-slate-400" />
                        </div>

                        <div className="flex flex-wrap gap-2 pl-11 sm:pl-12">
                          <Button
                            asChild
                            variant="outline"
                            className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <a href={documentUrl} target="_blank" rel="noreferrer">
                              Vezi documentul
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <a href={documentUrl} download>
                              <FileDown className="h-4 w-4" />
                              Descarcă
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-sm font-semibold text-slate-500">
                  {config.documentsEmptyMessage}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
};
