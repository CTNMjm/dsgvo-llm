import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSubscribed(true);
    toast.success("Erfolgreich zum Newsletter angemeldet!");
    setEmail("");
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
            <Mail className="h-8 w-8 text-orange-500" />
            Keine Updates verpassen
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Erhalten Sie monatliche Updates zu neuen DSGVO-konformen KI-Tools, Compliance-Checklisten und exklusive Vergleiche direkt in Ihr Postfach.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[350px]">
          {subscribed ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">Angemeldet!</h3>
              <p className="text-slate-300 text-sm">Vielen Dank für Ihr Interesse.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="ihre@email.de" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12 pl-4 pr-4 focus:ring-orange-500 focus:border-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base w-full"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Jetzt anmelden"}
              </Button>
              <p className="text-xs text-slate-500 text-center mt-2">
                Abmeldung jederzeit möglich. Wir hassen Spam genauso wie Sie.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
