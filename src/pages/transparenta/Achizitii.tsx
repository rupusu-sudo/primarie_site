import PageLayout from "@/components/PageLayout";
import { ShoppingCart, Gavel } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Achizitii = () => {
  return (
    <PageLayout 
      title="Achiziții Publice" 
      breadcrumbs={[
        { label: "Transparență", href: "/transparenta" }, 
        { label: "Achiziții Publice" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header aliniat cu restul paginilor */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Programul Anual de Achiziții Publice
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Consultați planurile de achiziții, anunțurile de participare și atribuirile de contracte desfășurate de Primăria Almăj.
            </p>
          </div>

          {/* Manager de documente cu categoriile specifice achizițiilor */}
          <AdminDocumentManager 
            categoryKey="achizitii-publice-almaj"
            title="Registru Achiziții"
            icon={Gavel}
            enableYearFilter={true}
            customCategories={["Plan Anual", "Anunțuri Participare", "Atribuiri", "Documentații"]}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Achizitii;