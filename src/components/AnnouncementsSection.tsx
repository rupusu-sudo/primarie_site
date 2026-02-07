import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Bell, Loader2, FileText } from "lucide-react";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        // Interogăm tabelul creat prin SQL
        const { data, error } = await supabase
          .from('official_announcements')
          .select('*')
          .order('created_at', { ascending: false }) // Cel mai nou la cel mai vechi
          .limit(3); // Doar primele 3

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (err) {
        console.error("Eroare fetch anunțuri:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="w-full">
      {/* Header Secțiune */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            <span className="text-blue-700 font-black uppercase text-[10px] tracking-[0.3em]">Avizierul Comunei</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Ultimele <span className="text-blue-700">Anunțuri</span> & Noutăți
          </h2>
        </div>
        <Link to="/anunturi">
          <Button variant="outline" className="group border-slate-200 hover:bg-blue-700 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest px-6 h-12 transition-all shadow-sm">
            Vezi Toate Anunțurile <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stare Încărcare */}
      {loading ? (
        <div className="flex justify-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {announcements.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <Badge className="bg-blue-50 text-blue-700 border-none font-black uppercase text-[9px] px-3 py-1 tracking-widest">
                  {item.category?.replace(/-/g, ' ')}
                </Badge>
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString('ro-RO')}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 uppercase leading-tight mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3 italic opacity-80">
                {item.description || "Consultați documentul oficial pentru detalii."}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <Link to="/anunturi" className="flex items-center gap-2 text-blue-700 font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                  Citește mai mult <ArrowRight className="w-4 h-4" />
                </Link>
                <FileText className="w-4 h-4 text-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Stare Golește Arhiva */
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Momentan nu există anunțuri recente în bază de date</p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsSection;