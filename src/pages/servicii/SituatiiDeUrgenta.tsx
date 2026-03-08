import { type ComponentType, type MouseEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, CalendarDays, FileDown, FileText, Images, Users, ChevronRight, Phone, Mail, ShieldCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { ServiceInfoGrid } from "@/components/servicii/ServiceInfoGrid";
import { API_URL, withApiBase } from "@/config/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SvsuDocument {
  id: number;
  title: string;
  category: string;
  type?: string | null;
  content?: string | null;
  fileUrl?: string | null;
  year?: number | null;
  createdAt: string;
}

interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  subsections?: string[];
}

const SVSU_SECTIONS: SectionConfig[] = [
  {
    id: "fisa",
    title: "Fișa S.V.S.U.",
    description: "Organigramă, componență și documentele de organizare ale serviciului.",
    icon: FileText,
    subsections: [
      "Organigrama",
      "Componența numerică a S.V.S.U.",
      "Hotărârea C.L. reorganizare S.V.S.U.",
      "Aviz I.S.U. Oltenia Dolj înființare S.V.S.U.",
    ]
  },
  {
    id: "exercitii",
    title: "Planificarea exercițiilor",
    description: "Calendarul aplicațiilor și simulărilor pentru intervenții și coordonare.",
    icon: AlertTriangle,
  },
  {
    id: "controale",
    title: "Planificarea controalelor preventive",
    description: "Verificări programate pentru reducerea riscurilor și monitorizarea măsurilor.",
    icon: CalendarDays,
  },
  {
    id: "pregatire",
    title: "Planul de pregătire",
    description: "Instruire periodică, exerciții și repere operaționale pentru personal.",
    icon: Users,
  },
  {
    id: "interventii",
    title: "Intervenții situații de urgență",
    description: "Proceduri și documente pentru răspuns rapid în situații operative.",
    icon: AlertTriangle,
  },
  {
    id: "risc",
    title: "Măsuri preventive tipuri de risc – PAAR",
    description: "Planul de Acțiune și Răspuns la Risc pentru tipurile principale de pericol.",
    icon: ShieldCheck,
    subsections: ["Plan de Acțiune și Răspuns la Risc (PAAR)"]
  },
  {
    id: "istoric",
    title: "Registrul istoric S.V.S.U.",
    description: "Evidența activităților și a documentelor păstrate în arhiva serviciului.",
    icon: FileText,
  },
  {
    id: "recrutare",
    title: "Recrutare personal",
    description: "Condiții, anunțuri și informații pentru completarea echipei SVSU.",
    icon: Users,
  },
  {
    id: "multimedia",
    title: "Multimedia – galerii foto",
    description: "Materiale vizuale din intervenții, exerciții și activitatea curentă.",
    icon: Images,
  },
];

const scrollToSection = (sectionId: string) => {
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return;

  const nextHash = `#${sectionId}`;
  const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(window.history.state, "", nextUrl);

  targetSection.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
};

const handleSectionAnchorClick =
  (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(sectionId);
  };

const ContentIndex = () => {
  const contentItems = [
    {
      title: "Fișa Serviciului Voluntar pentru Situații de Urgență (S.V.S.U.)",
      description:
        "Organigrama S.V.S.U., componența numerică, hotărârea Consiliului Local de reorganizare și avizul I.S.U. „Oltenia” Dolj privind înființarea serviciului.",
      details: [
        "Organigrama S.V.S.U.",
        "Componența numerică a S.V.S.U.",
        "Hotărârea Consiliului Local de reorganizare a S.V.S.U.",
        "Aviz I.S.U. „Oltenia” Dolj privind înființarea S.V.S.U.",
      ],
    },
    {
      title: "Planificarea exercițiilor",
      description: "Activități de pregătire și simulare pentru intervenții în situații de urgență.",
    },
    {
      title: "Planificarea controalelor preventive",
      description: "Acțiuni de verificare și prevenire a riscurilor în gospodării și instituții.",
    },
    {
      title: "Planul de pregătire",
      description: "Programul anual de instruire și pregătire a personalului SVSU.",
    },
    {
      title: "Intervenții în situații de urgență",
      description: "Activitățile desfășurate în caz de incendii, inundații sau alte situații de risc.",
    },
    {
      title: "Măsuri preventive – tipuri de risc (PAAR)",
      description: "Informări și recomandări privind prevenirea dezastrelor naturale și a incendiilor.",
    },
    {
      title: "Registrul istoric S.V.S.U.",
      description: "Evidența activităților și intervențiilor desfășurate de serviciu.",
    },
    {
      title: "Recrutare personal",
      description: "Informații despre înscrierea voluntarilor în cadrul SVSU.",
    },
    {
      title: "Multimedia – galerii foto",
      description: "Fotografii și materiale vizuale din activitățile serviciului.",
    },
  ];

  return (
    <section className="service-fade-up-scroll" aria-labelledby="content-title">
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <FileText className="h-3.5 w-3.5" />
            Structură pagină
          </span>
          <h2 id="content-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Conținut
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-medium">
            Structura Serviciului Voluntar pentru Situații de Urgență și principalele activități desfășurate la nivelul comunei.
          </p>
        </div>

        <div className="w-full border-t border-slate-100">
          {contentItems.map((item, index) => (
            <div key={item.title} className="border-b border-slate-100">
                <a
                  href={`#${SVSU_SECTIONS[index]?.id ?? "content"}`}
                  onClick={handleSectionAnchorClick(SVSU_SECTIONS[index]?.id ?? "content")}
                  className="group flex items-start justify-between gap-4 py-4 sm:py-5 outline-none transition-colors hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-inset"
                >
                  <div className="min-w-0 flex-1 pr-3 sm:pr-4">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug transition-colors group-hover:text-blue-600">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                    {item.details ? (
                      <div className="mt-3 space-y-1.5">
                        {item.details.map((detail) => (
                          <p key={detail} className="text-xs sm:text-sm leading-relaxed text-slate-500">
                            {detail}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>

                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700 sm:h-9 sm:w-9 sm:text-sm">
                  {index + 1}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DocumentsSection = ({
  section,
  documents,
}: {
  section: SectionConfig;
  documents: SvsuDocument[];
}) => {
  const SectionIcon = section.icon;

  if (documents.length === 0) {
    return (
      <section id={section.id} className="service-fade-up-scroll scroll-mt-24" aria-labelledby={`${section.id}-title`}>
        <div className="space-y-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              <SectionIcon className="h-3.5 w-3.5" />
              Documente
            </span>
            <h2 id={`${section.id}-title`} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {section.title}
            </h2>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-sm font-semibold text-slate-500">
            Nu există încă documente publicate pentru această secțiune.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className="service-fade-up-scroll scroll-mt-24" aria-labelledby={`${section.id}-title`}>
      <div className="space-y-4">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <SectionIcon className="h-3.5 w-3.5" />
            Documente
          </span>
          <h2 id={`${section.id}-title`} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {section.title}
          </h2>
        </div>

        <div className="border-t border-slate-200">
          {documents.map((document) => {
            const documentUrl = withApiBase(document.fileUrl);
            if (!documentUrl) return null;

            return (
              <div
                key={document.id}
                className="flex flex-col gap-4 border-b border-slate-200 py-4 sm:py-5 last:border-b-0"
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
                      {document.year ? (
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          Anul {document.year}
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
                    className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs sm:text-sm"
                  >
                    <a href={documentUrl} target="_blank" rel="noreferrer">
                      Vezi documentul
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs sm:text-sm"
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
      </div>
    </section>
  );
};

const SituatiiDeUrgenta = () => {
  const pageRef = useRef<HTMLElement>(null);
  const [documents, setDocuments] = useState<SvsuDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_URL}/api/documents`);
        url.searchParams.set("servicePage", "svsu");

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`request_failed_${response.status}`);
        }

        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (nextError) {
        console.error("Nu am putut încărca documentele SVSU.", nextError);
        setError("Documentele nu au putut fi încărcate momentan.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDocuments();
  }, []);

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
        { label: "SVSU" },
      ]}
    >
      <section
        ref={pageRef}
        className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
      >
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="service-fade-in-left inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                Servicii de protecție
              </span>
            </div>

            <div className="service-fade-in-left flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-blue-700 shadow-sm">
                <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <h1 className="text-center sm:hidden text-4xl font-black text-slate-900 leading-[1.05] tracking-tight">
                Serviciul Voluntar pentru
                <span className="block">Situații de Urgență</span>
              </h1>
              <h1 className="hidden sm:block text-center sm:text-5xl lg:text-left lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                Serviciul Voluntar pentru Situații de Urgență
              </h1>
            </div>

            <div className="service-fade-in-left max-w-[34rem]">
              <span className="block text-center text-base sm:text-lg font-semibold text-slate-700 lg:text-left">
                Coordonare și planificare pentru situații de urgență și intervenții de protecție civil.
              </span>
            </div>

            <div className="service-fade-in-left flex w-full flex-wrap justify-center gap-3 pt-4 lg:hidden">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#content" onClick={handleSectionAnchorClick("content")}>
                  Vezi conținutul
                </a>
              </Button>
            </div>
          </div>

          <div className="order-3 lg:order-2 service-fade-in-right flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                Serviciul Voluntar pentru Situații de Urgență (SVSU) coordonează măsuri de prevenire și intervenție în situații de urgență. Departamentul asigură pregătire periodică, exerciții de testare a planurilor, controale preventive și recrutare de personal calificat. Documentele publicate în această secțiune conțin planuri de acțiune, proceduri de intervenție, registre de activitate și informații de recrutare.
              </p>
            </div>

            <div className="hidden lg:flex flex-wrap gap-3 pt-6">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#content" onClick={handleSectionAnchorClick("content")}>
                  Vezi conținutul
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <section className="service-stagger-container" aria-labelledby="service-facts-title">
          <h2 id="service-facts-title" className="sr-only">
            Informații rapide
          </h2>
          <ServiceInfoGrid
            items={[
              { label: "Program", value: "Luni - Vineri 08:00 - 12:00", icon: CalendarDays },
              { label: "Contact", value: "0251 449 234", icon: Phone },
              { label: "Email", value: "primariaalmaj@gmail.com", icon: Mail },
            ]}
          />
        </section>

        {/* Content Index */}
        <div id="content" className="scroll-mt-24 border-t border-slate-200 pt-8 lg:pt-10">
          <ContentIndex />
        </div>

        {/* Documents Sections */}
        <div className="space-y-12 border-t border-slate-200 pt-8 lg:pt-10">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm font-semibold text-slate-500">
              Se încarcă documentele...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : (
            SVSU_SECTIONS.map((section) => {
              const sectionDocs = documents.filter((doc) => doc.type === section.id);
              return (
                <DocumentsSection
                  key={section.id}
                  section={section}
                  documents={sectionDocs}
                />
              );
            })
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default SituatiiDeUrgenta;
