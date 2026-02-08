import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Download, 
  Calendar, 
  AlertCircle, 
  FileText, 
  Megaphone, 
  Info, 
  RefreshCw, 
  Search,
  Filter,
  Bell
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Types ---
interface Announcement {
  id: number;
  title: string;
  content: string;
  category: 'General' | 'Urgent' | 'Informativ' | 'Cultura';
  fileUrl?: string;
  createdAt: string; 
}

type SortOption = 'newest' | 'oldest' | 'urgent';

// --- Custom Hook: Smart Polling ---
const useSmartPolling = (callback: () => Promise<void>, intervalMs: number = 30000) => {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    const tick = () => { if (document.visibilityState === 'visible') savedCallback.current(); };
    tick();
    const id = setInterval(tick, intervalMs);
    const handleVisibilityChange = () => { if (document.visibilityState === 'visible') savedCallback.current(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", handleVisibilityChange); };
  }, [intervalMs]);
};

// --- Componentă UI: Badge Categorie ---
const CategoryBadge = ({ category }: { category: Announcement['category'] }) => {
  const styles = {
    Urgent: "bg-red-50 text-red-700 border-red-200 ring-red-500/20",
    General: "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20",
    Informativ: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
    Cultura: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
  };

  const icons = {
    Urgent: <AlertCircle className="w-3 h-3 mr-1.5" />,
    General: <FileText className="w-3 h-3 mr-1.5" />,
    Informativ: <Info className="w-3 h-3 mr-1.5" />,
    Cultura: <Megaphone className="w-3 h-3 mr-1.5" />,
  };

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ring-1 ring-inset transition-all",
      styles[category] || styles.General
    )}>
      {icons[category] || icons.General}
      {category}
    </div>
  );
};

// --- Componentă: Card Modern ---
const AnnouncementCard = ({ item }: { item: Announcement }) => {
  const isUrgent = item.category === 'Urgent';
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ro-RO', { 
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateString));
  };

  return (
    <div className={cn(
      "group relative flex flex-col p-6 bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-xl hover:border-blue-200/50",
      isUrgent ? "border-red-100 shadow-red-50" : "border-white/60 shadow-slate-200/50"
    )}>
      {isUrgent && (
        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-red-500/80" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <CategoryBadge category={item.category} />
        <div className="flex items-center text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-md">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
        {item.title}
      </h3>
      
      <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-6 flex-grow font-medium">
        {item.content}
      </div>

      {item.fileUrl && (
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "font-bold text-xs uppercase tracking-wide transition-all rounded-xl",
              isUrgent 
                ? "text-red-700 hover:text-red-800 hover:bg-red-50" 
                : "text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            )}
            asChild
          >
            <a href={item.fileUrl} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4 mr-2" />
              Descarcă Document
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

// --- Componentă: Skeleton Loader ---
const CardSkeleton = () => (
  <div className="p-6 bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-sm animate-pulse h-[240px] flex flex-col justify-between">
    <div className="flex justify-between">
      <div className="h-6 w-24 bg-slate-200 rounded-full" />
      <div className="h-5 w-32 bg-slate-100 rounded-md" />
    </div>
    <div className="space-y-3 mt-4">
      <div className="h-6 w-3/4 bg-slate-200 rounded" />
      <div className="h-4 w-full bg-slate-100 rounded" />
      <div className="h-4 w-5/6 bg-slate-100 rounded" />
    </div>
    <div className="h-8 w-32 bg-slate-100 rounded-xl self-end mt-4" />
  </div>
);

// --- MAIN PAGE ---
export default function Anunturi() {
  const [data, setData] = useState<Announcement[]>([]);
  const [filteredData, setFilteredData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch('/api/announcements'); 
      if (!response.ok) throw new Error('Eroare conexiune');
      const jsonData = await response.json();
      
      setData(prev => {
        const isSame = JSON.stringify(prev) === JSON.stringify(jsonData);
        return isSame ? prev : jsonData;
      });
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (data.length === 0) setError("Nu s-au putut încărca datele.");
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  useSmartPolling(fetchAnnouncements, 30000);

  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortOption === 'urgent') {
        if (a.category === 'Urgent' && b.category !== 'Urgent') return -1;
        if (a.category !== 'Urgent' && b.category === 'Urgent') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredData(result);
  }, [data, searchTerm, sortOption]);

  return (
    <PageLayout
      title="" // Lăsăm gol aici pentru că folosim un header custom mai jos
      breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Anunțuri Oficiale" }]}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* --- HEADER SECȚIUNE (NOU) --- */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Badge Instituțional */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 backdrop-blur-sm px-3 py-1 text-xs font-bold text-blue-800 uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Avizier Oficial
            </div>
            
            {/* Titlu Mare cu Gradient */}
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                Anunțuri <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Comunitare</span>
            </h1>

            {/* Subtitlu */}
            <p className="text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
                Rămâneți conectați cu administrația locală. Aici găsiți hotărâri, înștiințări de interes public și comunicate oficiale, actualizate în timp real.
            </p>
        </div>

        {/* --- TOOLBAR: Status + Filtre --- */}
        <div className="sticky top-20 z-20 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="bg-slate-50 p-2 rounded-full border border-slate-200 text-slate-500">
                    <Bell className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Status Sistem
                    </span>
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        {loading ? (
                            'Se caută actualizări...'
                        ) : error ? (
                             <span className="text-red-600">Offline</span>
                        ) : (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>
                                Sincronizat: {lastUpdated.toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                            </>
                        )}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Caută anunțuri..." 
                        className="pl-9 bg-white/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <Select value={sortOption} onValueChange={(val: SortOption) => setSortOption(val)}>
                    <SelectTrigger className="w-[180px] bg-white/50 border-slate-200 rounded-xl">
                        <Filter className="w-4 h-4 mr-2 text-slate-500" />
                        <SelectValue placeholder="Sortează" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Cele mai noi</SelectItem>
                        <SelectItem value="oldest">Cele mai vechi</SelectItem>
                        <SelectItem value="urgent" className="text-red-600 font-medium">Prioritate Urgente</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* --- GRID ANUNȚURI --- */}
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="w-4 h-4" /> {error}
              </span>
              <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchAnnouncements(); }} className="h-8 border-red-200 hover:bg-red-100 text-red-700 bg-white">
                 <RefreshCw className="w-3 h-3 mr-2" /> Reîncearcă
              </Button>
            </div>
          )}

          {loading && data.length === 0 ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : filteredData.length > 0 ? (
            filteredData.map((anunt) => (
              <AnnouncementCard key={anunt.id} item={anunt} />
            ))
          ) : (
            !error && (
              <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur rounded-2xl border border-dashed border-slate-300">
                <div className="bg-slate-50 p-4 rounded-full mb-4 border border-slate-100">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Nu am găsit anunțuri</h3>
                <p className="text-slate-500 text-sm mt-1">Încearcă să modifici termenii căutării.</p>
                {searchTerm && (
                    <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2 text-blue-600">
                        Șterge filtrele
                    </Button>
                )}
              </div>
            )
          )}
        </div>

      </div>
    </PageLayout>
  );
}