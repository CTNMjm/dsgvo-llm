import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ReviewsProps {
  platformId: number;
  platformName: string;
}

export function Reviews({ platformId, platformName }: ReviewsProps) {
  const utils = trpc.useUtils();
  
  const { data: reviews = [], isLoading } = trpc.reviews.listByPlatform.useQuery(
    { platformId },
    { enabled: !!platformId }
  );
  
  const { data: averageRating } = trpc.reviews.getAverageRating.useQuery(
    { platformId },
    { enabled: !!platformId }
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    title: '',
    content: ''
  });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setIsDialogOpen(false);
      setFormData({ authorName: '', authorEmail: '', title: '', content: '' });
      setSelectedRating(5);
      utils.reviews.listByPlatform.invalidate({ platformId });
      utils.reviews.getAverageRating.invalidate({ platformId });
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Senden der Bewertung.");
    }
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate({
      platformId,
      authorName: formData.authorName,
      authorEmail: formData.authorEmail || undefined,
      rating: selectedRating,
      title: formData.title || undefined,
      content: formData.content || undefined
    });
  };

  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-orange-500" />
            Nutzer-Erfahrungen
          </h2>
          {averageRating && averageRating.count > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              Durchschnitt: {averageRating.average.toFixed(1)} von 5 ({averageRating.count} Bewertungen)
            </p>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              Bewertung schreiben
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bewertung für {platformName}</DialogTitle>
              <DialogDescription>
                Teilen Sie Ihre Erfahrungen mit dieser Plattform. Ihre Bewertung hilft anderen Nutzern.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  required 
                  placeholder="Max Mustermann" 
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Bewertung *</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      type="button" 
                      key={star} 
                      onClick={() => setSelectedRating(star)}
                      className={`focus:outline-none transition-colors ${star <= selectedRating ? 'text-orange-400' : 'text-slate-300'}`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titel (optional)</Label>
                <Input 
                  id="title" 
                  placeholder="Kurze Zusammenfassung" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Ihre Erfahrung (optional)</Label>
                <Textarea 
                  id="content" 
                  placeholder="Was gefällt Ihnen? Was könnte besser sein?" 
                  className="min-h-[100px]" 
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail (optional, zur Verifizierung)</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@firma.de" 
                  value={formData.authorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
                />
                <p className="text-xs text-slate-500">Wird nicht veröffentlicht.</p>
              </div>
              <p className="text-xs text-slate-500">
                Bewertungen werden vor der Veröffentlichung geprüft.
              </p>
              <DialogFooter>
                <Button type="submit" disabled={createReview.isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  {createReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Bewertung absenden
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          Bewertungen werden geladen...
        </div>
      ) : reviews.length === 0 ? (
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
                        {review.authorName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        {review.authorName}
                        {review.isVerified && (
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded flex items-center border border-emerald-100" title="Verifizierter Nutzer">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Verifiziert
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <div className="text-sm text-slate-700 font-medium mt-0.5">
                          {review.title}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded text-orange-700 font-bold text-sm">
                    <Star className="h-3 w-3 fill-current" /> {review.rating}.0
                  </div>
                </div>
                {review.content && (
                  <p className="text-slate-700 leading-relaxed mb-4">
                    "{review.content}"
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
                  <span>{formatDate(review.createdAt)}</span>
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
