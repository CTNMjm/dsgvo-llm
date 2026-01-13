import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SEO, SEOPresets } from "@/components/SEO";
import { PlatformCard, FeatureBadge, ProsList, ConsList } from "@/components/ui-custom";
import { Search, X, ArrowRightLeft, CheckCircle2, Info, ExternalLink, Download, Loader2 } from "lucide-react";
import { exportComparisonToPDF } from "@/lib/pdf-export";
import { toast } from "sonner";
import { CostCalculator } from "@/components/CostCalculator";
import { FeedbackForm } from "@/components/FeedbackForm";
import { MemberMenu } from "@/components/MemberLogin";
import { Newsletter } from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Platform type from API
interface Platform {
  id: number;
  slug: string;
  name: string;
  company: string;
  location: string | null;
  url: string | null;
  pricingModel: string;
  basePrice: string | null;
  tokenBased: boolean | null;
  compliance: string[] | null;
  customGPTs: boolean | null;
  customGPTDetails: string | null;
  features: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  description: string | null;
  screenshotUrl: string | null;
  employees: string | null;
  customers: string | null;
  isActive: boolean | null;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch platforms from API
  const { data: platforms = [], isLoading } = trpc.platforms.list.useQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportComparisonToPDF("comparison-content", "LLM-Plattform-Vergleich");
      toast.success("PDF erfolgreich heruntergeladen!");
    } catch (error) {
      toast.error("Fehler beim Erstellen des PDFs.");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredPlatforms = useMemo(() => {
    return platforms.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.features || []).some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPricing = selectedPricing === "all" || p.pricingModel === selectedPricing;

      return matchesSearch && matchesPricing;
    });
  }, [platforms, searchQuery, selectedPricing]);

  const toggleCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareList([]);

  const selectedPlatformsData = useMemo(() => {
    return platforms.filter(p => compareList.includes(p.id));
  }, [platforms, compareList]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <header className="relative bg-[#0F172A] text-white overflow-hidden">
          <div className="container py-20 md:py-32">
            <Skeleton className="h-12 w-3/4 bg-slate-700 mb-6" />
            <Skeleton className="h-6 w-1/2 bg-slate-700 mb-4" />
            <Skeleton className="h-12 w-full max-w-2xl bg-slate-700" />
          </div>
        </header>
        <main className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <SEO {...SEOPresets.home} />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <header className="relative bg-[#0F172A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/images/hero-background.jpg" 
            alt="Abstract Swiss Style Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 backdrop-blur-sm">
                  <Info className="mr-2 h-4 w-4" />
                  Stand: Januar 2026
                </div>
                <FeedbackForm />
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                <MemberMenu />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              DSGVO-konforme <br/>
              <span className="text-orange-500">LLM-Plattformen</span> im Vergleich
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Vergleichen Sie die besten DSGVO-konformen KI-Lösungen für Ihr Unternehmen. Filtern Sie nach Preismodell, Funktionen und Compliance-Standards.
            </p>
            
            {/* Search & Filter Bar */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-2 max-w-2xl mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Suchen nach Name, Firma oder Feature..." 
                  className="w-full bg-white/90 border-0 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                <SelectTrigger className="w-full md:w-[200px] bg-white/90 border-0 rounded-xl h-[48px] text-slate-900">
                  <SelectValue placeholder="Preismodell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Modelle</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Nutzungsbasiert">Nutzungsbasiert</SelectItem>
                  <SelectItem value="Pro User">Pro User</SelectItem>
                  <SelectItem value="Einmalzahlung">Einmalzahlung</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 pb-24">
        {/* Comparison Bar (Sticky) */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-sm font-medium text-slate-400 whitespace-nowrap hidden sm:inline">Vergleich:</span>
                <div className="flex -space-x-2">
                  {selectedPlatformsData.map((p: Platform) => (
                    <div key={p.id} className="h-10 w-10 rounded-full bg-slate-800 border-2 border-[#0F172A] flex items-center justify-center text-xs font-bold text-white" title={p.name}>
                      {p.name.substring(0, 2)}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium ml-2">{compareList.length} / 3</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearCompare} className="text-slate-400 hover:text-white hover:bg-white/10">
                  Leeren
                </Button>
                <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6">
                      Jetzt vergleichen <ArrowRightLeft className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50">
                    <DialogHeader className="p-6 bg-white border-b border-slate-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <DialogTitle className="text-2xl font-bold text-slate-900">Plattform-Vergleich</DialogTitle>
                          <DialogDescription>Detaillierter Vergleich der ausgewählten Anbieter.</DialogDescription>
                        </div>
                        <Button 
                          onClick={handleExportPDF} 
                          disabled={isExporting}
                          variant="outline"
                          className="gap-2"
                        >
                          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                          Als PDF speichern
                        </Button>
                      </div>
                    </DialogHeader>
                    <ScrollArea className="flex-1 p-6">
                      <div id="comparison-content" className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[800px] bg-slate-50 p-4">
                        {/* Labels Column */}
                        <div className="space-y-8 pt-20 hidden md:block">
                          <div className="h-8 font-semibold text-slate-500">Firma & Standort</div>
                          <div className="h-8 font-semibold text-slate-500">Preismodell</div>
                          <div className="h-8 font-semibold text-slate-500">Basispreis</div>
                          <div className="h-8 font-semibold text-slate-500">Compliance</div>
                          <div className="h-8 font-semibold text-slate-500">Custom GPTs</div>
                          <div className="h-32 font-semibold text-slate-500">Features</div>
                          <div className="h-32 font-semibold text-slate-500">Vorteile</div>
                          <div className="h-32 font-semibold text-slate-500">Nachteile</div>
                        </div>

                        {/* Platform Columns */}
                        {selectedPlatformsData.map((p: Platform) => (
                          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-8">
                            <div className="h-20 border-b border-slate-100 pb-4 mb-4">
                              <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                              <a href={p.url || '#'} target="_blank" className="text-sm text-orange-500 hover:underline flex items-center mt-1">
                                Website öffnen <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase">Firma</div>
                              <div className="font-medium">{p.company}</div>
                              <div className="text-sm text-slate-500">{p.location}</div>
                            </div>

                            <div className="space-y-1">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase">Preismodell</div>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-800">{p.pricingModel}</Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase">Basispreis</div>
                              <div className="font-medium text-slate-900">{p.basePrice}</div>
                              {p.tokenBased && <div className="text-xs text-slate-500">+ Token-Kosten</div>}
                            </div>

                            <div className="space-y-1">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase">Compliance</div>
                              <div className="flex flex-wrap gap-1">
                                {(p.compliance || []).map((c: string) => (
                                  <span key={c} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> {c}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase">Custom GPTs</div>
                              <div className="font-medium flex items-center">
                                {p.customGPTs ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> : <X className="h-4 w-4 text-rose-500 mr-2" />}
                                {p.customGPTDetails}
                              </div>
                            </div>

                            <div className="h-auto md:h-32 overflow-y-auto">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-2">Features</div>
                              <div className="flex flex-wrap gap-1">
                                {(p.features || []).map((f: string) => (
                                  <FeatureBadge key={f}>{f}</FeatureBadge>
                                ))}
                              </div>
                            </div>

                            <div className="h-auto md:h-32 overflow-y-auto">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-2">Vorteile</div>
                              <ProsList items={p.pros || []} />
                            </div>

                            <div className="h-auto md:h-32 overflow-y-auto">
                              <div className="md:hidden text-xs font-semibold text-slate-400 uppercase mb-2">Nachteile</div>
                              <ConsList items={p.cons || []} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Calculator (Desktop) */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-6">
            <CostCalculator />
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Warum vergleichen?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Die Preismodelle unterscheiden sich stark. Während einige Anbieter pauschal pro User abrechnen, setzen andere auf Token-Verbrauch oder Hybrid-Modelle.
              </p>
              <p className="text-sm text-blue-700">
                Unser Rechner hilft Ihnen, die versteckten Kosten bei hoher Nutzung aufzudecken.
              </p>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {filteredPlatforms.map((platform: Platform) => (
                <PlatformCard 
                  key={platform.id} 
                  platform={{
                    id: platform.slug,
                    name: platform.name,
                    company: platform.company,
                    location: platform.location || '',
                    pricingModel: platform.pricingModel as any,
                    basePrice: platform.basePrice || '',
                    tokenBased: platform.tokenBased || false,
                    compliance: platform.compliance || [],
                    customGPTs: platform.customGPTs || false,
                    customGPTDetails: platform.customGPTDetails || '',
                    features: platform.features || [],
                    pros: platform.pros || [],
                    cons: platform.cons || [],
                    url: platform.url || '',
                    description: platform.description || '',
                    screenshots: [],
                    employees: platform.employees || '',
                    customers: platform.customers || ''
                  }} 
                  onCompare={() => toggleCompare(platform.id)}
                  isSelected={compareList.includes(platform.id)}
                />
              ))}
            </div>

            {filteredPlatforms.length === 0 && (
              <div className="text-center py-20 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Keine Ergebnisse gefunden</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Versuchen Sie es mit anderen Suchbegriffen oder ändern Sie die Filtereinstellungen.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => { setSearchQuery(""); setSelectedPricing("all"); }}
                >
                  Filter zurücksetzen
                </Button>
              </div>
            )}

            {/* Newsletter Section */}
            <Newsletter />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="container text-center text-slate-500 text-sm">
          <div className="flex justify-center gap-6 mb-6 font-medium flex-wrap">
            <Link href="/blog" className="text-slate-600 hover:text-orange-500 transition-colors">Blog & Ratgeber</Link>
            <Link href="/datenschutz" className="text-slate-600 hover:text-orange-500 transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="text-slate-600 hover:text-orange-500 transition-colors">Impressum</Link>
            <Link href="/admin" className="text-slate-600 hover:text-orange-500 transition-colors">Admin</Link>
          </div>
          <p className="mb-4">
            Diese Übersicht dient nur zu Informationszwecken. Alle Angaben ohne Gewähr. <br/>
            Preise und Funktionen können sich jederzeit ändern. Bitte prüfen Sie die aktuellen Konditionen auf den Webseiten der Anbieter.
          </p>
          <p>© 2026 LLM-Plattform Vergleich. Erstellt mit Manus.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
