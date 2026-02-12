import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import HartaDigitala from "./pages/HartaDigitala";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// --- PAGINI PRINCIPALE ---
const Primaria = lazy(() => import("./pages/Primaria"));
const ConsiliulLocal = lazy(() => import("./pages/ConsiliulLocal"));
const Organigrama = lazy(() => import("./pages/Organigrama"));
const Contact = lazy(() => import("./pages/Contact"));
const Istoric = lazy(() => import("./pages/Istoric"));
const Cultura = lazy(() => import("./pages/Cultura"));
const Anunturi = lazy(() => import("./pages/Anunturi"));
const Instiintari = lazy(() => import("./pages/Instiintari"));
const VoceaAlmajului = lazy(() => import("./pages/VoceaAlmajului"));
const OportunitatiDeDezvoltare = lazy(() => import("./pages/OportunitatiDeDezvoltare"));
const LoginAdmin = lazy(() => import("./pages/LoginAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// --- CONDUCERE & EXECUTIV ---
const Primar = lazy(() => import("./pages/Primar"));
const Viceprimar = lazy(() => import("./pages/Viceprimar"));
const Secretar = lazy(() => import("./pages/Secretar"));

// --- MONITOR OFICIAL ---
const MonitorulOficial = lazy(() => import("./pages/MonitorulOficial"));
const Dispozitii = lazy(() => import("./pages/monitorul/Dispozitii"));
const Declaratii = lazy(() => import("./pages/monitorul/Declaratii"));
const Regulamente = lazy(() => import("./pages/monitorul/Regulamente"));
const Statut = lazy(() => import("./pages/monitorul/Statut"));
const AlteDocumente = lazy(() => import("./pages/monitorul/AlteDocumente"));

// --- TRANSPARENȚĂ ---
const Transparenta = lazy(() => import("./pages/Transparenta"));
const HCL = lazy(() => import("./pages/transparenta/HCL"));
const Buget = lazy(() => import("./pages/transparenta/Buget"));
const Achizitii = lazy(() => import("./pages/transparenta/Achizitii"));
const Contracte = lazy(() => import("./pages/transparenta/Contracte"));
const Cariere = lazy(() => import("./pages/transparenta/Cariere"));

// --- SERVICII ---
const Servicii = lazy(() => import("./pages/Servicii"));
const Taxe = lazy(() => import("./pages/servicii/Taxe"));
const Urbanism = lazy(() => import("./pages/servicii/Urbanism"));
const StareCivila = lazy(() => import("./pages/servicii/StareCivila"));
const RegistruAgricol = lazy(() => import("./pages/servicii/RegistruAgricol"));
const AsistentaSociala = lazy(() => import("./pages/servicii/AsistentaSociala"));
const FondLocativ = lazy(() => import("./pages/servicii/FondLocativ"));

const RouteSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-6 h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-[42vh] animate-pulse rounded-3xl bg-slate-200" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AccessibilityProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster />
            <Sonner />

            <Header />

            <Suspense fallback={<RouteSkeleton />}>
              <main className="min-h-screen">
                <Routes>
                {/* Rute Principale */}
                <Route path="/" element={<Index />} />
                <Route path="/harta-digitala" element={<HartaDigitala />} />

                {/* Instituție */}
                <Route path="/primaria" element={<Primaria />} />
                <Route path="/consiliul-local" element={<ConsiliulLocal />} />
                <Route path="/organigrama" element={<Organigrama />} />

                {/* Conducere */}
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

                {/* Monitor Oficial */}
                <Route path="/monitorul-oficial" element={<MonitorulOficial />} />
                <Route path="/monitorul-oficial/dispozitii" element={<Dispozitii />} />
                <Route path="/monitorul-oficial/declaratii" element={<Declaratii />} />
                <Route path="/monitorul-oficial/regulamente" element={<Regulamente />} />
                <Route path="/monitorul-oficial/statut" element={<Statut />} />
                <Route path="/monitorul-oficial/alte-documente" element={<AlteDocumente />} />

                {/* Transparență */}
                <Route path="/transparenta" element={<Transparenta />} />
                <Route path="/transparenta/hcl" element={<HCL />} />
                <Route path="/transparenta/buget" element={<Buget />} />
                <Route path="/transparenta/achizitii" element={<Achizitii />} />
                <Route path="/transparenta/contracte" element={<Contracte />} />
                <Route path="/transparenta/cariere" element={<Cariere />} />

                {/* Servicii */}
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
        </AccessibilityProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
