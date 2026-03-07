import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, Search, MessageSquare, Phone, Lock, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext"; // <--- IMPORT CONTEXT AUTH
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const { user, logout } = useAuth(); // <--- Verificăm dacă ești Admin
  const isAdmin = !!user;
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Acasă", href: "/" },
    { 
      name: "Primăria", 
      href: "/primaria",
      submenu: [
        { name: "Primar", href: "/primar" },
        { name: "Viceprimar", href: "/viceprimar" },
        { name: "Secretar General", href: "/secretar" },
        { name: "Consiliul Local", href: "/consiliul-local" },
        { name: "Organigramă", href: "/organigrama" },
      ]
    },
    { 
      name: "Monitor Oficial", 
      href: "/monitorul-oficial",
      submenu: [
        { name: "Statutul Comunei", href: "/monitorul-oficial/statut" },
        { name: "Regulamente", href: "/monitorul-oficial/regulamente" },
        { name: "Transparență (HCL)", href: "/transparenta" },
        { name: "Dispoziții Primar", href: "/dispozitii" },
        { name: "Buget Local", href: "/monitorul-oficial/buget" },
        { name: "Alte Documente", href: "/monitorul-oficial/alte-documente" },
      ]
    },
    { name: "Servicii", href: "/servicii" },
    { name: "Comuna", href: "/istoric", submenu: [{ name: "Istoric", href: "/istoric" }, { name: "Cultură", href: "/cultura" }] },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-slate-200" : "bg-white py-3 border-transparent shadow-sm"}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/RO_Judetul_Dolj_COA.svg/800px-RO_Judetul_Dolj_COA.svg.png" alt="Stema" className={`transition-all duration-300 object-contain ${isScrolled ? "h-10" : "h-12"}`} />
          <div className="leading-tight">
            <h1 className={`font-bold text-slate-900 transition-all ${isScrolled ? "text-lg" : "text-xl"}`}>Primăria Almăj</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Județul Dolj</p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            link.submenu ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 outline-none transition-colors rounded-md hover:bg-slate-50">
                  {link.name} <ChevronDown className="w-4 h-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 animate-in fade-in zoom-in-95 duration-200">
                  {link.submenu.map((sub) => (
                    <DropdownMenuItem key={sub.name} asChild>
                      <Link to={sub.href} className="cursor-pointer font-medium text-slate-700 focus:text-blue-600 focus:bg-blue-50 py-2">{sub.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link key={link.name} to={link.href} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === link.href ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"}`}>{link.name}</Link>
            )
          ))}
        </nav>

        {/* ACTIONS & LOGIN */}
        <div className="flex items-center gap-2">
          
          <div className="hidden lg:block">
            <Link to="/vocea-almajului">
              <Button size="sm" className="font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <MessageSquare className="w-4 h-4 mr-2" /> Vocea Almăjului
              </Button>
            </Link>
          </div>

          {/* BUTONUL DE LOGIN ADMIN (DISCRET) */}
          {isAdmin ? (
            <Button variant="ghost" size="icon" onClick={logout} title="Deconectare Admin" className="text-red-500 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate("/login")} title="Logare Admin" className="text-slate-400 hover:text-blue-600">
              <Lock className="w-5 h-5" />
            </Button>
          )}

          {/* MOBILE MENU */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button size="icon" variant="ghost"><Menu className="w-6 h-6 text-slate-700" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto">
              {/* ... (Codul pentru mobil rămâne la fel, poți adăuga linkul de login și aici dacă vrei) ... */}
              <div className="mt-6 flex flex-col gap-4">
                  {/* ...nav links... */}
                  {isAdmin ? (
                    <Button variant="destructive" onClick={logout} className="w-full justify-start"><LogOut className="w-4 h-4 mr-2"/> Ieșire Admin</Button>
                  ) : (
                    <Button variant="outline" onClick={() => {navigate("/login"); setIsOpen(false);}} className="w-full justify-start"><Lock className="w-4 h-4 mr-2"/> Login Admin</Button>
                  )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;