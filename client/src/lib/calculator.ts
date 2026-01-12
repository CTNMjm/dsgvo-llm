import { Platform } from "./data";

export type UsageIntensity = 'low' | 'medium' | 'high';

interface CostEstimate {
  platformId: string;
  platformName: string;
  monthlyCost: number;
  details: string;
  isEstimate: boolean;
}

// Assumptions for token usage per user per month
const TOKENS_PER_USER = {
  low: 100000,    // ~150 pages of text
  medium: 500000, // ~750 pages of text
  high: 2000000   // ~3000 pages of text
};

// Average cost per 1M tokens (blended input/output for GPT-4o class models)
const COST_PER_1M_TOKENS = 10.00; // €10 per 1M tokens approx

export function calculateCosts(
  platforms: Platform[],
  userCount: number,
  intensity: UsageIntensity
): CostEstimate[] {
  const monthlyTokensPerUser = TOKENS_PER_USER[intensity];
  const totalMonthlyTokens = monthlyTokensPerUser * userCount;
  
  return platforms.map(platform => {
    let cost = 0;
    let details = "";
    let isEstimate = false;

    // Logicc: €19.90 per user
    if (platform.id === 'logicc') {
      cost = 19.90 * userCount;
      details = `€19,90 × ${userCount} User`;
    }
    // Langdock: €20 per user + Tokens
    else if (platform.id === 'langdock') {
      const baseCost = 20 * userCount;
      const tokenCost = (totalMonthlyTokens / 1000000) * COST_PER_1M_TOKENS;
      cost = baseCost + tokenCost;
      details = `€20/User + ~€${tokenCost.toFixed(0)} Token`;
      isEstimate = true;
    }
    // Mistral: €14.99 per user
    else if (platform.id === 'mistral') {
      cost = 14.99 * userCount;
      details = `€14,99 × ${userCount} User`;
    }
    // Patris: €10 per user
    else if (platform.id === 'patrisai') {
      cost = 10 * userCount;
      details = `€10,00 × ${userCount} User`;
    }
    // Kamium: €600 base (includes 30 users) + €10 per extra user
    else if (platform.id === 'kamium') {
      if (userCount <= 30) {
        cost = 600;
        details = "Pauschalpreis (bis 30 User)";
      } else {
        cost = 600 + (userCount - 30) * 10;
        details = `€600 Basis + €10 × ${userCount - 30} Extra-User`;
      }
    }
    // Nele.ai: Token based only (Volume packages)
    else if (platform.id === 'neleai') {
      const tokenCost = (totalMonthlyTokens / 1000000) * COST_PER_1M_TOKENS * 1.2; // 20% markup assumption for service
      cost = Math.max(50, tokenCost); // Minimum spend assumption
      details = "Rein nutzungsbasiert (geschätzt)";
      isEstimate = true;
    }
    // DSGPT: One-time payment amortized over 24 months for comparison
    else if (platform.id === 'dsgpt') {
      cost = 2495 / 24; 
      details = "€2.495 Lifetime (auf 24 Mon. umgelegt)";
      isEstimate = true;
    }
    // Others (Enterprise/Custom)
    else {
      cost = -1; // Indicates "On Request"
      details = "Preis auf Anfrage";
    }

    return {
      platformId: platform.id,
      platformName: platform.name,
      monthlyCost: cost,
      details,
      isEstimate
    };
  }).sort((a, b) => {
    if (a.monthlyCost === -1) return 1;
    if (b.monthlyCost === -1) return -1;
    return a.monthlyCost - b.monthlyCost;
  });
}
