import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "cookieConsent";

type ConsentValue = "accepted" | "rejected";

const isStoredConsent = (value: string | null): value is ConsentValue =>
  value === "accepted" || value === "rejected";

export default function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(STORAGE_KEY);
      setIsVisible(!isStoredConsent(savedConsent));
    } catch {
      setIsVisible(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  const handleConsent = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Hide the banner even if localStorage is unavailable.
    }

    setIsVisible(false);
  };

  if (!isReady || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6">
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 mx-auto w-full max-w-5xl rounded-[1.5rem] border border-slate-700/80 bg-[#090E1A]/96 text-slate-100 shadow-[0_18px_50px_rgba(2,6,23,0.34)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-4 px-4 py-3.5 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-200">
                <Cookie className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                    <ShieldCheck className="h-3 w-3" />
                    Cookies
                  </span>
                  <h2
                    id="cookie-consent-title"
                    className="text-sm font-black tracking-tight text-white sm:text-[15px]"
                  >
                    Preferințe privind cookie-urile
                  </h2>
                </div>

                <p
                  id="cookie-consent-description"
                  className="mt-2 max-w-3xl text-xs font-medium leading-relaxed text-slate-300 sm:text-sm"
                >
                  Acest site utilizează cookie-uri pentru funcționarea corectă, îmbunătățirea experienței de utilizare și analiză statistică, conform Politicii de Cookies.
                </p>
                <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-400 sm:text-xs">
                  Puteți accepta sau respinge cookie-urile neesențiale în orice moment.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:justify-end">
            <button
              type="button"
              onClick={() => handleConsent("accepted")}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition-all hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1A] lg:min-w-[8.5rem]"
            >
              Acceptă
            </button>

            <button
              type="button"
              onClick={() => handleConsent("rejected")}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-900/60 px-4 text-sm font-bold text-slate-100 transition-all hover:border-slate-500 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1A] lg:min-w-[8.5rem]"
            >
              Respinge
            </button>

            <Link
              to="/politica-cookies"
              className="col-span-2 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1A] lg:col-span-1 lg:min-w-[10.5rem]"
            >
              Politica de Cookies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
