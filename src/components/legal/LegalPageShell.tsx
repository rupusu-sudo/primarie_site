import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

import PageLayout from "@/components/PageLayout";
import { cn } from "@/lib/utils";
import {
  ServiceInfoGrid,
  type ServiceInfoItem,
} from "@/components/servicii/ServiceInfoGrid";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type LegalPageAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type LegalPageShellProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  lead: string;
  note: string;
  breadcrumbs: BreadcrumbItem[];
  infoItems: ServiceInfoItem[];
  actions?: LegalPageAction[];
  children: ReactNode;
};

type LegalSectionProps = {
  id: string;
  badge: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  accent?: "blue" | "slate";
  className?: string;
  children: ReactNode;
};

type LegalPanelProps = {
  className?: string;
  children: ReactNode;
};

type LegalContactCardProps = {
  className?: string;
};

const actionClassName = {
  base:
    "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 sm:h-14 sm:text-base",
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
  secondary:
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-blue-200 hover:bg-white hover:text-blue-700",
};

export function LegalPanel({ className, children }: LegalPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LegalNumberBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700 sm:h-9 sm:w-9 sm:text-sm">
      {value}
    </span>
  );
}

export function LegalSection({
  id,
  badge,
  icon: Icon,
  title,
  description,
  accent = "blue",
  className,
  children,
}: LegalSectionProps) {
  const badgeClassName =
    accent === "blue"
      ? "border border-blue-200 bg-blue-100/70 text-blue-700"
      : "border border-slate-300 bg-white text-slate-700";

  return (
    <section id={id} className={cn("space-y-4", className)} aria-labelledby={`${id}-title`}>
      <div className="space-y-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] sm:text-xs",
            badgeClassName,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {badge}
        </span>
        <h2
          id={`${id}-title`}
          className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function LegalContactCard({ className }: LegalContactCardProps) {
  return (
    <LegalSection
      id="contact"
      badge="Contact instituțional"
      icon={Mail}
      title="Contact"
      description="Pentru clarificări privind conținutul acestor documente, puteți contacta instituția prin canalele oficiale."
      className={className}
    >
      <LegalPanel className="space-y-4">
        <p className="text-lg font-black tracking-tight text-slate-900">
          Primăria Comunei Almăj
        </p>
        <div className="space-y-3 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
            <a
              href="mailto:primaria@almaj.ro"
              className="transition-colors hover:text-blue-700"
            >
              primaria@almaj.ro
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
            <a
              href="tel:0251449234"
              className="transition-colors hover:text-blue-700"
            >
              0251 449 234
            </a>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
            <span>Comuna Almăj, județul Dolj, România</span>
          </div>
        </div>
      </LegalPanel>
    </LegalSection>
  );
}

function LegalPageActionButton({ action }: { action: LegalPageAction }) {
  const className = cn(
    actionClassName.base,
    action.variant === "secondary"
      ? actionClassName.secondary
      : actionClassName.primary,
  );

  if (action.external || action.href.startsWith("#")) {
    return (
      <a
        href={action.href}
        className={className}
        {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {action.label}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={action.href} className={className}>
      {action.label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default function LegalPageShell({
  title,
  subtitle,
  lastUpdated,
  lead,
  note,
  breadcrumbs,
  infoItems,
  actions = [],
  children,
}: LegalPageShellProps) {
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <section className="mx-auto flex max-w-[92rem] flex-col gap-8 overflow-x-hidden px-3 py-6 sm:px-5 sm:py-10 lg:gap-10 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10">
          <div className="order-1 flex w-full flex-col items-center space-y-5 text-center lg:items-start lg:pr-5 lg:text-left xl:pr-7">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="rounded-md bg-blue-50/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700 sm:text-xs">
                Document oficial
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 sm:text-xs">
                Ultima actualizare: {lastUpdated}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <div className="max-w-3xl">
              <span className="text-base font-semibold text-slate-700 sm:text-lg">
                {subtitle}
              </span>
            </div>

            <div className="flex w-full flex-col gap-3 pt-2 text-sm font-medium text-slate-700 sm:text-base">
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Building2 className="h-5 w-5 text-blue-500" />
                Primăria Comunei Almăj
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Phone className="h-5 w-5 text-blue-500" />
                <a
                  href="tel:0251449234"
                  className="transition-colors hover:text-blue-600"
                >
                  0251 449 234
                </a>
              </span>
              <span className="flex items-center justify-center gap-3 lg:justify-start">
                <Mail className="h-5 w-5 text-blue-500" />
                <a
                  href="mailto:primaria@almaj.ro"
                  className="break-all transition-colors hover:text-blue-600"
                >
                  primaria@almaj.ro
                </a>
              </span>
            </div>

            {actions.length ? (
              <div className="flex w-full flex-wrap justify-center gap-4 pt-4 lg:hidden">
                {actions.map((action) => (
                  <LegalPageActionButton key={`${action.label}-${action.href}`} action={action} />
                ))}
              </div>
            ) : null}
          </div>

          <div className="order-3 flex w-full flex-col justify-between border-t-4 border-blue-100 pt-5 lg:order-2 lg:border-l-4 lg:border-t-0 lg:py-1 lg:pl-6 xl:pl-8">
            <div className="space-y-5">
              <p
                className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg"
                style={{ textIndent: "1.5rem" }}
              >
                {lead}
              </p>

              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-medium leading-relaxed text-slate-700 sm:px-5">
                {note}
              </div>
            </div>

            {actions.length ? (
              <div className="hidden flex-wrap gap-4 pt-6 lg:flex">
                {actions.map((action) => (
                  <LegalPageActionButton key={`${action.label}-${action.href}`} action={action} />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section aria-labelledby="legal-summary-title">
          <h2 id="legal-summary-title" className="sr-only">
            Informații rapide
          </h2>
          <ServiceInfoGrid items={infoItems} />
        </section>

        <div className="grid grid-cols-1 items-start gap-8 border-t border-slate-200 pt-8 sm:pt-10 lg:grid-cols-2 lg:gap-10">
          {children}
        </div>
      </section>
    </PageLayout>
  );
}
