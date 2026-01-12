import { useState, useEffect } from "react";
import { platforms } from "@/lib/data";
import { calculateCosts, UsageIntensity } from "@/lib/calculator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, Users, Zap, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CostCalculator() {
  const [userCount, setUserCount] = useState([10]);
  const [intensity, setIntensity] = useState<UsageIntensity>('medium');
  const [estimates, setEstimates] = useState<any[]>([]);

  useEffect(() => {
    const results = calculateCosts(platforms, userCount[0], intensity);
    // Filter out "On Request" (-1) and take top 5 cheapest
    const topResults = results.filter(r => r.monthlyCost !== -1).slice(0, 5);
    setEstimates(topResults);
  }, [userCount, intensity]);

  return (
    <Card className="w-full bg-white border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calculator className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Kosten-Simulator</CardTitle>
            <CardDescription>Schätzen Sie die monatlichen Kosten für Ihr Team.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* User Count Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users className="h-4 w-4" /> Anzahl Mitarbeiter
              </Label>
              <span className="text-2xl font-bold text-slate-900">{userCount[0]}</span>
            </div>
            <Slider
              value={userCount}
              onValueChange={setUserCount}
              max={200}
              min={1}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-slate-400 px-1">
              <span>1</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200+</span>
            </div>
          </div>

          {/* Intensity Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Zap className="h-4 w-4" /> KI-Nutzungsintensität
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Niedrig: Gelegentliche Fragen (~150 Seiten/Monat)</p>
                  <p>Mittel: Tägliche Nutzung (~750 Seiten/Monat)</p>
                  <p>Hoch: Power-User (~3000 Seiten/Monat)</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <RadioGroup 
              defaultValue="medium" 
              value={intensity} 
              onValueChange={(v) => setIntensity(v as UsageIntensity)}
              className="grid grid-cols-3 gap-2"
            >
              <div>
                <RadioGroupItem value="low" id="low" className="peer sr-only" />
                <Label
                  htmlFor="low"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-600 cursor-pointer transition-all"
                >
                  <span className="text-sm font-semibold">Niedrig</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                <Label
                  htmlFor="medium"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-600 cursor-pointer transition-all"
                >
                  <span className="text-sm font-semibold">Mittel</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="high" id="high" className="peer sr-only" />
                <Label
                  htmlFor="high"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-600 cursor-pointer transition-all"
                >
                  <span className="text-sm font-semibold">Hoch</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Results Table */}
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-medium text-slate-700">Geschätzte monatliche Kosten (Top 5)</Label>
            <div className="rounded-lg border border-slate-100 overflow-hidden">
              {estimates.map((est, index) => (
                <div 
                  key={est.platformId} 
                  className={`flex items-center justify-between p-3 text-sm ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                >
                  <span className="font-medium text-slate-700">{est.platformName}</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">€{est.monthlyCost.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">{est.details}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              *Schätzungen basieren auf öffentlichen Listenpreisen und Annahmen zum Token-Verbrauch. Keine Gewähr.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
