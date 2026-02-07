import { Link } from "react-router-dom";
import { 
  User, Users, FileText, ChevronRight, 
  Building2, MapPin, Phone, Mail, Clock, 
  ShieldCheck, Gavel, Globe 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const sections = [
  {
    icon: User,
    title: "Primar",
    description: "Conducerea administrației publice locale",
    href: "/primar",
    gradient: "from-blue-600 to-blue-700",
  },
  {
    icon: User,
    title: "Viceprimar",
    description: "Sprijin în administrația locală",
    href: "/viceprimar",
    gradient: "from-blue-700 to-indigo-700",
  },
  {
    icon: Users,
    title: "Secretar General",
    description: "Coordonarea activității aparatului de specialitate",
    href: "/secretar",
    gradient: "from-slate-600 to-slate-700",
  },
  {
    icon: Gavel,
    title: "Consiliul Local",
    description: "Autoritatea deliberativă a comunei Almăj",
    href: "/consiliul-local",
    gradient: "from-blue-800 to-blue-900",
  },
];

const Primaria = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Primăria" },
      ]}
    >
      <div className="max-w-6xl mx-auto pb-16">
        {/* Header - Hero Style */}
        <div className="hero-gradient rounded-[2.5rem] p-8 lg:p-14 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic">Primăria Almăj</h1>
              <p className="text-blue-100 mt-3 font-bold uppercase text-xs tracking-[0.3em] opacity-80">
                Instituția Publică Locală • Județul Dolj
              </p>
            </div>
          </div>
        </div>

        {/* Grid-ul de Leadership */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sections.map((section) => (
            <Link key={section.title} to={section.href} className="group">
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] h-full flex flex-col bg-white border border-slate-100">
                <div className={`bg-gradient-to-br ${section.gradient} p-8 flex justify-center`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="p-6 text-center flex-grow flex flex-col items-center">
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-2">
                    {section.title}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mb-6 leading-relaxed italic">
                    {section.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-700 group-hover:gap-3 transition-all">
                    Detalii <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Despre + Contact (RAFINAT) */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* About Card */}
          <Card className="p-10 lg:col-span-2 border-none shadow-sm rounded-[3rem] bg-white border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic text-center md:text-left">Misiune și Administrație</h2>
            </div>
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed italic text-lg border-l-4 border-blue-100 pl-8">
              <p>
                Primăria Comunei Almăj funcționează ca autoritate executivă, având rolul fundamental de a implementa hotărârile luate în beneficiul comunității și de a asigura bunul mers al vieții publice.
              </p>
              <p>
                Prin departamentele noastre specializate, gestionăm resursele locale și dezvoltăm proiecte de infrastructură, educație și cultură, punând întotdeauna cetățeanul în centrul procesului decizional.
              </p>
            </div>
          </Card>

          {/* Contact Sidebar (CULOARE REPARATA) */}
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
              <h3 className="font-black uppercase tracking-widest text-[10px] mb-8 text-blue-700 border-b border-slate-100 pb-4">Informații Directe</h3>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: "Sediu", val: "Comuna Almăj, Dolj" },
                  { icon: Phone, label: "Telefon", val: "0251 468 001", link: "tel:0251468001" },
                  { icon: Mail, label: "Email", val: "primaria@almaj.ro", link: "mailto:primaria@almaj.ro" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{item.label}</p>
                      {item.link ? (
                        <a href={item.link} className="text-sm font-bold text-slate-700 hover:text-blue-700 transition-colors">{item.val}</a>
                      ) : (
                        <p className="text-sm font-bold text-slate-700">{item.val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Program Lucru - Mai curat */}
            <Card className="p-8 border-none shadow-sm rounded-[2rem] bg-slate-50 border border-slate-200/50">
              <div className="flex items-center gap-3 mb-5">
                <Clock className="w-5 h-5 text-blue-700" />
                <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-900">Program Instituție</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 border-b border-slate-200 pb-2 italic">
                  <span>Luni - Joi</span>
                  <span className="text-slate-900 font-black">08:00 - 16:30</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 italic">
                  <span>Vineri</span>
                  <span className="text-slate-900 font-black">08:00 - 14:00</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Primaria;