import { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Map,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Home,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";

const quickLinks = [
  {
    title: "Monitorul Oficial",
    desc: "Publică și gestionează documentele oficiale.",
    href: "/monitorul-oficial",
    icon: FileText,
  },
  {
    title: "Anunțuri",
    desc: "Administrează comunicările publice.",
    href: "/anunturi",
    icon: Megaphone,
  },
  {
    title: "Vocea Almăjului",
    desc: "Răspunde și moderează sesizările cetățenilor.",
    href: "/vocea-almajului",
    icon: MessageCircle,
  },
  {
    title: "Harta Digitală",
    desc: "Editează punctele de interes din hartă.",
    href: "/harta-digitala",
    icon: Map,
  },
];

const AdminPanel = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { user, isAdmin } = useAuth();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-admin-hero]", { y: 28, opacity: 0, duration: 0.55 })
        .from(
          "[data-admin-meta]",
          { y: 18, opacity: 0, duration: 0.45 },
          "-=0.3"
        )
        .from(
          "[data-admin-card]",
          { y: 24, opacity: 0, duration: 0.45, stagger: 0.08 },
          "-=0.2"
        );
    },
    { scope: rootRef }
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Acces restricționat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Contul conectat nu are rol de administrator.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Înapoi la homepage
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card
          data-admin-hero
          className="overflow-hidden border-blue-100 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white shadow-xl"
        >
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <Badge className="bg-white/15 text-white border-white/20">
                    Panou Administrare
                  </Badge>
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Control Primăria Almăj
                </h1>
                <p className="max-w-xl text-sm text-blue-100">
                  Bun venit, {user.name || "Administrator"}. De aici gestionezi modulele
                  publice ale portalului.
                </p>
              </div>

              <div data-admin-meta className="rounded-2xl bg-white/10 p-4 text-sm backdrop-blur">
                <p className="text-blue-100">Status</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  Admin activ
                </p>
                <p className="mt-2 text-xs text-blue-100/80">
                  {new Date().toLocaleString("ro-RO")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {quickLinks.map((item) => (
            <Card
              key={item.href}
              data-admin-card
              className="border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base text-slate-900">
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{item.desc}</p>
                <Button asChild variant="outline" className="w-full justify-between border-slate-200">
                  <Link to={item.href}>
                    Deschide modul
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
