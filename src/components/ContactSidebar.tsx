import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import { Phone, Mail, Calendar, CheckCircle2, User, Send, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    official: "", 
    date: "",
    reason: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.official || !formData.reason) {
      alert("Vă rugăm să completați toate câmpurile obligatorii (*).");
      return;
    }

    setIsSubmitting(true);

    const serviceId = 'service_kz54w39'; 
    const templateId = 'template_8c1l8s9'; 
    const publicKey = 'dLtErg83Eo9yKtvTD'; 

    const templateParams = {
      subject: `AUDIENȚĂ: ${formData.official.toUpperCase()}`,
      from_name: formData.name,
      contact_email: formData.email || "Nespecificat",
      phone: formData.phone,
      description: `
        DETALII SOLICITARE
        ==================
        Persoana solicitată: ${formData.official}
        Data Propusă: ${formData.date || "Oricând"}
        
        MOTIVUL AUDIENȚEI:
        ${formData.reason}
      `,
      category: "Secretariat / Audiențe",
      submission_date: new Date().toLocaleDateString('ro-RO'),
      // Folosim contract_type pentru a trimite data propusă în template-ul frumos
      contract_type: formData.date ? formData.date : "La disponibilitate"
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
    } catch (err) {
      console.error('Eroare EmailJS:', err);
      setIsSubmitting(false);
      alert("A apărut o eroare. Vă rugăm să sunați la primărie.");
    }
  };

  const closeAndReset = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setFormData({ name: "", phone: "", email: "", official: "", date: "", reason: "" });
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Contact Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Contact</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefon</p>
              <a href="tel:0251447113" className="font-medium text-foreground hover:text-primary transition-colors">
                0251 447 113
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <a href="mailto:primariaalmaj@yahoo.com" className="font-medium text-foreground hover:text-primary transition-colors break-all">
                primariaalmaj@yahoo.com
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Audiențe Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Program Audiențe</h3>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Înscrieri</p>
            <p className="text-sm text-muted-foreground">Luni - Vineri</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full shadow-md hover:shadow-lg transition-all">
          Programează audiență
        </Button>
      </Card>

      {/* Program Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Program de lucru</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Luni - Joi:</span>
            <span className="text-primary font-medium">8:00 - 16:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vineri:</span>
            <span className="text-primary font-medium">8:00 - 14:00</span>
          </div>
        </div>
      </Card>

      {/* MODAL PROGRAMARE */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden [&>button]:hidden"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Programare audiență</DialogTitle>
          
          {/* MESAJ DE SUCCES - AICI AM MODIFICAT TEXTUL */}
          {submissionSuccess ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Cerere Înregistrată!</h3>
              <p className="text-muted-foreground mt-3 mb-6 leading-relaxed">
                Solicitarea dumneavoastră a ajuns la noi. <br/>
                Un reprezentant al primăriei <strong>vă va contacta telefonic</strong> în cel mai scurt timp pentru a confirma data și ora exactă a audienței.
              </p>
              <Button onClick={closeAndReset} className="w-full">Am înțeles</Button>
            </div>
          ) : (
            <>
              <div className="p-6 border-b bg-muted/10 flex justify-between items-center">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" /> Formular Audiență
                </DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                
                {/* SELECTARE OFICIAL */}
                <div className="space-y-2">
                  <Label>Cu cine doriți audiență? <span className="text-red-500">*</span></Label>
                  <Select value={formData.official} onValueChange={v => setFormData({...formData, official: v})}>
                    <SelectTrigger><SelectValue placeholder="Alegeți persoana..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primar">Primar</SelectItem>
                      <SelectItem value="Viceprimar">Viceprimar</SelectItem>
                      <SelectItem value="Secretar General">Secretar General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DATA PREFERATĂ */}
                <div className="space-y-2">
                  <Label>Dată preferată (Opțional)</Label>
                  <Input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]} 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                  />
                  <p className="text-[11px] text-muted-foreground">
                    * Data aleasă este o propunere. Veți fi sunat pentru confirmare.
                  </p>
                </div>

                {/* NUME */}
                <div className="space-y-2">
                  <Label>Nume și Prenume <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input className="pl-9" placeholder="Numele dvs." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>

                {/* TELEFON */}
                <div className="space-y-2">
                  <Label>Telefon <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input className="pl-9" placeholder="07xx..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                {/* MOTIV */}
                <div className="space-y-2">
                  <Label>Motivul audienței <span className="text-red-500">*</span></Label>
                  <Textarea placeholder="Descrieți pe scurt problema..." className="min-h-[100px]" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                </div>
              </div>

              <div className="p-6 border-t bg-muted/10 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Anulează</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary min-w-[140px]">
                  {isSubmitting ? "Se trimite..." : <><Send className="w-4 h-4 mr-2" /> Trimite</>}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactSidebar;
