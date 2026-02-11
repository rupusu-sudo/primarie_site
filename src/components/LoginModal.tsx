import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Loader2, ShieldCheck, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setLoginState('idle');
      setEmail("");
      setPassword("");
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completează toate câmpurile!");
      return;
    }

    setLoginState('loading');

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Eroare');

      setLoginState('success');

      setTimeout(() => {
        login({ token: data.token, user: data.user });
        toast.success(`Bun venit, ${data.user.name || 'Admin'}!`);
        onClose(false);
      }, 1500);

    } catch (error: any) {
      setLoginState('idle');
      toast.error(error.message || "Date incorecte.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
        <button onClick={() => onClose(false)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 z-50">
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-8 pt-10">
          <div className={cn("transition-all duration-500", loginState === 'success' ? "opacity-0 translate-y-10 hidden" : "opacity-100")}>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Panou Admin</h2>
              <p className="text-slate-500 text-sm">Autentificare securizată</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase text-slate-400">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input type="email" placeholder="admin@primarie.ro" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loginState === 'loading'} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase text-slate-400">Parolă</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loginState === 'loading'} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={loginState === 'loading'}>
                {loginState === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Conectare"}
              </Button>
            </form>
          </div>

          {loginState === 'success' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm animate-in fade-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Acces Aprobat!</h3>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
