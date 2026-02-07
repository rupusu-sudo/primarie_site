import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

const API_URL = 'http://localhost:3001';

interface LoginModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completează toate câmpurile!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Autentificare eșuată');
      }

      // Corecție: Trimitem obiectul { token, user }
      login({ token: data.token, user: data.user });

      toast.success(`Bun venit, ${data.user.name}!`);
      setEmail("");
      setPassword("");
      onClose(false);

    } catch (error: any) {
      toast.error(error.message || "Email sau parolă incorectă.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-black uppercase tracking-tighter text-slate-900">Acces Administrator</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Email Admin</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                type="email" 
                placeholder="admin@primarie.ro" 
                className="pl-9 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Parolă</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-9 h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase text-xs tracking-widest transition-all" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Logare Securizată"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;