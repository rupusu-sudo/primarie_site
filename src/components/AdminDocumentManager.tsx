import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, Trash2, Plus, ShieldCheck, UploadCloud, 
  CalendarClock, Eye, FileCheck, Loader2, Search
} from "lucide-react";
import { toast } from "sonner";
import PDFViewer from "@/components/PDFViewer"; 
import { API_URL } from "@/config/api";

// Tipul documentului conform noii baze de date
type Document = {
  id: number;
  title: string;
  category: string;
  content: string;
  fileUrl: string;
  year: number;
  createdAt: string;
};

interface AdminDocumentManagerProps {
  categoryKey: string;
  title: string;
  icon?: any;
  enableYearFilter?: boolean;
  customCategories?: string[];
  retentionYears?: number; 
}

const AdminDocumentManager = ({ categoryKey, title, icon: Icon = FileText, enableYearFilter = true, customCategories }: AdminDocumentManagerProps) => {
  const { user, token } = useAuth(); // Luăm userul și token-ul din contextul nou
  const location = useLocation();

  // Verificare simplă - în noul sistem rolul e direct pe user
  const isAdmin = user?.role === 'ADMIN';

  const routeCategoryMap: Record<string, string[]> = {
    "/anunturi": ["Anunț Public", "Urgent", "Informații"],
    "/monitorul-oficial/declaratii": ["Avere", "Interese", "Anuale"],
    "/transparenta/hcl": ["Hotărâri Consiliu", "Proiecte", "Arhivă"],
  };

  const categories = useMemo(() => 
    customCategories || routeCategoryMap[location.pathname] || ["Oficial", "General"], 
  [location.pathname, customCategories]);

  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", type: categories[0], desc: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState<string>("all");

  // --- FETCH DATE DE LA SERVER ---
  const fetchDocs = async () => {
    try {
      setLoading(true);
      const url = new URL(`${API_URL}/api/documents`);
      url.searchParams.append('category', categoryKey);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Eroare la încărcare');
      
      const data = await response.json();
      setDocs(data);
    } catch (e: any) {
      console.error(e);
      // toast.error("Nu s-au putut încărca documentele.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, [categoryKey]);

  const availableYears = useMemo(() => {
    const years = new Set(docs.map(doc => doc.year.toString()));
    return Array.from(years).sort().reverse();
  }, [docs]);

  const displayedDocs = useMemo(() => {
    return docs.filter(doc => {
      const year = doc.year.toString();
      const matchesYear = filterYear === "all" || year === filterYear;
      const matchesName = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesYear && matchesName;
    });
  }, [docs, filterYear, searchTerm]);

  // --- ADĂUGARE DOCUMENT (UPLOAD LOCAL) ---
  const handleAdd = async () => {
    if (!isAdmin) { 
        toast.error("Nu aveți drepturi de administrator!"); 
        return; 
    }

    if (!form.title || !file) { toast.error("Completează titlul și alege fișierul."); return; }
    
    setIsUploading(true);
    try {
      // Folosim FormData pentru a trimite fișierul către server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', form.title);
      formData.append('category', categoryKey);
      formData.append('content', form.desc || form.type); // Folosim 'content' ca descriere/categorie secundară
      formData.append('year', new Date().getFullYear().toString());

      const response = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Trimitem token-ul pentru verificare Admin
        },
        body: formData // Nu punem Content-Type, browserul îl pune automat pt FormData
      });

      if (!response.ok) throw new Error('Eroare la upload');

      toast.success("Publicat cu succes!");
      setForm({ title: "", type: categories[0], desc: "" });
      setFile(null);
      fetchDocs();
    } catch (e: any) { 
        toast.error("Eroare la publicare: " + e.message); 
    } finally { 
        setIsUploading(false); 
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!isAdmin) return;
    if (!confirm("Ștergeți definitiv documentul?")) return;

    try {
      const response = await fetch(`${API_URL}/api/documents/${doc.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Eroare la ștergere');

      toast.success("Eliminat.");
      fetchDocs();
    } catch (e) { toast.error("Eroare la ștergere."); }
  };

  return (
    <div className="space-y-8">
      {/* PANOU ADMINISTRARE */}
      {isAdmin && (
        <Card className="border-slate-200 shadow-xl bg-white rounded-xl overflow-hidden border-t-4 border-t-blue-700">
          <CardHeader className="bg-blue-50/30 border-b border-slate-100 py-4 px-6">
            <div className="flex items-center gap-2 text-blue-800">
              <ShieldCheck className="w-5 h-5" />
              <CardTitle className="text-sm font-bold uppercase tracking-tight">Panou Administrare Monitor Oficial</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titlu Document</label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="h-11 border-slate-200" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tip / Categorie</label>
                <Select onValueChange={v => setForm({...form, type: v})} value={form.type}>
                  <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center justify-center h-11 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/10 hover:bg-blue-50 cursor-pointer transition-all">
                  <UploadCloud className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-[10px] font-black text-blue-800 uppercase">{file ? file.name : "Selectează PDF"}</span>
                  <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf" />
                </label>
              </div>
            </div>
            <Textarea placeholder="Descriere suplimentară (opțional)..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="h-20 border-slate-200" />
            <Button onClick={handleAdd} disabled={isUploading} className="w-full bg-blue-700 h-12 font-black uppercase text-[10px] tracking-widest">
              {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />} Posteaza document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FILTRE */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Caută în arhivă..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 border-slate-200" />
        </div>
        {enableYearFilter && availableYears.length > 0 && (
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Button 
              variant={filterYear === "all" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setFilterYear("all")}
              className={`h-8 text-[10px] font-bold px-4 ${filterYear === "all" ? "bg-white shadow-sm" : ""}`}
            >
              Toți
            </Button>
            {availableYears.map(year => (
              <Button 
                key={year} 
                variant={filterYear === year ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilterYear(year)}
                className={`h-8 text-[10px] font-bold px-4 ${filterYear === year ? "bg-white shadow-sm" : ""}`}
              >
                {year}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* LISTA DOCUMENTELOR */}
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-400 font-black uppercase text-[10px] tracking-widest">Sincronizare cu serverul...</div>
        ) : displayedDocs.length > 0 ? (
          displayedDocs.map(doc => (
            <div key={doc.id} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-sm hover:border-blue-400 transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-2">{doc.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" /> {new Date(doc.createdAt).toLocaleDateString('ro-RO')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setViewDoc(doc)} variant="ghost" className="text-blue-700 font-black text-[10px] uppercase px-5 h-9">
                  <Eye className="w-4 h-4 mr-2" /> Vezi
                </Button>
                
                {isAdmin && (
                  <Button onClick={() => handleDelete(doc)} variant="ghost" size="icon" className="text-slate-200 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100 uppercase text-[10px] font-bold tracking-widest italic">Arhiva este goală</div>
        )}
      </div>

      <Dialog open={!!viewDoc} onOpenChange={() => setViewDoc(null)}>
        <DialogContent
          className="max-w-[1000px] w-[95vw] h-[92vh] p-0 bg-white flex flex-col rounded-xl overflow-hidden border-none shadow-2xl"
          aria-describedby={undefined}
        >
          {viewDoc && (
            <>
              <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-white shrink-0">
                <div className="bg-blue-700 p-2.5 rounded-lg mr-4">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 pr-10">
                  <DialogTitle className="text-sm font-black uppercase text-slate-800 truncate">
                    {viewDoc.title}
                  </DialogTitle>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    Document Oficial • {new Date(viewDoc.createdAt).toLocaleString('ro-RO')}
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 flex justify-center overflow-hidden relative">
                <PDFViewer 
                  url={viewDoc.fileUrl} 
                  className="w-full h-full border-none" 
                  onClose={() => setViewDoc(null)} 
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocumentManager;
