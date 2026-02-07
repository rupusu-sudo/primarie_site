import { History, Landmark, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const Istoric = () => {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Acasă", href: "/" },
        { label: "Istoric" },
      ]}
    >
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="hero-gradient rounded-xl p-6 lg:p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <History className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Istoricul Comunei Almăj</h1>
              <p className="text-white/80 mt-1">O istorie bogată din Epoca Bronzului până în prezent</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Origini */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Origini și Epoci Istorice
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-base leading-relaxed mb-4">
                    Istoria comunei <strong className="text-foreground">Almăj</strong> începe din <strong className="text-foreground">Epoca Bronzului</strong>, 
                    când pe aceste meleaguri s-a dezvoltat celebra <strong className="text-foreground">Cultură Coțofeni</strong>. Urmele arheologice 
                    descoperite în zonă atestă o continuitate de locuire care se întinde pe parcursul a mii de ani.
                  </p>
                  <p className="text-base leading-relaxed mb-4">
                    În <strong className="text-foreground">perioada dacică</strong>, regiunea a cunoscut o dezvoltare semnificativă, 
                    fiind situată pe drumurile comerciale care legau cetățile dacice din Oltenia de regiunile sudice 
                    ale Dunării.
                  </p>
                  <p className="text-base leading-relaxed">
                    De-a lungul evului mediu, comuna și-a păstrat caracterul rural, dezvoltându-se organic în jurul 
                    punctelor de referință naturale și a drumurilor care o traversau.
                  </p>
                </div>
              </div>
            </Card>

            {/* Cula Barbu Poenaru */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-blue-700 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  Cula Barbu Poenaru - Monument Istoric
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-base leading-relaxed mb-4">
                    Simbolul rezistenței locale și al patrimoniului cultural al comunei Almăj este 
                    <strong className="text-foreground"> Cula Barbu Poenaru</strong>, un monument istoric fortificat 
                    de o importanță deosebită pentru istoria Olteniei.
                  </p>
                  
                  <div className="bg-primary/5 rounded-lg p-4 my-6 border-l-4 border-primary">
                    <p className="text-sm font-medium text-foreground mb-2">Date istorice:</p>
                    <ul className="text-sm space-y-1 list-none pl-0 m-0">
                      <li><strong>Anul construcției:</strong> 1764</li>
                      <li><strong>Ctitor:</strong> Slugerul Barbu Poenaru</li>
                      <li><strong>Scop:</strong> Apărare împotriva otomanilor și haiducilor</li>
                      <li><strong>Statut:</strong> Monument istoric național</li>
                    </ul>
                  </div>

                  <p className="text-base leading-relaxed mb-4">
                    Cula a fost ridicată de <strong className="text-foreground">slugerul Barbu Poenaru</strong> în anul 
                    <strong className="text-foreground"> 1764</strong>, într-o perioadă marcată de instabilitate 
                    și amenințări constante din partea otomanilor și a bandelor de haiduci care operau în regiune.
                  </p>
                  <p className="text-base leading-relaxed">
                    Construcția reprezintă o <strong className="text-foreground">mărturie vie a arhitecturii vechi românești</strong>, 
                    fiind un exemplu remarcabil de arhitectură defensivă specifică Olteniei. Cu ziduri groase de piatră 
                    și cărămidă, turn de observație și ferestre înguste pentru apărare, cula a servit atât ca locuință 
                    pentru familia Poenaru, cât și ca punct de refugiu pentru locuitorii din împrejurimi în vremuri de primejdie.
                  </p>
                </div>
              </div>
            </Card>

            {/* Dezvoltare Modernă */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dezvoltare și Modernizare
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-base leading-relaxed mb-4">
                    În perioada modernă, comuna Almăj a cunoscut o dezvoltare constantă, păstrându-și 
                    în același timp caracterul autentic și tradițiile moștenite din generație în generație.
                  </p>
                  <p className="text-base leading-relaxed">
                    Astăzi, comuna reprezintă o îmbinare armonioasă între patrimoniul istoric și 
                    infrastructura modernă, oferind locuitorilor săi atât legătura cu trecutul glorios, 
                    cât și facilitățile necesare vieții contemporane.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Repere Cronologice */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Repere Cronologice
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-foreground">Epoca Bronzului</p>
                  <p className="text-xs text-muted-foreground">Cultura Coțofeni</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-4">
                  <p className="text-sm font-medium text-foreground">Perioada Dacică</p>
                  <p className="text-xs text-muted-foreground">Dezvoltare regională</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-sm font-medium text-foreground">1764</p>
                  <p className="text-xs text-muted-foreground">Construcția Culei Barbu Poenaru</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-foreground">1787-1789</p>
                  <p className="text-xs text-muted-foreground">Ctitorirea Bisericii „Sfinții Îngeri"</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-sm font-medium text-foreground">Prezent</p>
                  <p className="text-xs text-muted-foreground">Comună modernizată, cu tradiții vii</p>
                </div>
              </div>
            </Card>

            {/* Monument Protejat */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">Monument Istoric Protejat</h3>
              <p className="text-sm text-amber-700">
                Cula Barbu Poenaru este înscrisă în Lista Monumentelor Istorice din România 
                și beneficiază de protecție conform legislației în vigoare privind patrimoniul cultural.
              </p>
            </Card>

            {/* Vizitare */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-3">Informații Vizitare</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Locație:</strong> Sat Almăj, Comuna Almăj, Județul Dolj
                </p>
                <p>
                  <strong>Acces:</strong> Drum județean DJ 606
                </p>
                <p className="text-xs mt-3">
                  Pentru vizite ghidate, vă rugăm să contactați Primăria Almăj.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Istoric;
