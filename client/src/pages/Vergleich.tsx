import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";
import { MemberMenu } from "@/components/MemberLogin";
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  Minus,
  ChevronDown,
  Star,
  Building2,
  MapPin,
  ExternalLink,
  Loader2,
  Scale,
  Download,
  FileText
} from "lucide-react";

export default function Vergleich() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialIds = params.get("ids")?.split(",").map(Number).filter(Boolean) || [];
  
  const [selectedIds, setSelectedIds] = useState<number[]>(initialIds.slice(0, 3));
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);

  // Fetch all platforms for selector
  const { data: allPlatforms, isLoading: loadingPlatforms } = trpc.platforms.list.useQuery();
  
  // Fetch selected platforms with details
  const { data: platform1 } = trpc.platforms.getBySlug.useQuery(
    { slug: allPlatforms?.find(p => p.id === selectedIds[0])?.slug || "" },
    { enabled: !!selectedIds[0] && !!allPlatforms }
  );
  const { data: platform2 } = trpc.platforms.getBySlug.useQuery(
    { slug: allPlatforms?.find(p => p.id === selectedIds[1])?.slug || "" },
    { enabled: !!selectedIds[1] && !!allPlatforms }
  );
  const { data: platform3 } = trpc.platforms.getBySlug.useQuery(
    { slug: allPlatforms?.find(p => p.id === selectedIds[2])?.slug || "" },
    { enabled: !!selectedIds[2] && !!allPlatforms }
  );

  // Fetch API pricing for selected platforms
  const { data: pricing1 } = trpc.apiPricing.listByPlatform.useQuery(
    { platformId: selectedIds[0] },
    { enabled: !!selectedIds[0] }
  );
  const { data: pricing2 } = trpc.apiPricing.listByPlatform.useQuery(
    { platformId: selectedIds[1] },
    { enabled: !!selectedIds[1] }
  );
  const { data: pricing3 } = trpc.apiPricing.listByPlatform.useQuery(
    { platformId: selectedIds[2] },
    { enabled: !!selectedIds[2] }
  );

  // Fetch average ratings
  const { data: rating1 } = trpc.reviews.getAverageRating.useQuery(
    { platformId: selectedIds[0] },
    { enabled: !!selectedIds[0] }
  );
  const { data: rating2 } = trpc.reviews.getAverageRating.useQuery(
    { platformId: selectedIds[1] },
    { enabled: !!selectedIds[1] }
  );
  const { data: rating3 } = trpc.reviews.getAverageRating.useQuery(
    { platformId: selectedIds[2] },
    { enabled: !!selectedIds[2] }
  );

  const selectedPlatforms = [platform1, platform2, platform3].filter(Boolean);
  const pricingData = [pricing1, pricing2, pricing3];
  const ratingData = [rating1, rating2, rating3];

  // Add platform to comparison
  const addPlatform = (id: number) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
    setShowPlatformSelector(false);
  };

  // Remove platform from comparison
  const removePlatform = (id: number) => {
    setSelectedIds(selectedIds.filter(i => i !== id));
  };

  // Get available platforms (not yet selected)
  const availablePlatforms = allPlatforms?.filter(p => !selectedIds.includes(p.id)) || [];

  // Get cheapest input price for a platform
  const getCheapestInputPrice = (pricing: typeof pricing1) => {
    if (!pricing || pricing.length === 0) return null;
    const prices = pricing.map(p => parseFloat(p.inputPricePerMillion));
    return Math.min(...prices);
  };

  // PDF Export function
  const exportToPDF = async () => {
    if (selectedPlatforms.length === 0) return;
    
    // Create HTML content for PDF
    const platformNames = selectedPlatforms.map(p => p?.name || "").join(" vs ");
    const today = new Date().toLocaleDateString("de-DE");
    
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Plattform-Vergleich: ${platformNames}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          h1 { color: #0f172a; font-size: 24px; margin-bottom: 8px; }
          .subtitle { color: #64748b; font-size: 14px; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: #f8fafc; font-weight: 600; color: #475569; }
          .platform-header { background: #0f172a; color: white; font-weight: bold; }
          .check { color: #22c55e; }
          .cross { color: #94a3b8; }
          .price { color: #22c55e; font-family: monospace; font-weight: bold; }
          .rating { color: #f97316; }
          .tag { display: inline-block; padding: 2px 8px; background: #f1f5f9; border-radius: 4px; font-size: 12px; margin: 2px; }
          .pro { color: #22c55e; }
          .con { color: #ef4444; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <h1>Plattform-Vergleich</h1>
        <p class="subtitle">Erstellt am ${today} | DSGVO-konforme LLM-Plattformen</p>
        
        <table>
          <thead>
            <tr>
              <th style="width: 150px;">Merkmal</th>
              ${selectedPlatforms.map(p => `<th class="platform-header">${p?.name || ""}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Firma</strong></td>
              ${selectedPlatforms.map(p => `<td>${p?.company || "-"}</td>`).join("")}
            </tr>
            <tr>
              <td><strong>Standort</strong></td>
              ${selectedPlatforms.map(p => `<td>${p?.location || "-"}</td>`).join("")}
            </tr>
            <tr>
              <td><strong>Preismodell</strong></td>
              ${selectedPlatforms.map(p => `<td>${p?.pricingModel || "-"}</td>`).join("")}
            </tr>
            <tr>
              <td><strong>Basispreis</strong></td>
              ${selectedPlatforms.map(p => `<td>${p?.basePrice || "-"}</td>`).join("")}
            </tr>
            <tr>
              <td><strong>Günstigster API-Preis</strong></td>
              ${selectedPlatforms.map((p, i) => {
                const pricing = pricingData[selectedIds.indexOf(p?.id || 0)];
                const cheapest = getCheapestInputPrice(pricing);
                return `<td class="price">${cheapest !== null ? cheapest.toFixed(2) + "€/1M Token" : "-"}</td>`;
              }).join("")}
            </tr>
            <tr>
              <td><strong>Bewertung</strong></td>
              ${selectedPlatforms.map((p, i) => {
                const rating = ratingData[selectedIds.indexOf(p?.id || 0)];
                return `<td class="rating">${rating && rating.count > 0 ? `★ ${rating.average.toFixed(1)} (${rating.count})` : "Keine"}</td>`;
              }).join("")}
            </tr>
            <tr>
              <td><strong>Compliance</strong></td>
              ${selectedPlatforms.map(p => {
                const compliance = p?.compliance as string[] | null;
                return `<td>${compliance?.map(c => `<span class="tag">${c}</span>`).join(" ") || "-"}</td>`;
              }).join("")}
            </tr>
            <tr>
              <td><strong>Vorteile</strong></td>
              ${selectedPlatforms.map(p => {
                const pros = p?.pros as string[] | null;
                return `<td>${pros?.slice(0, 3).map(pro => `<div class="pro">✓ ${pro}</div>`).join("") || "-"}</td>`;
              }).join("")}
            </tr>
            <tr>
              <td><strong>Nachteile</strong></td>
              ${selectedPlatforms.map(p => {
                const cons = p?.cons as string[] | null;
                return `<td>${cons?.slice(0, 3).map(con => `<div class="con">✗ ${con}</div>`).join("") || "-"}</td>`;
              }).join("")}
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>Dieser Vergleich wurde automatisch generiert von LLM-Plattform Vergleich.</p>
          <p>Alle Angaben ohne Gewähr. Stand: ${today}</p>
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    // Open print dialog for PDF
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Comparison rows
  const comparisonRows = [
    {
      label: "Firma",
      icon: Building2,
      getValue: (p: typeof platform1) => p?.company || "-"
    },
    {
      label: "Standort",
      icon: MapPin,
      getValue: (p: typeof platform1) => p?.location || "-"
    },
    {
      label: "Preismodell",
      icon: Scale,
      getValue: (p: typeof platform1) => p?.pricingModel || "-"
    },
    {
      label: "Basispreis",
      icon: Scale,
      getValue: (p: typeof platform1) => p?.basePrice || "-"
    },
    {
      label: "Custom GPTs",
      icon: Check,
      getValue: (p: typeof platform1) => p?.customGPTs ? "Ja" : "Nein",
      isBoolean: true
    },
    {
      label: "Token-basiert",
      icon: Check,
      getValue: (p: typeof platform1) => p?.tokenBased ? "Ja" : "Nein",
      isBoolean: true
    },
  ];

  return (
    <>
      <SEO 
        title="Plattform-Vergleich | DSGVO-konforme LLM-Plattformen"
        description="Vergleichen Sie bis zu 3 DSGVO-konforme LLM-Plattformen direkt nebeneinander. Preise, Funktionen und Compliance im Überblick."
        keywords="LLM Vergleich, KI Plattform Vergleich, DSGVO KI"
      />
      
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Zurück</span>
                </Link>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Scale className="h-5 w-5 text-orange-500" />
                  Plattform-Vergleich
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {selectedPlatforms.length > 0 && (
                  <button
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Als PDF exportieren
                  </button>
                )}
                <MemberMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Platform Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[0, 1, 2].map((index) => {
              const platformId = selectedIds[index];
              const platform = [platform1, platform2, platform3][index];
              
              if (platformId && platform) {
                return (
                  <div key={index} className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                        <p className="text-sm text-slate-400">{platform.company}</p>
                      </div>
                      <button
                        onClick={() => removePlatform(platformId)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {ratingData[index] && ratingData[index]!.count > 0 && (
                        <span className="flex items-center gap-1 text-sm text-orange-400">
                          <Star className="h-4 w-4 fill-current" />
                          {ratingData[index]!.average.toFixed(1)}
                        </span>
                      )}
                      <Link
                        href={`/platform/${platform.slug}`}
                        className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => setShowPlatformSelector(true)}
                    disabled={selectedIds.length >= 3}
                    className="w-full h-full min-h-[120px] bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700 hover:border-orange-500/50 transition-colors flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-8 w-8" />
                    <span className="text-sm">Plattform hinzufügen</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Platform Selector Modal */}
          {showPlatformSelector && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 rounded-xl border border-slate-800 w-full max-w-md max-h-[70vh] overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Plattform auswählen</h3>
                  <button
                    onClick={() => setShowPlatformSelector(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[50vh]">
                  {loadingPlatforms ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
                    </div>
                  ) : availablePlatforms.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">
                      Alle Plattformen wurden bereits ausgewählt.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {availablePlatforms.map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => addPlatform(platform.id)}
                          className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <div className="font-medium text-white">{platform.name}</div>
                          <div className="text-sm text-slate-400">{platform.company}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedPlatforms.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 w-48">
                        Merkmal
                      </th>
                      {selectedPlatforms.map((platform, index) => (
                        <th key={platform?.id || index} className="px-4 py-3 text-center text-sm font-medium text-white">
                          {platform?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Basic Info Rows */}
                    {comparisonRows.map((row, rowIndex) => {
                      const Icon = row.icon;
                      return (
                        <tr key={rowIndex} className="border-b border-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-2 text-sm text-slate-300">
                              <Icon className="h-4 w-4 text-slate-500" />
                              {row.label}
                            </span>
                          </td>
                          {selectedPlatforms.map((platform, index) => {
                            const value = row.getValue(platform);
                            return (
                              <td key={platform?.id || index} className="px-4 py-3 text-center">
                                {row.isBoolean ? (
                                  value === "Ja" ? (
                                    <Check className="h-5 w-5 text-green-400 mx-auto" />
                                  ) : (
                                    <Minus className="h-5 w-5 text-slate-500 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm text-white">{value}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Compliance Row */}
                    <tr className="border-b border-slate-800/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="h-4 w-4 text-slate-500" />
                          Compliance
                        </span>
                      </td>
                      {selectedPlatforms.map((platform, index) => (
                        <td key={platform?.id || index} className="px-4 py-3 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {(platform?.compliance as string[] | null)?.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                                {c}
                              </span>
                            )) || <span className="text-slate-500">-</span>}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Rating Row */}
                    <tr className="border-b border-slate-800/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-slate-300">
                          <Star className="h-4 w-4 text-slate-500" />
                          Bewertung
                        </span>
                      </td>
                      {selectedPlatforms.map((platform, index) => {
                        const rating = ratingData[selectedIds.indexOf(platform?.id || 0)];
                        return (
                          <td key={platform?.id || index} className="px-4 py-3 text-center">
                            {rating && rating.count > 0 ? (
                              <span className="flex items-center gap-1 justify-center text-orange-400">
                                <Star className="h-4 w-4 fill-current" />
                                {rating.average.toFixed(1)} ({rating.count})
                              </span>
                            ) : (
                              <span className="text-slate-500">Keine</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Cheapest API Price Row */}
                    <tr className="border-b border-slate-800/50 bg-slate-800/30">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                          <Scale className="h-4 w-4 text-orange-500" />
                          Günstigster API-Preis
                        </span>
                      </td>
                      {selectedPlatforms.map((platform, index) => {
                        const pricing = pricingData[selectedIds.indexOf(platform?.id || 0)];
                        const cheapest = getCheapestInputPrice(pricing);
                        return (
                          <td key={platform?.id || index} className="px-4 py-3 text-center">
                            {cheapest !== null ? (
                              <span className="text-green-400 font-mono font-bold">
                                {cheapest.toFixed(2)}€/1M
                              </span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Features Row */}
                    <tr className="border-b border-slate-800/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="h-4 w-4 text-slate-500" />
                          Features
                        </span>
                      </td>
                      {selectedPlatforms.map((platform, index) => (
                        <td key={platform?.id || index} className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {(platform?.features as string[] | null)?.slice(0, 5).map((f, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                                {f}
                              </span>
                            )) || <span className="text-slate-500">-</span>}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Pros Row */}
                    <tr className="border-b border-slate-800/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-green-400">
                          <Check className="h-4 w-4" />
                          Vorteile
                        </span>
                      </td>
                      {selectedPlatforms.map((platform, index) => (
                        <td key={platform?.id || index} className="px-4 py-3">
                          <ul className="text-xs text-slate-300 space-y-1">
                            {(platform?.pros as string[] | null)?.slice(0, 3).map((p, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                                {p}
                              </li>
                            )) || <li className="text-slate-500">-</li>}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Cons Row */}
                    <tr>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-red-400">
                          <Minus className="h-4 w-4" />
                          Nachteile
                        </span>
                      </td>
                      {selectedPlatforms.map((platform, index) => (
                        <td key={platform?.id || index} className="px-4 py-3">
                          <ul className="text-xs text-slate-300 space-y-1">
                            {(platform?.cons as string[] | null)?.slice(0, 3).map((c, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <Minus className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
                                {c}
                              </li>
                            )) || <li className="text-slate-500">-</li>}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedPlatforms.length === 0 && (
            <div className="text-center py-16">
              <Scale className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Keine Plattformen ausgewählt</h2>
              <p className="text-slate-400 mb-6">
                Wählen Sie bis zu 3 Plattformen aus, um sie direkt zu vergleichen.
              </p>
              <button
                onClick={() => setShowPlatformSelector(true)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Plattform hinzufügen
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2026 LLM-Plattform Vergleich</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
              <Link href="/impressum" className="hover:text-white">Impressum</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
