import React, { useState, useRef, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { useAuth } from "@/components/AuthContext";
import { Link } from "react-router-dom"; 
import { 
  TrendingUp, Building2, MapPin, Plus, Upload, Trash2, Mail, Globe, 
  Briefcase, Wheat, ArrowRight, Wallet, Users, Loader2, ShieldCheck,
  CheckCircle2, Zap, Plane, ChevronRight, ChevronLeft, FileText, Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/components/ui/use-toast";

// --- CONFIGURARE ---
const FORM_CATEGORIES = [
  { id: "Agricultură", icon: <Wheat className="w-4 h-4"/> },
  { id: "Industrie", icon: <Building2 className="w-4 h-4"/> },
  { id: "Energie Verde", icon: <Zap className="w-4 h-4"/> },
  { id: "Logistică", icon: <ArrowRight className="w-4 h-4"/> },
  { id: "Servicii", icon: <Users className="w-4 h-4"/> },
  { id: "Altele", icon: <Briefcase className="w-4 h-4"/> }
];

const JOB_TYPES = ["Full-time", "Part-time", "Sezonier", "Proiect"];

interface JobPosting {
  id: string;
  title: string;
  company: string;
  imageUrl?: string;
  category: string;
  type: string;
  publishDate: string;
  location: string;
  salary?: string;
  description?: string;
  requirements: string[];
  contactEmail: string;
  externalLink?: string;
  contentType: "text" | "poster";
}

const OportunitatiDeDezvoltare = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);

  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Bază, 2: Detalii, 3: Previzualizare
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "", company: "", imageUrl: "", imageFile: null as File | null,
    category: "", type: "Full-time", location: "Almăj", description: "",
    contactEmail: "", externalLink: "", salary: "",
    requirements: [] as string[],
    gdprConsent: false
  });

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // --- 1. VERIFICARE ADMIN ---
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { setIsAdmin(false); return; }
      try {
        const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
        if (data?.role === 'admin') setIsAdmin(true);
      } catch (e) { console.error(e); }
    };
    checkAdmin();
  }, [user]);

  // --- 2. FETCH JOBS ---
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const { data, error } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false });
      
      if (data && !error) {
        setJobs(data.map((item: any) => ({
            id: item.id,
            title: item.title,
            company: item.company,
            imageUrl: item.image_url,
            category: item.category || "General",
            type: item.type || "Full-time",
            publishDate: item.created_at,
            location: item.location || "Almăj",
            salary: item.salary,
            description: item.description,
            requirements: item.requirements || [],
            contactEmail: item.contact_email,
            externalLink: item.external_link,
            contentType: item.image_url ? "poster" : "text"
        })));
      } else {
        // Fallback Date Reale
        setJobs([
            {
                id: "demo1", title: "Operator Stație Biogaz (Viitor)", company: "Genesis Biopartner", category: "Energie Verde", type: "Full-time",
                publishDate: new Date().toISOString(), location: "Almăj", salary: "Confidențial",
                description: "Personal tehnic pentru viitoarea stație de cogenerare (2.99 MW). Training specializat asigurat.",
                requirements: ["Studii tehnice", "Cunoștințe operare PC"],
                contactEmail: "recrutare@genesisbiopartner.ro", contentType: "text"
            },
            {
                id: "demo2", title: "Manipulant Mărfuri", company: "Profi Logistic", category: "Logistică", type: "Full-time",
                publishDate: new Date().toISOString(), location: "DN6, Almăj", salary: "3.500 RON Net",
                description: "Personal pentru centrul logistic. Se oferă transport.",
                requirements: ["Fără cazier", "Rezistență efort"],
                contactEmail: "recrutare@profi.ro", contentType: "text"
            }
        ]);
      }
    } catch (err) { console.error(err); } finally { setLoadingJobs(false); }
  };
  useEffect(() => { fetchJobs(); }, []);

  // --- 3. DELETE JOB ---
  const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if(id.startsWith("demo")) {
        setJobs(prev => prev.filter(j => j.id !== id));
        toast({ title: "Șters", description: "Anunț demo eliminat." });
        return;
    }
    if (!confirm("Sigur ștergeți acest anunț?")) return;
    try {
        await supabase.from('job_postings').delete().eq('id', id);
        toast({ title: "Succes", description: "Anunț șters din baza de date." });
        fetchJobs();
    } catch (err) { toast({ title: "Eroare", description: "Nu s-a putut șterge.", variant: "destructive" }); }
  };

  // --- HANDLERS WIZARD ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageFile: file, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
        if (!formData.title || !formData.company || !formData.contactEmail) {
            toast({ title: "Date incomplete", description: "Vă rugăm completați titlul, compania și emailul.", variant: "destructive" });
            return;
        }
    }
    if (step === 2) {
        if (!formData.category || !formData.description) {
            toast({ title: "Date incomplete", description: "Selectați o categorie și adăugați o descriere.", variant: "destructive" });
            return;
        }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.gdprConsent) { toast({ title: "Eroare", description: "Acceptați politica GDPR.", variant: "destructive" }); return; }
    
    setIsSubmitting(true);
    
    if (isAdmin) {
        try {
            let publicUrl = "";
            if (formData.imageFile) {
                const fileName = `jobs/${Date.now()}_${formData.imageFile.name}`;
                const { error: upErr } = await supabase.storage.from('documente').upload(fileName, formData.imageFile);
                if (!upErr) {
                    const res = supabase.storage.from('documente').getPublicUrl(fileName);
                    publicUrl = res.data.publicUrl;
                }
            }
            await supabase.from('job_postings').insert([{
                title: formData.title, company: formData.company, category: formData.category, type: formData.type,
                location: formData.location, salary: formData.salary || "Confidențial", description: formData.description,
                requirements: [], contact_email: formData.contactEmail, external_link: formData.externalLink, image_url: publicUrl
            }]);
            toast({ title: "Publicat", description: "Jobul este acum activ." });
            fetchJobs();
            closeAndReset();
        } catch (err: any) { toast({ title: "Eroare DB", description: err.message, variant: "destructive" }); } 
        finally { setIsSubmitting(false); }
    } else {
        const templateParams = {
            subject: `JOB NOU: ${formData.title}`, from_name: formData.company, contact_email: formData.contactEmail,
            description: `Categorie: ${formData.category}\nTip: ${formData.type}\nSalariu: ${formData.salary}\n\nDescriere:\n${formData.description}`, 
            category: "Investiții"
        };
        try {
            await emailjs.send('service_kz54w39', 'template_iux5x4j', templateParams, 'dLtErg83Eo9yKtvTD');
            toast({ title: "Trimis", description: "Solicitarea a fost trimisă spre aprobare." });
            closeAndReset();
        } catch (err) { toast({ title: "Eroare Email", description: "Verificați conexiunea.", variant: "destructive" }); } 
        finally { setIsSubmitting(false); }
    }
  };

  const closeAndReset = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setFormData({ 
        title: "", company: "", imageUrl: "", imageFile: null, category: "", type: "Full-time", 
        location: "Almăj", description: "", contactEmail: "", externalLink: "", salary: "", 
        requirements: [], gdprConsent: false 
      });
    }, 300);
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Acasă", href: "/" }, { label: "Dezvoltare Economică" }]}>
      
      {/* 1. HERO SECTION */}
      <section className="hero-gradient relative overflow-hidden min-h-[400px] flex items-center justify-center text-center">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 fade-in duration-700">
            
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mx-auto hover:bg-white/20 transition-colors cursor-default">
              <TrendingUp className="w-4 h-4 text-blue-100" />
              <span className="text-sm font-medium tracking-wide text-white">Hub Economic Regional</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 leading-tight drop-shadow-md text-white">
              Investește în Viitorul
              <br />
              <span className="text-blue-100 opacity-95">Comunei Almăj</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
               Oportunități strategice la doar 18km de Craiova. Oferim acces direct la DN6, terenuri cu potențial industrial și agricol, plus o administrație deschisă parteneriatelor.
            </p>
            
            <div className="flex justify-center mb-16">
              <Button onClick={() => setIsModalOpen(true)} variant="secondary" size="lg" className="w-full sm:w-auto font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-blue-900 bg-white hover:bg-blue-50">
                <Plus className="w-5 h-5 mr-2 text-blue-700" />
                {isAdmin ? "Adaugă Job (Admin)" : "Postează Anunț Angajare"}
              </Button>
            </div>
            
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 hero-wave opacity-100"></div>
      </section>

      {/* 2. PILONI STABILI DE DEZVOLTARE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Piloni Stabili de Dezvoltare</h2>
                <p className="text-slate-600 text-lg">
                    Comuna Almăj se dezvoltă pe trei direcții strategice majore, atrăgând investiții sustenabile și pe termen lung.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                {/* Pilon 1: Industrie */}
                <div className="group border-l-4 border-blue-600 pl-6 hover:bg-blue-50/50 transition-colors duration-300 py-4 rounded-r-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
                            <Plane className="w-6 h-6"/>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Hub Aeronautic & Auto</h3>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        Parteneri precum <strong>Diehl Aviation</strong> și <strong>Formfleks</strong> confirmă potențialul industrial al zonei.
                    </p>
                    <ul className="space-y-2">
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600"/> Componente Aeronautice</li>
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600"/> Industria Automotive</li>
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600"/> Acces Logistic DN6</li>
                    </ul>
                </div>

                {/* Pilon 2: Energie Verde - GENESIS */}
                <div className="group border-l-4 border-emerald-500 pl-6 hover:bg-emerald-50/50 transition-colors duration-300 py-4 rounded-r-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-700">
                            <Leaf className="w-6 h-6"/>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Economie Circulară</h3>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        <strong>Genesis Biopartner</strong> dezvoltă o stație de biogaz de ultimă generație (~3 MW capacitate) în Almăj.
                    </p>
                    <ul className="space-y-2">
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Transformare Deșeuri Bio</li>
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Energie Regenerabilă</li>
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Producție Fertilizatori</li>
                    </ul>
                </div>

                {/* Pilon 3: Logistică */}
                <div className="group border-l-4 border-amber-500 pl-6 hover:bg-amber-50/50 transition-colors duration-300 py-4 rounded-r-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-100 rounded-lg text-amber-700">
                            <Zap className="w-6 h-6"/>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Logistică & Utilități</h3>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        Centrul logistic <strong>Profi</strong> și rețelele extinse de utilități susțin dezvoltarea rapidă a afacerilor.
                    </p>
                    <ul className="space-y-2">
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Depozitare Strategică</li>
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Iluminat Public Modern</li>
                        <li className="text-sm font-medium text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Suport Administrativ</li>
                    </ul>
                </div>
            </div>

            {/* Documente Suport */}
            <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-4 bg-white rounded-full border border-slate-100 shadow-md text-blue-600">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">Transparență Decizională</h4>
                        <p className="text-slate-500 text-sm">Consultați Planul Urbanistic General (PUG) și oportunitățile curente.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild className="border-slate-300 text-slate-700 font-bold bg-white hover:bg-slate-100 h-12">
                        <Link to="/contact">Contact Primărie</Link>
                    </Button>
                    <Button asChild className="bg-slate-900 text-white font-bold hover:bg-slate-800 h-12">
                        <Link to="/servicii/urbanism">
                            Vezi Documente Urbanism <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* 3. LISTA LOCURI DE MUNCĂ */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Locuri de Muncă Active</h2>
                <p className="text-slate-500 text-sm mt-1">Platforma oficială de recrutare locală.</p>
              </div>
              {isAdmin && <Badge className="bg-red-600">Admin Mode</Badge>}
           </div>

           {loadingJobs ? (
             <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto"/></div>
           ) : jobs.length > 0 ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} onClick={() => setSelectedJob(job)} className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 overflow-hidden group h-full flex flex-col relative bg-white">
                    <div className="relative h-2 bg-blue-600 w-full top-0 left-0 group-hover:h-3 transition-all"></div>
                    <CardHeader className="pb-3 pt-6">
                      <div className="flex justify-between items-start mb-3">
                         <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold uppercase text-[10px] tracking-wider">{job.category}</Badge>
                         <span className="text-xs font-bold text-slate-400">{new Date(job.publishDate).toLocaleDateString('ro-RO')}</span>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide"><Building2 className="w-3 h-3" /> {job.company}</div>
                    </CardHeader>
                    <CardContent className="pt-2 pb-6">
                       <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"><MapPin className="w-3 h-3 mr-1"/> {job.location}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium"><Wallet className="w-3 h-3 mr-1"/> {job.salary || "Confidențial"}</span>
                       </div>
                       <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                          <span className="text-xs font-bold text-slate-400">{job.type}</span>
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 font-bold">Detalii <ChevronRight className="w-4 h-4 ml-1"/></Button>
                       </div>
                    </CardContent>
                    
                    {isAdmin && (
                        <Button variant="destructive" size="icon" className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDeleteJob(job.id, e)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                  </Card>
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">Nu există anunțuri active momentan.</p>
             </div>
           )}
        </div>
      </section>

      {/* --- ADD JOB WIZARD MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-3xl p-0 border-none rounded-2xl shadow-2xl bg-white overflow-hidden max-h-[90vh] flex flex-col"
          aria-describedby={undefined}
        >
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">
                            {isAdmin ? "Panou Administrator" : "Publică un Anunț"}
                        </DialogTitle>
                        <p className="text-sm text-slate-500 mt-1">Completează detaliile pentru a găsi candidatul ideal.</p>
                    </div>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                    <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                    
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex flex-col items-center gap-2 ${step >= s ? 'text-blue-700' : 'text-slate-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>{s}</div>
                            <span className="text-xs font-bold uppercase tracking-wider bg-slate-50 px-2">{s === 1 ? 'Bază' : s === 2 ? 'Detalii' : 'Final'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                
                {/* STEP 1: BASICS */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">Titlu Job <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                    <Input placeholder="ex: Șofer Profesionist" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="pl-10 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"/>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">Companie <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                    <Input placeholder="ex: Transport SRL" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="pl-10 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"/>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">Email Contact <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                    <Input placeholder="hr@firma.ro" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="pl-10 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"/>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">Locație</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/>
                                    <Input placeholder="Almăj" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="pl-10 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"/>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Logo (Opțional)</Label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600"/>
                                </div>
                                <p className="text-sm font-medium text-slate-600">{formData.imageFile ? formData.imageFile.name : "Click pentru a încărca logo"}</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Categorie <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {FORM_CATEGORIES.map((cat) => (
                                    <div 
                                        key={cat.id}
                                        onClick={() => setFormData({...formData, category: cat.id})}
                                        className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-all ${formData.category === cat.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}
                                    >
                                        <div className={`p-2 rounded-full ${formData.category === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {cat.icon}
                                        </div>
                                        <span className={`font-bold text-sm ${formData.category === cat.id ? 'text-blue-700' : 'text-slate-600'}`}>{cat.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Tip Job</Label>
                            <div className="flex flex-wrap gap-2">
                                {JOB_TYPES.map(type => (
                                    <div 
                                        key={type}
                                        onClick={() => setFormData({...formData, type: type})}
                                        className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all border ${formData.type === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Descriere Detaliată <span className="text-red-500">*</span></Label>
                            <Textarea 
                                placeholder="Descrieți responsabilitățile, beneficiile și programul de lucru..." 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                className="min-h-[150px] text-base border-slate-300 focus:border-blue-500 rounded-xl p-4 resize-none leading-relaxed"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Salariu (Opțional)</Label>
                            <Input placeholder="ex: 3.500 - 4.500 RON" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="h-12 border-slate-300 rounded-xl"/>
                        </div>
                    </div>
                )}

                {/* STEP 3: PREVIEW */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            <p className="text-sm text-blue-800 font-medium">Verifică dacă datele sunt corecte. Acesta este modul în care anunțul va arăta pe site.</p>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm max-w-md mx-auto">
                            <div className="flex justify-between items-start mb-4">
                                <Badge className="bg-slate-100 text-slate-600 px-3 py-1 text-xs uppercase font-bold">{formData.category}</Badge>
                                <span className="text-xs font-bold text-slate-400">AZI</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{formData.title}</h3>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-4">
                                <Building2 className="w-4 h-4"/> {formData.company}
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 mb-4 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                                {formData.description}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> {formData.location}</span>
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Wallet className="w-3 h-3"/> {formData.salary || "Confidențial"}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                            <Checkbox id="gdpr" checked={formData.gdprConsent} onCheckedChange={(c) => setFormData({...formData, gdprConsent: c as boolean})} />
                            <label htmlFor="gdpr" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                Confirm că reprezint această companie și sunt de acord cu politica GDPR.
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                {step > 1 ? (
                    <Button variant="ghost" onClick={prevStep} className="font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 px-6 h-12 rounded-xl">
                        <ChevronLeft className="w-5 h-5 mr-1" /> Înapoi
                    </Button>
                ) : (
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 px-6 h-12 rounded-xl">Renunță</Button>
                )}

                {step < 3 ? (
                    <Button onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 h-12 rounded-xl shadow-lg">
                        Continuă <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting || !formData.gdprConsent} className={`text-white font-bold px-10 h-12 rounded-xl shadow-lg ${isAdmin ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Procesare...</> : (isAdmin ? "Publică Instant" : "Trimite Anunț")}
                    </Button>
                )}
            </div>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS MODAL */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent
          className="max-w-xl p-0 border-none rounded-2xl shadow-2xl bg-white overflow-hidden"
          aria-describedby={undefined}
        >
             <DialogTitle className="sr-only">Detalii anunț de angajare</DialogTitle>
             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                    <Badge className="bg-blue-600 text-white border-none mb-3 px-3 py-1 rounded-md text-xs font-bold tracking-wide">{selectedJob?.category}</Badge>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedJob?.title}</h2>
                    <div className="flex items-center gap-2 text-slate-600 mt-2 text-sm font-medium"><Building2 className="w-4 h-4 text-blue-500" /> <span>{selectedJob?.company}</span></div>
                </div>
            </div>
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100"><div className="text-xs text-slate-400 font-bold uppercase mb-1">Locație</div><div className="font-bold text-slate-700 flex items-center gap-2"><MapPin className="w-4 h-4"/> {selectedJob?.location}</div></div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100"><div className="text-xs text-green-600/70 font-bold uppercase mb-1">Salariu</div><div className="font-bold text-green-700 flex items-center gap-2"><Wallet className="w-4 h-4"/> {selectedJob?.salary || "Confidențial"}</div></div>
                </div>
                {selectedJob?.imageUrl && <img src={selectedJob.imageUrl} alt="Job" className="w-full rounded-xl border border-slate-100 shadow-sm" />}
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium text-lg">{selectedJob?.description}</div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm font-bold text-slate-500 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm"><Mail className="w-4 h-4 text-blue-500"/> {selectedJob?.contactEmail}</div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {selectedJob?.externalLink && (
                        <Button variant="outline" className="flex-1" asChild><a href={selectedJob.externalLink} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4 mr-2"/> Web</a></Button>
                    )}
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 shadow-lg shadow-blue-100" asChild><a href={`mailto:${selectedJob?.contactEmail}`}>Aplică Acum</a></Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>

    </PageLayout>
  );
};

export default OportunitatiDeDezvoltare;
