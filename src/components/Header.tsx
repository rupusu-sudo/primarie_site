import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, ChevronDown, MessageSquare, Lock, LogOut, 
  Phone, Mail, Home, Landmark, 
  FileSearch, ClipboardList, Laptop, Bell, Headset,
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext"; 
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const Header = () => {
  const { user, logout } = useAuth(); 
  const isAdmin = !!user; 
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        if (scrollTop > 20 && !isScrolled) {
            setIsScrolled(true);
        } else if (scrollTop <= 20 && isScrolled) {
            setIsScrolled(false);
        }
        rafId = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
        window.removeEventListener("scroll", handleScroll);
        if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isScrolled]);

  const navLinks = [
    { name: "Acasă", href: "/", icon: <Home className="w-3.5 h-3.5" /> },
    { 
      name: "Primăria", 
      href: "/primaria",
      icon: <Landmark className="w-3.5 h-3.5" />,
      submenu: [
        { name: "Primar", href: "/primar" },
        { name: "Viceprimar", href: "/viceprimar" },
        { name: "Secretar General", href: "/secretar" },
        { name: "Consiliul Local", href: "/consiliul-local" },
        { name: "Organigramă", href: "/organigrama" },
      ]
    },
    {
      name: "Transparență",
      href: "/transparenta",
      icon: <FileSearch className="w-3.5 h-3.5" />,
      submenu: [
        { name: "Hotărâri Consiliu (HCL)", href: "/transparenta/hcl" },
        { name: "Achiziții Publice", href: "/transparenta/achizitii" },
        { name: "Buget Local", href: "/transparenta/buget" },
        { name: "Cariere Publice", href: "/transparenta/cariere" },
        { name: "Contracte", href: "/transparenta/contracte" },
      ]
    },
    { 
      name: "Monitor Oficial", 
      href: "/monitorul-oficial",
      icon: <ClipboardList className="w-3.5 h-3.5" />,
      submenu: [
        { name: "Regulamente", href: "/monitorul-oficial/regulamente" },
        { name: "Declarații Avere", href: "/monitorul-oficial/declaratii" },
        { name: "Dispoziții Primar", href: "/monitorul-oficial/dispozitii" },
        { name: "Statutul Comunei", href: "/monitorul-oficial/statut" },
        { name: "Alte Documente", href: "/monitorul-oficial/alte-documente" },
      ]
    },
    { name: "Dezvoltare", href: "/oportunitati", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { name: "Anunțuri", href: "/anunturi", icon: <Bell className="w-3.5 h-3.5" /> },
    { name: "Portal Servicii", href: "/servicii", icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      {/* 1. TOP BAR */}
      <div 
        className={`hidden lg:block bg-slate-50 border-b border-slate-200 py-1.5 px-4 z-[60] relative transform-gpu transition-transform duration-300 ease-in-out ${
            isScrolled ? '-translate-y-full absolute w-full top-0' : 'translate-y-0 relative'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:0251449234" className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm hover:border-blue-400 transition-colors group">
              <Phone className="w-3 h-3 text-blue-700 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">0251 449 234</span>
            </a>
            <a href="mailto:primariaalmaj@gmail.com" className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm hover:border-blue-400 transition-colors group">
              <Mail className="w-3 h-3 text-blue-700 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Email Primărie</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-wider hover:border-blue-600 hover:text-blue-700 transition-colors shadow-sm">
              <Headset className="w-3 h-3 text-blue-700" /> Contact
            </Link>

            <div className="w-px h-4 bg-slate-200 mx-1" />

            {isAdmin ? (
              <button onClick={logout} className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-4 py-1 rounded-full text-[10px] font-black text-red-600 uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors shadow-sm">
                <LogOut className="w-3 h-3" /> Ieșire Panel
              </button>
            ) : (
              // REDIRECȚIONARE CĂTRE PAGINA DEDICATĂ
              <Link to="/login-admin" className="flex items-center gap-1.5 bg-blue-800 px-4 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider hover:bg-slate-900 transition-colors shadow-md active:scale-95">
                <Lock className="w-3 h-3" /> Autentificare
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header 
        className={`sticky top-0 left-0 right-0 z-50 transform-gpu backface-invisible will-change-transform transition-[padding,background-color,box-shadow] duration-300 ease-out ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-lg py-2 border-b border-slate-100" 
            : "bg-white py-5 border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <img 
              src="/flavicon.png" 
              alt="Stema" 
              className={`transition-all duration-300 origin-left ${isScrolled ? "h-9 scale-95" : "h-12 scale-100"}`} 
            />
            <div className="flex flex-col">
              <h1 className={`font-black text-slate-900 leading-none tracking-tighter uppercase transition-all duration-300 origin-left ${isScrolled ? "text-base scale-95" : "text-xl scale-100"}`}>
                Primăria <span className="text-blue-700">Almăj</span>
              </h1>
              <span className={`text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1 transition-all duration-300 ${isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"}`}>
                Administrație Publică
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              link.submenu ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-[11px] font-black text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors uppercase tracking-tight outline-none group">
                    <span className="text-blue-700 opacity-80 group-hover:opacity-100">{link.icon}</span>
                    {link.name} <ChevronDown className="w-3 h-3 opacity-30 group-hover:rotate-180 transition-transform duration-300" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-64 p-3 border-slate-100 rounded-2xl shadow-2xl">
                    {link.submenu.map((sub) => (
                      <DropdownMenuItem key={sub.name} asChild>
                        <Link to={sub.href} className="cursor-pointer font-bold text-slate-600 focus:text-blue-800 focus:bg-blue-50 py-2.5 rounded-xl text-xs transition-colors">
                          {sub.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-tight transition-colors rounded-lg ${
                    location.pathname === link.href ? "text-blue-800 bg-blue-50" : "text-slate-700 hover:text-blue-800 hover:bg-blue-50"
                  }`}
                >
                  <span className={location.pathname === link.href ? "text-blue-800" : "text-blue-700 opacity-80 group-hover:opacity-100"}>{link.icon}</span>
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/vocea-almajului" className="hidden lg:block">
              <Button size="sm" className="bg-slate-900 hover:bg-blue-800 text-white font-black text-[10px] uppercase tracking-widest px-6 h-10 rounded-xl transition-all shadow-xl">
                <MessageSquare className="w-4 h-4 mr-2" /> Vocea Almăjului
              </Button>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="xl:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 hover:bg-blue-50">
                  <Menu className="w-6 h-6 text-slate-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0 border-none shadow-2xl flex flex-col h-full bg-white z-[100]">
                <div className="bg-blue-800 p-6 text-white shrink-0 min-h-[140px] flex flex-col justify-end">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Meniul Comunei</h2>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Instituția Primarului Almăj</p>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <div key={link.name}>
                      {link.submenu ? (
                        <Accordion type="single" collapsible className="w-full">
                           <AccordionItem value={`item-${index}`} className="border-none">
                             <AccordionTrigger className="py-3 text-base font-black uppercase text-slate-800 hover:text-blue-800 px-2 rounded-lg data-[state=open]:bg-blue-50">
                                <div className="flex items-center gap-3">{link.icon} <span>{link.name}</span></div>
                             </AccordionTrigger>
                             <AccordionContent className="pb-0 pt-1 px-2">
                                <div className="flex flex-col border-l-2 border-blue-100 ml-3 pl-4 py-2 gap-2">
                                  {link.submenu.map(sub => (
                                    <Link key={sub.name} to={sub.href} onClick={() => setIsOpen(false)} className="py-2 text-sm font-bold text-slate-600 hover:text-blue-700">
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                             </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                      ) : (
                        <Link to={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-3 px-2 text-base font-black uppercase text-slate-800 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                          {link.icon} <span>{link.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;