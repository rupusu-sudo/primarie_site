import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, ChevronDown, LogOut,
  MessageCircle, User, Map, ChevronRight, X,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { useSwipe } from "@/hooks/use-swipe";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useSwipe({
    onSwipeLeft: () => setIsMobileMenuOpen(true),
    onSwipeRight: () => setIsMobileMenuOpen(false),
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`
        sticky top-0 z-50 w-full h-16 transition-all duration-300 ease-out border-b
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-slate-200 shadow-md' 
          : 'bg-white border-transparent'}
      `}
    >
      <div className="container mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-2 lg:gap-6">
        
        {/* --- LOGO --- */}
        <Link to="/" className="group flex items-center gap-3 shrink-0 relative z-50 mr-2">
          <img 
            src="/flavicon.png" 
            alt="Stema Almăj" 
            className={`transition-all duration-500 object-contain drop-shadow-sm ${isScrolled ? 'h-10 w-10' : 'h-12 w-12'}`} 
          />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Primăria</span>
            <span className={`font-black text-slate-900 uppercase tracking-tighter transition-all duration-500 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
              Almăj
            </span>
          </div>
        </Link>

        {/* --- NAVIGAȚIE DESKTOP --- */}
        <nav className="hidden xl:flex items-center justify-center flex-1">
          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border border-slate-100 shadow-sm">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.href) && item.href !== "/";
              if (item.children) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 outline-none select-none ${isActive ? 'text-blue-700 bg-white shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'}`}>
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-64 p-2 rounded-2xl shadow-xl border-slate-100 bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in-95 mt-2">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.label} asChild>
                          <Link to={child.href} className="cursor-pointer rounded-xl font-medium text-slate-600 focus:text-blue-700 focus:bg-blue-50 py-2.5 px-3 flex items-center gap-3 group">
                            {child.icon && <child.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />}
                            <span className="flex-1">{child.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link key={item.label} to={item.href} className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-200 ${isActive ? 'text-blue-700 bg-white shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          {/* A11y trigger desktop lângă Vocea Almăjului */}
          <div className="hidden lg:flex">
            <AccessibilityWidget mode="header" align="left" triggerClassName="mr-1" />
          </div>
          <Link to="/vocea-almajului" className="hidden lg:flex">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-6 font-bold border-0 transition-all hover:scale-105 active:scale-95">
              <MessageCircle className="w-4 h-4 mr-2" /> 
              Vocea Almăjului
            </Button>
          </Link>
          
          <div className="hidden lg:flex items-center pl-2 ml-1">
            {user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0 border border-slate-200 hover:border-blue-300 transition-all">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-700 text-sm">
                      {user.name.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100 p-2">
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer p-2.5 rounded-xl font-medium focus:bg-blue-50">
                      <Link to="/admin">
                        <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" /> Panou Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer p-2.5 rounded-xl font-medium focus:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" /> Deconectare
                  </DropdownMenuItem>
                </DropdownMenuContent>
               </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile A11y trigger (stânga hamburger) */}
          <div className="xl:hidden">
            <AccessibilityWidget mode="header" align="left" triggerClassName="w-11 h-11 mr-1" />
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden text-slate-800 hover:bg-slate-100 rounded-full w-11 h-11 active:scale-90 transition-transform">
                <Menu className="w-7 h-7" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-slate-100 shadow-2xl z-[100] flex flex-col bg-slate-50">
              
              <div className="px-6 pt-6 pb-2 bg-white rounded-b-[2rem] shadow-sm z-10">
                <div className="flex items-center justify-between mb-6">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold border-2 border-blue-50">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">Salut, {user.name}!</p>
                        <p className="text-xs text-slate-500">Cetățean conectat</p>
                      </div>
                    </div>
                  ) : (
                     <div className="flex items-center gap-3">
                       <img src="/flavicon.png" alt="Logo" className="w-10 h-10 object-contain" />
                       <div>
                         <p className="font-bold text-slate-900 leading-tight">Meniu Principal</p>
                         <p className="text-xs text-slate-500 font-bold text-blue-600">Comuna Almăj</p>
                       </div>
                     </div>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full hover:bg-slate-100">
                    <X className="w-6 h-6 text-slate-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <MobileGridButton 
                    to="/vocea-almajului" 
                    icon={<MessageCircle className="w-5 h-5 text-indigo-600" />} 
                    label="Vocea Almăjului" 
                    bgColor="bg-indigo-50" 
                    textColor="text-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {isAdmin ? (
                    <MobileGridButton
                      to="/admin"
                      icon={<LayoutDashboard className="w-5 h-5 text-indigo-600" />}
                      label="Panou Admin"
                      bgColor="bg-indigo-50"
                      textColor="text-slate-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ) : (
                    <MobileGridButton
                      to="/harta-digitala"
                      icon={<Map className="w-5 h-5 text-indigo-600" />}
                      label="GeoPortal Cadastral"
                      bgColor="bg-indigo-50"
                      textColor="text-slate-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Navigare</p>
                {NAVIGATION_ITEMS.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {item.children ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${idx}`} className="border-none">
                          <AccordionTrigger className="py-4 px-4 hover:no-underline hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600`}>
                                {item.icon && <item.icon className="w-5 h-5" />}
                              </div>
                              <span className="font-bold text-slate-800 text-base">{item.label}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <div className="flex flex-col border-t border-slate-100">
                              {item.children.map((child) => (
                                <Link 
                                  key={child.label}
                                  to={child.href} 
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="py-3.5 px-4 pl-16 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                                >
                                  {child.label}
                                  <ChevronRight className="w-4 h-4 opacity-30" />
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link 
                        to={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 py-4 px-4 hover:bg-slate-50 transition-colors"
                      >
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600`}>
                           {item.icon && <item.icon className="w-5 h-5" />}
                         </div>
                         <span className="font-bold text-slate-800 text-base">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {user ? (
                <div className="p-4 bg-white border-t border-slate-200">
                  <Button 
                    variant="destructive" 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="w-full rounded-xl py-6 font-bold"
                  >
                    <LogOut className="w-5 h-5 mr-2" /> Deconectare
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-white border-t border-slate-200">
                  <Button asChild className="w-full rounded-xl py-6 font-bold bg-blue-600 hover:bg-blue-700">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="w-5 h-5 mr-2" /> Login Admin
                    </Link>
                  </Button>
                </div>
              )}

            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
};

const MobileGridButton = ({ to, icon, label, bgColor, textColor, onClick }: any) => (
  <Link to={to} onClick={onClick} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${bgColor} active:scale-95 transition-transform h-24 shadow-sm border border-black/5`}>
    <div className="mb-2">{icon}</div>
    <span className={`text-xs font-bold ${textColor}`}>{label}</span>
  </Link>
);

export default Header;

