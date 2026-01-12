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
import { MessageSquarePlus, CheckCircle2, Loader2, LogIn, User } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useMember } from "@/hooks/useMember";
import { MemberLogin } from "@/components/MemberLogin";

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { member, isAuthenticated, isLoading: memberLoading, refetch: refetchMember } = useMember();
  
  const [formData, setFormData] = useState({
    type: 'new_platform' as 'new_platform' | 'correction' | 'feature_request',
    platformName: '',
    platformUrl: '',
    description: '',
  });

  const createSuggestion = trpc.suggestions.create.useMutation({
    onSuccess: (data) => {
      setSuccess(true);
      toast.success(data.message);
      
      // Reset after delay
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            type: 'new_platform',
            platformName: '',
            platformUrl: '',
            description: '',
          });
        }, 300);
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Senden. Bitte versuchen Sie es erneut.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    
    createSuggestion.mutate({
      ...formData,
      submitterName: member.name || undefined,
      submitterEmail: member.email,
    });
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
        ) : memberLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Anmeldung erforderlich</h3>
              <p className="text-slate-500 mb-4">Bitte melden Sie sich an, um einen Vorschlag einzureichen.</p>
              <MemberLogin 
                trigger={
                  <Button>
                    <LogIn className="h-4 w-4 mr-2" />
                    Jetzt anmelden
                  </Button>
                }
                onSuccess={() => refetchMember()}
              />
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
            
            {/* Show logged-in user info */}
            <div className="flex items-center gap-3 py-4 px-3 bg-slate-50 rounded-lg my-4 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-slate-900">{member?.name || member?.email.split('@')[0]}</p>
                <p className="text-slate-500">{member?.email}</p>
              </div>
            </div>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Art der Meldung</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie eine Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_platform">Neuer Anbieter</SelectItem>
                    <SelectItem value="correction">Korrekturvorschlag</SelectItem>
                    <SelectItem value="feature_request">Feature-Wunsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name des Anbieters / Betreff</Label>
                <Input 
                  id="name" 
                  placeholder="z.B. SuperAI GmbH" 
                  value={formData.platformName}
                  onChange={(e) => setFormData(prev => ({ ...prev, platformName: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Website URL (optional)</Label>
                <Input 
                  id="url" 
                  placeholder="https://..." 
                  value={formData.platformUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, platformUrl: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Beschreibung</Label>
                <Textarea 
                  id="message" 
                  placeholder="Bitte geben Sie Details an..." 
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createSuggestion.isPending} className="bg-slate-900 hover:bg-slate-800 text-white">
                {createSuggestion.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Absenden
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
