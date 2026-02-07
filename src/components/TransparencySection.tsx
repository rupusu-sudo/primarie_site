import { FileText, DollarSign, ShoppingCart, FileCheck, ChevronRight, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const documents = [
  {
    icon: FileText,
    title: "Hotărâri Consiliul Local",
    badge: "2025",
    description: "Deciziile și hotărârile adoptate",
    link: "#",
  },
  {
    icon: DollarSign,
    title: "Bugetul Local",
    badge: "Actualizat",
    description: "Execuție bugetară și rapoarte financiare",
    link: "#",
  },
  {
    icon: ShoppingCart,
    title: "Achiziții Publice",
    badge: "SEAP",
    description: "Proceduri și contracte de achiziție",
    link: "#",
  },
  {
    icon: FileCheck,
    title: "Contracte",
    badge: "Toate",
    description: "Contracte de închiriere și concesiune",
    link: "#",
  },
];

const recentDocuments = [
  {
    title: "Hotărârea nr. 47/2021 privind contravențiile în domeniul edilitar-gospodăresc",
    type: "Hotărâre",
    link: "#",
  },
  {
    title: "Calendar colectare deșeuri reciclabile",
    type: "Document",
    link: "#",
  },
  {
    title: "Ghid colectare deșeuri reziduale",
    type: "Informativ",
    link: "#",
  },
];

const TransparencySection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="section-label mb-2">Transparență decizională</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Documente Publice</h2>
            <p className="text-muted-foreground mt-2">Acces la toate documentele și actele administrative</p>
          </div>
          <a href="#" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            <Archive className="w-5 h-5 mr-1" />
            Arhivă completă
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>

        {/* Documents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {documents.map((doc, index) => (
            <Card key={index} className="p-6 card-hover cursor-pointer group bg-card border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary transition-colors">
                  <doc.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <Badge variant="secondary" className="text-xs">{doc.badge}</Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </Card>
          ))}
        </div>

        {/* Recent Documents */}
        <Card className="p-6 bg-muted/30 border-border">
          <h3 className="font-semibold text-foreground mb-4">Documente recente</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recentDocuments.map((doc, index) => (
              <a
                key={index}
                href={doc.link}
                className="p-4 bg-card rounded-xl hover:shadow-md transition-all group flex flex-col"
              >
                <p className="text-sm text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {doc.title}
                </p>
                <Badge variant="outline" className="w-fit text-xs mt-auto">{doc.type}</Badge>
              </a>
            ))}
          </div>
          <a href="#" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all mt-6">
            Vezi toate documentele
            <ChevronRight className="w-5 h-5" />
          </a>
        </Card>
      </div>
    </section>
  );
};

export default TransparencySection;
