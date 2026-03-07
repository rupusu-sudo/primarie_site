import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, Gavel, Banknote, ShoppingCart, FileSignature, 
  ArrowRight, Calendar, Eye 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PDFViewer from "@/components/PDFViewer";

const PublicDocumentsSection = () => {
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const handleOpenDoc = (title: string, url: string) => {
    setPreviewDoc(url);
    setPreviewTitle(title);
  };

  const recentDocs = [
    {
      id: 1,
      title: "Hotărârea nr. 47/2025 privind bugetul local",
      type: "Hotărâre",
      date: "Ieri",
      url: "/documents/hotarari/2025/hcl_47.pdf" 
    },
    {
      id: 2,
      title: "Raport execuție bugetară Trimestrul IV 2024",
      type: "Raport",
      date: "2 zile în urmă",
      url: "/documents/buget/2024/executie_q4.pdf"
    },
    {
      id: 3,
      title: "Anunț licitație publică - Asfaltare străzi",
      type: "Achiziții",
      date: "Săptămâna trecută",
      url: "/documents/achizitii/anunt_asfaltare.pdf"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Documente Publice & Transparență</h2>
            <p className="text-slate-600">Acces direct la actele administrative, buget și hotărâri.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/monitorul-oficial">
              Arhivă completă <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/transparenta" className="group">
              <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-blue-600 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Gavel className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary">2025</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Hotărâri Consiliul Local</h3>
                  <p className="text-sm text-slate-500">Deciziile și hotărârile adoptate recent.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/monitorul-oficial/buget" className="group">
              <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-green-600 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Actualizat</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Bugetul Local</h3>
                  <p className="text-sm text-slate-500">Execuție bugetară, bilanțuri și rapoarte.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/anunturi" className="group">
              <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-orange-500 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary">SEAP</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Achiziții Publice</h3>
                  <p className="text-sm text-slate-500">Proceduri de licitație și contracte.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/monitorul-oficial/alte-documente" className="group">
              <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-purple-500 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <FileSignature className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary">Arhivă</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Alte Documente</h3>
                  <p className="text-sm text-slate-500">Contracte, rapoarte și diverse acte.</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card className="lg:col-span-1 h-full flex flex-col border-none shadow-md">
            <div className="p-5 border-b bg-white rounded-t-xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Ultimele încărcate
              </h3>
            </div>
            <CardContent className="p-0 flex-1 bg-white rounded-b-xl">
              <div className="divide-y">
                {recentDocs.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] h-5">{doc.type}</Badge>
                      <span className="text-xs text-slate-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {doc.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 leading-snug mb-3 line-clamp-2">
                      {doc.title}
                    </h4>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full h-8 text-xs"
                        onClick={() => handleOpenDoc(doc.title, doc.url)}
                      >
                        <Eye className="w-3 h-3 mr-1.5" /> Vizualizează
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-slate-50 rounded-b-xl">
                <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-white" asChild>
                  <Link to="/monitorul-oficial">
                    Vezi arhiva completă
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col" aria-describedby={undefined}>
          <DialogHeader className="px-6 py-4 border-b bg-white shrink-0">
            <DialogTitle className="truncate pr-8 text-base">{previewTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
            {previewDoc ? (
              // MODIFICAT: Trimitem și funcția onClose
              <PDFViewer 
                url={previewDoc} 
                className="w-full h-full border-none"
                onClose={() => setPreviewDoc(null)} 
              />
            ) : (
              <div className="text-slate-400">Document indisponibil în demo</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PublicDocumentsSection;
