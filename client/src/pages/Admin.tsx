import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, MessageSquare, Users, FileText, CheckCircle2, XCircle, Loader2, Mail, AlertCircle, Star, LogOut, CheckSquare, Server, Plus, Pencil, Trash2, Eye, EyeOff, DollarSign, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, isOAuthEnabled } from "@/const";
import { MemberLogin } from "@/components/MemberLogin";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ImageUpload";

// Platform form type
interface PlatformFormData {
  slug: string;
  name: string;
  company: string;
  location: string;
  url: string;
  pricingModel: "Hybrid" | "Nutzungsbasiert" | "Pro User" | "Einmalzahlung" | "Enterprise";
  basePrice: string;
  tokenBased: boolean;
  compliance: string[];
  customGPTs: boolean;
  customGPTDetails: string;
  features: string[];
  pros: string[];
  cons: string[];
  description: string;
  screenshotUrl: string;
  logoUrl: string;
  websiteUrl: string;
  employees: string;
  customers: string;
  developers: string;
  isActive: boolean;
}

const emptyPlatformForm: PlatformFormData = {
  slug: "",
  name: "",
  company: "",
  location: "",
  url: "",
  pricingModel: "Nutzungsbasiert",
  basePrice: "",
  tokenBased: false,
  compliance: [],
  customGPTs: false,
  customGPTDetails: "",
  features: [],
  pros: [],
  cons: [],
  description: "",
  screenshotUrl: "",
  logoUrl: "",
  websiteUrl: "",
  employees: "",
  customers: "",
  developers: "",
  isActive: true,
};

// API Pricing form type
interface ApiPricingFormData {
  platformId: number;
  provider: string;
  modelName: string;
  modelVersion: string;
  inputPricePerMillion: string;
  outputPricePerMillion: string;
  regions: string[];
  supportedLanguages: string[];
  capabilities: string[];
  contextWindow: number | null;
  notes: string;
  isAvailable: boolean;
}

const emptyApiPricingForm: ApiPricingFormData = {
  platformId: 0,
  provider: "",
  modelName: "",
  modelVersion: "",
  inputPricePerMillion: "",
  outputPricePerMillion: "",
  regions: [],
  supportedLanguages: [],
  capabilities: [],
  contextWindow: null,
  notes: "",
  isAvailable: true,
};

// Blog form type
interface BlogFormData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
}

const emptyBlogForm: BlogFormData = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "Ratgeber",
  readTime: "",
  imageUrl: "",
  metaTitle: "",
  metaDescription: "",
  isPublished: false,
};

export default function Admin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  
  // Selection state for bulk actions
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  
  // Platform form state
  const [platformDialogOpen, setPlatformDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<number | null>(null);
  const [platformForm, setPlatformForm] = useState<PlatformFormData>(emptyPlatformForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [platformToDelete, setPlatformToDelete] = useState<number | null>(null);
  
  // API Pricing form state
  const [apiPricingDialogOpen, setApiPricingDialogOpen] = useState(false);
  const [editingApiPricing, setEditingApiPricing] = useState<number | null>(null);
  const [apiPricingForm, setApiPricingForm] = useState<ApiPricingFormData>(emptyApiPricingForm);
  const [apiPricingToDelete, setApiPricingToDelete] = useState<number | null>(null);
  const [apiDeleteConfirmOpen, setApiDeleteConfirmOpen] = useState(false);
  
  // Blog form state
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState<BlogFormData>(emptyBlogForm);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const [blogDeleteConfirmOpen, setBlogDeleteConfirmOpen] = useState(false);
  
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
  
  const { data: platforms = [], isLoading: platformsLoading } = trpc.platforms.listAll.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: apiPricingList = [], isLoading: apiPricingLoading } = trpc.apiPricing.listAllAdmin.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  
  const { data: blogPosts = [], isLoading: blogPostsLoading } = trpc.blog.listAll.useQuery(
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
  
  // Platform mutations
  const createPlatform = trpc.platforms.create.useMutation({
    onSuccess: () => {
      toast.success("Plattform erstellt");
      utils.platforms.listAll.invalidate();
      utils.platforms.list.invalidate();
      setPlatformDialogOpen(false);
      setPlatformForm(emptyPlatformForm);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  const updatePlatform = trpc.platforms.update.useMutation({
    onSuccess: () => {
      toast.success("Plattform aktualisiert");
      utils.platforms.listAll.invalidate();
      utils.platforms.list.invalidate();
      setPlatformDialogOpen(false);
      setEditingPlatform(null);
      setPlatformForm(emptyPlatformForm);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  const deletePlatform = trpc.platforms.delete.useMutation({
    onSuccess: () => {
      toast.success("Plattform deaktiviert");
      utils.platforms.listAll.invalidate();
      utils.platforms.list.invalidate();
      setDeleteConfirmOpen(false);
      setPlatformToDelete(null);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  // API Pricing mutations
  const createApiPricing = trpc.apiPricing.create.useMutation({
    onSuccess: () => {
      toast.success("API-Preis erstellt");
      utils.apiPricing.listAllAdmin.invalidate();
      utils.apiPricing.listAll.invalidate();
      setApiPricingDialogOpen(false);
      setApiPricingForm(emptyApiPricingForm);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  const updateApiPricing = trpc.apiPricing.update.useMutation({
    onSuccess: () => {
      toast.success("API-Preis aktualisiert");
      utils.apiPricing.listAllAdmin.invalidate();
      utils.apiPricing.listAll.invalidate();
      setApiPricingDialogOpen(false);
      setEditingApiPricing(null);
      setApiPricingForm(emptyApiPricingForm);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  const deleteApiPricing = trpc.apiPricing.delete.useMutation({
    onSuccess: () => {
      toast.success("API-Preis gelöscht");
      utils.apiPricing.listAllAdmin.invalidate();
      utils.apiPricing.listAll.invalidate();
      setApiDeleteConfirmOpen(false);
      setApiPricingToDelete(null);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  // Blog mutations
  const createBlog = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog-Artikel erstellt");
      utils.blog.listAll.invalidate();
      utils.blog.list.invalidate();
      setBlogDialogOpen(false);
      setBlogForm(emptyBlogForm);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  const updateBlog = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog-Artikel aktualisiert");
      utils.blog.listAll.invalidate();
      utils.blog.list.invalidate();
      setBlogDialogOpen(false);
      setEditingBlog(null);
      setBlogForm(emptyBlogForm);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    }
  });
  
  const deleteBlog = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog-Artikel gelöscht");
      utils.blog.listAll.invalidate();
      utils.blog.list.invalidate();
      setBlogDeleteConfirmOpen(false);
      setBlogToDelete(null);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
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
  
  // Platform form helpers
  const openCreatePlatformDialog = () => {
    setPlatformForm(emptyPlatformForm);
    setEditingPlatform(null);
    setPlatformDialogOpen(true);
  };
  
  const openEditPlatformDialog = (platform: typeof platforms[0]) => {
    setPlatformForm({
      slug: platform.slug,
      name: platform.name,
      company: platform.company,
      location: platform.location || "",
      url: platform.url || "",
      pricingModel: platform.pricingModel,
      basePrice: platform.basePrice || "",
      tokenBased: platform.tokenBased || false,
      compliance: (platform.compliance as string[]) || [],
      customGPTs: platform.customGPTs || false,
      customGPTDetails: platform.customGPTDetails || "",
      features: (platform.features as string[]) || [],
      pros: (platform.pros as string[]) || [],
      cons: (platform.cons as string[]) || [],
      description: platform.description || "",
      screenshotUrl: platform.screenshotUrl || "",
      logoUrl: platform.logoUrl || "",
      websiteUrl: platform.websiteUrl || "",
      employees: platform.employees || "",
      customers: platform.customers || "",
      developers: platform.developers || "",
      isActive: platform.isActive ?? true,
    });
    setEditingPlatform(platform.id);
    setPlatformDialogOpen(true);
  };
  
  const handlePlatformSubmit = () => {
    const data = {
      ...platformForm,
      url: platformForm.url || undefined,
      location: platformForm.location || undefined,
      basePrice: platformForm.basePrice || undefined,
      customGPTDetails: platformForm.customGPTDetails || undefined,
      description: platformForm.description || undefined,
      screenshotUrl: platformForm.screenshotUrl || null,
      logoUrl: platformForm.logoUrl || null,
      websiteUrl: platformForm.websiteUrl || null,
      employees: platformForm.employees || undefined,
      customers: platformForm.customers || undefined,
      developers: platformForm.developers || undefined,
    };
    
    if (editingPlatform) {
      updatePlatform.mutate({ id: editingPlatform, ...data });
    } else {
      createPlatform.mutate(data);
    }
  };
  
  const handleArrayInput = (field: 'compliance' | 'features' | 'pros' | 'cons', value: string) => {
    const items = value.split('\n').map(s => s.trim()).filter(Boolean);
    setPlatformForm(prev => ({ ...prev, [field]: items }));
  };
  
  // API Pricing form helpers
  const openCreateApiPricingDialog = () => {
    setApiPricingForm(emptyApiPricingForm);
    setEditingApiPricing(null);
    setApiPricingDialogOpen(true);
  };
  
  const openEditApiPricingDialog = (pricing: typeof apiPricingList[0]) => {
    setApiPricingForm({
      platformId: pricing.platformId,
      provider: pricing.provider,
      modelName: pricing.modelName,
      modelVersion: pricing.modelVersion || "",
      inputPricePerMillion: pricing.inputPricePerMillion,
      outputPricePerMillion: pricing.outputPricePerMillion,
      regions: (pricing.regions as string[]) || [],
      supportedLanguages: (pricing.supportedLanguages as string[]) || [],
      capabilities: (pricing.capabilities as string[]) || [],
      contextWindow: pricing.contextWindow || null,
      notes: pricing.notes || "",
      isAvailable: pricing.isAvailable ?? true,
    });
    setEditingApiPricing(pricing.id);
    setApiPricingDialogOpen(true);
  };
  
  const handleApiPricingSubmit = () => {
    const data = {
      ...apiPricingForm,
      modelVersion: apiPricingForm.modelVersion || undefined,
      contextWindow: apiPricingForm.contextWindow || undefined,
      notes: apiPricingForm.notes || undefined,
    };
    
    if (editingApiPricing) {
      updateApiPricing.mutate({ id: editingApiPricing, ...data });
    } else {
      createApiPricing.mutate(data);
    }
  };
  
  const handleApiArrayInput = (field: 'regions' | 'supportedLanguages' | 'capabilities', value: string) => {
    const items = value.split('\n').map(s => s.trim()).filter(Boolean);
    setApiPricingForm(prev => ({ ...prev, [field]: items }));
  };
  
  // Blog form helpers
  const openCreateBlogDialog = () => {
    setBlogForm(emptyBlogForm);
    setEditingBlog(null);
    setBlogDialogOpen(true);
  };
  
  const openEditBlogDialog = (post: typeof blogPosts[0]) => {
    setBlogForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author,
      category: post.category || "Ratgeber",
      readTime: post.readTime || "",
      imageUrl: post.imageUrl || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      isPublished: post.isPublished ?? false,
    });
    setEditingBlog(post.id);
    setBlogDialogOpen(true);
  };
  
  const handleBlogSubmit = () => {
    const data = {
      ...blogForm,
      excerpt: blogForm.excerpt || undefined,
      category: blogForm.category || undefined,
      readTime: blogForm.readTime || undefined,
      imageUrl: blogForm.imageUrl || undefined,
      metaTitle: blogForm.metaTitle || undefined,
      metaDescription: blogForm.metaDescription || undefined,
    };
    
    if (editingBlog) {
      updateBlog.mutate({ id: editingBlog, updates: data });
    } else {
      createBlog.mutate(data);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
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
          <CardContent>
            {isOAuthEnabled() ? (
              <Button className="w-full" onClick={() => {
                const loginUrl = getLoginUrl();
                if (loginUrl) window.location.href = loginUrl;
              }}>
                Anmelden
              </Button>
            ) : (
              <MemberLogin 
                trigger={
                  <Button className="w-full">
                    Mit E-Mail anmelden
                  </Button>
                }
              />
            )}
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
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/'}>
              Zurück zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate pending counts
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const pendingComments = comments.filter(c => c.status === 'pending').length;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const activePlatforms = platforms.filter(p => p.isActive).length;
  const activeApiPricing = apiPricingList.filter(p => p.isAvailable).length;
  const publishedPosts = blogPosts.filter(p => p.isPublished).length;

  // Get platform name by ID
  const getPlatformName = (platformId: number) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.name || `ID: ${platformId}`;
  };

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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{blogPosts.length}</div>
                <div className="text-sm text-slate-500">Blog-Artikel</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="platforms" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl flex-wrap">
            <TabsTrigger value="platforms" className="data-[state=active]:bg-slate-100">
              <Server className="mr-2 h-4 w-4" /> Plattformen
              <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">{activePlatforms}</Badge>
            </TabsTrigger>
            <TabsTrigger value="apiPricing" className="data-[state=active]:bg-slate-100">
              <DollarSign className="mr-2 h-4 w-4" /> API-Preise
              <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">{activeApiPricing}</Badge>
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-slate-100">
              <BookOpen className="mr-2 h-4 w-4" /> Blog
              <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">{publishedPosts}</Badge>
            </TabsTrigger>
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

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>LLM-Plattformen verwalten</CardTitle>
                    <CardDescription>Erstellen, bearbeiten und löschen Sie Plattformen.</CardDescription>
                  </div>
                  <Button onClick={openCreatePlatformDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Neue Plattform
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {platformsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : platforms.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Plattformen vorhanden.</p>
                ) : (
                  <div className="space-y-3">
                    {platforms.map((platform) => (
                      <div 
                        key={platform.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${platform.isActive ? 'border-slate-200 bg-white' : 'border-red-200 bg-red-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          {platform.logoUrl ? (
                            <img src={platform.logoUrl} alt={platform.name} className="h-10 w-10 rounded object-contain bg-white p-1 border" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                              <Server className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{platform.name}</span>
                              {!platform.isActive && (
                                <Badge variant="destructive" className="text-xs">Inaktiv</Badge>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              <span>{platform.company}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">{platform.pricingModel}</Badge>
                              <span>•</span>
                              <span className="text-xs text-slate-400">/{platform.slug}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditPlatformDialog(platform)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={platform.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                            onClick={() => {
                              if (platform.isActive) {
                                setPlatformToDelete(platform.id);
                                setDeleteConfirmOpen(true);
                              } else {
                                updatePlatform.mutate({ id: platform.id, isActive: true });
                              }
                            }}
                          >
                            {platform.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Pricing Tab */}
          <TabsContent value="apiPricing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API-Preise verwalten</CardTitle>
                    <CardDescription>Erstellen, bearbeiten und löschen Sie API-Preise für Modelle.</CardDescription>
                  </div>
                  <Button onClick={openCreateApiPricingDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Neuer API-Preis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {apiPricingLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : apiPricingList.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine API-Preise vorhanden.</p>
                ) : (
                  <div className="space-y-3">
                    {apiPricingList.map((pricing) => (
                      <div 
                        key={pricing.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${pricing.isAvailable ? 'border-slate-200 bg-white' : 'border-red-200 bg-red-50'}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{pricing.modelName}</span>
                            <Badge variant="outline" className="text-xs">{pricing.provider}</Badge>
                            {!pricing.isAvailable && (
                              <Badge variant="destructive" className="text-xs">Inaktiv</Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                            <span>Plattform: {getPlatformName(pricing.platformId)}</span>
                            <span>Input: €{pricing.inputPricePerMillion}/M</span>
                            <span>Output: €{pricing.outputPricePerMillion}/M</span>
                            {pricing.contextWindow && <span>Context: {(pricing.contextWindow / 1000).toFixed(0)}K</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditApiPricingDialog(pricing)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setApiPricingToDelete(pricing.id);
                              setApiDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blog-Artikel verwalten</CardTitle>
                    <CardDescription>Erstellen, bearbeiten und löschen Sie Blog-Artikel.</CardDescription>
                  </div>
                  <Button onClick={openCreateBlogDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Neuer Artikel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blogPostsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : blogPosts.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Blog-Artikel vorhanden.</p>
                ) : (
                  <div className="space-y-3">
                    {blogPosts.map((post) => (
                      <div 
                        key={post.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${post.isPublished ? 'border-slate-200 bg-white' : 'border-yellow-200 bg-yellow-50'}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.title}</span>
                            {post.category && <Badge variant="outline" className="text-xs">{post.category}</Badge>}
                            {!post.isPublished && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">Entwurf</Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                            <span>Von: {post.author}</span>
                            {post.readTime && <span>{post.readTime}</span>}
                            <span>/{post.slug}</span>
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditBlogDialog(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setBlogToDelete(post.id);
                              setBlogDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plattform-Bewertungen</CardTitle>
                    <CardDescription>Verwalten Sie Nutzer-Bewertungen.</CardDescription>
                  </div>
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
                            <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            <Badge variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {review.status}
                            </Badge>
                            <span className="text-slate-400 font-normal text-sm">• {formatDate(review.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{review.content}</p>
                        </div>
                        {review.status === 'pending' && (
                          <div className="flex gap-2">
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
                    <CardDescription>Moderieren Sie Kommentare zu Blog-Artikeln.</CardDescription>
                  </div>
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
                          <p className="text-sm text-slate-600">{comment.content}</p>
                          {comment.authorEmail && (
                            <p className="text-xs text-slate-400">{comment.authorEmail}</p>
                          )}
                        </div>
                        {comment.status === 'pending' && (
                          <div className="flex gap-2">
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
                <CardTitle>Kontaktanfragen</CardTitle>
                <CardDescription>Verwalten Sie eingehende Leads und Anfragen.</CardDescription>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : leads.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Leads vorhanden.</p>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-slate-50">
                        <div className="space-y-1 flex-1">
                          <div className="font-medium flex items-center gap-2 flex-wrap">
                            <span>{lead.name}</span>
                            {lead.company && <span className="text-slate-500">({lead.company})</span>}
                            <Badge variant={lead.status === 'closed' ? 'default' : lead.status === 'contacted' ? 'secondary' : 'outline'}>
                              {lead.status}
                            </Badge>
                            <span className="text-slate-400 font-normal text-sm">• {formatDate(lead.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{lead.message}</p>
                          <div className="flex gap-4 text-xs text-slate-400">
                            <span>{lead.email}</span>
                            {lead.phone && <span>{lead.phone}</span>}
                          </div>
                        </div>
                        {lead.status !== 'closed' && (
                          <div className="flex gap-2 ml-4">
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => updateLeadStatus.mutate({ id: lead.id, status: 'closed' })}
                              disabled={updateLeadStatus.isPending}
                            >
                              Abschließen
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

      {/* Platform Create/Edit Dialog */}
      <Dialog open={platformDialogOpen} onOpenChange={setPlatformDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlatform ? 'Plattform bearbeiten' : 'Neue Plattform erstellen'}</DialogTitle>
            <DialogDescription>
              {editingPlatform ? 'Ändern Sie die Plattform-Details.' : 'Füllen Sie die Details für die neue Plattform aus.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  value={platformForm.name}
                  onChange={(e) => setPlatformForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="z.B. ChatGPT Enterprise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input 
                  id="slug" 
                  value={platformForm.slug}
                  onChange={(e) => setPlatformForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="z.B. chatgpt-enterprise"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Unternehmen *</Label>
                <Input 
                  id="company" 
                  value={platformForm.company}
                  onChange={(e) => setPlatformForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="z.B. OpenAI"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Standort</Label>
                <Input 
                  id="location" 
                  value={platformForm.location}
                  onChange={(e) => setPlatformForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="z.B. USA"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricingModel">Preismodell *</Label>
                <Select 
                  value={platformForm.pricingModel}
                  onValueChange={(value) => setPlatformForm(prev => ({ ...prev, pricingModel: value as PlatformFormData['pricingModel'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nutzungsbasiert">Nutzungsbasiert</SelectItem>
                    <SelectItem value="Pro User">Pro User</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Einmalzahlung">Einmalzahlung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Basispreis</Label>
                <Input 
                  id="basePrice" 
                  value={platformForm.basePrice}
                  onChange={(e) => setPlatformForm(prev => ({ ...prev, basePrice: e.target.value }))}
                  placeholder="z.B. ab 20€/User/Monat"
                />
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="tokenBased" 
                    checked={platformForm.tokenBased}
                    onCheckedChange={(checked) => setPlatformForm(prev => ({ ...prev, tokenBased: checked }))}
                  />
                  <Label htmlFor="tokenBased">Token-basiert</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input 
                  id="websiteUrl" 
                  value={platformForm.websiteUrl}
                  onChange={(e) => setPlatformForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <ImageUpload
                  value={platformForm.logoUrl}
                  onChange={(url) => setPlatformForm(prev => ({ ...prev, logoUrl: url }))}
                  folder="logos"
                  label="Logo"
                  placeholder="https://..."
                  maxSizeMB={2}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea 
                id="description" 
                value={platformForm.description}
                onChange={(e) => setPlatformForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kurze Beschreibung der Plattform..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="compliance">Compliance (eine pro Zeile)</Label>
              <Textarea 
                id="compliance" 
                value={platformForm.compliance.join('\n')}
                onChange={(e) => handleArrayInput('compliance', e.target.value)}
                placeholder="DSGVO&#10;ISO 27001&#10;SOC 2"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="features">Features (eine pro Zeile)</Label>
              <Textarea 
                id="features" 
                value={platformForm.features.join('\n')}
                onChange={(e) => handleArrayInput('features', e.target.value)}
                placeholder="GPT-4 Zugang&#10;Team-Verwaltung&#10;API-Zugang"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pros">Vorteile (eine pro Zeile)</Label>
                <Textarea 
                  id="pros" 
                  value={platformForm.pros.join('\n')}
                  onChange={(e) => handleArrayInput('pros', e.target.value)}
                  placeholder="Einfache Bedienung&#10;Guter Support"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cons">Nachteile (eine pro Zeile)</Label>
                <Textarea 
                  id="cons" 
                  value={platformForm.cons.join('\n')}
                  onChange={(e) => handleArrayInput('cons', e.target.value)}
                  placeholder="Hoher Preis&#10;Keine On-Premise Option"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="customGPTs" 
                checked={platformForm.customGPTs}
                onCheckedChange={(checked) => setPlatformForm(prev => ({ ...prev, customGPTs: checked }))}
              />
              <Label htmlFor="customGPTs">Custom GPTs unterstützt</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={platformForm.isActive}
                onCheckedChange={(checked) => setPlatformForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Plattform aktiv (öffentlich sichtbar)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlatformDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handlePlatformSubmit}
              disabled={createPlatform.isPending || updatePlatform.isPending || !platformForm.name || !platformForm.slug || !platformForm.company}
            >
              {(createPlatform.isPending || updatePlatform.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPlatform ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Platform Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plattform deaktivieren?</DialogTitle>
            <DialogDescription>
              Die Plattform wird deaktiviert und ist nicht mehr öffentlich sichtbar. Sie können sie später wieder aktivieren.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              variant="destructive"
              onClick={() => platformToDelete && deletePlatform.mutate({ id: platformToDelete })}
              disabled={deletePlatform.isPending}
            >
              {deletePlatform.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deaktivieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Pricing Create/Edit Dialog */}
      <Dialog open={apiPricingDialogOpen} onOpenChange={setApiPricingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingApiPricing ? 'API-Preis bearbeiten' : 'Neuen API-Preis erstellen'}</DialogTitle>
            <DialogDescription>
              {editingApiPricing ? 'Ändern Sie die API-Preis-Details.' : 'Füllen Sie die Details für den neuen API-Preis aus.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platformId">Plattform *</Label>
              <Select 
                value={apiPricingForm.platformId.toString()}
                onValueChange={(value) => setApiPricingForm(prev => ({ ...prev, platformId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Plattform auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.filter(p => p.isActive).map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input 
                  id="provider" 
                  value={apiPricingForm.provider}
                  onChange={(e) => setApiPricingForm(prev => ({ ...prev, provider: e.target.value }))}
                  placeholder="z.B. OpenAI"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelName">Modell-Name *</Label>
                <Input 
                  id="modelName" 
                  value={apiPricingForm.modelName}
                  onChange={(e) => setApiPricingForm(prev => ({ ...prev, modelName: e.target.value }))}
                  placeholder="z.B. GPT-4 Turbo"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inputPrice">Input €/M Tokens *</Label>
                <Input 
                  id="inputPrice" 
                  value={apiPricingForm.inputPricePerMillion}
                  onChange={(e) => setApiPricingForm(prev => ({ ...prev, inputPricePerMillion: e.target.value }))}
                  placeholder="z.B. 10.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outputPrice">Output €/M Tokens *</Label>
                <Input 
                  id="outputPrice" 
                  value={apiPricingForm.outputPricePerMillion}
                  onChange={(e) => setApiPricingForm(prev => ({ ...prev, outputPricePerMillion: e.target.value }))}
                  placeholder="z.B. 30.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contextWindow">Context Window</Label>
                <Input 
                  id="contextWindow" 
                  type="number"
                  value={apiPricingForm.contextWindow || ''}
                  onChange={(e) => setApiPricingForm(prev => ({ ...prev, contextWindow: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="z.B. 128000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capabilities">Capabilities (eine pro Zeile)</Label>
              <Textarea 
                id="capabilities" 
                value={apiPricingForm.capabilities.join('\n')}
                onChange={(e) => handleApiArrayInput('capabilities', e.target.value)}
                placeholder="chat&#10;code&#10;vision"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="regions">Regionen (eine pro Zeile)</Label>
              <Textarea 
                id="regions" 
                value={apiPricingForm.regions.join('\n')}
                onChange={(e) => handleApiArrayInput('regions', e.target.value)}
                placeholder="EU&#10;US&#10;Global"
                rows={2}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="apiIsAvailable" 
                checked={apiPricingForm.isAvailable}
                onCheckedChange={(checked) => setApiPricingForm(prev => ({ ...prev, isAvailable: checked }))}
              />
              <Label htmlFor="apiIsAvailable">Verfügbar (öffentlich sichtbar)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiPricingDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleApiPricingSubmit}
              disabled={createApiPricing.isPending || updateApiPricing.isPending || !apiPricingForm.platformId || !apiPricingForm.provider || !apiPricingForm.modelName}
            >
              {(createApiPricing.isPending || updateApiPricing.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingApiPricing ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Pricing Delete Confirmation Dialog */}
      <Dialog open={apiDeleteConfirmOpen} onOpenChange={setApiDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API-Preis löschen?</DialogTitle>
            <DialogDescription>
              Der API-Preis wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiDeleteConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              variant="destructive"
              onClick={() => apiPricingToDelete && deleteApiPricing.mutate({ id: apiPricingToDelete })}
              disabled={deleteApiPricing.isPending}
            >
              {deleteApiPricing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Create/Edit Dialog */}
      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Blog-Artikel bearbeiten' : 'Neuen Blog-Artikel erstellen'}</DialogTitle>
            <DialogDescription>
              {editingBlog ? 'Ändern Sie die Artikel-Details.' : 'Füllen Sie die Details für den neuen Artikel aus.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blogTitle">Titel *</Label>
                <Input 
                  id="blogTitle" 
                  value={blogForm.title}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Artikel-Titel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogSlug">Slug *</Label>
                <Input 
                  id="blogSlug" 
                  value={blogForm.slug}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="artikel-slug"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blogAuthor">Autor *</Label>
                <Input 
                  id="blogAuthor" 
                  value={blogForm.author}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Name des Autors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogCategory">Kategorie</Label>
                <Select 
                  value={blogForm.category}
                  onValueChange={(value) => setBlogForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ratgeber">Ratgeber</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Vergleich">Vergleich</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Analyse">Analyse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogReadTime">Lesezeit</Label>
                <Input 
                  id="blogReadTime" 
                  value={blogForm.readTime}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, readTime: e.target.value }))}
                  placeholder="z.B. 8 Min."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="blogExcerpt">Kurzfassung</Label>
              <Textarea 
                id="blogExcerpt" 
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Kurze Zusammenfassung des Artikels..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="blogContent">Inhalt (Markdown) *</Label>
              <Textarea 
                id="blogContent" 
                value={blogForm.content}
                onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="# Überschrift&#10;&#10;Ihr Artikel-Inhalt in Markdown..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <ImageUpload
                value={blogForm.imageUrl}
                onChange={(url) => setBlogForm(prev => ({ ...prev, imageUrl: url }))}
                folder="blog"
                label="Beitragsbild"
                placeholder="https://..."
                maxSizeMB={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blogMetaTitle">Meta-Titel (SEO)</Label>
                <Input 
                  id="blogMetaTitle" 
                  value={blogForm.metaTitle}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO-Titel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogMetaDesc">Meta-Beschreibung (SEO)</Label>
                <Input 
                  id="blogMetaDesc" 
                  value={blogForm.metaDescription}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO-Beschreibung"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="blogIsPublished" 
                checked={blogForm.isPublished}
                onCheckedChange={(checked) => setBlogForm(prev => ({ ...prev, isPublished: checked }))}
              />
              <Label htmlFor="blogIsPublished">Veröffentlicht</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleBlogSubmit}
              disabled={createBlog.isPending || updateBlog.isPending || !blogForm.title || !blogForm.slug || !blogForm.content || !blogForm.author}
            >
              {(createBlog.isPending || updateBlog.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBlog ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Delete Confirmation Dialog */}
      <Dialog open={blogDeleteConfirmOpen} onOpenChange={setBlogDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blog-Artikel löschen?</DialogTitle>
            <DialogDescription>
              Der Artikel und alle zugehörigen Kommentare werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogDeleteConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              variant="destructive"
              onClick={() => blogToDelete && deleteBlog.mutate({ id: blogToDelete })}
              disabled={deleteBlog.isPending}
            >
              {deleteBlog.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
