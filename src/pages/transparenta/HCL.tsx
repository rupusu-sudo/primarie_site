import PageLayout from "@/components/PageLayout";
import { Scale, Gavel } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const HCL = () => {
  return (
    <PageLayout 
      title="Hotărâri Consiliu Local" 
      breadcrumbs={[
        { label: "Transparență", href: "/transparenta" }, 
        { label: "HCL" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <Gavel className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Hotărâri de Consiliu Local
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Registrul complet al hotărârilor adoptate de Consiliul Local, organizat pe ani.
            </p>
          </div>

          <AdminDocumentManager 
            categoryKey="hcl-transparenta"
            title="Arhivă HCL"
            icon={Scale}
            enableYearFilter={true}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default HCL;