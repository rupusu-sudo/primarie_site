import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpDown,
  Calendar,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
  UploadCloud,
  X,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/components/AuthContext";
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

gsap.registerPlugin(ScrollTrigger);

type PublicDocument = {
  id: number;
  title: string;
  category: string;
  number?: string | null;
  publicationDate?: string | null;
  year?: number | null;
  fileUrl?: string | null;
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

type PublicInfoDocumentsPageProps = {
  title: string;
  badge: string;
  description: string;
  category: string;
  emptyMessage: string;
  heroLabel: string;
  icon: LucideIcon;
  breadcrumbs: { label: string; href?: string }[];
};

const ALL_YEARS_LABEL = "Toți anii";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Cele mai noi" },
  { value: "oldest", label: "Cele mai vechi" },
  { value: "title-asc", label: "Titlu A-Z" },
  { value: "title-desc", label: "Titlu Z-A" },
];

const normalizeValue = (value: string | null | undefined) => value?.toLowerCase() ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "Dată indisponibilă";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Dată indisponibilă";

  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDocumentYear = (document: PublicDocument) => {
  if (typeof document.year === "number" && Number.isFinite(document.year)) {
    return String(document.year);
  }

  const sourceDate = document.publicationDate || document.createdAt;
  const timestamp = new Date(sourceDate).getTime();
  if (Number.isNaN(timestamp)) return "Necunoscut";
  return String(new Date(sourceDate).getFullYear());
};

const getDocumentDate = (document: PublicDocument) => document.publicationDate || document.createdAt;

export default function PublicInfoDocumentsPage({
  title,
  badge,
  description,
  category,
  emptyMessage,
  heroLabel,
  icon: HeroIcon,
  breadcrumbs,
}: PublicInfoDocumentsPageProps) {
  const pageRef = useRef<HTMLElement>(null);
  const { isAdmin, token } = useAuth();

  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<PublicDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [activeYear, setActiveYear] = useState(ALL_YEARS_LABEL);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminForm, setAdminForm] = useState({
    title: "",
    number: "",
    publicationDate: "",
  });

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = new URL(`${API_URL}/api/documents`);
      url.searchParams.set("category", category);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`request_failed_${response.status}`);
      }

      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (nextError) {
      console.error(`Nu am putut încărca documentele pentru categoria ${category}.`, nextError);
      setError("Documentele nu au putut fi încărcate momentan.");
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });

      timeline
        .fromTo(".public-info-fade-in-left", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08 })
        .fromTo(".public-info-fade-in-right", { opacity: 0, x: 20 }, { opacity: 1, x: 0 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>(".public-info-fade-up-scroll").forEach((element) => {
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
        const matchesYear = activeYear === ALL_YEARS_LABEL || documentYear === activeYear;
        const searchSource = [
          document.title,
          document.number,
          documentYear,
          formatDate(getDocumentDate(document)),
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch = normalizedTerm.length === 0 || searchSource.includes(normalizedTerm);
        return matchesYear && matchesSearch;
      })
      .sort((first, second) => {
        const firstTime = new Date(getDocumentDate(first)).getTime();
        const secondTime = new Date(getDocumentDate(second)).getTime();

        if (sortOption === "newest") return secondTime - firstTime;
        if (sortOption === "oldest") return firstTime - secondTime;
        if (sortOption === "title-asc") return first.title.localeCompare(second.title, "ro");
        return second.title.localeCompare(first.title, "ro");
      });

    setFilteredDocuments(result);
  }, [activeYear, deferredSearchTerm, documents, sortOption]);

  const hasActiveFilters = searchTerm.trim().length > 0 || activeYear !== ALL_YEARS_LABEL;

  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("newest");
    setActiveYear(ALL_YEARS_LABEL);
  };

  const handleSubmit = async () => {
    if (!isAdmin || !token) return;
    if (!adminForm.title.trim() || !adminForm.publicationDate || !selectedFile) {
      setError("Completați titlul, data publicării și atașați documentul.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", adminForm.title.trim());
      formData.append("category", category);
      formData.append("number", adminForm.number.trim());
      formData.append("publicationDate", adminForm.publicationDate);
      formData.append("year", String(new Date(adminForm.publicationDate).getFullYear()));
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Nu am putut publica documentul.");
      }

      setAdminForm({ title: "", number: "", publicationDate: "" });
      setSelectedFile(null);
      await fetchDocuments();
    } catch (nextError) {
      console.error(`Nu am putut publica documentul pentru categoria ${category}.`, nextError);
      setError(nextError instanceof Error ? nextError.message : "Nu am putut publica documentul.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <section
        ref={pageRef}
        className="max-w-[92rem] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-6 sm:py-10 flex flex-col gap-8 lg:gap-10 overflow-x-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:text-left lg:pr-5 xl:pr-7">
            <div className="public-info-fade-in-left inline-flex">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-700 bg-blue-50/60 px-3 py-1 rounded-md">
                {badge}
              </span>
            </div>

            <div className="public-info-fade-in-left flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-blue-700 shadow-sm">
                <HeroIcon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <h1 className="text-center sm:text-5xl lg:text-left lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                {title}
              </h1>
            </div>

            <div className="public-info-fade-in-left max-w-[40rem]">
              <span className="block text-center text-base sm:text-lg font-semibold text-slate-700 lg:text-left">
                {heroLabel}
              </span>
            </div>
          </div>

          <div className="order-3 lg:order-2 public-info-fade-in-right flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-t-0 lg:border-l-4 lg:pl-6 xl:pl-8 lg:py-1 lg:justify-center">
            <p className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg" style={{ textIndent: "1.5rem" }}>
              {description}
            </p>
          </div>
        </div>

        <section className="public-info-fade-up-scroll" aria-labelledby="filtre-documente-title">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <Search className="h-3.5 w-3.5" />
                    Filtre rapide
                  </span>
                  <h2 id="filtre-documente-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Căutare și sortare
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Găsiți rapid documentele după titlu, număr, an sau data publicării.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="cautare-documente"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Caută după titlu sau număr..."
                      className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Ordonare
                      </label>
                      <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-sm font-semibold">
                          <SelectValue placeholder="Selectează ordonarea" />
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
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        An
                      </label>
                      <Select value={activeYear} onValueChange={setActiveYear}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-sm font-semibold">
                          <SelectValue placeholder="Selectează anul" />
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
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        Se sincronizează documentele...
                      </>
                    ) : error ? (
                      <span>{error}</span>
                    ) : (
                      <span>{filteredDocuments.length} documente afișate</span>
                    )}
                  </div>

                  {hasActiveFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetFilters}
                      className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700"
                    >
                      <X className="h-4 w-4" />
                      Resetează
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  <HeroIcon className="h-3.5 w-3.5" />
                  Arhivă publică
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Documente publicate
                </h2>
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                  Lista de mai jos este încărcată din baza de date și oferă acces direct la documentele disponibile.
                </p>
              </div>

              {isLoading && documents.length === 0 ? (
                <div className="border-t border-slate-200 py-8 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    Se sincronizează arhiva...
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
                    const documentDate = formatDate(getDocumentDate(document));

                    return (
                      <article key={document.id} className="border-b border-slate-200 py-5 sm:py-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {document.number ? (
                              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
                                Nr. {document.number}
                              </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {documentDate}
                            </span>
                            {documentYear !== "Necunoscut" ? (
                              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                {documentYear}
                              </span>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-black leading-tight text-slate-900">
                              {document.title || "Fără titlu"}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {documentUrl ? (
                              <>
                                <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700">
                                  <a href={documentUrl} target="_blank" rel="noreferrer">
                                    <Eye className="h-4 w-4" />
                                    Vezi documentul
                                  </a>
                                </Button>
                                <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-900 hover:border-blue-200 hover:text-blue-700">
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
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="border-t border-slate-200 py-8">
                  <p className="text-base font-semibold text-slate-700">{emptyMessage}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Încercați alte cuvinte cheie sau modificați filtrarea și ordonarea.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {isAdmin ? (
          <section className="public-info-fade-up-scroll border-t border-slate-200 pt-8 lg:pt-10" aria-labelledby="administrare-documente-title">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Administrare
                  </span>
                  <h2 id="administrare-documente-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Publicare documente
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                    Încărcați documente noi folosind același flux de administrare bazat pe tabela existentă `documents`.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Titlu document
                    </label>
                    <Input
                      value={adminForm.title}
                      onChange={(event) => setAdminForm((current) => ({ ...current, title: event.target.value }))}
                      className="h-12 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Număr document
                    </label>
                    <Input
                      value={adminForm.number}
                      onChange={(event) => setAdminForm((current) => ({ ...current, number: event.target.value }))}
                      className="h-12 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Data publicării
                    </label>
                    <Input
                      type="date"
                      value={adminForm.publicationDate}
                      onChange={(event) =>
                        setAdminForm((current) => ({ ...current, publicationDate: event.target.value }))
                      }
                      className="h-12 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Fișier PDF
                    </label>
                    <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 px-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                      <UploadCloud className="h-4 w-4" />
                      <span className="truncate">{selectedFile ? selectedFile.name : "Selectează documentul"}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Categoria de publicare: <span className="font-bold text-slate-700">{category}</span>
                  </p>
                  <Button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={isSubmitting}
                    className="h-12 rounded-xl bg-blue-600 px-6 font-bold hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Se publică...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        Publică documentul
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </PageLayout>
  );
}
