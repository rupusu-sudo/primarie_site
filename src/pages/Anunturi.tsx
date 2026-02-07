import PageLayout from "@/components/PageLayout";
import AdminDocumentManager from "@/components/AdminDocumentManager";
import { Bell } from "lucide-react";

const Anunturi = () => {
  return (
    <PageLayout title="Anunțuri" breadcrumbs={[{ label: "Anunțuri" }]}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Anunțuri Publice</h1>
            <p className="text-slate-600 text-lg font-medium">
              Comunicate oficiale, evenimente și informări de interes public.
              <br/>
              <span className="text-sm text-slate-400 italic">(Anunțurile sunt arhivate automat după 5 ani)</span>
            </p>
          </div>

          {/* COMPONENTA CU REGULA DE 5 ANI */}
          <AdminDocumentManager 
            categoryKey="docs_anunturi" 
            title="Anunțuri"
            icon={Bell}
            retentionYears={5} 
          />
          
        </div>
      </div>
    </PageLayout>
  );
};

export default Anunturi;