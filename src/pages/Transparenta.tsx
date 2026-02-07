import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Gavel, 
  ShoppingBag, 
  Wallet, 
  Briefcase, 
  FileSignature, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Search
} from "lucide-react";

const Transparenta = () => {
  const sections = [
    {
      title: "Hotărâri Consiliu (HCL)",
      desc: "Registrul proiectelor de hotărâri și a deciziilor adoptate de plenul Consiliului Local.",
      icon: Gavel,
      href: "/transparenta/hcl"
    },
    {
      title: "Achiziții Publice",
      desc: "Programul anual al achizițiilor, licitații în curs și contracte de achiziție publică.",
      icon: ShoppingBag,
      href: "/achizitii"
    },
    {
      title: "Buget și Finanțe",
      desc: "Planificarea financiară anuală, bilanțuri contabile și rapoarte de execuție.",
      icon: Wallet,
      href: "/buget"
    },
    {
      title: "Cariere & Concursuri",
      desc: "Anunțuri privind posturile vacante, rezultate probe și liste finale de concurs.",
      icon: Briefcase,
      href: "/cariere"
    },
    {
      title: "Contracte & Concesiuni",
      desc: "Publicarea contractelor de închiriere, concesiune și vânzare a bunurilor publice.",
      icon: FileSignature,
      href: "/contracte"
    },
    {
      title: "Transparență Salarială",
      desc: "Lista funcțiilor și a drepturilor salariale conform prevederilor Legii 153/2017.",
      icon: Eye,
      href: "/monitorul-oficial/declaratii"
    }
  ];

  return (
    <PageLayout 
        title="Transparență" 
        breadcrumbs={[{ label: "Portal Transparență" }]}
    >
      <div className="container mx-auto px-4 py-16 min-h-screen">
        
        {/* HEADER 1:1 CU MONITORUL OFICIAL */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-20">
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
              Conform Legii 544/2001
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">
              Transparență <span className="text-blue-600">Decizională</span>
            </h1>
            <p className="text-slate-500 max-w-2xl text-lg font-medium italic">
              Punctul central pentru asigurarea transparenței decizionale și accesul cetățenilor la informațiile de interes public ale Comunei Almăj.
            </p>
          </div>

          {/* Spațiu rezervat pentru aliniere, similar cu butonul de admin din Monitor */}
          <div className="hidden md:block w-16 h-16 opacity-0"></div>
        </div>

        {/* GRIDUL DE NAVIGARE 1:1 CU MONITORUL OFICIAL */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Link key={section.title} to={section.href} className="group outline-none">
              <Card className="h-full border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white overflow-hidden text-left relative">
                <CardHeader className="pt-10 px-8 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-100/50">
                    <section.icon className="w-7 h-7 text-slate-900" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                  <CardDescription className="text-slate-500 text-sm font-medium italic mb-6 leading-relaxed">
                    {section.desc}
                  </CardDescription>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-all">
                    Vezi documente <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck className="w-24 h-24 -mr-8 -mt-8" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </PageLayout>
  );
};

export default Transparenta;