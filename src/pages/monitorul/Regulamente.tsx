import PageLayout from "@/components/PageLayout";
import { FileText, BookOpen } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Regulamente = () => {
  return (
    <PageLayout 
      title="Regulamente" 
      breadcrumbs={[
        { label: "Monitor Oficial", href: "/monitorul-oficial" }, 
        { label: "Regulamente" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Regulamente și Norme
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Consultați regulamentele de organizare, funcționare și normele interne adoptate de instituția noastră.
            </p>
          </div>

          <AdminDocumentManager 
            categoryKey="regulamente-oficiale"
            title="Arhivă Regulamente"
            icon={FileText}
            enableYearFilter={true}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Regulamente;