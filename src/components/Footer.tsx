import { Link } from "react-router-dom";
import { 
  Building2, MapPin, Phone, Mail, Clock, Facebook, 
  ChevronRight, ShieldCheck, FileText, ScrollText, ExternalLink 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1425] text-slate-300 font-sans border-t-4 border-blue-700">
      {/* --- SECȚIUNEA PRINCIPALĂ --- */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. IDENTITATE INSTITUȚIONALĂ */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-700/10 rounded-xl flex items-center justify-center border border-blue-700/20 group-hover:bg-blue-700 transition-all duration-300">
                <Building2 className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white leading-tight uppercase tracking-tighter">Primăria Almăj</h3>
                <p className="text-[10px] text-blue-500 uppercase tracking-[0.2em] font-bold">Județul Dolj</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Portalul oficial al administrației publice locale. Angajați în transparență, eficiență și modernizarea serviciilor pentru cetățeni.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-lg hover:bg-blue-700 hover:text-white transition-all shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. SERVICII ȘI NAVIGARE */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Navigare Rapidă
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/servicii" className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 text-blue-700 group-hover:translate-x-1 transition-transform" /> Portal Servicii
                </Link>
              </li>
              <li>
                <Link to="/anunturi" className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 text-blue-700 group-hover:translate-x-1 transition-transform" /> Anunțuri Publice
                </Link>
              </li>
              <li>
                <Link to="/cariere" className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 text-blue-700 group-hover:translate-x-1 transition-transform" /> Cariere & Concursuri
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 text-blue-700 group-hover:translate-x-1 transition-transform" /> Audiențe & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. TRANSPARENȚĂ ȘI EXTERNE */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Transparență
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/monitorul-oficial" className="text-blue-500 hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Monitorul Oficial Local
                </Link>
              </li>
              <li>
                <Link to="/transparenta/hcl" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-slate-500" /> Hotărâri Consiliu
                </Link>
              </li>
              <li className="pt-2">
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Legături Utile</p>
                 <div className="space-y-2">
                    <a href="https://dj.prefectura.mai.gov.ro/" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Prefectura Dolj
                    </a>
                    <a href="https://www.cjdolj.ro/" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Consiliul Județean Dolj
                    </a>
                 </div>
              </li>
            </ul>
          </div>

          {/* 4. CONTACT & PROGRAM (STIL CARTE DE VIZITĂ) */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5">
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-6">Informații Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">Str. Principală, Nr. 1, Comuna Almăj, Jud. Dolj</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <a href="tel:0251448201" className="hover:text-white transition-colors font-bold tracking-tight">0251 449 234</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <a href="mailto:primariaalmaj@gmail.com" className="hover:text-white transition-colors text-xs font-bold truncate">
                  primariaalmaj@gmail.com
                </a>
              </li>
              <li className="pt-4 border-t border-white/5 mt-4">
                <div className="flex items-start gap-3">
                   <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                   <div className="text-[11px] uppercase font-black tracking-wider">
                     <p className="text-white mb-1">Program cu publicul</p>
                     <p className="text-slate-500">L-J: 08:00 - 16:30</p>
                     <p className="text-slate-500">V: 08:00 - 14:00</p>
                   </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- COPYRIGHT & LEGAL (BARA DE JOS) --- */}
      <div className="bg-[#070e1a] py-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                &copy; {currentYear} Instituția Primarului Comunei Almăj. Toate drepturile rezervate.
              </p>
            </div>

            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
              <Link to="/termeni" className="text-slate-500 hover:text-blue-500 transition-colors">Termeni</Link>
              <Link to="/confidentialitate" className="text-slate-500 hover:text-blue-500 transition-colors">GDPR</Link>
              <a href="https://anpc.ro" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-500 transition-colors">ANPC</a>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-lg border border-white/5">
               <span className="text-[10px] text-slate-500 font-bold uppercase">Design:</span>
               <span className="text-[10px] text-blue-500 font-black tracking-widest uppercase">ruppz</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;