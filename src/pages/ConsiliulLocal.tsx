import { useEffect, useRef, useState, useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import { ServiceInfoGrid } from "@/components/servicii/ServiceInfoGrid";
import CouncilActivitySection from "@/components/CouncilActivitySection";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Scale,
  Landmark,
  Calculator,
  Sprout,
  Building2,
  GraduationCap,
  Gavel,
  Download,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";

import { type CouncilMember, type MandateBlock } from "./consiliu-data/types";

gsap.registerPlugin(ScrollTrigger);

// --- DATE ARHIVĂ ---
type ArchiveOption = {
  id: string;
  label: string;
  load: () => Promise<MandateBlock>;
};

const ARCHIVE_OPTIONS: ArchiveOption[] = [
  {
    id: "2020-2024",
    label: "Mandat 2020-2024",
    load: async () => {
      const module = await import("./consiliu-data/archive-2020-2024");
      return module.ARCHIVE_2020_2024;
    },
  },
  {
    id: "2016-2020",
    label: "Mandat 2016-2020",
    load: async () => {
      const module = await import("./consiliu-data/archive-2016-2020");
      return module.ARCHIVE_2016_2020;
    },
  },
];

// --- DATE CURENTE HARDCODATE ---
const consiliuData = {
  title: "Consiliul Local",
  role: "Autoritatea Deliberativă Almăj",
  mandate: "Mandat 2024 - 2028",
  location: "Sediul Primăriei – Sala de Ședințe",
  membersCount: "11 Consilieri",
  meetings: "Lunar (Ordinar)",
  messageShort:
    "Consiliul Local reprezintă vocea cetățenilor. Dezbatem și aprobăm proiectele esențiale pentru dezvoltarea comunei, asigurând o administrație eficientă.",
  messageLong:
    "Consiliul Local reprezintă autoritatea deliberativă a comunei, formată din reprezentanții aleși ai cetățenilor. Misiunea noastră este să dezbatem și să aprobăm bugetele, strategiile de dezvoltare și proiectele esențiale pentru modernizarea comunei Almăj, garantând transparența decizională și interesul public.",
};

const consilieri = [
  { nume: "BITOLEANU BOGDAN-NICUȘOR", partid: "PSD", comisie: "Buget-Finanțe", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "CĂLINOIU CONSTANTIN", partid: "PSD", comisie: "Agricultură", avere: "https://primariaalmaj.ro/declavere23/DA%20CALINOIU%20CONSTANTIN%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20CALINOIU%20CONSTANTIN%202023.pdf" },
  { nume: "ISTUDOR ILARION", partid: "PNL", comisie: "Urbanism", avere: "https://primariaalmaj.ro/declavere23/DA%20ISTUDOR%20ILARION%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20ISTUDOR%20ILARION%202023.pdf" },
  { nume: "MORUJU GRIGORE-DANIEL", partid: "PSD", comisie: "Buget-Finanțe", avere: "https://primariaalmaj.ro/declavere23/DA%20MORUJU%20DANIEL%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20MORUJU%20GRIGORIE%20DANIEL%202023.pdf" },
  { nume: "NICA ION", partid: "PNL", comisie: "Învățământ", avere: "https://primariaalmaj.ro/declavere23/DA%20NICA%20ION%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20NICA%20ION%202023.pdf" },
  { nume: "PÎRVULESCU DORINA-CRISTINA", partid: "USR", comisie: "Învățământ", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "PĂUNA MARIUS-VALENTIN", partid: "PSD", comisie: "Agricultură", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "STAN LAURENȚIU-IONUȚ", partid: "PSD", comisie: "Urbanism", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "TĂLĂBAN ROBERT-IONUȚ", partid: "PSD", comisie: "Buget-Finanțe", avere: "https://primariaalmaj.ro/declavere24/", interese: "https://primariaalmaj.ro/declavere24/" },
  { nume: "TOTORA SIMION-CRISTIAN", partid: "SENS", comisie: "Agricultură", avere: "https://primariaalmaj.ro/declavere23/DA%20TOTORA%20SIMION%20CRISTIAN%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20TOTORA%20SIMION%20CRISTIAN%20.pdf" },
  { nume: "UȚOIU LAURENȚIU-CONSTANTIN", partid: "PSD", comisie: "Urbanism", avere: "https://primariaalmaj.ro/declavere23/DA%20UTOIU%20CTIN%20LAURENTIU%202023.pdf", interese: "https://primariaalmaj.ro/declavere23/DI%20UTOIU%20LAURENTIU%20CONSTANTIN%202023.pdf" },
];

const atributiiLegale = [
  "Aprobă bugetul local, împrumuturile, contul de încheiere a exercițiului bugetar și utilizarea rezervei bugetare.",
  "Aprobă strategiile de dezvoltare economică, socială și de mediu a unității administrativ-teritoriale.",
  "Hotărăște darea în administrare, concesionarea sau închirierea bunurilor proprietate publică a comunei.",
  "Inițiază și aprobă proiecte de hotărâri (HCL) privind dezvoltarea infrastructurii și serviciilor publice.",
  "Aprobă planurile urbanistice (PUG, PUZ) și documentațiile de amenajare a teritoriului.",
  "Alege viceprimarul din rândul consilierilor locali, la propunerea primarului sau a consilierilor."
];

// --- FUNCȚII AJUTĂTOARE ---
const getPartidBadge = (partid?: string) => {
  switch (partid) {
    case 'PSD': return 'bg-red-50 text-red-700 border-red-200';
    case 'PNL': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'USR': return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'SENS': return 'bg-purple-50 text-purple-700 border-purple-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getComisieIcon = (comisie: string) => {
  if (comisie.includes("Buget")) return Calculator;
  if (comisie.includes("Agricultură")) return Sprout;
  if (comisie.includes("Urbanism")) return Building2;
  if (comisie.includes("Învățământ")) return GraduationCap;
  return Gavel; 
};

// Componentă pentru randarea membrilor din arhivă
const ArchiveMembersList = ({ members }: { members: CouncilMember[] }) => {
  return (
    <div className="border-t border-slate-200">
      {members.map((member, index) => (
        <article key={index} className="grid grid-cols-1 gap-4 border-b border-slate-200 py-4 sm:py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {member.party && (
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest ${getPartidBadge(member.party)}`}>
                  {member.party}
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Gavel className="w-4 h-4 text-slate-400" />
                {member.role}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {member.name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end sm:w-[250px]">
            {member.documents.map((doc) =>
              doc.url ? (
                <Button key={doc.label} variant="outline" className="h-10 flex-1 sm:flex-none rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-colors text-xs font-bold" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5 mr-1.5 shrink-0" /> <span className="truncate">{doc.label}</span>
                  </a>
                </Button>
              ) : (
                <Button key={doc.label} variant="outline" className="h-10 flex-1 sm:flex-none rounded-xl border-slate-200 text-slate-400 bg-slate-50 text-xs font-bold" disabled>
                  <span className="truncate">{doc.label} (în curs)</span>
                </Button>
              )
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

// --- COMPONENTA PRINCIPALĂ ---
const ConsiliulLocal = () => {
  const pageRef = useRef<HTMLElement>(null);
  const [expandedMessage, setExpandedMessage] = useState(false);

  // Stări pentru secțiunea de Arhivă
  const [pendingMandateId, setPendingMandateId] = useState("");
  const [activeMandate, setActiveMandate] = useState<MandateBlock | null>(null);
  const [activeMandateId, setActiveMandateId] = useState("");
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const archiveOptionsMap = useMemo(() => {
    return new Map(ARCHIVE_OPTIONS.map((option) => [option.id, option]));
  }, []);

  const handleSearchArchive = async () => {
    if (!pendingMandateId) return;

    const option = archiveOptionsMap.get(pendingMandateId);
    if (!option) return;

    setArchiveError(null);
    setIsArchiveLoading(true);

    try {
      const mandate = await option.load();
      setActiveMandate(mandate);
      setActiveMandateId(option.id);
      
      // Refresh GSAP ScrollTriggers după încărcarea noului conținut
      setTimeout(() => ScrollTrigger.refresh(), 100);
    } catch {
      setArchiveError("Nu am putut încărca datele arhivei. Încearcă din nou.");
      setActiveMandate(null);
      setActiveMandateId("");
    } finally {
      setIsArchiveLoading(false);
    }
  };

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

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Administrație", href: "/primaria" }, { label: "Consiliul Local" }]}>      
      <section ref={pageRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 lg:gap-14 overflow-x-hidden">
        
        {/* --- HEADER SECȚIUNE CURENTĂ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="fade-in-left gsap-optimize inline-flex">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-md">
                Primăria Almăj
              </span>
            </div>
            
            <h1 className="fade-in-left gsap-optimize text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              {consiliuData.title}
            </h1>
            
            <div className="fade-in-left gsap-optimize">
              <span className="text-base sm:text-lg font-semibold text-slate-500">
                {consiliuData.role}
              </span>
            </div>
            
            <div className="fade-in-left gsap-optimize flex w-full flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <MapPin className="w-5 h-5 text-blue-500" /> {consiliuData.location}
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Calendar className="w-5 h-5 text-blue-500" /> {consiliuData.mandate}
              </span>
            </div>
          </div>
          
          <div className="order-3 lg:order-2 fade-in-right gsap-optimize flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-center">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <Landmark className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Vocea Cetățenilor
              </h2>
            </div>
            <div>
              <p className="hidden text-base font-medium leading-relaxed text-slate-700 lg:block sm:text-lg">
                {consiliuData.messageLong}
              </p>
              <p className="text-base font-medium leading-relaxed text-slate-700 lg:hidden sm:text-lg">
                {expandedMessage ? consiliuData.messageLong : consiliuData.messageShort}
              </p>
              <button 
                onClick={() => setExpandedMessage(!expandedMessage)}
                className="group self-start mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-2 lg:hidden"
              >
                {expandedMessage ? "Restrânge textul" : "Citește tot mesajul"}
              </button>
            </div>
          </div>
        </div>

        {/* --- FACT GRID --- */}
        <section className="stagger-container" aria-labelledby="facts-title">
          <h2 id="facts-title" className="sr-only">Informații rapide</h2>
          <ServiceInfoGrid
            items={[
              { label: "Componență", value: consiliuData.membersCount, icon: Users },
              { label: "Mandat", value: consiliuData.mandate.split(" ")[1] + " - 2028", icon: Calendar },
              { label: "Ședințe", value: consiliuData.meetings, icon: Gavel },
              { label: "Locație", value: "Sala de Ședințe", icon: MapPin },
            ]}
          />
        </section>

        {/* --- ATRIBUȚII ȘI TRANSPARENȚĂ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-16 border-t border-slate-200 pt-8 lg:pt-10">
          <section className="fade-up-scroll gsap-optimize" aria-labelledby="duties-title">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-blue-600" />
                  <h2 id="duties-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Rol Legislativ</h2>
                </div>
                <p className="text-slate-500 text-sm sm:text-base font-medium">Conform OUG 57/2019 privind Codul Administrativ.</p>
              </div>
              
              <Accordion type="single" collapsible className="w-full border-t border-slate-100">
                {atributiiLegale.map((duty, idx) => (
                  <AccordionItem key={idx} value={`duty-${idx}`} className="border-b border-slate-100">
                    <AccordionTrigger
                      icon={
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700 sm:h-9 sm:w-9 sm:text-sm">
                          {idx + 1}
                        </span>
                      }
                      className="py-4 sm:py-5 gap-4 text-left text-sm sm:text-base font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                    >
                      <span className="pr-2">{duty}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pl-10 sm:pl-12 text-slate-500 text-sm leading-relaxed">
                      Prevedere aplicabilă la nivelul Unității Administrativ Teritoriale Almăj, prin votul majorității consilierilor.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
          
          <section className="fade-up-scroll gsap-optimize" aria-labelledby="transparency-title">
            <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Integritate Publică
                  </span>
                  <h2 id="transparency-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Transparență ANI</h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Declarațiile de avere și interese ale consilierilor sunt actualizate anual conform Legii nr. 176/2010 și pot fi consultate individual mai jos sau pe portalul oficial ANI.
                  </p>
                </div>

                <div className="border-t border-slate-200">
                  <a href="/transparenta" className="group flex items-start justify-between gap-4 border-b border-slate-200 py-4 sm:py-5 transition-colors hover:border-blue-300">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 leading-snug">Vezi ROI Consiliu (Regulament)</span>
                    </div>
                    <ChevronRight className="mt-0.5 w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>
          </section>
        </div>

        {/* --- LISTA CONSILIERI MANDAT CURENT --- */}
        <section className="fade-up-scroll gsap-optimize border-t border-slate-200 pt-10 sm:pt-12 mt-2" aria-labelledby="consiliu-title">
          <div className="mb-8 space-y-2">
            <h2 id="consiliu-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Componența Consiliului Local</h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">Cei {consilieri.length} consilieri aleși pentru mandatul curent.</p>
          </div>

          <div className="border-t border-slate-200">
            {consilieri.map((c, index) => {
              const ComisieIcon = getComisieIcon(c.comisie);
              return (
                <article key={index} className="grid grid-cols-1 gap-4 border-b border-slate-200 py-4 sm:py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest ${getPartidBadge(c.partid)}`}>
                        {c.partid}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <ComisieIcon className="w-4 h-4 text-blue-500" />
                        {c.comisie}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      {c.nume}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:w-[250px]">
                    <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-colors text-xs font-bold" asChild>
                      <a href={c.avere} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Avere
                      </a>
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-colors text-xs font-bold" asChild>
                      <a href={c.interese} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Interese
                      </a>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* --- SECȚIUNEA DE ARHIVĂ MANDATE --- */}
        <section className="fade-up-scroll gsap-optimize border-t border-slate-200 pt-10 sm:pt-12 mt-2" aria-labelledby="arhiva-title">
          <div className="mb-8 space-y-2">
            <h2 id="arhiva-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Arhivă Mandate</h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">Consultă componența consiliilor din anii precedenți.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={pendingMandateId} onValueChange={setPendingMandateId}>
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-300 bg-white sm:max-w-[280px]">
                  <SelectValue placeholder="Alege mandatul din arhivă..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {ARCHIVE_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="cursor-pointer py-2.5">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                className="h-11 rounded-xl bg-blue-600 px-5 font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-50"
                disabled={!pendingMandateId || isArchiveLoading}
                onClick={handleSearchArchive}
              >
                <Search className="mr-2 h-4 w-4" />
                {isArchiveLoading ? "Se încarcă..." : "Caută mandat"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-xl px-5 font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                onClick={() => {
                  setPendingMandateId("");
                  setActiveMandateId("");
                  setActiveMandate(null);
                  setArchiveError(null);
                  setTimeout(() => ScrollTrigger.refresh(), 100);
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Resetează
              </Button>
            </div>
          </div>

          {archiveError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm sm:text-base font-medium text-red-700">
              {archiveError}
            </div>
          )}

          {isArchiveLoading && (
            <div className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center text-sm sm:text-base font-medium text-slate-500">
              Se încarcă datele din arhivă...
            </div>
          )}

          {!archiveError && activeMandate && !isArchiveLoading && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Rezultate: {activeMandate.label}
              </h3>
              
              {activeMandate.years.map((yearBlock) => (
                <article key={yearBlock.id} className="space-y-4">
                  <h4 className="flex items-center gap-3 text-xs sm:text-sm font-black uppercase tracking-widest text-blue-700">
                    <span className="h-px w-6 sm:w-8 bg-blue-600"></span>
                    {yearBlock.title}
                  </h4>
                  <ArchiveMembersList members={yearBlock.members} />
                </article>
              ))}
            </div>
          )}
        </section>

        <CouncilActivitySection className="fade-up-scroll gsap-optimize border-t border-slate-200 pt-10 sm:pt-12 mt-2" />

      </section>
    </PageLayout>
  );
};

export default ConsiliulLocal;
