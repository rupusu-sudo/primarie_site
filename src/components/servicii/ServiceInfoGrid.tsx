import { type LucideIcon } from "lucide-react";

export type ServiceInfoItem = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type ServiceInfoGridProps = {
  items: ServiceInfoItem[];
};

export const ServiceInfoGrid = ({ items }: ServiceInfoGridProps) => {
  const desktopColumnsClass =
    items.length <= 1
      ? "md:grid-cols-1"
      : items.length === 2
        ? "md:grid-cols-2"
        : items.length === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-4";

  return (
    <div className="rounded-[1.75rem] bg-slate-200 p-px overflow-hidden">
      <div className={`grid grid-cols-2 gap-px ${desktopColumnsClass}`}>
        {items.map((item) => (
          <article
            key={item.label}
            className="service-stagger-item flex min-h-[9.5rem] flex-col items-center justify-center bg-slate-50/80 px-4 py-6 text-center sm:min-h-[10rem] sm:px-6 sm:py-7 md:min-h-[10.5rem] md:px-8 md:py-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-600">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-[11px] uppercase font-bold tracking-widest text-slate-500">
              {item.label}
            </p>
            <p className="mt-2 max-w-[18rem] text-sm sm:text-base font-semibold leading-snug text-slate-900">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};
