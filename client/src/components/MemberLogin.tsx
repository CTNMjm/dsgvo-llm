import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMember } from "@/hooks/useMember";
import { toast } from "sonner";
import { Mail, Loader2, LogIn, User, LogOut, KeyRound } from "lucide-react";
import { Link } from "wouter";

interface MemberLoginProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function MemberLogin({ trigger, onSuccess }: MemberLoginProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  
  const { 
    requestCode, 
    verifyCode, 
    isRequestingCode, 
    isVerifyingCode 
  } = useMember();
  
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await requestCode(email);
      if (result.success) {
        toast.success(result.message);
        setStep('code');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await verifyCode(email, code);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setStep('email');
        setEmail('');
        setCode('');
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setStep('email');
      setCode('');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Anmelden
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'email' ? (
              <>
                <Mail className="h-5 w-5 text-orange-500" />
                Anmelden
              </>
            ) : (
              <>
                <KeyRound className="h-5 w-5 text-orange-500" />
                Code eingeben
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' 
              ? "Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Einmal-Code zur Anmeldung."
              : `Wir haben einen 6-stelligen Code an ${email} gesendet.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === 'email' ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isRequestingCode}>
              {isRequestingCode ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Code anfordern
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">6-stelliger Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isVerifyingCode || code.length !== 6}>
              {isVerifyingCode ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird überprüft...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Anmelden
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full"
              onClick={() => setStep('email')}
            >
              Andere E-Mail verwenden
            </Button>
          </form>
        )}
        
        <p className="text-xs text-slate-500 text-center mt-4">
          Mit der Anmeldung akzeptieren Sie unsere{' '}
          <Link href="/datenschutz" className="text-orange-600 hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Member menu for logged-in users
export function MemberMenu() {
  const { member, logout, isLoggingOut, isAuthenticated } = useMember();
  
  if (!isAuthenticated || !member) {
    return <MemberLogin />;
  }
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <User className="h-4 w-4 text-orange-600" />
        </div>
        <span className="text-slate-700 hidden sm:inline">
          {member.name || member.email.split('@')[0]}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => logout()}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

// Login prompt for protected actions
export function LoginPrompt({ 
  message = "Bitte melden Sie sich an, um fortzufahren.",
  onSuccess 
}: { 
  message?: string;
  onSuccess?: () => void;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
      <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-600 mb-4">{message}</p>
      <MemberLogin 
        trigger={
          <Button>
            <LogIn className="h-4 w-4 mr-2" />
            Jetzt anmelden
          </Button>
        }
        onSuccess={onSuccess}
      />
    </div>
  );
}
