import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, CheckCircle2, X, Building2, MapPin, Users, Shield, Coins, Layers, Loader2 } from "lucide-react";
import { ProsList, ConsList } from "@/components/ui-custom";
import { Reviews } from "@/components/Reviews";
import { LeadForm } from "@/components/LeadForm";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "./NotFound";

export default function PlatformDetail() {
  const [match, params] = useRoute("/platform/:slug");
  
  if (!match) return <NotFound />;

  const { data: platform, isLoading, error } = trpc.platforms.getBySlug.useQuery(
    { slug: params.slug },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="container py-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </header>
        <main className="container py-8 max-w-5xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="w-full md:w-80 h-64 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !platform) return <NotFound />;

  const features = platform.features || [];
  const pros = platform.pros || [];
  const cons = platform.cons || [];
  const compliance = platform.compliance || [];

  return (
    <>
      <SEO 
        title={`${platform.name} - DSGVO-konforme LLM-Plattform`}
        description={platform.description || `${platform.name} von ${platform.company}: DSGVO-konforme KI-Lösung für Unternehmen. Preismodell: ${platform.pricingModel}. Compliance: ${compliance.join(', ')}.`}
        url={`/platform/${platform.slug}`}
        keywords={`${platform.name}, ${platform.company}, LLM Plattform, DSGVO konform, ${compliance.join(', ')}`}
        product={{
          name: platform.name,
          description: platform.description || `${platform.name} - DSGVO-konforme KI-Plattform`,
          brand: platform.company
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Plattformen', url: '/' },
          { name: platform.name, url: `/platform/${platform.slug}` }
        ]}
      />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">{platform.name}</h1>
            <a href={platform.url || '#'} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                Website besuchen <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        {/* Hero Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {platform.name.substring(0, 2)}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{platform.name}</h1>
                  <div className="flex items-center text-slate-500 mt-1">
                    <Building2 className="h-4 w-4 mr-1" /> {platform.company}
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4 mr-1" /> {platform.location}
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {platform.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1 text-sm">
                  <Users className="h-3 w-3 mr-2" /> {platform.customers}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1 text-sm">
                  <Shield className="h-3 w-3 mr-2" /> {compliance.join(", ")}
                </Badge>
              </div>
            </div>

            {/* Pricing Card (Mini) */}
            <div className="w-full md:w-80 bg-slate-50 rounded-xl border border-slate-200 p-6 shrink-0">
              <div className="mb-6 space-y-3">
                <LeadForm platformName={platform.name} platformId={platform.id} />
                <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-100 text-slate-700" asChild>
                  <a href={platform.url || '#'} target="_blank" rel="noopener noreferrer">
                    Zur Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Preismodell</h3>
              <div className="text-3xl font-bold text-slate-900 mb-1">{platform.basePrice}</div>
              <div className="text-sm text-slate-500 mb-4">
                {platform.pricingModel} 
                {platform.tokenBased && " + Token-Verbrauch"}
              </div>
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Custom GPTs</span>
                  {platform.customGPTs ? (
                    <span className="text-emerald-600 font-medium flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" /> Ja</span>
                  ) : (
                    <span className="text-rose-600 font-medium flex items-center"><X className="h-4 w-4 mr-1" /> Nein</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Typ</span>
                  <span className="text-slate-900 font-medium">{platform.customGPTDetails}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots Section */}
        {platform.screenshotUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <Layers className="h-6 w-6 mr-2 text-orange-500" /> Einblick in die Plattform
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 group">
                <img 
                  src={platform.screenshotUrl} 
                  alt={`${platform.name} Screenshot`} 
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Detailed Features & Pros/Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Features */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Coins className="h-5 w-5 mr-2 text-orange-500" /> Funktionen & Features
            </h2>
            <div className="flex flex-wrap gap-2">
              {features.map(f => (
                <span key={f} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 border border-slate-100">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-orange-500" /> Vor- & Nachteile
            </h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Stärken</h3>
              <ProsList items={pros} />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-3">Schwächen</h3>
              <ConsList items={cons} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Reviews platformId={platform.id} platformName={platform.name} />
        </div>

      </main>
    </div>
    </>
  );
}
