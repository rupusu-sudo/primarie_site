import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      // CORECorecție: Trimitem datele ca obiect { token, user }
      login({ token: data.token, user: data.user });
      
      toast.success(`Bun venit, ${data.user.name || 'Admin'}!`);
      navigate("/"); 

    } catch (err: any) {
      setError(err.message || "Eroare de conexiune.");
      toast.error("Autentificare eșuată.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl overflow-hidden">
        <div className="h-2 bg-blue-600 w-full"></div>
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Lock className="h-8 w-8 text-blue-700" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900">Acces Administrativ</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-base">Portal Securizat Primărie</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-bold text-xs uppercase ml-2">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500 ml-1">Email Oficial</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  type="email" 
                  placeholder="admin@primarie.ro" 
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 transition-all text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500 ml-1">Parolă Acces</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 transition-all text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-black uppercase text-xs tracking-widest shadow-lg transition-all" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificare...</> : "Autentificare Securizată"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-slate-50/50 pb-8 pt-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest w-full text-center">Doar personalul autorizat</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginAdmin;