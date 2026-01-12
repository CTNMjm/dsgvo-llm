import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMember } from "@/hooks/useMember";
import { LoginPrompt } from "@/components/MemberLogin";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { User, Mail, Save, Loader2, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Profil() {
  const { member, isLoading, isAuthenticated, updateProfile, isUpdatingProfile, refetch } = useMember();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Initialize form with member data
  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setBio(member.bio || '');
    }
  }, [member]);
  
  // Track changes
  useEffect(() => {
    if (member) {
      const nameChanged = name !== (member.name || '');
      const bioChanged = bio !== (member.bio || '');
      setHasChanges(nameChanged || bioChanged);
    }
  }, [name, bio, member]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name: name || undefined, bio: bio || undefined });
      toast.success("Profil erfolgreich aktualisiert!");
      setHasChanges(false);
      refetch();
    } catch (error) {
      toast.error("Fehler beim Speichern des Profils.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <>
        <SEO
          title="Profil | LLM-Plattformen Vergleich"
          description="Verwalten Sie Ihr Profil auf LLM-Plattformen Vergleich."
          url="/profil"
        />
        <div className="min-h-screen bg-slate-50 py-16">
          <div className="container max-w-lg">
            <LoginPrompt 
              message="Melden Sie sich an, um Ihr Profil zu bearbeiten."
              onSuccess={() => refetch()}
            />
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <SEO
        title="Mein Profil | LLM-Plattformen Vergleich"
        description="Verwalten Sie Ihr Profil auf LLM-Plattformen Vergleich."
        url="/profil"
      />
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Mein Profil</h1>
            <p className="text-slate-500 mt-2">Verwalten Sie Ihre persönlichen Informationen</p>
          </div>
          
          <div className="grid gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Profil-Informationen
                </CardTitle>
                <CardDescription>
                  Diese Informationen werden bei Ihren Kommentaren und Bewertungen angezeigt.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="h-10 w-10 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{member?.name || 'Kein Name'}</p>
                      <p className="text-sm text-slate-500">{member?.email}</p>
                      {member?.isVerified && (
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                          <CheckCircle className="h-4 w-4" />
                          Verifiziert
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Anzeigename</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Max Mustermann"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={200}
                    />
                    <p className="text-xs text-slate-500">
                      Dieser Name wird bei Ihren Kommentaren und Bewertungen angezeigt.
                    </p>
                  </div>
                  
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Über mich (optional)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Erzählen Sie etwas über sich..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={500}
                      rows={3}
                    />
                    <p className="text-xs text-slate-500">
                      {bio.length}/500 Zeichen
                    </p>
                  </div>
                  
                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{member?.email}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Die E-Mail-Adresse kann nicht geändert werden.
                    </p>
                  </div>
                  
                  {/* Submit */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      type="submit" 
                      disabled={!hasChanges || isUpdatingProfile}
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Wird gespeichert...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Speichern
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Konto-Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Mitglied seit</p>
                    <p className="font-medium">
                      {member?.createdAt 
                        ? new Date(member.createdAt).toLocaleDateString('de-DE', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })
                        : '-'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Letzte Anmeldung</p>
                    <p className="font-medium">
                      {member?.lastLoginAt 
                        ? new Date(member.lastLoginAt).toLocaleDateString('de-DE', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Back link */}
            <div className="text-center">
              <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm">
                ← Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
