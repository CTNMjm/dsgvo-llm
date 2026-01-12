import { trpc } from "@/lib/trpc";
import { Loader2, DollarSign, Cpu, ArrowDownUp, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApiPricingProps {
  platformId: number;
}

// Group pricing by provider
function groupByProvider(pricing: any[]) {
  return pricing.reduce((acc, item) => {
    if (!acc[item.provider]) {
      acc[item.provider] = [];
    }
    acc[item.provider].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

// Provider colors
const providerColors: Record<string, string> = {
  'OpenAI': 'bg-green-100 text-green-800',
  'Anthropic': 'bg-orange-100 text-orange-800',
  'Google': 'bg-blue-100 text-blue-800',
  'Meta': 'bg-indigo-100 text-indigo-800',
  'Mistral': 'bg-purple-100 text-purple-800',
  'Cohere': 'bg-pink-100 text-pink-800',
  'default': 'bg-slate-100 text-slate-800'
};

export function ApiPricing({ platformId }: ApiPricingProps) {
  const { data: pricing = [], isLoading } = trpc.apiPricing.listByPlatform.useQuery(
    { platformId },
    { enabled: !!platformId }
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (pricing.length === 0) {
    return null; // Don't show section if no pricing data
  }

  const groupedPricing = groupByProvider(pricing);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-100">
          <DollarSign className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">API-Preise</h3>
          <p className="text-sm text-slate-500">Preise pro 1 Million Tokens (EUR)</p>
        </div>
      </div>

      <TooltipProvider>
        <div className="space-y-6">
          {Object.entries(groupedPricing).map(([provider, models]) => (
            <div key={provider} className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                <Badge className={providerColors[provider] || providerColors.default}>
                  {provider}
                </Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40%]">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-slate-400" />
                        Modell
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ArrowDownUp className="h-4 w-4 text-slate-400" />
                        Input
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ArrowDownUp className="h-4 w-4 text-slate-400" />
                        Output
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">Region</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(models as any[]).map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {model.modelName}
                          {model.modelVersion && (
                            <span className="text-xs text-slate-400">
                              ({model.modelVersion})
                            </span>
                          )}
                          {model.notes && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{model.notes}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        €{model.inputPricePerMillion}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        €{model.outputPricePerMillion}
                      </TableCell>
                      <TableCell>
                        {model.regions && model.regions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {(model.regions as string[]).map((region: string) => (
                              <Badge key={region} variant="outline" className="text-xs">
                                {region}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">Global</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </TooltipProvider>

      <p className="text-xs text-slate-500 mt-6 text-center">
        Preise können variieren. Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
      </p>
    </div>
  );
}
