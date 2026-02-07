import PageLayout from "@/components/PageLayout";
import { 
  Building2, 
  Users, 
  FileStack, 
  Map, 
  CreditCard, 
  HeartHandshake, 
  ArrowRight,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

const Servicii = () => {
  const servicii = [
    {
      title: "Urbanism",
      desc: "Autorizații de construire, certificate de urbanism și documentații PUG.",
      icon: Building2,
      href: "/servicii/urbanism",
      color: "bg-blue-500",
    },
    {
      title: "Taxe și Impozite",
      desc: "Plata obligațiilor fiscale, consultare debite și eliberare certificate fiscale.",
      icon: CreditCard,
      href: "/servicii/taxe",
      color: "bg-emerald-500",
    },
    {
      title: "Stare Civilă",
      desc: "Înregistrare nașteri, căsătorii, decese și eliberări de duplicate acte.",
      icon: Users,
      href: "/servicii/stare-civila",
      color: "bg-indigo-500",
    },
    {
      title: "Asistență Socială",
      desc: "Ajutoare sociale, protecția copilului și sprijin pentru persoane vârstnice.",
      icon: HeartHandshake,
      href: "/servicii/asistenta-sociala",
      color: "bg-rose-500",
    },
    {
      title: "Registru Agricol",
      desc: "Adeverințe producător, înscriere animale și evidența terenurilor agricole.",
      icon: Map,
      href: "/servicii/registru-agricol",
      color: "bg-amber-500",
    },
    {
      title: "Fond Locativ",
      desc: "Cereri locuințe sociale, administrare fond locativ de stat.",
      icon: FileStack,
      href: "/servicii/fond-locativ",
      color: "bg-slate-500",
    },
  ];

  return (
    <PageLayout title="Portal Servicii Publice">
      <div className="container mx-auto px-4 py-16">
        
        {/* HERO SECTION PORTAL */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-blue-100">
            Administrație Digitală
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">
            Portal Servicii Publice
          </h1>
          <p className="text-slate-500 text-lg font-medium italic leading-relaxed">
            Centrul de informare și procesare a cererilor cetățenilor. Accesați secțiunea dorită pentru formulare, proceduri și acte necesare.
          </p>
        </div>

        {/* GRID SERVICII */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {servicii.map((s, i) => (
            <Link 
              key={i} 
              to={s.href}
              className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <s.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {s.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">
                {s.desc}
              </p>

              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                Accesează Serviciul <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* INFO BOX FOOTER */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="bg-white/10 p-4 rounded-2xl">
              <Info className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold mb-2 uppercase italic tracking-tight">Aveți nevoie de asistență?</h4>
              <p className="text-slate-400 text-sm italic">
                Dacă nu găsiți informațiile necesare online, biroul de Relații cu Publicul vă stă la dispoziție în sediul Primăriei, Luni-Vineri, între 08:00 - 16:00.
              </p>
            </div>
            <Link to="/contact" className="shrink-0">
              <button className="px-8 py-4 bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-blue-500 hover:text-white transition-all">
                Contactează-ne
              </button>
            </Link>
          </div>
        </div>

      </div>
    </PageLayout>
  );
};

export default Servicii;