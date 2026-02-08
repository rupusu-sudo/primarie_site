import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import HartaDigitala from "./pages/HartaDigitala";
import LoadingScreen from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

/**
 * Funcție pentru a forța o întârziere minimă la încărcarea paginilor (Lazy Loading)
 * Astfel, LoadingScreen-ul nu va mai "pâlpâi" rapid.
 */
const lazyWithDelay = (importFn: () => Promise<any>, delay = 800) => {
  return lazy(() => 
    Promise.all([
      importFn(),
      new Promise(resolve => setTimeout(resolve, delay))
    ]).then(([moduleExports]) => moduleExports)
  );
};

// --- PAGINI PRINCIPALE ---
const Index = lazyWithDelay(() => import("./pages/Index"));
const Primaria = lazyWithDelay(() => import("./pages/Primaria"));
const ConsiliulLocal = lazyWithDelay(() => import("./pages/ConsiliulLocal"));
const Organigrama = lazyWithDelay(() => import("./pages/Organigrama"));
const Contact = lazyWithDelay(() => import("./pages/Contact"));
const Istoric = lazyWithDelay(() => import("./pages/Istoric"));
const Cultura = lazyWithDelay(() => import("./pages/Cultura"));
const Anunturi = lazyWithDelay(() => import("./pages/Anunturi"));
const Instiintari = lazyWithDelay(() => import("./pages/Instiintari"));
const VoceaAlmajului = lazyWithDelay(() => import("./pages/VoceaAlmajului"));
const OportunitatiDeDezvoltare = lazyWithDelay(() => import("./pages/OportunitatiDeDezvoltare"));
const LoginAdmin = lazyWithDelay(() => import("./pages/LoginAdmin"));
const NotFound = lazyWithDelay(() => import("./pages/NotFound"));

// --- CONDUCERE & EXECUTIV (AICI SUNT MODIFICĂRILE TALE) ---
const Primar = lazyWithDelay(() => import("./pages/Primar"));
const Viceprimar = lazyWithDelay(() => import("./pages/Viceprimar"));
const Secretar = lazyWithDelay(() => import("./pages/Secretar"));

// --- MONITOR OFICIAL ---
const MonitorulOficial = lazyWithDelay(() => import("./pages/MonitorulOficial"));
const Dispozitii = lazyWithDelay(() => import("./pages/monitorul/Dispozitii"));
const Declaratii = lazyWithDelay(() => import("./pages/monitorul/Declaratii"));
const Regulamente = lazyWithDelay(() => import("./pages/monitorul/Regulamente"));
const Statut = lazyWithDelay(() => import("./pages/monitorul/Statut"));
const AlteDocumente = lazyWithDelay(() => import("./pages/monitorul/AlteDocumente"));

// --- TRANSPARENȚĂ ---
const Transparenta = lazyWithDelay(() => import("./pages/Transparenta"));
const HCL = lazyWithDelay(() => import("./pages/transparenta/HCL"));
const Buget = lazyWithDelay(() => import("./pages/transparenta/Buget"));
const Achizitii = lazyWithDelay(() => import("./pages/transparenta/Achizitii"));
const Contracte = lazyWithDelay(() => import("./pages/transparenta/Contracte"));
const Cariere = lazyWithDelay(() => import("./pages/transparenta/Cariere"));

// --- SERVICII ---
const Servicii = lazyWithDelay(() => import("./pages/Servicii"));
const Taxe = lazyWithDelay(() => import("./pages/servicii/Taxe"));
const Urbanism = lazyWithDelay(() => import("./pages/servicii/Urbanism"));
const StareCivila = lazyWithDelay(() => import("./pages/servicii/StareCivila"));
const RegistruAgricol = lazyWithDelay(() => import("./pages/servicii/RegistruAgricol"));
const AsistentaSociala = lazyWithDelay(() => import("./pages/servicii/AsistentaSociala"));
const FondLocativ = lazyWithDelay(() => import("./pages/servicii/FondLocativ"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster />
          <Sonner />
          
          <Header />

          <Suspense fallback={<LoadingScreen />}>
            <main className="min-h-screen">
              <Routes>
                {/* Rute Principale */}
                <Route path="/" element={<Index />} />
                <Route path="/harta-digitala" element={<HartaDigitala />} />
                
                {/* Instituție */}
                <Route path="/primaria" element={<Primaria />} />
                <Route path="/consiliul-local" element={<ConsiliulLocal />} />
                <Route path="/organigrama" element={<Organigrama />} />
                
                {/* --- RUTELE PENTRU PRIMAR, VICEPRIMAR, SECRETAR --- */}
                {/* Aceste rute trebuie să corespundă cu link-urile din meniu/site */}
                <Route path="/primaria/primar" element={<Primar />} />
                <Route path="/primaria/viceprimar" element={<Viceprimar />} />
                <Route path="/primaria/secretar-general" element={<Secretar />} />
                
                {/* Informații */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/istoric" element={<Istoric />} />
                <Route path="/cultura" element={<Cultura />} />
                <Route path="/anunturi" element={<Anunturi />} />
                <Route path="/instiintari" element={<Instiintari />} />
                <Route path="/vocea-almajului" element={<VoceaAlmajului />} />
                <Route path="/oportunitati" element={<OportunitatiDeDezvoltare />} />
                <Route path="/login" element={<LoginAdmin />} />
                
                {/* Rute Monitor Oficial */}
                <Route path="/monitorul-oficial" element={<MonitorulOficial />} />
                <Route path="/monitorul-oficial/dispozitii" element={<Dispozitii />} />
                <Route path="/monitorul-oficial/declaratii" element={<Declaratii />} />
                <Route path="/monitorul-oficial/regulamente" element={<Regulamente />} />
                <Route path="/monitorul-oficial/statut" element={<Statut />} />
                <Route path="/monitorul-oficial/alte-documente" element={<AlteDocumente />} />
                
                {/* Rute Transparență */}
                <Route path="/transparenta" element={<Transparenta />} />
                <Route path="/transparenta/hcl" element={<HCL />} />
                <Route path="/transparenta/buget" element={<Buget />} />
                <Route path="/transparenta/achizitii" element={<Achizitii />} />
                <Route path="/transparenta/contracte" element={<Contracte />} />
                <Route path="/transparenta/cariere" element={<Cariere />} />

                {/* Rute Servicii */}
                <Route path="/servicii" element={<Servicii />} />
                <Route path="/servicii/taxe" element={<Taxe />} />
                <Route path="/servicii/urbanism" element={<Urbanism />} />
                <Route path="/servicii/stare-civila" element={<StareCivila />} />
                <Route path="/servicii/registru-agricol" element={<RegistruAgricol />} />
                <Route path="/servicii/asistenta-sociala" element={<AsistentaSociala />} />
                <Route path="/servicii/fond-locativ" element={<FondLocativ />} />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </Suspense>

          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;