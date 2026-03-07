import PageLayout from "@/components/PageLayout";
import { ShieldAlert, FileStack } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Dispozitii = () => {
  return (
    <PageLayout 
      title="Dispoziții Primar" 
      breadcrumbs={[
        { label: "Monitor Oficial", href: "/monitorul-oficial" }, 
        { label: "Dispoziții Primar" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Instituțional */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Dispozițiile Primarului
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Actele administrative emise de Primar în exercitarea atribuțiilor sale, 
              publicate pentru asigurarea transparenței decizionale.
            </p>
          </div>

          {/* Managerul de Documente cu Filtru de Căutare și An */}
          <AdminDocumentManager 
            categoryKey="dispozitii-primar"
            title="Registru Dispoziții"
            icon={FileStack}
            enableYearFilter={true}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Dispozitii;