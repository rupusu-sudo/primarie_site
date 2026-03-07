import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Building2,
  FileCheck,
  FileText,
  Megaphone,
  Plus,
  Scale,
  ScrollText,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/components/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

type MonitorSection = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  color: string;
  hoverBg: string;
  hoverBorder: string;
};

const sections: MonitorSection[] = [
  {
    title: "Statutul Comunei",
    desc: "Actul fundamental care reunește principiile de organizare și funcționare ale comunei.",
    href: "/monitorul-oficial/statut",
    icon: Building2,
    eyebrow: "Cadru administrativ",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Regulamente Locale",
    desc: "Norme și reguli de interes public, prezentate într-un format clar și ușor de urmărit.",
    href: "/monitorul-oficial/regulamente",
    icon: ScrollText,
    eyebrow: "Norme locale",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Hotărâri Consiliu (HCL)",
    desc: "Arhiva hotărârilor adoptate de Consiliul Local, organizată pentru consultare rapidă.",
    href: "/transparenta/hcl",
    icon: Scale,
    eyebrow: "Decizii oficiale",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Dispoziții Primar",
    desc: "Actele administrative emise de autoritatea executivă, disponibile în spațiul public.",
    href: "/dispozitii",
    icon: Megaphone,
    eyebrow: "Acte executive",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Buget și Finanțe",
    desc: "Documentele financiare ale administrației locale, publicate pentru transparență și informare.",
    href: "/buget",
    icon: Wallet,
    eyebrow: "Transparență bugetară",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    title: "Alte Documente",
    desc: "Rapoarte, declarații, anunțuri și alte materiale oficiale relevante pentru comunitate.",
    href: "/monitorul-oficial/alte-documente",
    icon: FileText,
    eyebrow: "Informări publice",
    color: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
];


const MonitorulOficial = () => {
  const { user } = useAuth();
  const isAdmin = !!user;
  const pageRef = useRef<HTMLElement>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState("docs_hcl");

  useEffect(() => {
    if (!pageRef.current) return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(pageRef);
      const heroLeft = q(".monitor-hero-left > *");
      const heroRight = q(".monitor-hero-right > *");
      const sectionIntro = q(".monitor-section-intro");
      const mobileList = q(".monitor-mobile-list");
      const mobileItems = q(".monitor-mobile-item");
      const desktopList = q(".monitor-desktop-list");
      const desktopItems = q(".monitor-desktop-item");

      if (heroLeft.length) {
        gsap.fromTo(
          heroLeft,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.11, ease: "power2.out" },
        );
      }

      if (heroRight.length) {
        gsap.fromTo(
          heroRight,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.68, stagger: 0.1, delay: 0.14, ease: "power2.out" },
        );
      }

      if (sectionIntro.length) {
        gsap.fromTo(
          sectionIntro,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionIntro[0],
              start: "top 88%",
            },
          },
        );
      }

      if (mobileItems.length) {
        gsap.fromTo(
          mobileItems,
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mobileList[0] || mobileItems[0],
              start: "top 90%",
            },
          },
        );
      }

      if (desktopItems.length) {
        gsap.fromTo(
          desktopItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: desktopList[0] || desktopItems[0],
              start: "top 85%",
            },
          },
        );
      }

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSave = () => {
    if (!title || !date) {
      toast.error("Vă rugăm să completați titlul și data.");
      return;
    }

    const existingData = localStorage.getItem(category);
    const docs = existingData ? JSON.parse(existingData) : [];

    const newDoc = {
      id: Date.now(),
      title,
      date,
      number,
      description: `Publicat oficial la data de ${new Date(date).toLocaleDateString("ro-RO")}`,
    };

    localStorage.setItem(category, JSON.stringify([newDoc, ...docs]));
    toast.success("Documentul a fost publicat în Monitorul Oficial.");
    setTitle("");
    setDate("");
    setNumber("");
    setOpen(false);
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Monitorul Oficial" }]}>
      <main ref={pageRef} className="w-full py-8">
        <section className="mx-auto flex max-w-[92rem] flex-col gap-8 overflow-x-hidden px-3 py-6 sm:px-5 sm:py-10 lg:gap-10 lg:px-6 xl:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10">
            <div className="monitor-hero-left order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:pr-5 lg:text-left xl:pr-7">
              <div className="gsap-optimize inline-flex">
                <Badge className="rounded-md border-0 bg-blue-50/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700 sm:text-xs">
                  Date oficiale
                </Badge>
              </div>

              <h1 className="gsap-optimize text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Monitorul Oficial
              </h1>

              <div className="gsap-optimize flex w-full flex-col gap-3 pt-2 sm:max-w-md lg:max-w-none">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Documente și informații oficiale ale administrației locale.
                </p>
                <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                  Accesați hotărâri, dispoziții, anunțuri și alte documente publice într-un spațiu digital clar,
                  organizat și ușor de consultat.
                </p>
              </div>

              {isAdmin && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="gsap-optimize h-12 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition-all hover:-translate-y-0.5 hover:bg-blue-700 sm:px-7">
                      <Plus className="mr-2 h-4 w-4" />
                      Publică document
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-[560px]">
                    <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5 sm:px-7">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                          Publicare document
                        </DialogTitle>
                        <DialogDescription className="pt-1 text-sm leading-relaxed text-slate-600">
                          Adăugați un nou act în secțiunea corespunzătoare din Monitorul Oficial.
                        </DialogDescription>
                      </DialogHeader>
                    </div>

                    <div className="grid gap-5 px-6 py-6 sm:px-7">
                      <div className="grid gap-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Categoria de arhivare
                        </label>
                        <Select onValueChange={setCategory} defaultValue="docs_hcl">
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white">
                            <SelectValue placeholder="Alege secțiunea" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="docs_hcl">Hotărâri Consiliu (HCL)</SelectItem>
                            <SelectItem value="docs_dispozitii">Dispoziții Primar</SelectItem>
                            <SelectItem value="docs_buget">Buget și Finanțe</SelectItem>
                            <SelectItem value="docs_regulamente">Regulamente</SelectItem>
                            <SelectItem value="docs_alte">Alte Documente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Titlul documentului
                        </label>
                        <Input
                          placeholder="Ex: Hotărârea nr. 45 din 2024"
                          className="h-12 rounded-xl border-slate-200 bg-white"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Număr act
                          </label>
                          <Input
                            placeholder="Nr. 10"
                            className="h-12 rounded-xl border-slate-200 bg-white"
                            value={number}
                            onChange={(event) => setNumber(event.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Data adoptării
                          </label>
                          <Input
                            type="date"
                            className="h-12 rounded-xl border-slate-200 bg-white"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50/50">
                        <FileCheck className="mb-3 h-9 w-9 text-slate-400" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Încărcare document PDF
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          Păstrați aceeași arhivare existentă; fișierul se atașează ulterior din fluxul actual.
                        </p>
                      </div>
                    </div>

                    <DialogFooter className="border-t border-slate-200 bg-white px-6 py-5 sm:px-7">
                      <Button
                        onClick={handleSave}
                        className="h-12 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition-all hover:bg-blue-700"
                      >
                        Confirmă publicarea
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="monitor-hero-right order-2 flex w-full flex-col border-t-4 border-blue-100 pt-5 lg:border-l-4 lg:border-t-0 lg:justify-between lg:pl-6 lg:py-1 xl:pl-8">
              <div className="gsap-optimize">
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <span className="h-px w-10 bg-blue-600" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Monitor public</p>
                </div>
                <h2 className="mt-4 text-center text-3xl font-black leading-tight text-slate-900 lg:text-left xl:text-4xl">
                  Informații oficiale într-un format clar și ușor de parcurs.
                </h2>
              </div>

              <p
                className="gsap-optimize mt-6 text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                Pagina reunește principalele categorii de documente publice ale administrației locale și oferă acces
                rapid către arhivele tematice. Structura păstrează un cadru sobru și folosește aceeași logică de
                navigare prezentă deja în secțiunea de transparență.
              </p>

              <div className="gsap-optimize mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-blue-200 px-6 text-sm font-bold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Link to="/transparenta/hcl">Vezi hotărârile publicate</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="categorii-oficiale"
          className="relative mx-auto max-w-7xl overflow-x-hidden px-4 pb-10 pt-2 sm:px-6 lg:px-8"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-slate-50 via-white to-blue-50/50 sm:rounded-[2.5rem]" />
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] opacity-[0.22] mix-blend-overlay sm:rounded-[2.5rem]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")',
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 lg:px-8">
            <div className="monitor-mobile-list -mx-8 grid grid-cols-2 gap-3 sm:mx-0 sm:gap-4 lg:hidden">
              {sections.map((section, index) => (
                <Link
                  key={`${section.title}-${index}-mobile`}
                  to={section.href}
                  className="monitor-mobile-item gsap-optimize group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-3.5 shadow-sm backdrop-blur-xl transition-all duration-300 outline-none active:scale-[0.99] active:shadow-none sm:min-h-[232px] sm:p-4"
                >
                  <div className="mb-2.5 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-300 sm:h-12 sm:w-12 ${section.color} ${section.hoverBg} group-active:text-white`}
                    >
                      <section.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-active:-translate-y-0.5 group-active:translate-x-0.5" />
                  </div>

                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {section.eyebrow}
                  </p>
                  <h3 className="text-sm font-black leading-tight text-slate-900 line-clamp-3 sm:text-base">
                    {section.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">
                    {section.desc}
                  </p>
                </Link>
              ))}
            </div>

            <div className="monitor-desktop-list hidden grid-cols-3 gap-6 lg:grid xl:gap-8">
              {sections.map((section, index) => (
                <Link
                  key={`${section.title}-${index}-desktop`}
                  to={section.href}
                  className="monitor-desktop-item gsap-optimize group block h-full outline-none"
                >
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-white hover:shadow-[0_22px_45px_-20px_rgba(15,23,42,0.35)] ${section.hoverBorder}`}
                  >
                    <div className={`absolute left-0 top-0 h-1 w-full opacity-0 transition-opacity duration-500 ${section.hoverBg} group-hover:opacity-100`} />

                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-500 ${section.color} ${section.hoverBg} group-hover:text-white`}
                      >
                        <section.icon className="h-6 w-6" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-900 group-hover:opacity-100" />
                    </div>

                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {section.eyebrow}
                    </p>
                    <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
                      {section.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-slate-500">{section.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default MonitorulOficial;
