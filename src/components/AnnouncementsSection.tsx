import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ArrowRight, 
  Megaphone,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/documents?category=anunturi');
        if (!response.ok) throw new Error("Eroare preluare date");
        const data = await response.json();
        setAnnouncements(data.slice(0, 3));
      } catch (error) {
        console.error("Eroare:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg"><Megaphone className="w-5 h-5 text-blue-600" /></div>
              <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Informații Utile</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Ultimele <span className="text-blue-700 underline decoration-blue-100 underline-offset-8">Anunțuri</span>
            </h2>
          </div>
          <Link to="/anunturi">
            <Button variant="outline" className="group border-slate-200 hover:border-blue-600 px-6 py-6 rounded-2xl transition-all">
              Toate anunțurile <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {announcements.map((announcement) => (
              <Link 
                key={announcement.id} 
                to="/anunturi" 
                className="group flex flex-col bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{announcement.category}</Badge>
                  <div className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase">{new Date(announcement.createdAt).toLocaleDateString('ro-RO')}</span></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">{announcement.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">{announcement.content}</p>
                <div className="flex items-center text-blue-700 font-black text-[10px] uppercase tracking-[0.2em] pt-6 border-t border-slate-200/60 mt-auto group-hover:gap-2 transition-all">Vezi Detalii <ChevronRight className="w-4 h-4" /></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;