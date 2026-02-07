import PageLayout from "@/components/PageLayout";
import AdminDocumentManager from "@/components/AdminDocumentManager";
import { Building2, Landmark } from "lucide-react";

const Statut = () => {
  return (
    <PageLayout 
      title="Statutul Comunei" 
      breadcrumbs={[
        { label: "Monitor Oficial", href: "/monitorul-oficial" }, 
        { label: "Statutul Comunei" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* HEADER IDENTIC CU DECLARAȚII / BUGET / CONTRACTE */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Statutul Comunei <span className="text-blue-700">Almăj</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Documentul fundamental care stabilește reperele identitare, organizarea administrativă 
              și normele de funcționare ale comunității noastre.
            </p>
          </div>

          {/* MANAGER DE DOCUMENTE - FORMAT 1:1 */}
          <AdminDocumentManager 
            categoryKey="statut-comuna-almaj" 
            title="Arhivă Statut"
            icon={Landmark}
            // De obicei statutul nu se schimbă anual, dar lăsăm filtrul pentru istoricul modificărilor
            enableYearFilter={true} 
            customCategories={[
              "Statut Actualizat",
              "Modificări Statut",
              "Anexe Statut",
              "Istoric"
            ]}
          />

          {/* NOTĂ DE SUBSOL INSTITUȚIONALĂ */}
          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
               Documentația este publicată în conformitate cu prevederile Codului Administrativ al României.
             </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Statut;