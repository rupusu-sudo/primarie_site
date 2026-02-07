import PageLayout from "@/components/PageLayout";
import { Wallet, PieChart } from "lucide-react";
import AdminDocumentManager from "@/components/AdminDocumentManager";

const Buget = () => {
  return (
    <PageLayout 
      title="Buget Local" 
      breadcrumbs={[
        { label: "Transparență", href: "/transparenta" }, 
        { label: "Buget Local" }
      ]}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Identic cu Declarații/Achiziții */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-700 mb-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Bugetul Comunei Almăj
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Transparență totală în utilizarea banului public. Consultați proiectele de buget, 
              rectificările și execuția bugetară anuală.
            </p>
          </div>

          {/* Manager de documente cu filtre de căutare și categorii de buget */}
          <AdminDocumentManager 
            categoryKey="buget-local-almaj"
            title="Arhivă Financiară"
            icon={PieChart}
            enableYearFilter={true}
            customCategories={[
              "Proiect Buget", 
              "Buget Aprobat", 
              "Rectificări Bugetare", 
              "Execuție Bugetară", 
              "Situații Financiare"
            ]}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Buget;