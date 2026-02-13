import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/api";

const LoginAdmin = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  const { login } = useAuth();
  const navigate = useNavigate();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-login-back]", { opacity: 0, y: -12, duration: 0.35 })
        .from(
          "[data-login-card]",
          { y: 28, opacity: 0, duration: 0.55, scale: 0.98 },
          "-=0.1"
        )
        .from(
          "[data-login-logo]",
          { y: 16, opacity: 0, duration: 0.35 },
          "-=0.3"
        )
        .from(
          "[data-login-field]",
          { y: 14, opacity: 0, duration: 0.3, stagger: 0.08 },
          "-=0.2"
        );

      gsap.to("[data-login-glow]", {
        y: 12,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef }
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Completeaza email si parola.");
      return;
    }

    setLoginState("loading");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Date incorecte");

      setLoginState("success");

      const nextRoute =
        String(data?.user?.role || "").toUpperCase() === "ADMIN" ? "/admin" : "/";

      setTimeout(() => {
        login({ token: data.token, user: data.user });
        toast.success(`Bun venit, ${data.user?.name || "Administrator"}!`);
        navigate(nextRoute);
      }, 750);
    } catch {
      setLoginState("idle");
      toast.error("Email sau parola gresita.");
    }
  };

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.2),transparent_42%),linear-gradient(160deg,#020617_0%,#0b1224_50%,#111827_100%)]" />
        <div data-login-glow className="absolute left-1/2 top-1/4 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div data-login-back>
          <Button asChild variant="ghost" className="text-slate-300 hover:bg-white/10 hover:text-white">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Inapoi la site
            </Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div
            data-login-card
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div data-login-logo className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
                <img src="/flavicon.png" alt="Stema Almaj" className="h-14 w-14 object-contain" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-white">
                Login Admin
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Acces securizat pentru panoul de administrare.
              </p>
            </div>

            {loginState === "success" ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 py-8 text-center">
                <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-300" />
                <p className="font-semibold text-emerald-100">Autentificare reusita</p>
                <p className="mt-1 text-sm text-emerald-200/80">Se deschide panoul admin...</p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div data-login-field className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-300">
                    Email oficial
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="admin@primarie.ro"
                      className="h-11 border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-slate-500 focus:border-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loginState === "loading"}
                    />
                  </div>
                </div>

                <div data-login-field className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-300">
                    Parola
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-slate-500 focus:border-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loginState === "loading"}
                    />
                  </div>
                </div>

                <div data-login-field className="pt-2">
                  <Button
                    type="submit"
                    className={cn(
                      "h-11 w-full bg-blue-600 font-bold text-white hover:bg-blue-500",
                      loginState === "loading" && "opacity-85"
                    )}
                    disabled={loginState === "loading"}
                  >
                    {loginState === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Autentificare
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div data-login-field className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <Link
                to="/admin"
                className="flex items-center justify-between text-sm font-semibold text-slate-200 transition-colors hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-blue-300" />
                  Panou Administrare
                </span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
