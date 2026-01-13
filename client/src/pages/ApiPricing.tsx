import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";
import { MemberMenu } from "@/components/MemberLogin";
import { 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  Check, 
  X, 
  Globe, 
  Code, 
  MessageSquare, 
  Image as ImageIcon,
  Mic,
  Brain,
  Loader2,
  ArrowLeft
} from "lucide-react";

// Available filter options
const LANGUAGES = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "Englisch" },
  { code: "fr", label: "Französisch" },
  { code: "es", label: "Spanisch" },
  { code: "it", label: "Italienisch" },
  { code: "pt", label: "Portugiesisch" },
  { code: "nl", label: "Niederländisch" },
  { code: "pl", label: "Polnisch" },
  { code: "ru", label: "Russisch" },
  { code: "zh", label: "Chinesisch" },
  { code: "ja", label: "Japanisch" },
  { code: "ko", label: "Koreanisch" },
];

const CAPABILITIES = [
  { code: "chat", label: "Chat", icon: MessageSquare },
  { code: "code", label: "Code", icon: Code },
  { code: "embedding", label: "Embedding", icon: Globe },
  { code: "vision", label: "Vision", icon: ImageIcon },
  { code: "audio", label: "Audio", icon: Mic },
  { code: "reasoning", label: "Reasoning", icon: Brain },
];

type SortField = "provider" | "modelName" | "inputPrice" | "outputPrice" | "contextWindow";
type SortDirection = "asc" | "desc";

export default function ApiPricing() {
  // Filter state
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [maxInputPrice, setMaxInputPrice] = useState<number | undefined>();
  const [maxOutputPrice, setMaxOutputPrice] = useState<number | undefined>();
  const [minContextWindow, setMinContextWindow] = useState<number | undefined>();
  
  // Sort state
  const [sortField, setSortField] = useState<SortField>("inputPrice");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Dropdown states
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCapabilityDropdown, setShowCapabilityDropdown] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);

  // Fetch data
  const { data: allPricing, isLoading } = trpc.apiPricing.filter.useQuery({
    languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
    capabilities: selectedCapabilities.length > 0 ? selectedCapabilities : undefined,
    providers: selectedProviders.length > 0 ? selectedProviders : undefined,
    minContextWindow,
    maxInputPrice,
    maxOutputPrice,
  });
  
  const { data: providers } = trpc.apiPricing.providers.useQuery();
  const { data: platforms } = trpc.platforms.list.useQuery();

  // Sort pricing data
  const sortedPricing = useMemo(() => {
    if (!allPricing) return [];
    
    return [...allPricing].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "provider":
          comparison = a.provider.localeCompare(b.provider);
          break;
        case "modelName":
          comparison = a.modelName.localeCompare(b.modelName);
          break;
        case "inputPrice":
          comparison = parseFloat(a.inputPricePerMillion) - parseFloat(b.inputPricePerMillion);
          break;
        case "outputPrice":
          comparison = parseFloat(a.outputPricePerMillion) - parseFloat(b.outputPricePerMillion);
          break;
        case "contextWindow":
          comparison = (a.contextWindow || 0) - (b.contextWindow || 0);
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [allPricing, sortField, sortDirection]);

  // Get platform name by ID
  const getPlatformName = (platformId: number) => {
    const platform = platforms?.find(p => p.id === platformId);
    return platform?.name || "Unbekannt";
  };

  const getPlatformSlug = (platformId: number) => {
    const platform = platforms?.find(p => p.id === platformId);
    return platform?.slug || "";
  };

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Toggle filter selection
  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev => 
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  const toggleCapability = (code: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev => 
      prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLanguages([]);
    setSelectedCapabilities([]);
    setSelectedProviders([]);
    setMaxInputPrice(undefined);
    setMaxOutputPrice(undefined);
    setMinContextWindow(undefined);
  };

  const hasActiveFilters = selectedLanguages.length > 0 || 
    selectedCapabilities.length > 0 || 
    selectedProviders.length > 0 ||
    maxInputPrice !== undefined ||
    maxOutputPrice !== undefined ||
    minContextWindow !== undefined;

  // Format context window
  const formatContextWindow = (tokens: number | null) => {
    if (!tokens) return "-";
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  return (
    <>
      <SEO 
        title="API-Preise Vergleich | DSGVO-konforme LLM-Plattformen"
        description="Vergleichen Sie API-Preise für GPT-4, Claude, Gemini und weitere LLM-Modelle. Filtern Sie nach Sprachen, Funktionen und Preisen."
        keywords="API Preise, LLM Kosten, GPT-4 Preis, Claude Preis, Token Kosten"
      />
      
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Zurück</span>
                </Link>
                <h1 className="text-xl font-bold text-white">API-Preise Vergleich</h1>
              </div>
              <MemberMenu />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Filter Section */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-white">Filter</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Filter zurücksetzen
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Language Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown);
                    setShowCapabilityDropdown(false);
                    setShowProviderDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:border-slate-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    {selectedLanguages.length > 0 
                      ? `${selectedLanguages.length} Sprache(n)` 
                      : "Sprachen"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => toggleLanguage(lang.code)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700 text-left"
                      >
                        <span className="text-white">{lang.label}</span>
                        {selectedLanguages.includes(lang.code) && (
                          <Check className="h-4 w-4 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Capability Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCapabilityDropdown(!showCapabilityDropdown);
                    setShowLanguageDropdown(false);
                    setShowProviderDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:border-slate-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-slate-400" />
                    {selectedCapabilities.length > 0 
                      ? `${selectedCapabilities.length} Funktion(en)` 
                      : "Funktionen"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showCapabilityDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showCapabilityDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                    {CAPABILITIES.map(cap => {
                      const Icon = cap.icon;
                      return (
                        <button
                          key={cap.code}
                          onClick={() => toggleCapability(cap.code)}
                          className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700 text-left"
                        >
                          <span className="flex items-center gap-2 text-white">
                            <Icon className="h-4 w-4 text-slate-400" />
                            {cap.label}
                          </span>
                          {selectedCapabilities.includes(cap.code) && (
                            <Check className="h-4 w-4 text-orange-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Provider Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProviderDropdown(!showProviderDropdown);
                    setShowLanguageDropdown(false);
                    setShowCapabilityDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:border-slate-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-slate-400" />
                    {selectedProviders.length > 0 
                      ? `${selectedProviders.length} Anbieter` 
                      : "Anbieter"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showProviderDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showProviderDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                    {providers?.map(provider => (
                      <button
                        key={provider}
                        onClick={() => toggleProvider(provider)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700 text-left"
                      >
                        <span className="text-white">{provider}</span>
                        {selectedProviders.includes(provider) && (
                          <Check className="h-4 w-4 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Max Price Filter */}
              <div>
                <input
                  type="number"
                  placeholder="Max. Input-Preis (€/1M)"
                  value={maxInputPrice || ""}
                  onChange={(e) => setMaxInputPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
                {selectedLanguages.map(code => {
                  const lang = LANGUAGES.find(l => l.code === code);
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm"
                    >
                      {lang?.label}
                      <button onClick={() => toggleLanguage(code)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                {selectedCapabilities.map(code => {
                  const cap = CAPABILITIES.find(c => c.code === code);
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      {cap?.label}
                      <button onClick={() => toggleCapability(code)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                {selectedProviders.map(provider => (
                  <span
                    key={provider}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                  >
                    {provider}
                    <button onClick={() => toggleProvider(provider)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Results Table */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => toggleSort("provider")}
                        className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white"
                      >
                        Anbieter
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => toggleSort("modelName")}
                        className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white"
                      >
                        Modell
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleSort("inputPrice")}
                        className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white ml-auto"
                      >
                        Input €/1M
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleSort("outputPrice")}
                        className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white ml-auto"
                      >
                        Output €/1M
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleSort("contextWindow")}
                        className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white ml-auto"
                      >
                        Kontext
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                      Funktionen
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                      Plattform
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
                        <p className="text-slate-400 mt-2">Lade Preise...</p>
                      </td>
                    </tr>
                  ) : sortedPricing.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        Keine Ergebnisse gefunden. Versuchen Sie andere Filter.
                      </td>
                    </tr>
                  ) : (
                    sortedPricing.map((pricing) => (
                      <tr 
                        key={pricing.id} 
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-white font-medium">{pricing.provider}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-white">{pricing.modelName}</span>
                            {pricing.modelVersion && (
                              <span className="text-slate-500 text-sm ml-1">({pricing.modelVersion})</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-green-400 font-mono">
                            {parseFloat(pricing.inputPricePerMillion).toFixed(2)}€
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-orange-400 font-mono">
                            {parseFloat(pricing.outputPricePerMillion).toFixed(2)}€
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-slate-300 font-mono text-sm">
                            {formatContextWindow(pricing.contextWindow)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {(pricing.capabilities as string[] | null)?.map(cap => {
                              const capInfo = CAPABILITIES.find(c => c.code === cap);
                              if (!capInfo) return null;
                              const Icon = capInfo.icon;
                              return (
                                <span
                                  key={cap}
                                  title={capInfo.label}
                                  className="p-1 bg-slate-800 rounded text-slate-400"
                                >
                                  <Icon className="h-3 w-3" />
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/plattform/${getPlatformSlug(pricing.platformId)}`}
                            className="text-orange-400 hover:text-orange-300 text-sm"
                          >
                            {getPlatformName(pricing.platformId)}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Results Count */}
            <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/30">
              <p className="text-sm text-slate-400">
                {sortedPricing.length} Modell{sortedPricing.length !== 1 ? "e" : ""} gefunden
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2026 LLM-Plattform Vergleich. Alle Preise in EUR, exkl. MwSt.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/datenschutz" className="hover:text-white">Datenschutz</Link>
              <Link to="/impressum" className="hover:text-white">Impressum</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
