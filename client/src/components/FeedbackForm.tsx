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
import { MessageSquarePlus, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSuccess(true);
    toast.success("Vielen Dank für Ihren Vorschlag!");
    
    // Reset after delay
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => setSuccess(false), 300);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
          <MessageSquarePlus className="h-4 w-4" />
          Anbieter vorschlagen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Vielen Dank!</h3>
              <p className="text-slate-500">Wir haben Ihren Vorschlag erhalten und werden ihn prüfen.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Anbieter vorschlagen</DialogTitle>
              <DialogDescription>
                Kennen Sie eine weitere DSGVO-konforme LLM-Plattform oder haben Sie einen Fehler gefunden?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Art der Meldung</Label>
                <Select defaultValue="new_provider" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie eine Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_provider">Neuer Anbieter</SelectItem>
                    <SelectItem value="correction">Korrekturvorschlag</SelectItem>
                    <SelectItem value="feature_request">Feature-Wunsch</SelectItem>
                    <SelectItem value="other">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name des Anbieters / Betreff</Label>
                <Input id="name" placeholder="z.B. SuperAI GmbH" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Beschreibung / Link</Label>
                <Textarea 
                  id="message" 
                  placeholder="Bitte geben Sie Details oder einen Link zur Website an..." 
                  className="min-h-[100px]"
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail (optional)</Label>
                <Input id="email" type="email" placeholder="ihre@email.de" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Absenden
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
