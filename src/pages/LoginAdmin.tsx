import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/api";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vă rugăm să completați datele.");
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

      if (!response.ok) throw new Error(data.error || 'Date incorecte');

      setLoginState('success');

      setTimeout(() => {
        login({ token: data.token, user: data.user });
        toast.success(`Bun venit, ${data.user.name || 'Admin'}!`);
        navigate("/");
      }, 1500);

    } catch (error: any) {
      setLoginState('idle');
      toast.error("Email sau parolă greșită.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden relative">
      
      <div className="absolute inset-0 z-0">
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1528410913249-e10df222ab9f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 w-full max-w-[400px] px-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center text-center space-y-6 mb-8">
            <div className="relative group">
                <div className="absolute -inset-6 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                <img 
                    src="/flavicon.png" 
                    alt="Stema Almăj" 
                    className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
                />
            </div>

            {/* Titlu */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-widest text-white uppercase leading-none drop-shadow-lg">
                    Primăria <span className="text-blue-500">Almăj</span>
                </h1>
                <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto my-3"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    Portal Administrativ
                </p>
            </div>
        </div>

        <div className="w-full bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl">
            
            {loginState === 'success' ? (
                <div className="py-8 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-white font-bold text-xl">Acces Permis</h3>
                    <p className="text-slate-400 text-sm mt-2">Redirecționare...</p>
                </div>
            ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    <div className="space-y-1.5 group">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 pl-1 group-focus-within:text-blue-400 transition-colors">
                            Email Oficial
                        </Label>
                        <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.02]">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <Input 
                                type="email" 
                                placeholder="admin@primarie.ro" 
                                className="pl-10 h-11 bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loginState === 'loading'}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 pl-1 group-focus-within:text-blue-400 transition-colors">
                            Parolă Acces
                        </Label>
                        <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.02]">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10 h-11 bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loginState === 'loading'}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            className={cn(
                                "w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-wide rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-300",
                                loginState === 'loading' ? "opacity-80" : "hover:-translate-y-0.5"
                            )}
                            disabled={loginState === 'loading'}
                        >
                            {loginState === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Autentificare <ChevronRight className="w-4 h-4 opacity-70" />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center opacity-30 hover:opacity-80 transition-opacity">
            <p className="text-[10px] text-slate-400 font-mono">
                SECURE SYSTEM ID: 843-ADM
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginAdmin;
