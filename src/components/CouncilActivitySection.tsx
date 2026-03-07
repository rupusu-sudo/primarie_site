import { type FormEvent, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { API_URL, withApiBase } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  BookOpen,
  Calendar,
  Download,
  FileText,
  Filter,
  Gavel,
  Loader2,
  PencilLine,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";

type CouncilActivityType =
  | "adopted_decision"
  | "draft_decision"
  | "convocation"
  | "meeting_minutes";

type CouncilActivityDocument = {
  id: number;
  title: string;
  slug: string | null;
  type: CouncilActivityType;
  year: number;
  date: string;
  description: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type CouncilActivitySectionProps = {
  className?: string;
};

type ActivityFormState = {
  title: string;
  type: CouncilActivityType;
  year: string;
  date: string;
  description: string;
  isPublished: boolean;
};

const ACTIVITY_TYPE_META: Record<
  CouncilActivityType,
  {
    label: string;
    shortLabel: string;
    description: string;
    icon: typeof Gavel;
    badgeClassName: string;
  }
> = {
  adopted_decision: {
    label: "Hotărâri adoptate",
    shortLabel: "Hotărâri",
    description: "Actele aprobate de Consiliul Local și publicate oficial.",
    icon: Gavel,
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
  },
  draft_decision: {
    label: "Proiecte hotărâri",
    shortLabel: "Proiecte",
    description: "Proiecte propuse spre dezbatere și adoptare.",
    icon: BookOpen,
    badgeClassName: "border-slate-200 bg-slate-50 text-slate-700",
  },
  convocation: {
    label: "Convocatoare",
    shortLabel: "Convocatoare",
    description: "Convocări și materiale administrative asociate ședințelor.",
    icon: Calendar,
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  meeting_minutes: {
    label: "Procese-verbale",
    shortLabel: "Procese-verbale",
    description: "Procesele-verbale ale ședințelor Consiliului Local.",
    icon: FileText,
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
};

const ACTIVITY_TYPES = Object.keys(ACTIVITY_TYPE_META) as CouncilActivityType[];
const CURRENT_YEAR = new Date().getFullYear();
const ADMIN_YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 2009 },
  (_, index) => String(CURRENT_YEAR - index),
);

const createInitialForm = (type: CouncilActivityType): ActivityFormState => ({
  title: "",
  type,
  year: String(CURRENT_YEAR),
  date: new Date().toISOString().slice(0, 10),
  description: "",
  isPublished: true,
});

const formatDocumentDate = (value: string) =>
  new Date(value).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const CouncilActivitySection = ({ className = "" }: CouncilActivitySectionProps) => {
  const { isAdmin, token } = useAuth();
  const [activeType, setActiveType] = useState<CouncilActivityType>("adopted_decision");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm.trim());

  const [documents, setDocuments] = useState<CouncilActivityDocument[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [adminDocuments, setAdminDocuments] = useState<CouncilActivityDocument[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [form, setForm] = useState<ActivityFormState>(() => createInitialForm("adopted_decision"));

  useEffect(() => {
    if (!editingDocumentId) {
      setForm((current) => ({ ...current, type: activeType }));
    }
  }, [activeType, editingDocumentId]);

  useEffect(() => {
    const controller = new AbortController();

    const loadPublicState = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const yearsUrl = new URL(`${API_URL}/api/council-activity/years`);
        yearsUrl.searchParams.set("type", activeType);

        const documentsUrl = new URL(`${API_URL}/api/council-activity`);
        documentsUrl.searchParams.set("type", activeType);
        if (selectedYear !== "all") {
          documentsUrl.searchParams.set("year", selectedYear);
        }
        if (deferredSearchTerm) {
          documentsUrl.searchParams.set("q", deferredSearchTerm);
        }

        const [yearsResponse, documentsResponse] = await Promise.all([
          fetch(yearsUrl.toString(), { signal: controller.signal }),
          fetch(documentsUrl.toString(), { signal: controller.signal }),
        ]);

        if (!yearsResponse.ok || !documentsResponse.ok) {
          throw new Error("Nu am putut încărca documentele.");
        }

        const [availableYears, nextDocuments] = await Promise.all([
          yearsResponse.json(),
          documentsResponse.json(),
        ]);

        const normalizedYears = Array.isArray(availableYears)
          ? availableYears.filter((value): value is number => typeof value === "number")
          : [];

        setYears(normalizedYears);
        setDocuments(Array.isArray(nextDocuments) ? nextDocuments : []);

        if (
          selectedYear !== "all" &&
          normalizedYears.length > 0 &&
          !normalizedYears.includes(Number(selectedYear))
        ) {
          setSelectedYear("all");
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setErrorMessage("Nu am putut încărca documentele activității Consiliului Local.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPublicState();

    return () => controller.abort();
  }, [activeType, selectedYear, deferredSearchTerm, refreshNonce]);

  useEffect(() => {
    if (!isAdmin || !token) return;

    const controller = new AbortController();

    const loadAdminDocuments = async () => {
      setIsAdminLoading(true);

      try {
        const manageUrl = new URL(`${API_URL}/api/council-activity/manage`);
        manageUrl.searchParams.set("type", activeType);
        if (selectedYear !== "all") {
          manageUrl.searchParams.set("year", selectedYear);
        }
        if (deferredSearchTerm) {
          manageUrl.searchParams.set("q", deferredSearchTerm);
        }

        const response = await fetch(manageUrl.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Nu am putut încărca documentele administrative.");
        }

        const data = await response.json();
        setAdminDocuments(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        toast.error("Nu am putut încărca lista de administrare.");
      } finally {
        if (!controller.signal.aborted) {
          setIsAdminLoading(false);
        }
      }
    };

    loadAdminDocuments();

    return () => controller.abort();
  }, [activeType, selectedYear, deferredSearchTerm, isAdmin, token, refreshNonce]);

  const groupedDocuments = useMemo(() => {
    const groups = new Map<number, CouncilActivityDocument[]>();

    documents.forEach((document) => {
      const bucket = groups.get(document.year) ?? [];
      bucket.push(document);
      groups.set(document.year, bucket);
    });

    return Array.from(groups.entries())
      .sort((first, second) => second[0] - first[0])
      .map(([year, items]) => ({ year, items }));
  }, [documents]);

  const handleResetFilters = () => {
    setActiveType("adopted_decision");
    setSelectedYear("all");
    setSearchTerm("");
  };

  const handleEdit = (document: CouncilActivityDocument) => {
    setEditingDocumentId(document.id);
    setSelectedFile(null);
    setForm({
      title: document.title,
      type: document.type,
      year: String(document.year),
      date: document.date.slice(0, 10),
      description: document.description ?? "",
      isPublished: document.isPublished,
    });
  };

  const handleCancelEdit = () => {
    setEditingDocumentId(null);
    setSelectedFile(null);
    setForm(createInitialForm(activeType));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("Autentificarea administratorului este necesară.");
      return;
    }

    if (!form.title.trim() || !form.date || !form.year) {
      toast.error("Completați titlul, data și anul documentului.");
      return;
    }

    if (!selectedFile && !editingDocumentId) {
      toast.error("Atașați documentul înainte de salvare.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("type", form.type);
      formData.append("year", form.year);
      formData.append("date", form.date);
      formData.append("description", form.description.trim());
      formData.append("isPublished", String(form.isPublished));

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(
        editingDocumentId
          ? `${API_URL}/api/council-activity/${editingDocumentId}`
          : `${API_URL}/api/council-activity`,
        {
          method: editingDocumentId ? "PATCH" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Nu am putut salva documentul.");
      }

      toast.success(
        editingDocumentId ? "Documentul a fost actualizat." : "Documentul a fost adăugat.",
      );

      setEditingDocumentId(null);
      setSelectedFile(null);
      setForm(createInitialForm(activeType));
      setRefreshNonce((current) => current + 1);
    } catch (error) {
      toast.error((error as Error).message || "Nu am putut salva documentul.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (document: CouncilActivityDocument) => {
    if (!token) return;
    if (!window.confirm("Ștergeți definitiv acest document?")) return;

    try {
      const response = await fetch(`${API_URL}/api/council-activity/${document.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Nu am putut șterge documentul.");
      }

      if (editingDocumentId === document.id) {
        handleCancelEdit();
      }

      toast.success("Documentul a fost șters.");
      setRefreshNonce((current) => current + 1);
    } catch (error) {
      toast.error((error as Error).message || "Nu am putut șterge documentul.");
    }
  };

  const handleTogglePublished = async (document: CouncilActivityDocument) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/council-activity/${document.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !document.isPublished }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Nu am putut actualiza starea documentului.");
      }

      toast.success(
        !document.isPublished
          ? "Documentul a fost publicat."
          : "Documentul a fost retras din afișare.",
      );
      setRefreshNonce((current) => current + 1);
    } catch (error) {
      toast.error((error as Error).message || "Nu am putut actualiza starea documentului.");
    }
  };

  return (
    <section
      id="activitate-consiliul-local"
      className={`${className} space-y-8`}
      aria-labelledby="activity-title"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-3 text-center lg:mx-0 lg:items-start lg:text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 sm:text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          Activitate Consiliul Local
        </span>
        <h2 id="activity-title" className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Activitate Consiliul Local
        </h2>
        <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
          Documente și activitatea administrativă a Consiliului Local, organizate simplu pe ani și categorii.
        </p>
        <p className="text-sm font-medium leading-relaxed text-slate-500">
          Selectați un tip de document sau un an pentru a găsi rapid informația dorită.
        </p>
      </div>

      <div className="space-y-5">
        <div className="max-w-sm space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Tip document
          </label>
          <Select value={activeType} onValueChange={(value: CouncilActivityType) => setActiveType(value)}>
            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white text-sm font-medium text-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {ACTIVITY_TYPE_META[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="council-activity-search" className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Căutare arhivă
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="council-activity-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Caută hotărâre, proces verbal sau an..."
                className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-sm font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
              {isLoading ? "Se încarcă..." : `${documents.length} documente publicate`}
            </div>
            <Button type="button" variant="ghost" className="h-11 justify-start rounded-xl px-4 font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:justify-center" onClick={handleResetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Resetează filtrele
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedYear("all")}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${selectedYear === "all" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"}`}
            >
              Toți anii
            </button>

            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(String(year))}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${selectedYear === String(year) ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="activity-results" className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {ACTIVITY_TYPE_META[activeType].label}
          </h3>
          <p className="text-sm font-medium text-slate-600 sm:text-base">
            {selectedYear === "all" ? "Afișare extinsă pe toți anii disponibili." : `An selectat: ${selectedYear}.`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white px-6 py-12 text-center">
            <div className="space-y-3 text-slate-500">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
              <p className="text-sm font-semibold">Se încarcă documentele publicate...</p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-base font-semibold text-red-700">{errorMessage}</p>
          </div>
        ) : groupedDocuments.length > 0 ? (
          <div className="space-y-6">
            {groupedDocuments.map((group) => (
              <article key={group.year} className="space-y-4">
                {selectedYear === "all" ? (
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-blue-600" />
                    <h4 className="text-lg font-black text-slate-900 sm:text-xl">{group.year}</h4>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4">
                  {group.items.map((document) => {
                    const meta = ACTIVITY_TYPE_META[document.type];
                    const documentUrl = withApiBase(document.fileUrl);

                    return (
                      <article
                        key={document.id}
                        className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_-32px_rgba(15,23,42,0.35)] sm:p-6"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${meta.badgeClassName}`}>
                            {meta.shortLabel}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {formatDocumentDate(document.date)}
                          </span>
                        </div>

                        <h5 className="mt-4 text-lg font-black leading-tight text-slate-900 sm:text-xl">
                          {document.title}
                        </h5>

                        {document.description ? (
                          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 sm:text-[15px]">
                            {document.description}
                          </p>
                        ) : null}

                        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${documentUrl ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"}`}>
                            {documentUrl ? "Document disponibil" : "Fără atașament"}
                          </span>

                          {documentUrl ? (
                            <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                              <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Vezi documentul
                              </a>
                            </Button>
                          ) : (
                            <Button type="button" disabled variant="outline" className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">
                              Document indisponibil
                            </Button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 px-6 py-12 text-center">
            <p className="text-lg font-black text-slate-900">
              Nu există documente disponibile pentru această selecție.
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              Selectați alt an sau alt tip de document.
            </p>
            </div>
        )}
      </div>

      {isAdmin ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_-32px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrare documente
            </span>
            <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Gestionare activitate Consiliul Local
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              Adăugați, actualizați și publicați documentele direct din panoul paginii.
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Titlu document
                </label>
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-12 rounded-2xl border-slate-200" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Tip document
                </label>
                <Select value={form.type} onValueChange={(value: CouncilActivityType) => setForm((current) => ({ ...current, type: value }))}>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ACTIVITY_TYPE_META[type].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  An
                </label>
                <Select value={form.year} onValueChange={(value) => setForm((current) => ({ ...current, year: value }))}>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Data
                </label>
                <Input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-12 rounded-2xl border-slate-200" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Fișier
                </label>
                <label className="flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {selectedFile ? selectedFile.name : editingDocumentId ? "Înlocuiește fișierul" : "Selectează documentul"}
                  <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                Descriere
              </label>
              <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Detalii scurte despre document sau ședință." className="min-h-[120px] rounded-[1.5rem] border-slate-200" />
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <Checkbox checked={form.isPublished} onCheckedChange={(checked) => setForm((current) => ({ ...current, isPublished: checked === true }))} />
                Publică documentul imediat
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                {editingDocumentId ? (
                  <Button type="button" variant="ghost" className="h-11 rounded-xl px-5 font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900" onClick={handleCancelEdit}>
                    Renunță
                  </Button>
                ) : null}
                <Button type="submit" disabled={isSaving} className="h-11 rounded-xl bg-blue-600 px-5 font-semibold hover:bg-blue-700">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingDocumentId ? "Actualizează documentul" : "Adaugă documentul"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-lg font-black text-slate-900">Documente administrate</h4>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                {isAdminLoading ? "Se încarcă..." : `${adminDocuments.length} înregistrări`}
              </span>
            </div>

            {isAdminLoading ? (
              <div className="flex min-h-[120px] items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              </div>
            ) : adminDocuments.length > 0 ? (
              <div className="space-y-3">
                {adminDocuments.map((document) => {
                  const documentUrl = withApiBase(document.fileUrl);

                  return (
                    <article key={document.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/60 p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${ACTIVITY_TYPE_META[document.type].badgeClassName}`}>
                              {ACTIVITY_TYPE_META[document.type].shortLabel}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              {document.year} • {formatDocumentDate(document.date)}
                            </span>
                            <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${document.isPublished ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                              {document.isPublished ? "Publicat" : "Ascuns"}
                            </span>
                          </div>
                          <h5 className="text-base font-black text-slate-900">{document.title}</h5>
                          {document.description ? (
                            <p className="text-sm font-medium leading-relaxed text-slate-600">
                              {document.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button type="button" variant="outline" className="h-10 rounded-xl border-slate-200 font-semibold" onClick={() => handleEdit(document)}>
                            <PencilLine className="mr-2 h-4 w-4" />
                            Editează
                          </Button>
                          <Button type="button" variant="outline" className="h-10 rounded-xl border-slate-200 font-semibold" onClick={() => handleTogglePublished(document)}>
                            {document.isPublished ? "Ascunde" : "Publică"}
                          </Button>
                          {documentUrl ? (
                            <Button asChild type="button" variant="outline" className="h-10 rounded-xl border-slate-200 font-semibold">
                              <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Deschide
                              </a>
                            </Button>
                          ) : null}
                          <Button type="button" variant="outline" className="h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(document)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Șterge
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-slate-600">
                  Nu există înregistrări administrative pentru filtrul curent.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default CouncilActivitySection;
