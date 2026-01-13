import { cn } from "@/lib/utils";
import { Check, X, ExternalLink, Shield, Building2, Users, Coins, ArrowRight, Scale } from "lucide-react";
import { Link, useLocation } from "wouter";

export const SectionHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-3xl font-bold tracking-tight text-slate-900 mb-6", className)}>
    {children}
  </h2>
);

export const FeatureBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 mr-2 mb-2">
    {children}
  </span>
);

export const ProsList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 mt-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start text-sm text-slate-600">
        <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

export const ConsList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 mt-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start text-sm text-slate-600">
        <X className="h-4 w-4 text-rose-500 mr-2 mt-0.5 shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

export const PlatformCard = ({ platform, onCompare, isSelected, onAddToCompare, isInCompareCart }: { 
  platform: any, 
  onCompare: (id: string) => void, 
  isSelected: boolean,
  onAddToCompare?: (platformId: number, platformSlug: string) => void,
  isInCompareCart?: boolean
}) => {
  const [, navigate] = useLocation();
  
  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      isSelected ? "ring-2 ring-orange-500 border-orange-500 shadow-md" : "border-slate-200",
      isInCompareCart ? "ring-2 ring-blue-500 border-blue-500" : ""
    )}>
      {/* Compare Cart Badge */}
      {isInCompareCart && (
        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Scale className="h-3 w-3" />
          Im Vergleich
        </div>
      )}
      
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {platform.logoUrl && (
              <img 
                src={platform.logoUrl} 
                alt={`${platform.name} Logo`} 
                className="h-12 w-12 object-contain rounded-lg bg-white border border-slate-100 p-1" 
              />
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
              <p className="text-sm text-slate-500 flex items-center mt-1">
                <Building2 className="h-3 w-3 mr-1" /> {platform.company}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-slate-700">
            <Coins className="h-4 w-4 mr-2 text-slate-400" />
            <span className="font-medium">{platform.basePrice}</span>
          </div>
          <div className="flex items-center text-sm text-slate-700">
            <Shield className="h-4 w-4 mr-2 text-slate-400" />
            <span>{platform.compliance[0]}</span>
          </div>
          <div className="flex items-center text-sm text-slate-700">
            <Users className="h-4 w-4 mr-2 text-slate-400" />
            <span>{platform.customers}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Highlights</p>
          <ProsList items={platform.pros.slice(0, 2)} />
        </div>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {onAddToCompare ? (
            <button 
              onClick={() => onAddToCompare(platform.numericId, platform.id)}
              className={cn(
                "flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1",
                isInCompareCart 
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
              )}
            >
              <Scale className="h-4 w-4" />
              {isInCompareCart ? "Entfernen" : "Zum Vergleich"}
            </button>
          ) : (
            <button 
              onClick={() => onCompare(platform.id)}
              className={cn(
                "flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors",
                isSelected 
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200" 
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isSelected ? "Ausgewählt" : "Vergleichen"}
            </button>
          )}
          <a 
            href={platform.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
            title="Zur Website"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
        <Link href={`/platform/${platform.id}`}>
          <button className="w-full text-sm font-medium py-2 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center group-hover:bg-orange-500">
            Details ansehen <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};
