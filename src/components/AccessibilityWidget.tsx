import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "./AccessibilityProvider";
import { Accessibility, Eye, Minus, Plus, RefreshCcw, X } from "lucide-react";

type AccessibilityWidgetProps = {
  mode?: "header" | "floating";
  align?: "left" | "right";
  className?: string;
  triggerClassName?: string;
};

const fontSteps: { label: string; value: 100 | 115 | 130 }[] = [
  { label: "100%", value: 100 },
  { label: "115%", value: 115 },
  { label: "130%", value: 130 },
];

const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  mode = "floating",
  align = "right",
  className = "",
  triggerClassName = "",
}) => {
  const { font, contrast, motion, setFont, setContrast, setMotion } = useAccessibility();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isHeader = mode === "header";
  const fontIndex = fontSteps.findIndex((s) => s.value === font);
  const fontLabel = fontSteps[fontIndex]?.label ?? "100%";

  const panelStateClasses = useMemo(() => {
    const base = motion === "reduce" ? "duration-0" : "duration-200";
    return open
      ? `translate-y-0 opacity-100 pointer-events-auto scale-100 ${base}`
      : `translate-y-2 opacity-0 pointer-events-none scale-95 ${base}`;
  }, [open, motion]);

  const canDecreaseFont = fontIndex > 0;
  const canIncreaseFont = fontIndex < fontSteps.length - 1;

  const decreaseFont = () => {
    if (!canDecreaseFont) return;
    setFont(fontSteps[fontIndex - 1].value);
  };

  const increaseFont = () => {
    if (!canIncreaseFont) return;
    setFont(fontSteps[fontIndex + 1].value);
  };

  const toggleContrast = () => setContrast(contrast === "on" ? "off" : "on");
  const toggleMotion = () => setMotion(motion === "reduce" ? "normal" : "reduce");

  const enableLowVisionPreset = () => {
    setFont(130);
    setContrast("on");
    setMotion("reduce");
  };

  const resetSettings = () => {
    const next = { font: 100 as const, contrast: "off" as const, motion: "normal" as const };
    setFont(next.font);
    setContrast(next.contrast);
    setMotion(next.motion);

    // Persist immediately before refresh so defaults remain active after reload.
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      html.dataset.font = String(next.font);
      html.dataset.contrast = next.contrast;
      html.dataset.motion = next.motion;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("accessibility-settings-v1", JSON.stringify(next));
      window.setTimeout(() => window.location.reload(), 120);
    }
  };

  useEffect(() => {
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const containerClass = isHeader
    ? `relative ${className}`
    : `fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[70] ${className}`;

  const panelClass = isHeader
    ? `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 w-[min(92vw,340px)]`
    : "mb-3 w-[min(92vw,340px)]";

  return (
    <div ref={wrapperRef} className={containerClass}>
      <div
        className={`${panelClass} rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md transition-all origin-top-right z-[80] ${panelStateClasses}`}
        role="dialog"
        aria-label="Setari de accesibilitate"
        aria-hidden={!open}
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
            aria-label="Inchide panoul de accesibilitate"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <IconTile
            label="Text -"
            icon={<Minus className="h-4 w-4" />}
            onClick={decreaseFont}
            disabled={!canDecreaseFont}
            ariaLabel="Micsoreaza textul"
          />
          <IconTile
            label="Text +"
            icon={<Plus className="h-4 w-4" />}
            onClick={increaseFont}
            disabled={!canIncreaseFont}
            ariaLabel="Mareste textul"
          />
          <IconTile
            label="Alb/Negru"
            icon={<span className="text-[10px] font-black">B/W</span>}
            onClick={toggleContrast}
            active={contrast === "on"}
            ariaPressed={contrast === "on"}
            ariaLabel="Activeaza modul alb negru"
          />
          <IconTile
            label="Animatii"
            icon={<span className="text-[10px] font-black">R</span>}
            onClick={toggleMotion}
            active={motion === "reduce"}
            ariaPressed={motion === "reduce"}
            ariaLabel="Activeaza reducerea animatiilor"
          />
        </div>

        <Button
          variant="outline"
          className="mt-2 h-9 w-full justify-center gap-2 rounded-lg border-slate-200 text-slate-700"
          onClick={enableLowVisionPreset}
          aria-label="Activeaza preset pentru vedere scazuta"
        >
          <Eye className="h-4 w-4" />
          Preset vedere scazuta
        </Button>

        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-xs font-medium text-slate-600">
          Text: <span className="font-semibold text-slate-800">{fontLabel}</span> | Alb/Negru: <span className="font-semibold text-slate-800">{contrast === "on" ? "Activ" : "Inactiv"}</span> | Animatii: <span className="font-semibold text-slate-800">{motion === "reduce" ? "Reduse" : "Normale"}</span>
        </div>

        <Button
          variant="outline"
          className="mt-2.5 h-9 w-full justify-center gap-2 rounded-lg border-slate-200 text-slate-700"
          onClick={resetSettings}
          aria-label="Reseteaza setarile de accesibilitate"
        >
          <RefreshCcw className="h-4 w-4" />
          Reseteaza
        </Button>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className={`${isHeader ? "h-10 w-10" : "h-12 w-12"} rounded-full border border-slate-200 bg-white/95 text-blue-700 shadow-sm transition-all hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-300 ${triggerClassName}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Deschide setarile de accesibilitate"
      >
        <Accessibility className={isHeader ? "h-5 w-5" : "h-6 w-6"} />
      </Button>
    </div>
  );
};

export default AccessibilityWidget;

type IconTileProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel: string;
  active?: boolean;
  disabled?: boolean;
  ariaPressed?: boolean;
};

const IconTile: React.FC<IconTileProps> = ({
  icon,
  label,
  onClick,
  ariaLabel,
  active = false,
  disabled = false,
  ariaPressed,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    className={`h-14 rounded-xl border text-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? "border-blue-300 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-white hover:border-blue-200 hover:text-blue-700"
    }`}
  >
    <span className="flex h-full flex-col items-center justify-center gap-1">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">{icon}</span>
      <span className="text-[11px] font-semibold leading-none">{label}</span>
    </span>
  </button>
);
