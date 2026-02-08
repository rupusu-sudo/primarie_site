import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Download, Calendar, AlertCircle, FileText, Megaphone, 
  Search, Filter, Eye, X, RefreshCw
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  fileUrl?: string | null;
  createdAt: string;
}

type SortOption = 'newest' | 'oldest' | 'urgent';

const useIdlePolling = (callback: () => Promise<void>, intervalMs: number = 15000, idleThresholdMs: number = 5000) => {
  const savedCallback = useRef(callback);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    const resetActivity = () => { lastActivityRef.current = Date.now(); };
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, resetActivity));

    const id = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible' && (now - lastActivityRef.current > idleThresholdMs)) {
        savedCallback.current();
      }
    }, intervalMs);

    return () => {
      clearInterval(id);
      events.forEach(event => window.removeEventListener(event, resetActivity));
    };
  }, [intervalMs, idleThresholdMs]);
};

const FeedCard = ({ item }: { item: Announcement }) => {
    if (!item) return null;

    const isUrgent = item.category === 'Urgent';
    const Icon = isUrgent ? AlertCircle : item.category === 'Cultura' ? Megaphone : FileText;
    const badgeColor = isUrgent ? "bg-red-50 text-red-700 border-red-100" : "bg-blue-50 text-blue-700 border-blue-100";
    
    const fullUrl = item.fileUrl ? (item.fileUrl.startsWith('http') ? item.fileUrl : `http://localhost:3001${item.fileUrl}`) : null;

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return "";
            return new Date(dateString).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return "Dată invalidă";
        }
    };

    return (
        <div className={cn(
            "relative bg-white p-5 rounded-2xl border transition-all hover:border-blue-300 shadow-sm",
            isUrgent ? "border-l-4 border-l-red-500 border-y-slate-100 border-r-slate-100" : "border-slate-100"
        )}>
            <div className="flex items-center justify-between mb-3">
                <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5", badgeColor)}>
                    <Icon className="w-3 h-3" />
                    {item.category || "General"}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{item.title || "Fără Titlu"}</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-4">{item.content || "Fără conținut"}</p>

            {fullUrl && (
                <div className="flex gap-2 pt-2 border-t border-slate-50 mt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 hover:text-blue-700 bg-white">
                        <a href={fullUrl} target="_blank" rel="noreferrer"><Eye className="w-4 h-4 mr-2" /> Vizualizează</a>
                    </Button>
                    <Button asChild size="sm" className="flex-1 h-9 rounded-lg bg-slate-900 text-white hover:bg-blue-600 border-0">
                        <a href={fullUrl} download><Download className="w-4 h-4 mr-2" /> Descarcă</a>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default function Anunturi() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const [data, setData] = useState<Announcement[]>([]);
  const [filteredData, setFilteredData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/announcements');
      if (!response.ok) throw new Error("Network error");
      const jsonData = await response.json();
      
      if (Array.isArray(jsonData)) {
        setData(prev => (JSON.stringify(prev) !== JSON.stringify(jsonData) ? jsonData : prev));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchAnnouncements(); 
  }, [fetchAnnouncements]);
  
  useIdlePolling(fetchAnnouncements, 5000, 3000);

  useEffect(() => {
    if (!data) return;
    let result = [...data];
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(lower)) ||
        (item.content && item.content.toLowerCase().includes(lower))
      );
    }
    
    result.sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return sortOption === 'newest' ? tB - tA : tA - tB;
    });
    
    setFilteredData(result);
  }, [data, searchTerm, sortOption]);

  useGSAP(() => {
    if (!loading) {
        gsap.from(".anim-item", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }
  }, { scope: containerRef, dependencies: [loading] });

  return (
    <PageLayout title="" breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Avizier" }]}>
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 pb-20 pt-8 min-h-screen">
        
        <div className="mb-8 anim-item">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                Avizier Digital
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                Anunțuri oficiale actualizate în timp real din baza de date a primăriei.
            </p>
        </div>

        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md py-3 -mx-4 px-4 border-b border-slate-100 shadow-sm mb-6 anim-item">
            <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Caută..." 
                        className="pl-9 h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-base"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"><X className="w-4 h-4" /></button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Select value={sortOption} onValueChange={(val: any) => setSortOption(val)}>
                        <SelectTrigger className="h-11 w-full md:w-[160px] rounded-xl border-slate-200 bg-white">
                            <div className="flex items-center gap-2 truncate">
                                <Filter className="w-4 h-4 text-slate-500" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Cele mai noi</SelectItem>
                            <SelectItem value="oldest">Cele mai vechi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <div ref={listRef} className="space-y-4 anim-item">
            {loading && data.length === 0 ? (
                <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-500"/>
                    <span className="text-sm">Se sincronizează...</span>
                </div>
            ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                    item && item.id ? <FeedCard key={item.id} item={item} /> : null
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                    <Search className="w-12 h-12 mb-3 opacity-20" />
                    <p>Nu există anunțuri în baza de date.</p>
                </div>
            )}
        </div>

      </div>
    </PageLayout>
  );
}