import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  url: string;
  className?: string;
  onClose?: () => void; 
}

const PDFViewer = ({ url, className = "", onClose }: PDFViewerProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fix URL pentru Google Viewer
  const fullUrl = url.startsWith('http') 
    ? url 
    : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;

  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;

  // --- VARIANTA MOBIL (Full Screen + Buton X Plutitor Jos) ---
  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] bg-slate-900/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
        
        {/* DOCUMENTUL - Ocupă tot ecranul */}
        <div className="flex-1 relative w-full h-full overflow-hidden bg-white shadow-2xl">
          {loadingMobile && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 gap-2 bg-slate-50">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
               <p className="text-xs font-bold uppercase tracking-widest">Se deschide...</p>
             </div>
          )}
          <iframe
            src={googleViewerUrl}
            className="w-full h-full border-none bg-white"
            title="Vizualizare Document"
            onLoad={() => setLoadingMobile(false)}
          />
        </div>

        {/* BUTONUL X PLUTITOR - JOS CENTRAT */}
        {/* Acesta stă peste document, jos, ușor de apăsat */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
          <Button 
            onClick={onClose}
            className="pointer-events-auto rounded-full w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-2 border-white/20 active:scale-95 transition-all flex items-center justify-center"
          >
            <X className="w-7 h-7" />
            <span className="sr-only">Închide</span>
          </Button>
        </div>

      </div>,
      document.body
    );
  }

  // --- VARIANTA DESKTOP (Standard) ---
  return (
    <div className={`relative w-full h-full bg-slate-100 flex flex-col ${className}`}>
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full block flex-1 rounded-md"
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
          <FileText className="w-16 h-16 mb-4 opacity-50" />
          <p className="mb-4 text-sm font-medium">Previzualizare indisponibilă.</p>
          <a href={url} target="_blank" rel="noreferrer">
            <Button variant="outline">Descarcă documentul</Button>
          </a>
        </div>
      </object>
    </div>
  );
};

export default PDFViewer;