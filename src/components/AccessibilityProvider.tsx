import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type FontScale = 100 | 115 | 130;
type ContrastMode = "on" | "off";
type MotionMode = "reduce" | "normal";

type AccessibilityState = {
  font: FontScale;
  contrast: ContrastMode;
  motion: MotionMode;
};

type AccessibilityContextValue = AccessibilityState & {
  setFont: (font: FontScale) => void;
  setContrast: (mode: ContrastMode) => void;
  setMotion: (mode: MotionMode) => void;
};

const STORAGE_KEY = "accessibility-settings-v1";

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

const readPrefs = (): AccessibilityState => {
  if (typeof window === "undefined") return { font: 100, contrast: "off", motion: "normal" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { font: 100, contrast: "off", motion: "normal" };
    const parsed = JSON.parse(raw);
    return {
      font: parsed.font ?? 100,
      contrast: parsed.contrast ?? "off",
      motion: parsed.motion ?? "normal",
    };
  } catch {
    return { font: 100, contrast: "off", motion: "normal" };
  }
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [font, setFontState] = useState<FontScale>(() => readPrefs().font);
  const [contrast, setContrastState] = useState<ContrastMode>(() => readPrefs().contrast);
  const [motion, setMotionState] = useState<MotionMode>(() => {
    const stored = readPrefs().motion;
    if (prefersReducedMotion && stored === "normal") return "reduce";
    return stored;
  });

  const setFont = (value: FontScale) => setFontState(value);
  const setContrast = (value: ContrastMode) => setContrastState(value);
  const setMotion = (value: MotionMode) => setMotionState(value);

  // Persist + apply attributes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.dataset.font = String(font);
    html.dataset.contrast = contrast;
    html.dataset.motion = motion;

    const payload: AccessibilityState = { font, contrast, motion };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [font, contrast, motion]);

  const value = useMemo(
    () => ({ font, contrast, motion, setFont, setContrast, setMotion }),
    [font, contrast, motion]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
};

