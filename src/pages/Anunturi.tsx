import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpDown,
  BellRing,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL, withApiBase } from "@/config/api";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  fileUrl?: string | null;
  createdAt: string;
}

type SortOption = "newest" | "oldest" | "title" | "with-file";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Publicate recent" },
  { value: "oldest", label: "Publicate mai vechi" },
  { value: "title", label: "Titlu A-Z" },
  { value: "with-file", label: "Cu document atașat" },
];

const useIdlePolling = (
  callback: () => Promise<void>,
  intervalMs: number = 30 * 60 * 1000,
  idleThresholdMs: number = 5000,
) => {
  const savedCallback = useRef(callback);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => window.addEventListener(event, resetActivity));

    const id = setInterval(() => {
      const now = Date.now();
      if (
        document.visibilityState === "visible" &&
        now - lastActivityRef.current > idleThresholdMs
      ) {
        void savedCallback.current();
      }
    }, intervalMs);

    return () => {
      clearInterval(id);
      events.forEach((event) => window.removeEventListener(event, resetActivity));
    };
  }, [intervalMs, idleThresholdMs]);
};

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "Dată indisponibilă";
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Dată invalidă";
  }
};

const getYear = (dateString: string) => {
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "Necunoscut";
  return String(new Date(dateString).getFullYear());
};

const normalizeValue = (value: string | null | undefined) => value?.toLowerCase() ?? "";

const categoryBadgeClass = (category: string) => {
  if (category === "Urgent") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (category === "Cultura") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (category === "Informativ") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
};

export default function Anunturi() {
  const pageRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<Announcement[]>([]);
  const [filteredData, setFilteredData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [activeYear, setActiveYear] = useState("Toți anii");

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/announcements`);
      if (!response.ok) throw new Error("network_error");

      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        setData((prev) =>
          JSON.stringify(prev) !== JSON.stringify(jsonData) ? jsonData : prev,
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  useIdlePolling(fetchAnnouncements, 5000, 3000);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });

      timeline
        .fromTo(".avizier-fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 })
        .fromTo(".avizier-fade-in-right", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "-=0.4");

      gsap.fromTo(
        ".avizier-stagger-item",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".avizier-stagger-container", start: "top 85%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".avizier-fade-up-scroll").forEach((element) => {
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

  const categories = ["Toate", ...Array.from(new Set(data.map((item) => item.category).filter(Boolean)))];
  const years = [
    "Toți anii",
    ...Array.from(new Set(data.map((item) => getYear(item.createdAt)).filter(Boolean))).sort(
      (a, b) => Number(b) - Number(a),
    ),
  ];

  useEffect(() => {
    const normalizedTerm = normalizeValue(deferredSearchTerm.trim());

    let result = [...data].filter((item) => {
      const matchesCategory = activeCategory === "Toate" || item.category === activeCategory;
      const itemYear = getYear(item.createdAt);
      const matchesYear = activeYear === "Toți anii" || itemYear === activeYear;

      const searchSource = [item.title, item.content, item.category, itemYear, formatDate(item.createdAt)]
        .join(" ")
        .toLowerCase();

      const matchesSearch = normalizedTerm.length === 0 || searchSource.includes(normalizedTerm);

      return matchesCategory && matchesYear && matchesSearch;
    });

    result.sort((first, second) => {
      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();

      if (sortOption === "newest") return secondTime - firstTime;
      if (sortOption === "oldest") return firstTime - secondTime;
      if (sortOption === "title") return first.title.localeCompare(second.title, "ro");
      return Number(Boolean(second.fileUrl)) - Number(Boolean(first.fileUrl));
    });

    setFilteredData(result);
  }, [activeCategory, activeYear, data, deferredSearchTerm, sortOption]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 || activeCategory !== "Toate" || activeYear !== "Toți anii";

  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("newest");
    setActiveCategory("Toate");
    setActiveYear("Toți anii");
  };

  const facts = [
    { label: "Total afișări", value: String(data.length), icon: BellRing },
    { label: "Rezultate", value: String(filteredData.length), icon: Search },
    { label: "Categorii", value: String(Math.max(categories.length - 1, 0)), icon: SlidersHorizontal },
    { label: "Ani disponibili", value: String(Math.max(years.length - 1, 0)), icon: Calendar },
  ];

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Avizierul Digital" }]}>
      <section
        ref={pageRef}
        className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="avizier-fade-in-left inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                Publicare online
              </span>
            </div>

            <h1 className="avizier-fade-in-left text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Avizierul Digital
            </h1>

            <div className="avizier-fade-in-left max-w-3xl">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                Documente și informații publice disponibile online.
              </span>
            </div>

            <div className="avizier-fade-in-left flex w-full max-w-3xl flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <BellRing className="w-5 h-5 text-blue-500 shrink-0" />
                Anunțurile și documentele sunt încărcate din baza de date a primăriei.
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                Lista poate fi căutată, ordonată și filtrată pentru acces rapid la informații publice.
              </span>
            </div>

            <div className="avizier-fade-in-left flex w-full flex-wrap justify-center gap-3 pt-4 lg:hidden">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#cautare-avizier">Caută în avizier</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                asChild
              >
                <a href="#lista-avizier">Vezi documentele</a>
              </Button>
            </div>
          </div>

          <div className="order-3 lg:order-2 avizier-fade-in-right flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                Consultați rapid anunțurile și documentele afișate în avizierul digital într-un format clar și
                ușor de accesat. Pagina păstrează un traseu simplu de consultare: introducere scurtă, repere
                utile, căutare și ordonare, urmate de lista actualizată a documentelor publicate pentru
                informarea cetățenilor.
              </p>
            </div>

            <div className="hidden lg:flex flex-wrap gap-3 pt-6">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#cautare-avizier">Caută în avizier</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                asChild
              >
                <a href="#lista-avizier">Vezi documentele</a>
              </Button>
            </div>
          </div>
        </div>

        <section className="avizier-stagger-container" aria-labelledby="avizier-facts-title">
          <h2 id="avizier-facts-title" className="sr-only">
            Repere rapide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {facts.map((fact) => (
              <div key={fact.label} className="avizier-stagger-item flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <fact.icon className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="text-[11px] uppercase font-bold tracking-widest text-slate-500 mb-1">
                    {fact.label}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">
          <section
            id="cautare-avizier"
            className="avizier-fade-up-scroll scroll-mt-24 lg:col-start-1"
            aria-labelledby="cautare-title"
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <Search className="h-3.5 w-3.5" />
                  Căutare și ordonare
                </span>
                <h2 id="cautare-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Găsește rapid un document
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  Folosiți căutarea, ordonarea și filtrele rapide pentru a ajunge mai ușor la documentele sau
                  anunțurile relevante.
                </p>
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-5 sm:pt-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Caută document sau anunț..."
                    className="h-12 sm:h-14 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-11 text-base focus:bg-white"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label="Șterge căutarea"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      Sortare
                    </label>
                    <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-left">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Categorie
                    </label>
                    <Select value={activeCategory} onValueChange={setActiveCategory}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-left">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((entry) => (
                          <SelectItem key={entry} value={entry}>
                            {entry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      An publicare
                    </label>
                    <Select value={activeYear} onValueChange={setActiveYear}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-left">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((entry) => (
                          <SelectItem key={entry} value={entry}>
                            {entry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        Se sincronizează avizierul digital...
                      </>
                    ) : (
                      <span>{filteredData.length} rezultate afișate</span>
                    )}
                  </div>

                  {hasActiveFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetFilters}
                      className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                    >
                      Resetează filtrele
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section
            id="lista-avizier"
            className="avizier-fade-up-scroll lg:col-start-2"
            aria-labelledby="lista-avizier-title"
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <FileText className="h-3.5 w-3.5" />
                  Avizier public
                </span>
                <h2
                  id="lista-avizier-title"
                  className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                >
                  Documente și anunțuri publicate
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  Lista de mai jos este încărcată din baza de date și afișează documentele publice disponibile
                  pentru consultare sau descărcare.
                </p>
              </div>

              {loading && data.length === 0 ? (
                <div className="border-t border-slate-200 py-8 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    Se sincronizează avizierul digital...
                  </div>
                </div>
              ) : filteredData.length > 0 ? (
                <div className="border-t border-slate-200">
                  {filteredData.map((item) => {
                    const documentUrl = withApiBase(item.fileUrl) || null;

                    return (
                      <article key={item.id} className="py-5 sm:py-6 border-b border-slate-200">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]",
                                categoryBadgeClass(item.category),
                              )}
                            >
                              {item.category || "General"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-black leading-tight text-slate-900">
                              {item.title || "Fără titlu"}
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                              {item.content || "Fără conținut"}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {documentUrl ? (
                              <>
                                <Button
                                  asChild
                                  variant="outline"
                                  className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                                >
                                  <a href={documentUrl} target="_blank" rel="noreferrer">
                                    <Eye className="h-4 w-4" />
                                    Vezi documentul
                                  </a>
                                </Button>
                                <Button
                                  asChild
                                  variant="outline"
                                  className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                                >
                                  <a href={documentUrl} download>
                                    <Download className="h-4 w-4" />
                                    Descarcă
                                  </a>
                                </Button>
                              </>
                            ) : (
                              <span className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500">
                                Fără atașament
                              </span>
                            )}

                            <a
                              href={documentUrl ?? "#"}
                              target={documentUrl ? "_blank" : undefined}
                              rel={documentUrl ? "noreferrer" : undefined}
                              className={cn(
                                "inline-flex items-center gap-2 text-sm font-bold transition-colors",
                                documentUrl ? "text-blue-700 hover:text-blue-900" : "pointer-events-none text-slate-400",
                              )}
                            >
                              Deschide
                              <ChevronRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="border-t border-slate-200 py-8">
                  <p className="text-base font-semibold text-slate-700">
                    Nu există documente pentru această căutare.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Încercați alte cuvinte cheie sau modificați filtrele.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
