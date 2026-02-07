import { Link } from "react-router-dom";
import { 
  Building2, 
  Receipt, 
  Heart, 
  Tractor, 
  FileText, 
  Download, 
  ChevronRight,
  Home,
  Users,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const servicii = [
  {
    id: "taxe",
    icon: Receipt,
    title: "Taxe și Impozite",
    description: "Plata online a impozitelor și taxelor locale",
    gradient: "from-green-500 to-green-600",
    external: true,
    externalLink: "https://www.ghiseul.ro/",
    formulare: [
      { nume: "Declarație impozit clădire", tip: "PDF" },
      { nume: "Declarație impozit teren", tip: "PDF" },
      { nume: "Declarație auto", tip: "PDF" },
      { nume: "Cerere scutire impozit", tip: "PDF" },
    ],
  },
  {
    id: "urbanism",
    icon: Building2,
    title: "Urbanism",
    description: "Certificate de urbanism, autorizații de construire, avize",
    gradient: "from-blue-500 to-blue-600",
    external: false,
    formulare: [
      { nume: "Cerere certificat urbanism", tip: "PDF" },
      { nume: "Cerere autorizație construire", tip: "PDF" },
      { nume: "Declarație finalizare lucrări", tip: "PDF" },
      { nume: "Cerere aviz primar", tip: "PDF" },
    ],
  },
  {
    id: "stare-civila",
    icon: Users,
    title: "Stare Civilă",
    description: "Certificate naștere, căsătorie, deces, transcrieri",
    gradient: "from-purple-500 to-purple-600",
    external: false,
    formulare: [
      { nume: "Cerere certificat naștere", tip: "PDF" },
      { nume: "Cerere certificat căsătorie", tip: "PDF" },
      { nume: "Cerere transcriere acte", tip: "PDF" },
      { nume: "Declarație schimbare nume", tip: "PDF" },
    ],
  },
  {
    id: "asistenta",
    icon: Heart,
    title: "Asistență Socială",
    description: "Ajutoare sociale, alocații, indemnizații",
    gradient: "from-red-500 to-red-600",
    external: false,
    formulare: [
      { nume: "Cerere ajutor social", tip: "PDF" },
      { nume: "Cerere alocație susținere", tip: "PDF" },
      { nume: "Cerere indemnizație handicap", tip: "PDF" },
      { nume: "Anchetă socială", tip: "PDF" },
    ],
  },
  {
    id: "agricol",
    icon: Tractor,
    title: "Registru Agricol",
    description: "Adeverințe, atestate de producător, registre agricole",
    gradient: "from-amber-500 to-amber-600",
    external: false,
    formulare: [
      { nume: "Cerere adeverință registru agricol", tip: "PDF" },
      { nume: "Cerere atestat producător", tip: "PDF" },
      { nume: "Declarație animale", tip: "PDF" },
      { nume: "Declarație terenuri agricole", tip: "PDF" },
    ],
  },
  {
    id: "locuinte",
    icon: Home,
    title: "Fond Locativ",
    description: "Locuințe sociale, ANL, spațiu locativ",
    gradient: "from-cyan-500 to-cyan-600",
    external: false,
    formulare: [
      { nume: "Cerere locuință socială", tip: "PDF" },
      { nume: "Cerere locuință ANL", tip: "PDF" },
      { nume: "Declarație pe proprie răspundere", tip: "PDF" },
    ],
  },
];

const ServiciiCetateni = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Servicii Cetățeni" },
      ]}
    >
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="hero-gradient rounded-xl p-6 lg:p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Servicii pentru Cetățeni</h1>
              <p className="text-white/80 mt-1">Accesați rapid serviciile și formularele de care aveți nevoie</p>
            </div>
          </div>
        </header>

        {/* Ghișeul.ro Banner */}
        <Card className="p-4 mb-8 bg-green-50 border-green-200">
          <a 
            href="https://www.ghiseul.ro/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Receipt className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Plătește taxele online pe Ghișeul.ro</h3>
                <p className="text-sm text-green-600">Plata rapidă și sigură a impozitelor și taxelor locale</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform flex-shrink-0" aria-hidden="true" />
          </a>
        </Card>

        {/* Services Grid - Dashboard Style */}
        <section aria-labelledby="servicii-disponibile">
          <h2 id="servicii-disponibile" className="sr-only">Servicii disponibile</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicii.map((serviciu) => (
              <Card key={serviciu.id} className="overflow-hidden card-hover">
                {/* Colored Header */}
                <div className={`bg-gradient-to-r ${serviciu.gradient} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <serviciu.icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    {serviciu.external && (
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        Online
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{serviciu.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{serviciu.description}</p>
                  
                  {/* Formulare List - Fixed 3 items for symmetry */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Formulare disponibile
                    </p>
                    {serviciu.formulare.slice(0, 3).map((formular, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-red-500" aria-hidden="true" />
                          <span className="text-sm text-foreground">{formular.nume}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted/30 px-5 py-3 border-t border-border">
                  {serviciu.external ? (
                    <a 
                      href={serviciu.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Plătește online pe Ghișeul.ro
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link 
                      to={`/servicii/${serviciu.id}`}
                      className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Vezi actele necesare
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Info Card */}
        <Card className="p-6 mt-10 bg-primary/5 border-primary/20">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Cum depun documentele?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Formularele pot fi descărcate, completate și depuse la Registratura Primăriei Almăj, 
                în intervalul orar <strong>Luni-Joi 8:00-16:30</strong>, <strong>Vineri 8:00-14:00</strong>. 
                Pentru informații suplimentare, sunați la{" "}
                <a href="tel:0251448201" className="text-primary hover:underline">0251 448 201</a>.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </PageLayout>
  );
};

export default ServiciiCetateni;