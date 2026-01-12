import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

// Mock data for initial reviews
const MOCK_REVIEWS: Record<string, Review[]> = {
  'langdock': [
    {
      id: '1',
      author: 'Markus Weber',
      role: 'CTO',
      company: 'TechSolutions GmbH',
      rating: 5,
      date: '15.01.2026',
      content: 'Die Integration war super einfach und der Support ist erstklassig. Besonders die Custom GPTs nutzen wir täglich.',
      verified: true
    },
    {
      id: '2',
      author: 'Sarah Klein',
      role: 'Legal Counsel',
      company: 'Kanzlei Klein & Partner',
      rating: 4,
      date: '02.12.2025',
      content: 'Datenschutztechnisch absolut sauber. Ein Stern Abzug, da die Mobile-Ansicht noch optimiert werden könnte.',
      verified: true
    }
  ],
  'logicc': [
    {
      id: '3',
      author: 'Thomas Müller',
      role: 'IT-Leiter',
      company: 'Mittelstand AG',
      rating: 5,
      date: '10.01.2026',
      content: 'Preis-Leistung ist unschlagbar. Für unsere 50 Mitarbeiter die perfekte Lösung ohne versteckte Token-Kosten.',
      verified: true
    }
  ]
};

export function Reviews({ platformId }: { platformId: string }) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS[platformId] || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Bewertung erfolgreich eingereicht! Sie wird nach Prüfung veröffentlicht.");
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-orange-500" />
          Nutzer-Erfahrungen
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              Bewertung schreiben
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bewertung abgeben</DialogTitle>
              <DialogDescription>
                Teilen Sie Ihre Erfahrungen mit dieser Plattform. Ihre Bewertung hilft anderen Nutzern.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required placeholder="Max Mustermann" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rolle / Position</Label>
                  <Input id="role" required placeholder="z.B. CTO" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Firma</Label>
                <Input id="company" required placeholder="Musterfirma GmbH" />
              </div>
              <div className="space-y-2">
                <Label>Bewertung</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} className="text-orange-400 hover:text-orange-500 focus:outline-none">
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Ihre Erfahrung</Label>
                <Textarea id="content" required placeholder="Was gefällt Ihnen? Was könnte besser sein?" className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Geschäftliche E-Mail (zur Verifizierung)</Label>
                <Input id="email" type="email" required placeholder="name@firma.de" />
                <p className="text-xs text-slate-500">Wird nicht veröffentlicht. Nur für Verifizierung.</p>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Bewertung absenden
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length === 0 ? (
        <Card className="bg-slate-50 border-dashed border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Noch keine Bewertungen</h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Seien Sie der Erste, der eine Bewertung für diese Plattform abgibt und helfen Sie der Community.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-slate-100 border border-slate-200">
                      <AvatarFallback className="text-slate-600 font-medium">
                        {review.author.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        {review.author}
                        {review.verified && (
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded flex items-center border border-emerald-100" title="Verifizierter Nutzer">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Verifiziert
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        {review.role} bei {review.company}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded text-orange-700 font-bold text-sm">
                    <Star className="h-3 w-3 fill-current" /> {review.rating}.0
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  "{review.content}"
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
                  <span>{review.date}</span>
                  <button className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                    <ThumbsUp className="h-3 w-3" /> Hilfreich
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
