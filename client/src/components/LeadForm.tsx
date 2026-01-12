import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Send, FileText } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface LeadFormProps {
  platformName: string;
  platformId?: number;
}

export function LeadForm({ platformName, platformId }: LeadFormProps) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    employeeCount: '',
    interest: '' as 'demo' | 'quote' | 'trial' | 'info' | '',
    message: ''
  });

  const createLead = trpc.leads.create.useMutation({
    onSuccess: (data) => {
      setSuccess(true);
      toast.success(data.message);
      
      // Reset after delay
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            firstName: '',
            lastName: '',
            company: '',
            email: '',
            employeeCount: '',
            interest: '',
            message: ''
          });
        }, 300);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Senden. Bitte versuchen Sie es erneut.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createLead.mutate({
      platformId,
      platformName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      company: formData.company,
      employeeCount: formData.employeeCount,
      interest: formData.interest || 'info',
      message: formData.message || undefined
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm">
          <FileText className="mr-2 h-4 w-4" />
          Angebot anfordern
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Anfrage gesendet!</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Vielen Dank. Wir haben Ihre Anfrage an <strong>{platformName}</strong> weitergeleitet. Sie erhalten in Kürze eine Rückmeldung.
              </p>
            </div>
            <Button variant="outline" onClick={() => setOpen(false)} className="mt-4">
              Schließen
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl">Angebot anfordern</DialogTitle>
              <DialogDescription>
                Erhalten Sie ein unverbindliches Angebot direkt von <strong>{platformName}</strong>.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input 
                    id="firstName" 
                    required 
                    placeholder="Max" 
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input 
                    id="lastName" 
                    required 
                    placeholder="Mustermann" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Firma</Label>
                <Input 
                  id="company" 
                  placeholder="Musterfirma GmbH" 
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Geschäftliche E-Mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="name@firma.de" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees">Mitarbeiterzahl</Label>
                  <Select 
                    value={formData.employeeCount} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201+">201+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest">Interesse an</Label>
                  <Select 
                    value={formData.interest} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, interest: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Live Demo</SelectItem>
                      <SelectItem value="quote">Angebot</SelectItem>
                      <SelectItem value="trial">Testzugang</SelectItem>
                      <SelectItem value="info">Informationen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nachricht (optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Haben Sie spezifische Anforderungen?" 
                  className="min-h-[80px]"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              
              <div className="flex items-start gap-2 mt-2">
                <input type="checkbox" id="consent" required className="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                <Label htmlFor="consent" className="text-xs text-slate-500 font-normal leading-tight">
                  Ich stimme zu, dass meine Daten zur Bearbeitung der Anfrage an den Anbieter weitergeleitet werden.
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createLead.isPending} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                {createLead.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Anfrage absenden
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
