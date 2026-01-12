import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, MessageSquare, Users, FileText, CheckCircle2, XCircle, Loader2, Mail, AlertCircle, Star, LogOut, CheckSquare, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export default function Admin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  
  // Selection state for bulk actions
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Queries
  const { data: reviews = [], isLoading: reviewsLoading } = trpc.reviews.listAll.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: leads = [], isLoading: leadsLoading } = trpc.leads.listAll.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: suggestions = [], isLoading: suggestionsLoading } = trpc.suggestions.listAll.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: comments = [], isLoading: commentsLoading } = trpc.comments.listAll.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: subscribers = [], isLoading: subscribersLoading } = trpc.newsletter.listSubscribers.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: stats } = trpc.admin.stats.useQuery(
    undefined,
    { enabled: isAdmin }
  );

  // Mutations
  const updateReviewStatus = trpc.reviews.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Bewertungsstatus aktualisiert");
      utils.reviews.listAll.invalidate();
    }
  });
  
  const bulkUpdateReviewStatus = trpc.reviews.bulkUpdateStatus.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.updatedCount} Bewertungen aktualisiert`);
      utils.reviews.listAll.invalidate();
      setSelectedReviews([]);
    }
  });
  
  const updateCommentStatus = trpc.comments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Kommentarstatus aktualisiert");
      utils.comments.listAll.invalidate();
    }
  });
  
  const bulkUpdateCommentStatus = trpc.comments.bulkUpdateStatus.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.updatedCount} Kommentare aktualisiert`);
      utils.comments.listAll.invalidate();
      setSelectedComments([]);
    }
  });
  
  const updateSuggestionStatus = trpc.suggestions.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Vorschlagsstatus aktualisiert");
      utils.suggestions.listAll.invalidate();
    }
  });
  
  const updateLeadStatus = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Lead-Status aktualisiert");
      utils.leads.listAll.invalidate();
    }
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.reload();
    }
  });

  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Selection helpers
  const toggleCommentSelection = (id: number) => {
    setSelectedComments(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  
  const toggleReviewSelection = (id: number) => {
    setSelectedReviews(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  
  const selectAllPendingComments = () => {
    const pendingIds = comments.filter(c => c.status === 'pending').map(c => c.id);
    setSelectedComments(pendingIds);
  };
  
  const selectAllPendingReviews = () => {
    const pendingIds = reviews.filter(r => r.status === 'pending').map(r => r.id);
    setSelectedReviews(pendingIds);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // Not authenticated
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
          <CardContent className="flex justify-center">
            <Button 
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-slate-900 text-white"
            >
              Mit Manus anmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              Zugriff verweigert
            </CardTitle>
            <CardDescription className="text-center">
              Sie haben keine Berechtigung für den Admin-Bereich.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-500 mb-4">
              Angemeldet als: {user?.name || user?.email}
            </p>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" /> Abmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending counts
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const pendingComments = comments.filter(c => c.status === 'pending').length;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const newLeads = leads.filter(l => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <LayoutDashboard className="h-5 w-5 text-orange-500" />
            Admin Dashboard
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {user?.name || user?.email}
            </span>
            <Button 
              variant="ghost" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" /> Abmelden
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.platforms}</div>
                <div className="text-sm text-slate-500">Plattformen</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.reviews.total}</div>
                <div className="text-sm text-slate-500">Bewertungen</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.leads.total}</div>
                <div className="text-sm text-slate-500">Leads</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.subscribers}</div>
                <div className="text-sm text-slate-500">Newsletter</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl flex-wrap">
            <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-100">
              <Star className="mr-2 h-4 w-4" /> Bewertungen
              {pendingReviews > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">{pendingReviews}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-slate-100">
              <MessageSquare className="mr-2 h-4 w-4" /> Kommentare
              {pendingComments > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">{pendingComments}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-slate-100">
              <Users className="mr-2 h-4 w-4" /> Leads
              {newLeads > 0 && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">{newLeads}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-slate-100">
              <FileText className="mr-2 h-4 w-4" /> Vorschläge
              {pendingSuggestions > 0 && (
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">{pendingSuggestions}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="data-[state=active]:bg-slate-100">
              <Mail className="mr-2 h-4 w-4" /> Newsletter
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plattform-Bewertungen</CardTitle>
                    <CardDescription>Verwalten Sie Nutzer-Bewertungen.</CardDescription>
                  </div>
                  {/* Bulk Actions */}
                  {selectedReviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">{selectedReviews.length} ausgewählt</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => bulkUpdateReviewStatus.mutate({ ids: selectedReviews, status: 'approved' })}
                        disabled={bulkUpdateReviewStatus.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Alle genehmigen
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => bulkUpdateReviewStatus.mutate({ ids: selectedReviews, status: 'rejected' })}
                        disabled={bulkUpdateReviewStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Alle ablehnen
                      </Button>
                    </div>
                  )}
                  {pendingReviews > 0 && selectedReviews.length === 0 && (
                    <Button size="sm" variant="outline" onClick={selectAllPendingReviews}>
                      <CheckSquare className="h-4 w-4 mr-1" /> Alle ausstehenden auswählen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Bewertungen vorhanden.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="flex items-start gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50">
                        {review.status === 'pending' && (
                          <Checkbox 
                            checked={selectedReviews.includes(review.id)}
                            onCheckedChange={() => toggleReviewSelection(review.id)}
                            className="mt-1"
                          />
                        )}
                        <div className="space-y-1 flex-1">
                          <div className="font-medium flex items-center gap-2 flex-wrap">
                            <span>{review.authorName}</span>
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} />
                              ))}
                            </div>
                            <Badge variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {review.status}
                            </Badge>
                            <span className="text-slate-400 font-normal text-sm">• {formatDate(review.createdAt)}</span>
                          </div>
                          {review.title && <p className="font-medium text-slate-800">{review.title}</p>}
                          {review.content && <p className="text-sm text-slate-600">"{review.content}"</p>}
                        </div>
                        {review.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                              onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'approved' })}
                              disabled={updateReviewStatus.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                              onClick={() => updateReviewStatus.mutate({ id: review.id, status: 'rejected' })}
                              disabled={updateReviewStatus.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blog-Kommentare</CardTitle>
                    <CardDescription>Verwalten Sie Kommentare zu Blog-Artikeln.</CardDescription>
                  </div>
                  {/* Bulk Actions */}
                  {selectedComments.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">{selectedComments.length} ausgewählt</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => bulkUpdateCommentStatus.mutate({ ids: selectedComments, status: 'approved' })}
                        disabled={bulkUpdateCommentStatus.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Alle genehmigen
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => bulkUpdateCommentStatus.mutate({ ids: selectedComments, status: 'rejected' })}
                        disabled={bulkUpdateCommentStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Alle ablehnen
                      </Button>
                    </div>
                  )}
                  {pendingComments > 0 && selectedComments.length === 0 && (
                    <Button size="sm" variant="outline" onClick={selectAllPendingComments}>
                      <CheckSquare className="h-4 w-4 mr-1" /> Alle ausstehenden auswählen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {commentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Kommentare vorhanden.</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50">
                        {comment.status === 'pending' && (
                          <Checkbox 
                            checked={selectedComments.includes(comment.id)}
                            onCheckedChange={() => toggleCommentSelection(comment.id)}
                            className="mt-1"
                          />
                        )}
                        <div className="space-y-1 flex-1">
                          <div className="font-medium flex items-center gap-2 flex-wrap">
                            <span>{comment.authorName}</span>
                            <Badge variant={comment.status === 'approved' ? 'default' : comment.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {comment.status}
                            </Badge>
                            <span className="text-slate-400 font-normal text-sm">• {formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600">"{comment.content}"</p>
                        </div>
                        {comment.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                              onClick={() => updateCommentStatus.mutate({ id: comment.id, status: 'approved' })}
                              disabled={updateCommentStatus.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                              onClick={() => updateCommentStatus.mutate({ id: comment.id, status: 'rejected' })}
                              disabled={updateCommentStatus.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead-Anfragen</CardTitle>
                <CardDescription>Verwalten Sie eingehende Kontaktanfragen.</CardDescription>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                  </div>
                ) : leads.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Leads vorhanden.</p>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="font-medium flex items-center gap-2 flex-wrap">
                              <span className="text-lg">{lead.name}</span>
                              <Badge variant={lead.status === 'contacted' ? 'default' : lead.status === 'converted' ? 'secondary' : 'outline'}>
                                {lead.status}
                              </Badge>
                              <span className="text-slate-400 font-normal text-sm">• {formatDate(lead.createdAt)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><span className="text-slate-500">E-Mail:</span> {lead.email}</div>
                              {lead.company && <div><span className="text-slate-500">Firma:</span> {lead.company}</div>}
                              {lead.phone && <div><span className="text-slate-500">Telefon:</span> {lead.phone}</div>}
                              {lead.platformName && <div><span className="text-slate-500">Plattform:</span> {lead.platformName}</div>}
                              {lead.interest && <div><span className="text-slate-500">Interesse:</span> {lead.interest}</div>}
                            </div>
                            {lead.message && <p className="text-sm text-slate-600 mt-2 p-2 bg-white rounded border">"{lead.message}"</p>}
                          </div>
                          {lead.status === 'new' && (
                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                                onClick={() => updateLeadStatus.mutate({ id: lead.id, status: 'contacted' })}
                                disabled={updateLeadStatus.isPending}
                              >
                                Kontaktiert
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                                onClick={() => updateLeadStatus.mutate({ id: lead.id, status: 'converted' })}
                                disabled={updateLeadStatus.isPending}
                              >
                                Konvertiert
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutzer-Vorschläge</CardTitle>
                <CardDescription>Vorschläge für neue Plattformen oder Korrekturen.</CardDescription>
              </CardHeader>
              <CardContent>
                {suggestionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : suggestions.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Vorschläge vorhanden.</p>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="space-y-1 flex-1">
                          <div className="font-medium flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{suggestion.type}</Badge>
                            {suggestion.platformName && <span className="font-semibold">{suggestion.platformName}</span>}
                            <Badge variant={suggestion.status === 'implemented' ? 'default' : suggestion.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {suggestion.status}
                            </Badge>
                            <span className="text-slate-400 font-normal text-sm">• {formatDate(suggestion.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{suggestion.description}</p>
                          {suggestion.submitterEmail && (
                            <p className="text-xs text-slate-400">Von: {suggestion.submitterEmail}</p>
                          )}
                        </div>
                        {suggestion.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                              onClick={() => updateSuggestionStatus.mutate({ id: suggestion.id, status: 'reviewed' })}
                              disabled={updateSuggestionStatus.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                              onClick={() => updateSuggestionStatus.mutate({ id: suggestion.id, status: 'rejected' })}
                              disabled={updateSuggestionStatus.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter-Abonnenten</CardTitle>
                <CardDescription>Übersicht aller Newsletter-Anmeldungen.</CardDescription>
              </CardHeader>
              <CardContent>
                {subscribersLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : subscribers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Abonnenten vorhanden.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500 mb-4">
                      Gesamt: {subscribers.length} Abonnenten
                    </div>
                    {subscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <div>
                            <span className="font-medium">{subscriber.email}</span>
                            {subscriber.name && <span className="text-slate-500 ml-2">({subscriber.name})</span>}
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">{formatDate(subscriber.subscribedAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
