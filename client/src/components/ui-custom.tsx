import { cn } from "@/lib/utils";
import { Check, X, ExternalLink, Shield, Building2, Users, Coins } from "lucide-react";

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

export const PlatformCard = ({ platform, onCompare, isSelected }: { platform: any, onCompare: (id: string) => void, isSelected: boolean }) => {
  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      isSelected ? "ring-2 ring-orange-500 border-orange-500 shadow-md" : "border-slate-200"
    )}>
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
            <p className="text-sm text-slate-500 flex items-center mt-1">
              <Building2 className="h-3 w-3 mr-1" /> {platform.company}
            </p>
          </div>
          {platform.logo && <img src={platform.logo} alt={platform.name} className="h-8 w-8 object-contain" />}
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

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
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
    </div>
  );
};
