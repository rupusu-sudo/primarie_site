import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "./AccessibilityProvider";
import { Settings2, Minus, Plus, Accessibility, X, RefreshCcw, ChevronRight } from "lucide-react";

type AccessibilityWidgetProps = {
  mode?: "floating" | "header";
  align?: "left" | "right";
  triggerClassName?: string;
};

const fontSteps: { label: string; value: 100 | 115 | 130 }[] = [
  { label: "100%", value: 100 },
  { label: "115%", value: 115 },
  { label: "130%", value: 130 },
];

const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({ mode = "floating", align = "right", triggerClassName = "" }) => {
  const { font, contrast, motion, setFont, setContrast, setMotion } = useAccessibility();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const isHeader = mode === "header";
  const isDesktopHeader = useMemo(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
    []
  );

  const handleFontChange = (direction: "up" | "down") => {
    const idx = fontSteps.findIndex((s) => s.value === font);
    const next = direction === "up" ? Math.min(idx + 1, fontSteps.length - 1) : Math.max(idx - 1, 0);
    setFont(fontSteps[next].value);
  };

  const resetSettings = () => {
    setFont(100);
    setContrast("off");
    setMotion("normal");
  };

  const panelStateClasses = useMemo(() => {
    const base = motion === "reduce" ? "duration-0" : "duration-180";
    return open
      ? `translate-y-0 opacity-100 pointer-events-auto ${base}`
      : `-translate-y-1 opacity-0 pointer-events-none ${base}`;
  }, [open, motion]);

  // Închide panoul când utilizatorul derulează, ca să nu acopere textul prea mult timp.
  React.useEffect(() => {
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={isHeader ? "relative" : ""}>
      <div
        className={`${
          isHeader
            ? isDesktopHeader
              ? `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2`
              : "fixed left-3 right-auto"
            : "fixed left-2 sm:left-4"
        } z-50 w-[clamp(260px,80vw,320px)] space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-md transition-all ${panelStateClasses}`}
        style={isHeader && !isDesktopHeader ? { top: "72px" } : undefined}
        aria-hidden={!open}
        aria-live="polite"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Accessibility className="h-4 w-4 text-blue-600" />
            Accesibilitate
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(false)}
            aria-label="Închide setările de accesibilitate"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <MenuRow
          icon={<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">A+</span>}
          label="Mărește fontul"
          action={() => handleFontChange("up")}
          actionIcon={<Plus className="h-4 w-4" />}
        />
        <MenuRow
          icon={<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">A-</span>}
          label="Micșorează fontul"
          action={() => handleFontChange("down")}
          actionIcon={<Minus className="h-4 w-4" />}
        />
        <MenuRow
          icon={<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-800">B/W</span>}
          label="Alb și negru"
          toggle={
            <Switch
              checked={contrast === "on"}
              onCheckedChange={(v) => setContrast(v ? "on" : "off")}
              aria-label="Activează modul alb și negru"
            />
          }
        />
        <MenuRow
          icon={<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">R</span>}
          label="Reduce animațiile"
          toggle={
            <Switch
              checked={motion === "reduce"}
              onCheckedChange={(v) => setMotion(v ? "reduce" : "normal")}
              aria-label="Activează reduce motion"
            />
          }
        />
        <Button
          variant="outline"
          className="mt-1 w-full justify-center gap-2"
          onClick={resetSettings}
          aria-label="Resetează setările de accesibilitate"
        >
          <RefreshCcw className="h-4 w-4" />
          Resetează
        </Button>
      </div>

      <Button
        size="lg"
        variant={isHeader ? "ghost" : "ghost"}
        className={`${
          isHeader
            ? "relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-blue-700 shadow-sm"
            : "fixed top-4 left-3 h-11 w-11 rounded-full border border-slate-200 bg-white/90 text-blue-700 shadow-sm"
        } transition-transform transition-opacity ${
          open || !collapsed ? "translate-y-0 opacity-95" : isHeader ? "-translate-y-1 opacity-60" : "-translate-y-2 opacity-50"
        } hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-300 ${triggerClassName}`}
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => !open && setCollapsed(true)}
        onFocus={() => setCollapsed(false)}
        onBlur={() => !open && setCollapsed(true)}
        aria-expanded={open}
        aria-label="Deschide setările de accesibilitate"
      >
        <Accessibility className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AccessibilityWidget;

type MenuRowProps = {
  icon: React.ReactNode;
  label: string;
  action?: () => void;
  actionIcon?: React.ReactNode;
  toggle?: React.ReactNode;
};

const MenuRow: React.FC<MenuRowProps> = ({ icon, label, action, actionIcon, toggle }) => (
  <div className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-800 hover:bg-slate-50 focus-within:bg-slate-50">
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-semibold">{label}</span>
    </div>
    {toggle ? (
      toggle
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-blue-700 hover:bg-blue-50"
        onClick={action}
        aria-label={label}
      >
        {actionIcon ?? <Plus className="h-4 w-4" />}
      </Button>
    )}
  </div>
);
