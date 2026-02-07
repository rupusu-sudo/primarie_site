import PageLayout from "@/components/PageLayout";
import { UserPlus, Briefcase } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Cariere = () => {
  return (
    <PageLayout 
      title="Cariere și Concursuri" 
      breadcrumbs={[
        { label: "Transparență", href: "/transparenta" }, 
        { label: "Anunțuri Cariere" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header aliniat 1:1 cu Declarații / Buget / Achiziții */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Cariere și Concursuri
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Alăturați-vă echipei noastre. Aici găsiți toate informațiile privind posturile vacante, 
              bibliografiile de concurs și rezultatele probelor de examinare.
            </p>
          </div>

          {/* Manager de documente cu filtrare avansată (An + Nume) */}
          <AdminDocumentManager 
            categoryKey="cariere-si-concursuri-almaj"
            title="Portal Angajări"
            icon={Briefcase}
            enableYearFilter={true}
            customCategories={[
              "Anunțuri Concurs", 
              "Rezultate Selecție Dosare", 
              "Rezultate Probă Scrisă", 
              "Rezultate Finale", 
              "Arhivă Concursuri"
            ]}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Cariere;