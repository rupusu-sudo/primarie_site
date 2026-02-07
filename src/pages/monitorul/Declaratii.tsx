import React from "react";
import PageLayout from "@/components/PageLayout";
import { ShieldCheck, Users } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Declaratii: React.FC = () => {
  return (
    <PageLayout 
      title="Declarații de Avere și Interese" 
      breadcrumbs={[
        { label: "Monitor Oficial", href: "/monitorul-oficial" }, 
        { label: "Declarații de Avere și Interese" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introducere Secțiune */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Declarații de Avere și Interese
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Conform prevederilor legale privind integritatea în exercitarea funcțiilor și demnităților publice, 
              vă prezentăm declarațiile de avere și de interese ale reprezentanților instituției noastre.
            </p>
          </div>

          {/* Manager Documente - Categoriile vor fi detectate automat de AdminDocumentManager bazat pe ruta /monitorul-oficial/declaratii */}
          <AdminDocumentManager 
            categoryKey="declaratii-avere-interese"
            title="Arhivă Declarații"
            icon={Users}
            enableYearFilter={true}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Declaratii;