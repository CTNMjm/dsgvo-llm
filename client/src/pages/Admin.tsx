import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, LayoutDashboard, MessageSquare, Users, FileText, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock Data
const MOCK_REVIEWS = [
  { id: 1, platform: "Langdock", author: "Max M.", rating: 5, content: "Super Tool!", status: "pending", date: "2026-01-15" },
  { id: 2, platform: "Logicc", author: "Sarah K.", rating: 4, content: "Gutes Preis-Leistungs-Verhältnis.", status: "pending", date: "2026-01-14" },
];

const MOCK_LEADS = [
  { id: 1, platform: "Langdock", name: "Hans Peter", company: "Tech GmbH", email: "hp@tech.de", employees: "51-200", type: "demo", date: "2026-01-15" },
  { id: 2, platform: "AmberAI", name: "Julia Weber", company: "Kanzlei Weber", email: "jw@kanzlei.de", employees: "11-50", type: "quote", date: "2026-01-13" },
];

const MOCK_SUGGESTIONS = [
  { id: 1, type: "new_provider", subject: "SuperAI GmbH", message: "Bitte hinzufügen: www.superai.de", status: "pending", date: "2026-01-12" },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Willkommen im Admin-Bereich");
    } else {
      toast.error("Falsches Passwort");
    }
  };

  const handleApproveReview = (id: number) => {
    toast.success(`Bewertung #${id} freigeschaltet`);
  };

  const handleDeleteReview = (id: number) => {
    toast.success(`Bewertung #${id} gelöscht`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Bitte melden Sie sich an, um fortzufahren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-slate-900 text-white">
                <Lock className="mr-2 h-4 w-4" /> Anmelden
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <LayoutDashboard className="h-5 w-5 text-orange-500" />
            Admin Dashboard
          </div>
          <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>Abmelden</Button>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-100">
              <MessageSquare className="mr-2 h-4 w-4" /> Bewertungen
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-slate-100">
              <Users className="mr-2 h-4 w-4" /> Leads
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-slate-100">
              <FileText className="mr-2 h-4 w-4" /> Vorschläge
              <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">1</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ausstehende Bewertungen</CardTitle>
                <CardDescription>Diese Bewertungen warten auf Freischaltung.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {review.platform} 
                          <span className="text-slate-400 font-normal text-sm">• {review.author}</span>
                          <span className="text-slate-400 font-normal text-sm">• {review.date}</span>
                        </div>
                        <div className="text-sm text-orange-500 font-medium">Rating: {review.rating}/5</div>
                        <p className="text-sm text-slate-600">"{review.content}"</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApproveReview(review.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteReview(review.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generierte Leads</CardTitle>
                <CardDescription>Übersicht der letzten Anfragen.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                      <tr>
                        <th className="p-4">Datum</th>
                        <th className="p-4">Plattform</th>
                        <th className="p-4">Kontakt</th>
                        <th className="p-4">Firma</th>
                        <th className="p-4">Typ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {MOCK_LEADS.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50">
                          <td className="p-4 text-slate-500">{lead.date}</td>
                          <td className="p-4 font-medium">{lead.platform}</td>
                          <td className="p-4">
                            <div>{lead.name}</div>
                            <div className="text-slate-500 text-xs">{lead.email}</div>
                          </td>
                          <td className="p-4">
                            <div>{lead.company}</div>
                            <div className="text-slate-500 text-xs">{lead.employees} MA</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize">{lead.type}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutzervorschläge</CardTitle>
                <CardDescription>Feedback und neue Anbieter-Vorschläge.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_SUGGESTIONS.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{suggestion.subject}</div>
                        <Badge>{suggestion.type}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{suggestion.message}</p>
                      <div className="text-xs text-slate-400">{suggestion.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
