import { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { notificationsData, Notification } from "@/data/notificationsData";
import {
  BellRing,
  Calendar,
  Download,
  FileText,
  Filter,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { withApiBase } from "@/config/api";

const categoryTone: Record<Notification["category"], { bg: string; text: string; ring: string }> = {
  Taxe: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  Mediu: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  Agricol: { bg: "bg-lime-50", text: "text-lime-700", ring: "ring-lime-100" },
  Urgent: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-100" },
  General: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" },
};

const formatDate = (date: string) =>
  new Date(date.replace(/(Ianuarie|Februarie|Martie|Aprilie|Mai|Iunie|Iulie|August|Septembrie|Octombrie|Noiembrie|Decembrie)/i, (m) => {
    const monthMap: Record<string, string> = {
      ianuarie: "January",
      februarie: "February",
      martie: "March",
      aprilie: "April",
      mai: "May",
      iunie: "June",
      iulie: "July",
      august: "August",
      septembrie: "September",
      octombrie: "October",
      noiembrie: "November",
      decembrie: "December",
    };
    return monthMap[m.toLowerCase()] ?? m;
  })).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });

const resolveUrl = (url?: string) => withApiBase(url);

const Instiintari = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Notification["category"] | "toate">("toate");

  useGSAP(
    () => {
      gsap.from(".inst-hero", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.from(".inst-card", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
      });
    },
    { scope: containerRef, dependencies: [category, search] }
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return notificationsData.filter((item) => {
      const matchCategory = category === "toate" || item.category === category;
      const matchTerm =
        term.length === 0 ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return matchCategory && matchTerm;
    });
  }, [category, search]);

  return (
    <PageLayout
      title=""
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Înștiințări publice" },
      ]}
    >
      <div ref={containerRef} className="mx-auto max-w-5xl px-4 pb-20 pt-10">
        <div className="inst-hero mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-7 text-white shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                <Sparkles className="h-4 w-4" /> Actualizat lunar
              </div>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">Înștiințări oficiale</h1>
              <p className="max-w-2xl text-sm sm:text-base text-blue-50">
                Informări, taxe și avertizări urgente pentru comuna Almăj. Documentele pot fi
                descărcate sau vizualizate rapid, inclusiv de pe telefon.
              </p>
            </div>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-xs px-3 py-2">
              <BellRing className="mr-2 h-4 w-4" /> Avizier digital
            </Badge>
          </div>
        </div>

        <div className="inst-hero mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-auto sm:min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută după titlu sau descriere"
              className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["toate", "Taxe", "Mediu", "Agricol", "Urgent", "General"] as const).map((cat) => {
              const tone = cat === "toate" ? { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" } : categoryTone[cat as Notification["category"]];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as Notification["category"] | "toate")}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ring-1 transition",
                    tone.bg,
                    tone.text,
                    tone.ring,
                    category === cat ? "ring-2 ring-offset-1 ring-offset-white" : "opacity-90"
                  )}
                >
                  <Filter className="h-3.5 w-3.5" />
                  {cat === "toate" ? "Toate" : cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => {
            const tone = categoryTone[item.category];
            const url = resolveUrl(item.documentUrl);
            const isUrgent = item.category === "Urgent";

            return (
              <article
                key={item.id}
                className={cn(
                  "inst-card relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100",
                  isUrgent && "ring-red-100 border-l-4 border-l-red-500"
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        "flex items-center gap-1.5 border text-[11px] font-bold uppercase tracking-wide",
                        tone.bg,
                        tone.text,
                        tone.ring
                      )}
                    >
                      {isUrgent ? <ShieldAlert className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                      {item.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {url && (
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 text-slate-700">
                        <a href={url} target="_blank" rel="noreferrer">
                          <FileText className="mr-2 h-4 w-4" />
                          Vizualizează
                        </a>
                      </Button>
                      <Button asChild size="sm" className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700">
                        <a href={url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Descarcă
                        </a>
                      </Button>
                    </div>
                  )}
                </div>

                <h2 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="inst-card flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
              <Search className="mb-3 h-8 w-8 opacity-40" />
              <p className="text-sm">Nicio înștiințare nu corespunde filtrului curent.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Instiintari;
