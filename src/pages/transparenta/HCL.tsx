import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpDown,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Gavel,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthContext";
import PageLayout from "@/components/PageLayout";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_URL, withApiBase } from "@/config/api";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type HclDocument = {
  id: number;
  title: string;
  category: string;
  content?: string | null;
  fileUrl?: string | null;
  year?: number | null;
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

type AdminFormState = {
  title: string;
  type: string;
  description: string;
};

const HCL_CATEGORY_KEY = "hcl-transparenta";
const HCL_TYPES = ["Hotărâri Consiliu", "Proiecte", "Arhivă"];
const ALL_YEARS_LABEL = "Toți anii";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Cele mai noi" },
  { value: "oldest", label: "Cele mai vechi" },
  { value: "title-asc", label: "Alfabetic A-Z" },
  { value: "title-desc", label: "Alfabetic Z-A" },
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

    const id = window.setInterval(() => {
      const now = Date.now();
      if (
        document.visibilityState === "visible" &&
        now - lastActivityRef.current > idleThresholdMs
      ) {
        void savedCallback.current();
      }
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      events.forEach((event) => window.removeEventListener(event, resetActivity));
    };
  }, [idleThresholdMs, intervalMs]);
};

const normalizeValue = (value: string | null | undefined) => value?.toLowerCase() ?? "";

const formatDate = (dateString: string) => {
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "Dată indisponibilă";

  return new Date(dateString).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDocumentYear = (document: HclDocument) => {
  if (typeof document.year === "number" && Number.isFinite(document.year)) {
    return String(document.year);
  }

  const timestamp = new Date(document.createdAt).getTime();
  if (Number.isNaN(timestamp)) return "Necunoscut";
  return String(new Date(document.createdAt).getFullYear());
};

const extractDocumentNumber = (document: HclDocument) => {
  const source = `${document.title} ${document.content ?? ""}`;
  const match = source.match(/(?:nr\.?|num[aă]r(?:ul)?)\s*([0-9]+(?:\/[0-9]{2,4})?)/i);
  return match?.[1] ?? null;
};

export default function HCL() {
  const pageRef = useRef<HTMLElement>(null);
  const { isAdmin, token } = useAuth();

  const [documents, setDocuments] = useState<HclDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<HclDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [activeYear, setActiveYear] = useState(ALL_YEARS_LABEL);
  const [activeDocument, setActiveDocument] = useState<HclDocument | null>(null);
  const [adminForm, setAdminForm] = useState<AdminFormState>({
    title: "",
    type: HCL_TYPES[0],
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = new URL(`${API_URL}/api/documents`);
      url.searchParams.set("category", HCL_CATEGORY_KEY);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`request_failed_${response.status}`);
      }

      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (nextError) {
      console.error("Nu am putut încărca hotărârile Consiliului Local.", nextError);
      setError("Documentele nu au putut fi încărcate momentan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  useIdlePolling(fetchDocuments, 5000, 3000);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });

      timeline
        .fromTo(".hcl-fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 })
        .fromTo(".hcl-fade-in-right", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>(".hcl-fade-up-scroll").forEach((element) => {
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

  const years = useMemo(
    () => [
      ALL_YEARS_LABEL,
      ...Array.from(new Set(documents.map((document) => getDocumentYear(document)).filter(Boolean))).sort(
        (a, b) => Number(b) - Number(a),
      ),
    ],
    [documents],
  );

  useEffect(() => {
    const normalizedTerm = normalizeValue(deferredSearchTerm.trim());

    const result = [...documents]
      .filter((document) => {
        const documentYear = getDocumentYear(document);
        const documentNumber = extractDocumentNumber(document);
        const matchesYear = activeYear === ALL_YEARS_LABEL || documentYear === activeYear;
        const searchSource = [
          document.title,
          document.content,
          document.category,
          documentYear,
          documentNumber,
          formatDate(document.createdAt),
        ]
          .join(" ")
          .toLowerCase();

        return matchesYear && (normalizedTerm.length === 0 || searchSource.includes(normalizedTerm));
      })
      .sort((first, second) => {
        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();

        if (sortOption === "newest") return secondTime - firstTime;
        if (sortOption === "oldest") return firstTime - secondTime;
        if (sortOption === "title-asc") return first.title.localeCompare(second.title, "ro");
        return second.title.localeCompare(first.title, "ro");
      });

    setFilteredDocuments(result);
  }, [activeYear, deferredSearchTerm, documents, sortOption]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 || activeYear !== ALL_YEARS_LABEL || sortOption !== "newest";

  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("newest");
    setActiveYear(ALL_YEARS_LABEL);
  };

  const handleUpload = async () => {
    if (!isAdmin || !token) {
      toast.error("Nu aveți drepturi de administrator.");
      return;
    }

    if (!adminForm.title.trim() || !selectedFile) {
      toast.error("Completați titlul și alegeți documentul PDF.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", adminForm.title.trim());
      formData.append("category", HCL_CATEGORY_KEY);
      formData.append("content", adminForm.description.trim() || adminForm.type);
      formData.append("year", new Date().getFullYear().toString());

      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`upload_failed_${response.status}`);
      }

      toast.success("Hotărârea a fost publicată.");
      setAdminForm({ title: "", type: HCL_TYPES[0], description: "" });
      setSelectedFile(null);
      await fetchDocuments();
    } catch (nextError) {
      console.error("Nu am putut publica hotărârea.", nextError);
      toast.error("Publicarea documentului a eșuat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (document: HclDocument) => {
    if (!isAdmin || !token) return;
    if (!window.confirm("Ștergeți definitiv acest document?")) return;

    try {
      const response = await fetch(`${API_URL}/api/documents/${document.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`delete_failed_${response.status}`);
      }

      toast.success("Documentul a fost eliminat.");
      if (activeDocument?.id === document.id) {
        setActiveDocument(null);
      }
      await fetchDocuments();
    } catch (nextError) {
      console.error("Nu am putut șterge documentul.", nextError);
      toast.error("Ștergerea documentului a eșuat.");
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Transparență", href: "/transparenta" },
        { label: "HCL" },
      ]}
    >
      <section
        ref={pageRef}
        className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="hcl-fade-in-left inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                Transparență publică
              </span>
            </div>

            <h1 className="hcl-fade-in-left text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Hotărâri ale Consiliului Local
            </h1>

            <div className="hcl-fade-in-left max-w-3xl">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                Accesați hotărârile Consiliului Local într-un format clar și ușor de consultat.
              </span>
            </div>

            <div className="hcl-fade-in-left flex w-full max-w-3xl flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Gavel className="w-5 h-5 text-blue-500 shrink-0" />
                Hotărârile sunt încărcate din baza de date a primăriei și afișate public pentru consultare.
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                Consultați hotărârile adoptate, căutați rapid documentele necesare și ordonați rezultatele
                într-un mod simplu și eficient.
              </span>
            </div>

            <div className="hcl-fade-in-left flex w-full flex-wrap justify-center gap-3 pt-4 lg:hidden">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#cautare-hcl">Caută în HCL</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                asChild
              >
                <a href="#lista-hcl">Vezi hotărârile</a>
              </Button>
            </div>
          </div>

          <div className="order-3 lg:order-2 hcl-fade-in-right flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                Consultați hotărârile adoptate de Consiliul Local într-un traseu clar de consultare:
                introducere scurtă, instrumente rapide de căutare și ordonare, apoi lista actualizată a
                documentelor publice. Pagina păstrează aceeași logică de navigare și ritm vizual ca în restul
                secțiunilor instituționale ale site-ului.
              </p>
              <p className="mt-4 text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                Fiecare document poate fi identificat rapid după titlu, an sau număr, pentru un acces simplu și
                eficient la informațiile oficiale publicate de primărie.
              </p>
            </div>

            <div className="hidden lg:flex flex-wrap gap-3 pt-6">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#cautare-hcl">Caută în HCL</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                asChild
              >
                <a href="#lista-hcl">Vezi hotărârile</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">
          <section
            id="cautare-hcl"
            className="hcl-fade-up-scroll scroll-mt-24 lg:col-start-1"
            aria-labelledby="cautare-hcl-title"
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <Search className="h-3.5 w-3.5" />
                  Căutare și ordonare
                </span>
                <h2
                  id="cautare-hcl-title"
                  className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                >
                  Găsește rapid o hotărâre
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  Folosiți căutarea, ordonarea și filtrarea pe ani pentru a ajunge mai ușor la documentele
                  relevante.
                </p>
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-5 sm:pt-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Caută hotărâre după titlu sau cuvinte cheie..."
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        Se sincronizează arhiva hotărârilor...
                      </>
                    ) : error ? (
                      <span>{error}</span>
                    ) : (
                      <span>{filteredDocuments.length} hotărâri afișate</span>
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
            id="lista-hcl"
            className="hcl-fade-up-scroll lg:col-start-2"
            aria-labelledby="lista-hcl-title"
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <Scale className="h-3.5 w-3.5" />
                  Arhivă publică
                </span>
                <h2 id="lista-hcl-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Hotărâri publicate
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  Lista de mai jos este încărcată din baza de date și afișează hotărârile disponibile pentru
                  consultare, deschidere sau descărcare.
                </p>
              </div>

              {isLoading && documents.length === 0 ? (
                <div className="border-t border-slate-200 py-8 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    Se sincronizează arhiva hotărârilor...
                  </div>
                </div>
              ) : error && documents.length === 0 ? (
                <div className="border-t border-slate-200 py-8">
                  <p className="text-base font-semibold text-slate-700">{error}</p>
                  <p className="mt-2 text-sm text-slate-500">Reîncercați în câteva momente.</p>
                </div>
              ) : filteredDocuments.length > 0 ? (
                <div className="border-t border-slate-200">
                  {filteredDocuments.map((document) => {
                    const documentUrl = withApiBase(document.fileUrl) || null;
                    const documentYear = getDocumentYear(document);
                    const documentNumber = extractDocumentNumber(document);

                    return (
                      <article key={document.id} className="py-5 sm:py-6 border-b border-slate-200">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
                              HCL
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(document.createdAt)}
                            </span>
                            {documentYear !== "Necunoscut" ? (
                              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                {documentYear}
                              </span>
                            ) : null}
                            {documentNumber ? (
                              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                Nr. {documentNumber}
                              </span>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-black leading-tight text-slate-900">
                              {document.title || "Fără titlu"}
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                              {document.content?.trim()
                                ? document.content
                                : "Document public disponibil pentru consultare și descărcare."}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {documentUrl ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setActiveDocument(document)}
                                  className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                                >
                                  <Eye className="h-4 w-4" />
                                  Vezi documentul
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
                                documentUrl
                                  ? "text-blue-700 hover:text-blue-900"
                                  : "pointer-events-none text-slate-400",
                              )}
                            >
                              Deschide
                              <ChevronRight className="h-4 w-4" />
                            </a>

                            {isAdmin ? (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleDelete(document)}
                                className="h-11 rounded-xl px-3 text-slate-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                Șterge
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="border-t border-slate-200 py-8">
                  <p className="text-base font-semibold text-slate-700">
                    Nu există hotărâri pentru această căutare.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Încercați alte cuvinte cheie sau modificați ordonarea și filtrarea după an.
                  </p>
                </div>
              )}
            </div>
          </section>
          {isAdmin ? (
            <section
              className="hcl-fade-up-scroll lg:col-span-2 border-t border-slate-200 pt-8 lg:pt-10"
              aria-labelledby="administrare-hcl-title"
            >
              <div className="max-w-4xl space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Administrare
                  </span>
                  <h2
                    id="administrare-hcl-title"
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                  >
                    Publică un document nou
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Secțiune disponibilă doar administratorilor pentru încărcarea și actualizarea arhivei HCL.
                  </p>
                </div>

                <div className="space-y-4 border-t border-slate-200 pt-5 sm:pt-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Titlu document
                      </label>
                      <Input
                        value={adminForm.title}
                        onChange={(event) =>
                          setAdminForm((current) => ({ ...current, title: event.target.value }))
                        }
                        placeholder="Ex: HCL nr. 12/2026 - Aprobarea bugetului local"
                        className="h-12 sm:h-14 rounded-xl border-slate-200 bg-slate-50 text-base focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Tip document
                      </label>
                      <Select
                        value={adminForm.type}
                        onValueChange={(value) => setAdminForm((current) => ({ ...current, type: value }))}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-left">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HCL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Fișier PDF
                      </label>
                      <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 px-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                        <UploadCloud className="h-4 w-4" />
                        <span className="truncate">
                          {selectedFile ? selectedFile.name : "Selectează documentul"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Descriere scurtă
                    </label>
                    <Textarea
                      value={adminForm.description}
                      onChange={(event) =>
                        setAdminForm((current) => ({ ...current, description: event.target.value }))
                      }
                      rows={4}
                      placeholder="Descriere opțională pentru afișarea publică a hotărârii..."
                      className="rounded-xl border-slate-200 bg-slate-50 p-4 text-base focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      Documentul va fi încărcat în categoria publică HCL.
                    </p>
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={isSubmitting}
                      className="h-12 rounded-xl px-6 text-sm font-bold bg-slate-900 text-white hover:bg-blue-600"
                    >
                      {isSubmitting ? "Se publică..." : "Publică documentul"}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <Dialog open={Boolean(activeDocument)} onOpenChange={(open) => (!open ? setActiveDocument(null) : null)}>
        <DialogContent
          className="max-w-[1000px] w-[95vw] h-[92vh] p-0 bg-white flex flex-col rounded-xl overflow-hidden border-none shadow-2xl"
          aria-describedby={undefined}
        >
          {activeDocument ? (
            <>
              <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-white shrink-0">
                <div className="bg-blue-700 p-2.5 rounded-lg mr-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 pr-10">
                  <DialogTitle className="text-sm font-black uppercase text-slate-800 truncate">
                    {activeDocument.title}
                  </DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    Hotărâre Consiliu Local
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 flex justify-center overflow-hidden relative">
                {activeDocument.fileUrl ? (
                  <PDFViewer
                    url={withApiBase(activeDocument.fileUrl) || activeDocument.fileUrl}
                    className="w-full h-full border-none"
                    onClose={() => setActiveDocument(null)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-8 text-center text-slate-500">
                    Previzualizarea nu este disponibilă pentru acest document.
                  </div>
                )}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
