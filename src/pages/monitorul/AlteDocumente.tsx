import PageLayout from "@/components/PageLayout";
import { Archive, Layers } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const AlteDocumente = () => {
  return (
    <PageLayout 
      title="Alte Documente" 
      breadcrumbs={[
        { label: "Monitor Oficial", href: "/monitorul-oficial" }, 
        { label: "Documente Diverse" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Alte Documente de Interes Public
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Acces la diverse acte administrative, rapoarte și alte documente ce nu se încadrează în categoriile standard.
            </p>
          </div>

          <AdminDocumentManager 
            categoryKey="alte-documente-divers"
            title="Arhivă Diverse"
            icon={Archive}
            enableYearFilter={true}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AlteDocumente;