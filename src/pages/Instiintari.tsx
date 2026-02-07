import PageLayout from "@/components/PageLayout";
import AdminDocumentManager from "@/components/AdminDocumentManager";
import { BellRing } from "lucide-react";

const Instiintari = () => {
  return (
    <PageLayout title="Înștiințări" breadcrumbs={[{ label: "Înștiințări" }]}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
              <BellRing className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Înștiințări Cetățeni</h1>
            <div className="inline-block px-4 py-1 bg-orange-50 text-orange-700 text-xs font-black uppercase tracking-widest rounded-full border border-orange-100 mb-4">
              Alertă Locală
            </div>
            <p className="text-slate-600 text-lg font-medium">
              Notificări urgente și atenționări meteo.
              <br/>
              <span className="text-sm text-slate-400 italic">(Retenție automată: 5 ani)</span>
            </p>
          </div>

          <AdminDocumentManager 
            categoryKey="docs_instiintari" 
            title="Înștiințări"
            icon={BellRing}
            retentionYears={5}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Instiintari;