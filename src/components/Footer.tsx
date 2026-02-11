import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  ChevronRight,
  FileText,
  ScrollText,
  ExternalLink,
  MessageSquareWarning,
  LayoutGrid,
  Cookie,
  ShieldCheck,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/servicii", label: "Portal Servicii" },
    { to: "/anunturi", label: "Anunțuri Publice" },
    { to: "/cariere", label: "Cariere & Concursuri" },
    { to: "/contact", label: "Audiențe & Contact" },
    { to: "/harta-site-ului", label: "Harta site-ului" },
  ];

  const transparencyLinks = [
    { to: "/monitorul-oficial", label: "Monitorul Oficial Local", icon: FileText },
    { to: "/transparenta/hcl", label: "Hotărâri Consiliu", icon: ScrollText },
    // opționale (dacă există paginile):
    { to: "/transparenta/buget", label: "Buget & Raportări", icon: FileText },
    { to: "/transparenta/achizitii", label: "Achiziții Publice", icon: FileText },
  ];

  const usefulExternal = [
    { href: "https://dj.prefectura.mai.gov.ro/", label: "Prefectura Dolj" },
    { href: "https://www.cjdolj.ro/", label: "Consiliul Județean Dolj" },
  ];

  const legalLinks = [
    { to: "/termeni", label: "Termeni" },
    { to: "/confidentialitate", label: "GDPR" },
    { to: "/cookies", label: "Cookies", icon: Cookie },
    // dacă vrei să păstrezi ANPC:
    { href: "https://anpc.ro", label: "ANPC", external: true },
    // opțional: ANSPDCP (autoritatea pe GDPR)
    { href: "https://www.dataprotection.ro/", label: "ANSPDCP", external: true },
  ];

  const baseLink =
    "inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1425] rounded-md";

  const chevron =
    "w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#0a1425] text-slate-300 font-sans">
      {/* accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-700" />

      {/* subtle background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-blue-700/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-12rem] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="container mx-auto px-4 py-14 lg:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* 1) BRAND + CTA */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-blue-700/25 bg-blue-700/10 group-hover:bg-blue-700 transition-all duration-300 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]">
                <Building2 className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white leading-tight uppercase tracking-tight">
                  Primăria Almăj
                </h3>
                <p className="text-[10px] text-blue-400 uppercase tracking-[0.22em] font-bold">
                  Județul Dolj
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Portalul oficial al administrației publice locale — transparență,
              servicii digitale și comunicare rapidă cu cetățenii.
            </p>

            {/* CTA modern */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/sesizari"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white font-black text-xs uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-lg shadow-blue-700/15
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1425]"
              >
                <MessageSquareWarning className="w-4 h-4" />
                Raportează o problemă
              </Link>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Primăria Almăj"
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900/50 border border-white/10 hover:bg-blue-700 hover:border-blue-700 transition-all shadow-lg
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1425]"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">
                Informații oficiale & actualizate
              </span>
            </div>
          </div>

          {/* 2) NAVIGARE RAPIDĂ */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.22em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Navigare Rapidă
            </h4>

            <ul className="space-y-3 text-sm font-bold">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={`${baseLink} group`}>
                    <ChevronRight className={chevron} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* mini “sitemap” vibe */}
            <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-slate-900/25">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white mb-2">
                <LayoutGrid className="w-4 h-4 text-blue-500" />
                Acces rapid
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Găsești rapid documente, anunțuri și formulare — optimizat pentru telefon.
              </p>
            </div>
          </div>

          {/* 3) TRANSPARENȚĂ */}
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.22em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Transparență
            </h4>

            <ul className="space-y-3 text-sm font-bold">
              {transparencyLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to} className={`${baseLink} group`}>
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}

              <li className="pt-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.22em] font-black mb-3">
                  Legături utile
                </p>
                <div className="space-y-2">
                  {usefulExternal.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${baseLink} text-xs`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {l.label}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* 4) CONTACT CARD */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/35 p-6 shadow-xl shadow-black/20">
            <h4 className="font-black text-white text-xs uppercase tracking-[0.22em] mb-5">
              Informații Contact
            </h4>

            <address className="not-italic">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-200/90 font-medium leading-relaxed">
                    Str. Principală, Nr. 1, Comuna Almăj, Jud. Dolj
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <a
                    href="tel:+40251449234"
                    className="text-slate-200 font-black tracking-tight hover:text-white transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1425] rounded-md"
                  >
                    0251 449 234
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                  <a
                    href="mailto:primariaalmaj@gmail.com"
                    className="text-slate-200 text-xs font-black truncate hover:text-white transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1425] rounded-md"
                  >
                    primariaalmaj@gmail.com
                  </a>
                </li>

                <li className="pt-4 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-[11px] uppercase font-black tracking-wider">
                      <p className="text-white mb-1">Program cu publicul</p>
                      <p className="text-slate-500">L–J: 08:00 – 16:30</p>
                      <p className="text-slate-500">V: 08:00 – 14:00</p>
                    </div>
                  </div>
                </li>
              </ul>
            </address>

            <button
              type="button"
              onClick={scrollToTop}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-200 hover:bg-slate-950/60 hover:text-white transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1425]"
            >
              <ArrowUp className="w-4 h-4 text-blue-400" />
              Sus în pagină
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#070e1a] border-t border-white/10">
        <div className="container mx-auto px-4 py-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
              © {currentYear} Instituția Primarului Comunei Almăj. Toate drepturile rezervate.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest">
              {legalLinks.map((l) =>
                l.external ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="text-slate-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                  >
                    {l.icon ? <l.icon className="w-3.5 h-3.5" /> : null}
                    {l.label}
                  </Link>
                )
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-slate-900/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Design:</span>
              <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">
                ruppz
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
