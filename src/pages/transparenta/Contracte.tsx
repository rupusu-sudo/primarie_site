import PageLayout from "@/components/PageLayout";
import { FileSignature, Handshake } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Contracte = () => {
  return (
    <PageLayout 
      title="Contracte și Concesiuni" 
      breadcrumbs={[
        { label: "Transparență", href: "/transparenta" }, 
        { label: "Contracte și Concesiuni" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* HEADER IDENTIC CU BUGET / ACHIZIȚII */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <FileSignature className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Contracte și <span className="text-blue-700">Concesiuni</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Registrul public al contractelor de administrare a bunurilor publice și private, 
              incluzând închirieri, concesionări și vânzări prin licitație.
            </p>
          </div>

          {/* MANAGER DE DOCUMENTE - FORMAT 1:1 */}
          <AdminDocumentManager 
            categoryKey="contracte-concesiuni-almaj"
            title="Registru Patrimoniu"
            icon={Handshake}
            enableYearFilter={true}
            customCategories={[
              "Contracte Concesiune", 
              "Contracte Închiriere", 
              "Vânzări Bunuri", 
              "Licitații Active",
              "Arhivă Contracte"
            ]}
          />

          {/* NOTĂ SUBSOL INSTITUȚIONALĂ */}
          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
               Date publicate conform Codului Administrativ privind transparența utilizării patrimoniului public.
             </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Contracte;