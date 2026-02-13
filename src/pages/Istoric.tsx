import React, { useState } from "react";
import { 
  History, Landmark, MapPin, Calendar, Camera, 
  Upload, Info, CheckCircle, ChevronRight, BookOpen 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";

const HistoryTraditions = () => {
  const [activeTab, setActiveTab] = useState("cronologie");

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Istorie & Tradiții" },
      ]}
    >
      <main className="max-w-6xl mx-auto px-4 pb-12">
        
        {/* A) HERO SECTION */}
        <section className="relative rounded-2xl overflow-hidden mb-8 min-h-[400px] flex items-end">
          {/* Performance optimized background slot */}
          <picture className="absolute inset-0 z-0">
            <source srcSet="/assets/history/hero-1920.avif" media="(min-width: 1024px)" type="image/avif" />
            <source srcSet="/assets/history/hero-768.avif" media="(max-width: 767px)" type="image/avif" />
            <img 
              src="/assets/history/placeholder-hero.jpg" 
              alt="Peisaj Comuna Almăj"
              className="w-full h-full object-cover"
              width="1280"
              height="720"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          
          <div className="relative z-20 p-6 lg:p-12 text-white w-full">
            <Badge variant="outline" className="text-white border-white/40 mb-4 backdrop-blur-md">
              Imagini: în curs de actualizare
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-4">Istorie & Tradiții</h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mb-6">
              Descoperiți rădăcinile comunei Almăj, de la vestigiile culturii Coțofeni 
              până la moștenirea vie a vatra satului doljean.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Vezi Cronologia</Button>
              <Button size="lg" variant="secondary">Galerie Foto</Button>
            </div>
          </div>
        </section>

        {/* STICKY NAV (Mobile) */}
        <nav className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b mb-8 lg:hidden">
          <div className="flex overflow-x-auto py-3 no-scrollbar gap-4">
            {["Cronologie", "Repere", "Tradiții", "Galerie"].map((tab) => (
              <button key={tab} className="text-sm font-medium whitespace-nowrap px-4 py-1 rounded-full bg-muted">
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            
            {/* B) QUICK FACTS */}
            <section id="repere">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Sate", val: "4", sub: "Almăj, Bogea, Moșneni, Șitoaia" },
                  { label: "Prima Atestare", val: "1764", sub: "Cula Barbu Poenaru" },
                  { label: "Patrimoniu", val: "2", sub: "Monumente clasa A" },
                  { label: "Identitate", val: "Dolj", sub: "Câmpia Olteniei" },
                ].map((item, i) => (
                  <Card key={i} className="p-4 text-center border-primary/10 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</p>
                    <p className="text-2xl font-bold text-primary my-1">{item.val}</p>
                    <p className="text-[10px] leading-tight text-muted-foreground">{item.sub}</p>
                  </Card>
                ))}
              </div>
            </section>

            {/* C) TIMELINE */}
            <section id="cronologie">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <History className="text-primary" /> Cronologia Locală
              </h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {[
                  { t: "Epoca Bronzului", d: "Cultura Coțofeni - descoperiri arheologice locale." },
                  { t: "1764", d: "Construcția Culei Barbu Poenaru, punct defensiv strategic." },
                  { t: "1787", d: "Ctitorirea Bisericii Sf. Îngeri, pilon al spiritualității locale." },
                  { t: "Sec. XIX", d: "De completat din arhive locale (Documente mărire moșie)." },
                  { t: "Prezent", d: "Comună modernă ce conservă patrimoniul construit." },
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-hover:bg-primary text-slate-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <Card className="w-[calc(100%-4rem)] md:w-[45%] p-4 shadow-sm hover:border-primary/50 transition-all">
                      <time className="font-bold text-primary">{step.t}</time>
                      <p className="text-sm text-muted-foreground mt-1">{step.d}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* E) HERITAGE & LANDMARKS */}
            <section id="heritage" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Landmark className="text-primary" /> Patrimoniu Construit
              </h2>
              
              {/* Biserica Case Study */}
              <Card className="p-0 overflow-hidden border-2 border-primary/10">
                <div className="grid md:grid-cols-2">
                  <div className="bg-muted flex flex-col items-center justify-center p-8 text-center min-h-[250px] aspect-[4/3]">
                    <Camera className="w-12 h-12 text-muted-foreground/40 mb-4" />
                    <p className="text-sm font-medium">Fotografii în curs de publicare</p>
                    <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
                      Colectăm imagini de înaltă rezoluție cu Biserica "Sfinții Îngeri".
                    </p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Biserica "Sfinții Îngeri"</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ctitorită între anii 1787-1789, biserica reprezintă un punct focal al satului Almăj.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {["Exterior și clopotniță", "Pictura interioară", "Icoane de patrimoniu"].map((item) => (
                        <li key={item} className="text-xs flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Badge variant="secondary" className="font-normal text-[10px]">Sursă: Registrul Monumentelor Istorice</Badge>
                  </div>
                </div>
              </Card>
            </section>

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* G) CONTRIBUTION FORM */}
            <Card className="p-6 border-primary/20 bg-primary/5 shadow-none">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> Contribuie
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ai o fotografie veche sau o poveste despre Almăj? Ajută-ne să completăm arhiva digitală!
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Nume complet" className="w-full text-sm p-2 rounded border bg-background" />
                <input type="email" placeholder="Email" className="w-full text-sm p-2 rounded border bg-background" />
                <textarea placeholder="Povestea pe scurt..." className="w-full text-sm p-2 rounded border bg-background h-24" />
                <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Camera className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Încarcă Foto</p>
                </div>
                <div className="flex items-start gap-2 py-2">
                  <input type="checkbox" className="mt-1" id="gdpr" />
                  <label htmlFor="gdpr" className="text-[10px] text-muted-foreground leading-tight">
                    Sunt de acord cu publicarea materialului și confirm că dețin drepturile de autor.
                  </label>
                </div>
                <Button className="w-full">Trimite spre Moderare</Button>
                <p className="text-[9px] text-center text-muted-foreground italic">
                  * Materialele se publică doar după verificarea de către primărie.
                </p>
              </form>
            </Card>

            {/* INFO CARD */}
            <Card className="p-4 bg-muted/50 border-none shadow-none text-xs space-y-3">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <p><strong>Notă moderator:</strong> Se acceptă doar fotografii originale cu explicații clare privind locația și anul (aproximativ).</p>
              </div>
            </Card>
          </div>
        </div>

        {/* H) CONTENT ADMIN TOOLKIT (Editor Only) */}
        <section className="mt-16 pt-8 border-t border-dashed border-slate-300">
          <Accordion type="single" collapsible>
            <AccordionItem value="admin-notes" className="border-none">
              <AccordionTrigger className="bg-slate-100 px-4 rounded-lg hover:no-underline">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-600">
                  <BookOpen className="w-4 h-4" /> Workflow Admin (Editor Note)
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 border rounded-b-lg mt-1 space-y-4">
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">1. Procesare Imagini</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li>Descarcă pozele de pe FB (nu folosi link direct).</li>
                      <li>Redimensionează local (ex: Squoosh.app).</li>
                      <li>Optimizează: AVIF (75% q) + WebP fallback.</li>
                      <li>Naming: <code className="bg-slate-200 px-1">almaj-biserica-ext-1.avif</code></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">2. Dimensiuni Recomandate</h4>
                    <table className="w-full text-[11px] border-collapse">
                      <thead><tr className="border-b text-left"><th>Tip</th><th>Dimensiuni</th><th>Max Size</th></tr></thead>
                      <tbody>
                        <tr><td>Hero</td><td>1920x1080</td><td>150KB</td></tr>
                        <tr><td>Galerie</td><td>1200x800</td><td>120KB</td></tr>
                        <tr><td>Thumb</td><td>480x320</td><td>40KB</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </PageLayout>
  );
};

export default HistoryTraditions;