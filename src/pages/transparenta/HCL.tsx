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
  Mail,
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
  type?: string | null;
  status?: "consultare" | "adoptat" | null;
  number?: string | null;
  content?: string | null;
  fileUrl?: string | null;
  year?: number | null;
  publicationDate?: string | null;
  adoptionDate?: string | null;
  consultationDeadline?: string | null;
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";
type HclStatus = "consultare" | "adoptat";

type AdminFormState = {
  title: string;
  status: HclStatus;
  number: string;
  description: string;
  publicationDate: string;
  adoptionDate: string;
  consultationDeadline: string;
};

const HCL_STATUS_OPTIONS: { value: HclStatus; label: string }[] = [
  { value: "consultare", label: "Proiect in consultare" },
  { value: "adoptat", label: "Hotarare adoptata" },
];

const ALL_YEARS_LABEL = "Toti anii";

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

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Data indisponibila";
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "Data indisponibila";

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

  const referenceDate =
    document.adoptionDate || document.publicationDate || document.consultationDeadline || document.createdAt;
  const timestamp = new Date(referenceDate).getTime();
  if (Number.isNaN(timestamp)) return "Necunoscut";
  return String(new Date(referenceDate).getFullYear());
};

const getSortDate = (document: HclDocument) =>
  document.adoptionDate || document.publicationDate || document.consultationDeadline || document.createdAt;

export default function HCL() {
  const pageRef = useRef<HTMLElement>(null);
  const { isAdmin, token } = useAuth();

  const [documents, setDocuments] = useState<HclDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [activeYear, setActiveYear] = useState(ALL_YEARS_LABEL);
  const [activeDocument, setActiveDocument] = useState<HclDocument | null>(null);
  const [adminForm, setAdminForm] = useState<AdminFormState>({
    title: "",
    status: "consultare",
    number: "",
    description: "",
    publicationDate: "",
    adoptionDate: "",
    consultationDeadline: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = new URL(`${API_URL}/api/hcl`);
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`request_failed_${response.status}`);
      }

      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (nextError) {
      console.error("Nu am putut incarca documentele HCL.", nextError);
      setError("Documentele nu au putut fi incarcate momentan.");
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

  const filteredDocuments = useMemo(() => {
    const normalizedTerm = normalizeValue(deferredSearchTerm.trim());

    return [...documents]
      .filter((document) => {
        const documentYear = getDocumentYear(document);
        const matchesYear = activeYear === ALL_YEARS_LABEL || documentYear === activeYear;
        const searchSource = [
          document.title,
          document.content,
          document.number,
          documentYear,
          formatDate(document.publicationDate),
          formatDate(document.adoptionDate),
          formatDate(document.consultationDeadline),
        ]
          .join(" ")
          .toLowerCase();

        return matchesYear && (normalizedTerm.length === 0 || searchSource.includes(normalizedTerm));
      })
      .sort((first, second) => {
        const firstTime = new Date(getSortDate(first)).getTime();
        const secondTime = new Date(getSortDate(second)).getTime();

        if (sortOption === "newest") return secondTime - firstTime;
        if (sortOption === "oldest") return firstTime - secondTime;
        if (sortOption === "title-asc") return first.title.localeCompare(second.title, "ro");
        return second.title.localeCompare(first.title, "ro");
      });
  }, [activeYear, deferredSearchTerm, documents, sortOption]);

  const consultationProjects = filteredDocuments.filter(
    (document) => (document.status || "adoptat") === "consultare",
  );
  const adoptedDecisions = filteredDocuments.filter(
    (document) => (document.status || "adoptat") === "adoptat",
  );

  const hasActiveFilters =
    searchTerm.trim().length > 0 || activeYear !== ALL_YEARS_LABEL || sortOption !== "newest";

  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("newest");
    setActiveYear(ALL_YEARS_LABEL);
  };

  const handleUpload = async () => {
    if (!isAdmin || !token) {
      toast.error("Nu aveti drepturi de administrator.");
      return;
    }

    if (!adminForm.title.trim() || !selectedFile) {
      toast.error("Completati titlul si alegeti documentul PDF.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", adminForm.title.trim());
      formData.append("category", "hcl-transparenta");
      formData.append("type", "hcl");
      formData.append("status", adminForm.status);
      formData.append("number", adminForm.number.trim());
      formData.append("content", adminForm.description.trim());
      formData.append("year", new Date().getFullYear().toString());
      formData.append("publicationDate", adminForm.publicationDate);
      formData.append("adoptionDate", adminForm.status === "adoptat" ? adminForm.adoptionDate : "");
      formData.append(
        "consultationDeadline",
        adminForm.status === "consultare" ? adminForm.consultationDeadline : "",
      );

      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`upload_failed_${response.status}`);
      }

      toast.success("Documentul HCL a fost publicat.");
      setAdminForm({
        title: "",
        status: "consultare",
        number: "",
        description: "",
        publicationDate: "",
        adoptionDate: "",
        consultationDeadline: "",
      });
      setSelectedFile(null);
      await fetchDocuments();
    } catch (nextError) {
      console.error("Nu am putut publica documentul HCL.", nextError);
      toast.error("Publicarea documentului a esuat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (document: HclDocument) => {
    if (!isAdmin || !token) return;
    if (!window.confirm("Stergeti definitiv acest document?")) return;

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
      console.error("Nu am putut sterge documentul.", nextError);
      toast.error("Stergerea documentului a esuat.");
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasa", href: "/" },
        { label: "Transparenta", href: "/transparenta" },
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
                Transparenta publica
              </span>
            </div>

            <h1 className="hcl-fade-in-left text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Hotarari ale Consiliului Local
            </h1>

            <div className="hcl-fade-in-left max-w-3xl">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                Proiecte aflate in consultare publica si hotarari adoptate ale Consiliului Local.
              </span>
            </div>

            <div className="hcl-fade-in-left flex w-full max-w-3xl flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Gavel className="w-5 h-5 text-blue-500 shrink-0" />
                Consultati proiectele supuse consultarii publice si documentele adoptate, direct din arhiva digitala.
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                Urmariti termenele de dezbatere si accesati hotararile adoptate intr-un format clar si usor de consultat.
              </span>
            </div>

            <div className="hcl-fade-in-left flex w-full flex-wrap justify-center gap-3 pt-4 lg:hidden">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#cautare-hcl">Cauta proiect sau hotarare</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                asChild
              >
                <a href="#proiecte-hcl">Vezi sectiunile</a>
              </Button>
            </div>
          </div>

          <div className="order-3 lg:order-2 hcl-fade-in-right flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-between">
            <div>
              <p
                className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                Consultati proiectele supuse consultarii publice, urmariti termenele de dezbatere si accesati
                hotararile adoptate intr-un format clar si usor de consultat. Pagina reuneste intr-un singur
                traseu firesc proiectele aflate in consultare si hotararile finale ale Consiliului Local.
              </p>
              <p className="mt-4 text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                Cautarea si ordonarea sunt comune pentru intreaga pagina, iar cele doua sectiuni raman clar
                separate pentru o consultare rapida si oficiala.
              </p>
            </div>

            <div className="hidden lg:flex flex-wrap gap-3 pt-6">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#cautare-hcl">Cauta proiect sau hotarare</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-8 rounded-xl text-sm sm:text-base font-bold border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:text-blue-700"
                asChild
              >
                <a href="#proiecte-hcl">Vezi sectiunile</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-slate-200 pt-8 lg:pt-10 mt-0 sm:mt-1">
          <section
            id="cautare-hcl"
            className="hcl-fade-up-scroll scroll-mt-24"
            aria-labelledby="cautare-hcl-title"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10">
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <Search className="h-3.5 w-3.5" />
                    Cautare si ordonare
                  </span>
                  <h2 id="cautare-hcl-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Cauta proiect sau hotarare
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Cautarea functioneaza simultan pentru proiectele aflate in consultare publica si pentru
                    hotararile adoptate.
                  </p>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cauta proiect sau hotarare..."
                    className="h-12 sm:h-14 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-11 text-base focus:bg-white"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label="Sterge cautarea"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-5 sm:pt-6 lg:border-t-0 lg:pt-0">
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
                      An
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
                        Se sincronizeaza documentele HCL...
                      </>
                    ) : error ? (
                      <span>{error}</span>
                    ) : (
                      <span>{filteredDocuments.length} documente afisate</span>
                    )}
                  </div>

                  {hasActiveFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetFilters}
                      className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                    >
                      Reseteaza filtrele
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10">
            <section
              id="proiecte-hcl"
              className="hcl-fade-up-scroll lg:col-start-1"
              aria-labelledby="proiecte-hcl-title"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <Gavel className="h-3.5 w-3.5" />
                    Consultare publica
                  </span>
                  <h2 id="proiecte-hcl-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Proiecte supuse consultarii publice
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Cetatenii pot transmite sugestii si opinii in perioada de consultare publica.
                  </p>
                </div>

                {consultationProjects.length > 0 ? (
                  <div className="border-t border-slate-200">
                    {consultationProjects.map((document) => {
                      const documentUrl = withApiBase(document.fileUrl) || null;

                      return (
                        <article key={document.id} className="py-5 sm:py-6 border-b border-slate-200">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">
                                Consultare
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Calendar className="h-3.5 w-3.5" />
                                Publicat: {formatDate(document.publicationDate || document.createdAt)}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Calendar className="h-3.5 w-3.5" />
                                Termen: {formatDate(document.consultationDeadline)}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-lg sm:text-xl font-black leading-tight text-slate-900">
                                {document.title || "Fara titlu"}
                              </h3>
                              <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                                {document.content?.trim()
                                  ? document.content
                                  : "Proiect publicat pentru consultare publica."}
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
                                      Descarca
                                    </a>
                                  </Button>
                                </>
                              ) : (
                                <span className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500">
                                  Fara atasament
                                </span>
                              )}

                              <Button
                                asChild
                                variant="outline"
                                className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                              >
                                <a href="mailto:primariaalmaj@gmail.com?subject=Opinie consultare publica HCL">
                                  <Mail className="h-4 w-4" />
                                  Trimite opinie
                                </a>
                              </Button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-t border-slate-200 py-8">
                    <p className="text-base font-semibold text-slate-700">
                      Nu exista proiecte aflate in consultare publica momentan.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section
              id="hotarari-hcl"
              className="hcl-fade-up-scroll lg:col-start-2"
              aria-labelledby="hotarari-hcl-title"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <Scale className="h-3.5 w-3.5" />
                    Hotarari adoptate
                  </span>
                  <h2 id="hotarari-hcl-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Hotarari adoptate
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Sectiunea afiseaza hotararile finale adoptate de Consiliul Local.
                  </p>
                </div>

                {adoptedDecisions.length > 0 ? (
                  <div className="border-t border-slate-200">
                    {adoptedDecisions.map((document) => {
                      const documentUrl = withApiBase(document.fileUrl) || null;

                      return (
                        <article key={document.id} className="py-5 sm:py-6 border-b border-slate-200">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
                                HCL
                              </span>
                              {document.number ? (
                                <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                  Nr. {document.number}
                                </span>
                              ) : null}
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Calendar className="h-3.5 w-3.5" />
                                Adoptata: {formatDate(document.adoptionDate || document.createdAt)}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-lg sm:text-xl font-black leading-tight text-slate-900">
                                {document.title || "Fara titlu"}
                              </h3>
                              <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                                {document.content?.trim()
                                  ? document.content
                                  : "Hotarare adoptata disponibila pentru consultare si descarcare."}
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
                                      Descarca
                                    </a>
                                  </Button>
                                </>
                              ) : (
                                <span className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500">
                                  Fara atasament
                                </span>
                              )}

                              {isAdmin ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => handleDelete(document)}
                                  className="h-11 rounded-xl px-3 text-slate-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Sterge
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
                      Nu exista hotarari disponibile pentru aceasta selectie.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
          {isAdmin ? (
            <section
              className="hcl-fade-up-scroll border-t border-slate-200 pt-8 lg:pt-10"
              aria-labelledby="administrare-hcl-title"
            >
              <div className="max-w-5xl space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Administrare
                  </span>
                  <h2 id="administrare-hcl-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Publica proiect sau hotarare
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Sectiune disponibila doar administratorilor pentru publicarea proiectelor aflate in consultare
                    si a hotararilor adoptate.
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
                        placeholder="Ex: Proiect HCL privind aprobarea bugetului local"
                        className="h-12 sm:h-14 rounded-xl border-slate-200 bg-slate-50 text-base focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Status document
                      </label>
                      <Select
                        value={adminForm.status}
                        onValueChange={(value: HclStatus) =>
                          setAdminForm((current) => ({ ...current, status: value }))
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-left">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HCL_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Numar hotarare
                      </label>
                      <Input
                        value={adminForm.number}
                        onChange={(event) =>
                          setAdminForm((current) => ({ ...current, number: event.target.value }))
                        }
                        placeholder="Ex: 12/2026"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 text-base focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Data publicarii
                      </label>
                      <Input
                        type="date"
                        value={adminForm.publicationDate}
                        onChange={(event) =>
                          setAdminForm((current) => ({ ...current, publicationDate: event.target.value }))
                        }
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 text-base focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Data adoptarii
                      </label>
                      <Input
                        type="date"
                        value={adminForm.adoptionDate}
                        onChange={(event) =>
                          setAdminForm((current) => ({ ...current, adoptionDate: event.target.value }))
                        }
                        disabled={adminForm.status !== "adoptat"}
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 text-base focus:bg-white disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Termen consultare
                      </label>
                      <Input
                        type="date"
                        value={adminForm.consultationDeadline}
                        onChange={(event) =>
                          setAdminForm((current) => ({ ...current, consultationDeadline: event.target.value }))
                        }
                        disabled={adminForm.status !== "consultare"}
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 text-base focus:bg-white disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Fisier PDF
                      </label>
                      <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 px-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                        <UploadCloud className="h-4 w-4" />
                        <span className="truncate">
                          {selectedFile ? selectedFile.name : "Selecteaza documentul"}
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
                      Descriere scurta
                    </label>
                    <Textarea
                      value={adminForm.description}
                      onChange={(event) =>
                        setAdminForm((current) => ({ ...current, description: event.target.value }))
                      }
                      rows={4}
                      placeholder="Descriere optionala pentru afisarea publica a documentului..."
                      className="rounded-xl border-slate-200 bg-slate-50 p-4 text-base focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      Documentul va fi publicat in arhiva HCL cu statusul selectat.
                    </p>
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={isSubmitting}
                      className="h-12 rounded-xl px-6 text-sm font-bold bg-slate-900 text-white hover:bg-blue-600"
                    >
                      {isSubmitting ? "Se publica..." : "Publica documentul"}
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
                    {activeDocument.status === "consultare" ? "Proiect in consultare" : "Hotarare adoptata"}
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
                    Previzualizarea nu este disponibila pentru acest document.
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
