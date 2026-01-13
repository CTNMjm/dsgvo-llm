import { useState, useRef, useEffect } from "react";
import { Search, X, FileText, Server, Cpu, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Search query
  const { data: results, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery },
    { 
      enabled: debouncedQuery.length >= 2,
      staleTime: 30000,
    }
  );

  const hasResults = results && (
    results.platforms.length > 0 || 
    results.blogPosts.length > 0 || 
    results.apiModels.length > 0
  );

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Suchen..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded"
          >
            <X className="h-3 w-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Keine Ergebnisse für "{query}"</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {/* Platforms */}
              {results.platforms.length > 0 && (
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    Plattformen
                  </h3>
                  <div className="space-y-1">
                    {results.platforms.map((platform) => (
                      <Link
                        key={platform.id}
                        href={`/plattform/${platform.slug}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        {platform.logoUrl ? (
                          <img
                            src={platform.logoUrl}
                            alt={platform.name}
                            className="h-8 w-8 rounded object-contain bg-white p-1"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-slate-700 flex items-center justify-center">
                            <Server className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{platform.name}</p>
                          <p className="text-xs text-slate-400 truncate">{platform.company}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts */}
              {results.blogPosts.length > 0 && (
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    Blog-Artikel
                  </h3>
                  <div className="space-y-1">
                    {results.blogPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <div className="h-8 w-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{post.title}</p>
                          {post.category && (
                            <p className="text-xs text-slate-400">{post.category}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* API Models */}
              {results.apiModels.length > 0 && (
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    API-Modelle
                  </h3>
                  <div className="space-y-1">
                    {results.apiModels.map((model) => (
                      <Link
                        key={model.id}
                        href={`/plattform/${model.platformSlug}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <div className="h-8 w-8 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <Cpu className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {model.provider} {model.modelName}
                          </p>
                          <p className="text-xs text-slate-400">
                            Input: ${model.inputPricePerMillion}/M • Output: ${model.outputPricePerMillion}/M
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Link */}
              <div className="p-3 bg-slate-800/50">
                <Link
                  href={`/api-preise?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="block text-center text-sm text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Alle Ergebnisse anzeigen →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
