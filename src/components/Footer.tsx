import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Github,
  CodeXml,
  Clock,
  Navigation,
  Map,
  type LucideIcon,
} from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
};

type ContactItem = {
  icon: LucideIcon;
  value: React.ReactNode;
  href?: string;
};

type QuickAction = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type CreditItem = {
  icon: LucideIcon;
  href: string;
  prefix: string;
  accent: string;
};

const administrationLinks: FooterLink[] = [
  { label: "Primarul Comunei", href: "/primar" },
  { label: "Viceprimar", href: "/viceprimar" },
  { label: "Secretar General", href: "/secretar" },
  { label: "Consiliul Local", href: "/consiliul-local" },
  { label: "Organigramă", href: "/organizare" },
];

const transparencyLinks: FooterLink[] = [
  { label: "Hotărâri (HCL)", href: "/transparenta/hcl" },
  { label: "Buget & Finanțe", href: "/buget" },
  { label: "Achiziții Publice", href: "/achizitii" },
  { label: "Concursuri", href: "/cariere" },
  { label: "Declarații Avere", href: "/transparenta" },
];

const legalLinks: FooterLink[] = [
  { label: "Confidențialitate", href: "/politica-de-confidentialitate" },
  { label: "Cookies", href: "/politica-cookies" },
  { label: "Termeni și condiții", href: "/termeni-si-conditii" },
];

const credits: CreditItem[] = [
  {
    icon: Github,
    href: "https://github.com/rupusu-sudo",
    prefix: "Design by",
    accent: "rupusu-sudo",
  },
  {
    icon: CodeXml,
    href: "https://www.techconsult.ro/",
    prefix: "Powered by",
    accent: "Tech Consult",
  },
];

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);

  const wazeLink = "https://waze.com/ul?q=Primaria+Almaj+Dolj&navigate=yes";
  const mapsLink =
    "https://www.google.com/maps/dir/?api=1&destination=Primaria+Almaj+Dolj";

  const contactItems: ContactItem[] = [
    { icon: Phone, value: "0251 468 001", href: "tel:0251468001" },
    { icon: Mail, value: "primaria@almaj.ro", href: "mailto:primaria@almaj.ro" },
    {
      icon: MapPin,
      value: (
        <>
          Comuna Almăj, Județul Dolj
          <br />
          România
        </>
      ),
    },
  ];

  const quickActions: QuickAction[] = [
    { label: "Waze", href: wazeLink, icon: Navigation },
    { label: "Google Maps", href: mapsLink, icon: Map },
  ];

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return;
      }

      const elements = gsap.utils.toArray<HTMLElement>("[data-footer-item]", footer);
      if (!elements.length) {
        return;
      }

      const animateItems = () => {
        if (hasAnimatedRef.current) {
          return;
        }

        hasAnimatedRef.current = true;
        gsap.set(elements, { willChange: "transform, opacity" });
        gsap.from(elements, {
          opacity: 0,
          y: 22,
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.1,
          clearProps: "transform,opacity,willChange",
        });
      };

      if (footer.getBoundingClientRect().top <= window.innerHeight * 0.88) {
        animateItems();
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: footer,
        start: "top 88%",
        once: true,
        onEnter: animateItems,
      });

      return () => trigger.kill();
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative mt-auto overflow-hidden bg-slate-900 pb-12 pt-16 font-sans text-slate-300"
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-900" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-8">
          <div data-footer-item className="col-span-2 flex flex-col space-y-6 lg:col-span-4">
            <Link to="/" className="group flex w-fit items-center gap-4 outline-none">
              <img
                src="/flavicon.png"
                alt="Stema Almaj"
                className="h-12 w-12 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
              />
              <div>
                <h3 className="text-xl font-bold leading-none tracking-tight text-white">
                  Primăria
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  Comunei Almăj
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-400">
              Administrație locală digitalizată, orientată spre dezvoltare și servicii
              publice eficiente.
            </p>

            <div className="space-y-3 pt-2">
              {contactItems.map((item) => {
                const content = (
                  <>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition-colors group-hover:border-slate-700 group-hover:text-blue-200">
                      <item.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-medium leading-relaxed">
                      {item.value}
                    </span>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="group flex items-start gap-3 py-1 text-slate-400 transition-colors duration-300 hover:text-white"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div
                    key={String(item.value)}
                    className="group flex items-start gap-3 py-1 text-slate-400"
                  >
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 pt-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Acces rapid
              </p>
              <div className="flex flex-wrap gap-2.5">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-800 px-4 py-2 transition-all duration-300 hover:border-slate-600 hover:text-white"
                  >
                    <action.icon className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors group-hover:text-white">
                      {action.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div data-footer-item className="space-y-6 pt-2 lg:col-span-2 lg:pt-0">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Administrație
            </h4>
            <ul className="space-y-4">
              {administrationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-item className="space-y-6 pt-2 lg:col-span-2 lg:pt-0">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Transparență
            </h4>
            <ul className="space-y-4">
              {transparencyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-item className="col-span-2 space-y-6 pt-2 lg:col-span-4 lg:pt-0">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Informații utile
            </h4>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold tracking-wide text-white">
                  Program de funcționare
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Luni - Joi</span>
                  <span className="font-medium text-slate-200">08:00 - 16:30</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Vineri</span>
                  <span className="font-medium text-slate-200">08:00 - 14:00</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:text-blue-200"
              >
                Contactează-ne
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 border-t border-slate-800 pt-10 lg:flex-row lg:justify-between lg:gap-10">
          <div
            data-footer-item
            className="flex w-full flex-col items-center lg:w-auto lg:items-start"
          >
            <div className="w-full max-w-[336px] sm:max-w-[368px]">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                LEGAL
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
                <a
                  href="https://anpc.ro/ce-este-sal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full overflow-hidden rounded-lg bg-white transition-transform hover:scale-[1.02] sm:max-w-[176px]"
                >
                  <img
                    className="h-auto w-full bg-white p-0.5 sm:p-1"
                    src="https://wpfitness.eu/wp-content/uploads/2022/10/anpc-sal.png"
                    alt="ANPC SAL - Solutionarea Alternativa a Litigiilor"
                  />
                </a>

                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full overflow-hidden rounded-lg bg-white transition-transform hover:scale-[1.02] sm:max-w-[176px]"
                >
                  <img
                    className="h-auto w-full bg-white p-0.5 sm:p-1"
                    src="https://wpfitness.eu/wp-content/uploads/2022/10/anpc-sol.png"
                    alt="EU Online Dispute Resolution - Solutionarea online a litigiilor"
                  />
                </a>
              </div>
              <p className="mt-2 max-w-[336px] text-[9px] leading-relaxed text-slate-500 sm:max-w-[368px] sm:text-[10px]">
                Conform legislatiei privind solutionarea alternativa a litigiilor in
                domeniul protectiei consumatorilor.
              </p>
            </div>
          </div>

          <div
            data-footer-item
            className="flex w-full flex-1 flex-col items-center gap-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-6 lg:gap-y-3"
          >
            <div className="flex w-full max-w-[500px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center lg:w-auto lg:max-w-none lg:justify-end lg:text-right">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  {index > 0 ? (
                    <span className="hidden text-[11px] font-bold text-slate-700 sm:inline">
                      •
                    </span>
                  ) : null}
                  <Link
                    to={link.href}
                    className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-300 sm:text-[11px]"
                  >
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>

            <p className="text-center text-[11px] font-bold tracking-wide text-slate-600 lg:text-right">
              © {currentYear} Primăria Comunei Almăj. Toate drepturile rezervate.
            </p>

            <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5 lg:justify-end">
              {credits.map((credit) => (
                <a
                  key={credit.href}
                  href={credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] font-medium text-slate-500 transition-colors hover:text-white"
                >
                  <credit.icon className="h-3.5 w-3.5" />
                  <span>
                    {credit.prefix}{" "}
                    <span className="font-bold text-slate-300">{credit.accent}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
