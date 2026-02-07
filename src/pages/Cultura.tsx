import { Theater, Church, GraduationCap, Music, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const Cultura = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Cultură" },
      ]}
    >
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="hero-gradient rounded-xl p-6 lg:p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Theater className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Cultură și Tradiții</h1>
              <p className="text-white/80 mt-1">Moștenirea culturală a comunei Almăj</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biserica Sfinții Îngeri */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Church className="w-5 h-5" />
                  Biserica „Sfinții Îngeri"
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-base leading-relaxed mb-4">
                    Moștenirea culturală a comunei Almăj include remarcabila <strong className="text-foreground">Biserica „Sfinții Îngeri"</strong>, 
                    un lăcaș de cult de o valoare istorică și artistică deosebită.
                  </p>

                  <div className="bg-purple-50 rounded-lg p-4 my-6 border-l-4 border-purple-600">
                    <p className="text-sm font-medium text-foreground mb-2">Date despre biserică:</p>
                    <ul className="text-sm space-y-1 list-none pl-0 m-0">
                      <li><strong>Perioada construcției:</strong> 1787-1789</li>
                      <li><strong>Ctitor:</strong> Barbu Poenaru</li>
                      <li><strong>Hram:</strong> Sfinții Arhangheli Mihail și Gavriil</li>
                      <li><strong>Element distinctiv:</strong> Pictură reprezentând domnitorul Nicolae Mavrogheni</li>
                    </ul>
                  </div>

                  <p className="text-base leading-relaxed mb-4">
                    Biserica a fost <strong className="text-foreground">ctitorită între 1787-1789</strong> de către 
                    <strong className="text-foreground"> Barbu Poenaru</strong>, același boier care a construit și 
                    celebra Culă ce îi poartă numele.
                  </p>
                  <p className="text-base leading-relaxed">
                    Lăcașul este renumit pentru <strong className="text-foreground">pictura murală</strong> care include 
                    o reprezentare a <strong className="text-foreground">domnitorului Nicolae Mavrogheni</strong>, 
                    domn al Țării Românești între 1786-1790. Această pictură conferă bisericii o valoare 
                    documentară excepțională, fiind una dintre puținele reprezentări contemporane ale domnitorului.
                  </p>
                </div>
              </div>
            </Card>

            {/* Tradiția Educațională */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Tradiția Educațională
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-base leading-relaxed mb-4">
                    Tradiția educațională a comunei Almăj are rădăcini adânci în istorie, fiind legată chiar 
                    de monumentele sale emblematice.
                  </p>
                  <p className="text-base leading-relaxed mb-4">
                    <strong className="text-foreground">Prima școală din zonă</strong> a funcționat chiar în 
                    <strong className="text-foreground"> incinta Culei Barbu Poenaru</strong>, demonstrând 
                    importanța pe care familia ctitoare o acorda învățământului și formării generațiilor viitoare.
                  </p>
                  <p className="text-base leading-relaxed">
                    Astăzi, această tradiție educațională continuă prin cele <strong className="text-foreground">trei 
                    unități școlare</strong> care funcționează în comună, asigurând educația copiilor din toate 
                    satele componente.
                  </p>
                </div>
              </div>
            </Card>

            {/* Călușarii din Moșneni */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Călușarii din Moșneni
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-base leading-relaxed mb-4">
                    <strong className="text-foreground">Sărbătoarea de Rusalii</strong> aduce în prim-plan una 
                    dintre cele mai spectaculoase tradiții ale comunei Almăj: <strong className="text-foreground">
                    jocul Călușarilor din Moșneni</strong>.
                  </p>
                  <p className="text-base leading-relaxed mb-4">
                    Călușul este un dans ritual masculin, parte a patrimoniului cultural imaterial al României, 
                    recunoscut de UNESCO. În comuna Almăj, ceata de călușari din satul Moșneni păstrează vie 
                    această tradiție ancestrală.
                  </p>
                  <p className="text-base leading-relaxed">
                    Îmbrăcați în costume tradiționale elaborate, purtând la picioare zurgălăi care ritmează 
                    pașii dansului, călușarii execută coregrafii complexe menite să aducă sănătate, belșug 
                    și să alunge spiritele rele din comunitate.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Evenimente Culturale */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Evenimente Tradiționale
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-red-500 pl-4">
                  <p className="text-sm font-medium text-foreground">Rusalii</p>
                  <p className="text-xs text-muted-foreground">Jocul Călușarilor din Moșneni</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-foreground">8 Noiembrie</p>
                  <p className="text-xs text-muted-foreground">Hramul Bisericii „Sfinții Îngeri"</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-sm font-medium text-foreground">Crăciun & Anul Nou</p>
                  <p className="text-xs text-muted-foreground">Colinde și obiceiuri de iarnă</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-4">
                  <p className="text-sm font-medium text-foreground">Paște</p>
                  <p className="text-xs text-muted-foreground">Tradițiile pascale</p>
                </div>
              </div>
            </Card>

            {/* Patrimoniu UNESCO */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Patrimoniu UNESCO</h3>
              <p className="text-sm text-blue-700">
                Jocul Călușarilor este înscris în Lista Reprezentativă a Patrimoniului Cultural 
                Imaterial al Umanității de către UNESCO din anul 2005.
              </p>
            </Card>

            {/* Unități Școlare */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Unități de Învățământ
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">Școala Gimnazială Almăj</p>
                  <p className="text-xs">Sat Almăj</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">Școala Primară Moșneni</p>
                  <p className="text-xs">Sat Moșneni</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">Grădinița cu Program Normal</p>
                  <p className="text-xs">Sat Almăj</p>
                </div>
              </div>
            </Card>

            {/* Contact Cultură */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-3">Informații Culturale</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pentru mai multe informații despre evenimentele culturale și tradițiile locale, 
                contactați Primăria Almăj.
              </p>
              <p className="text-sm">
                <strong>Tel:</strong>{" "}
                <a href="tel:0251447113" className="text-primary hover:underline">
                  0251 447 113
                </a>
              </p>
            </Card>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Cultura;
