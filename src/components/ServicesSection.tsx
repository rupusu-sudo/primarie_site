import { 
  FileText, Banknote, HardHat, Baby, Tractor, 
  HeartHandshake, Calendar, MessageSquare, ChevronRight, ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Acte Necesare",
    description: "Lista documentelor pentru diverse solicitări.",
    color: "bg-blue-600",
    href: "/servicii", // Sau "/monitorul-oficial" dacă preferi
    btnText: "Accesează"
  },
  {
    icon: <Banknote className="w-6 h-6" />,
    title: "Taxe și Impozite",
    description: "Plătește online pe Ghișeul.ro sau vezi detalii.",
    color: "bg-emerald-600",
    href: "/servicii/taxe",
    btnText: "Deschide"
  },
  {
    icon: <HardHat className="w-6 h-6" />,
    title: "Urbanism",
    description: "Certificate, autorizații și planuri urbanistice.",
    color: "bg-amber-500",
    href: "/servicii/urbanism",
    btnText: "Accesează"
  },
  {
    icon: <Baby className="w-6 h-6" />,
    title: "Stare Civilă",
    description: "Acte de stare civilă, căsătorii, nașteri.",
    color: "bg-rose-500",
    href: "/servicii/stare-civila",
    btnText: "Accesează"
  },
  {
    icon: <Tractor className="w-6 h-6" />,
    title: "Registru Agricol",
    description: "Adeverințe și înscrieri în registrul agricol.",
    color: "bg-green-600",
    href: "/servicii/registru-agricol",
    btnText: "Accesează"
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Asistență Socială",
    description: "Ajutoare sociale și servicii comunitare.",
    color: "bg-purple-600",
    href: "/servicii/asistenta-sociala",
    btnText: "Accesează"
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Programări Audiențe",
    description: "Programează-te la audiențe la primar.",
    color: "bg-indigo-600",
    href: "/contact", // Audiențele sunt de obicei la Contact
    btnText: "Accesează"
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Sesizări Online",
    description: "Trimite sesizări și petiții online.",
    color: "bg-cyan-600",
    href: "/contact", // Sau "/sesizari" dacă vom crea pagina
    btnText: "Accesează"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Secțiune */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
             <span className="text-blue-600 font-bold text-sm px-3 uppercase tracking-wider">Servicii Digitale</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">SERVICII PENTRU CETĂȚENI</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Cum vă putem ajuta? Accesați rapid serviciile primăriei și informațiile de care aveți nevoie.
          </p>
        </div>

        {/* Grid Servicii (4 coloane pe ecrane mari pentru a acomoda 8 elemente) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link key={index} to={service.href} className="group h-full">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-100 group-hover:-translate-y-1 overflow-hidden flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Iconița */}
                  <div className={`${service.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  
                  {/* Titlu și Descriere */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  
                  {/* Butonul de Acțiune */}
                  <div className="mt-auto pt-4 border-t border-slate-50 w-full flex items-center justify-between text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    {service.btnText}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Buton "Toate serviciile" */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-slate-300 text-slate-700 hover:text-primary hover:border-primary">
            <Link to="/servicii">
              Toate serviciile <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;