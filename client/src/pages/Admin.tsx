import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, MessageSquare, Users, FileText, CheckCircle2, XCircle, Trash2, Loader2, Mail, AlertCircle, Star, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Skeleton } from "@/components/ui/skeleton";

export default function Admin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  
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
  
  const updateCommentStatus = trpc.comments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Kommentarstatus aktualisiert");
      utils.comments.listAll.invalidate();
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
                <CardTitle>Plattform-Bewertungen</CardTitle>
                <CardDescription>Verwalten Sie Nutzer-Bewertungen.</CardDescription>
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
                      <div key={review.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="space-y-1 flex-1">
                          <div className="font-medium flex items-center gap-2 flex-wrap">
                            <span>{review.authorName}</span>
                            <Badge variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {review.status}
                            </Badge>
                            <span className="text-slate-400 font-normal text-sm">• {formatDate(review.createdAt)}</span>
                          </div>
                          <div className="text-sm text-orange-500 font-medium flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" /> {review.rating}/5
                          </div>
                          {review.title && <p className="text-sm font-medium text-slate-700">{review.title}</p>}
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
                <CardTitle>Blog-Kommentare</CardTitle>
                <CardDescription>Verwalten Sie Kommentare zu Blog-Artikeln.</CardDescription>
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
                      <div key={comment.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-slate-50">
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
                <CardTitle>Generierte Leads</CardTitle>
                <CardDescription>Übersicht der Anfragen.</CardDescription>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : leads.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Leads vorhanden.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                        <tr>
                          <th className="p-4">Datum</th>
                          <th className="p-4">Plattform</th>
                          <th className="p-4">Kontakt</th>
                          <th className="p-4">Firma</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50/50">
                            <td className="p-4 text-slate-500">{formatDate(lead.createdAt)}</td>
                            <td className="p-4 font-medium">{lead.platformName || '-'}</td>
                            <td className="p-4">
                              <div>{lead.name}</div>
                              <div className="text-slate-500 text-xs">{lead.email}</div>
                            </td>
                            <td className="p-4">
                              <div>{lead.company || '-'}</div>
                              {lead.employeeCount && <div className="text-slate-500 text-xs">{lead.employeeCount} MA</div>}
                            </td>
                            <td className="p-4">
                              <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>{lead.status}</Badge>
                            </td>
                            <td className="p-4">
                              {lead.status === 'new' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateLeadStatus.mutate({ id: lead.id, status: 'contacted' })}
                                  disabled={updateLeadStatus.isPending}
                                >
                                  Kontaktiert
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                {suggestionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : suggestions.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Vorschläge vorhanden.</p>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{suggestion.platformName || 'Allgemein'}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{suggestion.type}</Badge>
                            <Badge variant={suggestion.status === 'implemented' ? 'default' : suggestion.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {suggestion.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                        {suggestion.platformUrl && (
                          <p className="text-sm text-blue-600 mb-2">{suggestion.platformUrl}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-slate-400">{formatDate(suggestion.createdAt)}</div>
                          {suggestion.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateSuggestionStatus.mutate({ id: suggestion.id, status: 'reviewed' })}
                                disabled={updateSuggestionStatus.isPending}
                              >
                                Geprüft
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600"
                                onClick={() => updateSuggestionStatus.mutate({ id: suggestion.id, status: 'implemented' })}
                                disabled={updateSuggestionStatus.isPending}
                              >
                                Umgesetzt
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

          {/* Newsletter Tab */}
          <TabsContent value="newsletter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter-Abonnenten</CardTitle>
                <CardDescription>Übersicht der aktiven Abonnenten.</CardDescription>
              </CardHeader>
              <CardContent>
                {subscribersLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : subscribers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Abonnenten vorhanden.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                        <tr>
                          <th className="p-4">E-Mail</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Angemeldet</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-medium">{sub.email}</td>
                            <td className="p-4">{sub.name || '-'}</td>
                            <td className="p-4">
                              <Badge variant={sub.isActive ? 'default' : 'secondary'}>
                                {sub.isActive ? 'Aktiv' : 'Inaktiv'}
                              </Badge>
                            </td>
                            <td className="p-4 text-slate-500">{formatDate(sub.subscribedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
