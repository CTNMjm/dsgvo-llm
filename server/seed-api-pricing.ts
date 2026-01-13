/**
 * Seed Script für API-Preise
 * 
 * Fügt realistische API-Preise für alle Plattformen in die Datenbank ein.
 * Basierend auf öffentlich verfügbaren Preisen (Stand Januar 2026).
 */

import { getDb } from './db';
import { apiPricing, platforms } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

interface PricingData {
  provider: string;
  modelName: string;
  modelVersion?: string;
  inputPricePerMillion: string;
  outputPricePerMillion: string;
  regions?: string[];
  notes?: string;
  supportedLanguages?: string[];
  capabilities?: string[];
  contextWindow?: number;
}

// Preise pro Plattform (basierend auf öffentlichen Daten)
const pricingByPlatform: Record<string, PricingData[]> = {
  // Aleph Alpha
  'aleph-alpha': [
    { provider: 'Aleph Alpha', modelName: 'Luminous Base', inputPricePerMillion: '6.00', outputPricePerMillion: '6.60', regions: ['EU'], notes: 'DSGVO-konform, EU-Hosting' },
    { provider: 'Aleph Alpha', modelName: 'Luminous Extended', inputPricePerMillion: '9.00', outputPricePerMillion: '9.90', regions: ['EU'], notes: 'Erweiterte Kontextlänge' },
    { provider: 'Aleph Alpha', modelName: 'Luminous Supreme', inputPricePerMillion: '35.00', outputPricePerMillion: '38.50', regions: ['EU'], notes: 'Höchste Qualität' },
  ],
  
  // DeepL
  'deepl': [
    { provider: 'DeepL', modelName: 'DeepL API Free', inputPricePerMillion: '0.00', outputPricePerMillion: '0.00', notes: '500.000 Zeichen/Monat kostenlos' },
    { provider: 'DeepL', modelName: 'DeepL API Pro', inputPricePerMillion: '20.00', outputPricePerMillion: '20.00', regions: ['EU'], notes: 'Pro Zeichen, nicht Token' },
  ],
  
  // Langdock
  'langdock': [
    { provider: 'OpenAI', modelName: 'GPT-4.1', inputPricePerMillion: '1.88', outputPricePerMillion: '7.53', regions: ['EU'] },
    { provider: 'OpenAI', modelName: 'GPT-4.1 mini', inputPricePerMillion: '0.38', outputPricePerMillion: '1.51', regions: ['EU'] },
    { provider: 'OpenAI', modelName: 'GPT-4o', inputPricePerMillion: '2.59', outputPricePerMillion: '10.36', regions: ['EU'] },
    { provider: 'OpenAI', modelName: 'GPT-4o Mini', inputPricePerMillion: '0.14', outputPricePerMillion: '0.56', regions: ['EU'] },
    { provider: 'OpenAI', modelName: 'o3', inputPricePerMillion: '1.88', outputPricePerMillion: '7.53', regions: ['EU'] },
    { provider: 'OpenAI', modelName: 'o3 Mini', inputPricePerMillion: '1.14', outputPricePerMillion: '4.56', regions: ['EU'] },
    { provider: 'Anthropic', modelName: 'Claude Haiku', modelVersion: '3.5', inputPricePerMillion: '0.75', outputPricePerMillion: '3.77', regions: ['EU'] },
    { provider: 'Anthropic', modelName: 'Claude Sonnet', modelVersion: '3.7', inputPricePerMillion: '2.82', outputPricePerMillion: '14.12', regions: ['EU'] },
    { provider: 'Anthropic', modelName: 'Claude Opus', modelVersion: '3', inputPricePerMillion: '14.12', outputPricePerMillion: '70.62', regions: ['EU'] },
    { provider: 'Google', modelName: 'Gemini 2.5 Flash', inputPricePerMillion: '0.28', outputPricePerMillion: '2.35', regions: ['EU'] },
    { provider: 'Google', modelName: 'Gemini 2.5 Pro', inputPricePerMillion: '2.35', outputPricePerMillion: '14.12', regions: ['EU'] },
    { provider: 'Meta', modelName: 'Llama 3.3', modelVersion: '70B', inputPricePerMillion: '0.67', outputPricePerMillion: '0.67', regions: ['EU'] },
    { provider: 'Meta', modelName: 'Llama 4 Maverick', inputPricePerMillion: '0.21', outputPricePerMillion: '0.81', regions: ['EU'] },
    { provider: 'DeepSeek', modelName: 'DeepSeek v3.1', inputPricePerMillion: '0.93', outputPricePerMillion: '3.71', regions: ['EU'] },
  ],
  
  // Microsoft Azure OpenAI
  'microsoft-azure-openai': [
    { provider: 'OpenAI via Azure', modelName: 'GPT-4', inputPricePerMillion: '30.00', outputPricePerMillion: '60.00', regions: ['EU', 'US'], notes: 'Azure EU West' },
    { provider: 'OpenAI via Azure', modelName: 'GPT-4 Turbo', inputPricePerMillion: '10.00', outputPricePerMillion: '30.00', regions: ['EU', 'US'] },
    { provider: 'OpenAI via Azure', modelName: 'GPT-4o', inputPricePerMillion: '5.00', outputPricePerMillion: '15.00', regions: ['EU', 'US'] },
    { provider: 'OpenAI via Azure', modelName: 'GPT-3.5 Turbo', inputPricePerMillion: '0.50', outputPricePerMillion: '1.50', regions: ['EU', 'US'] },
  ],
  
  // Google Vertex AI
  'google-vertex-ai': [
    { provider: 'Google', modelName: 'Gemini 1.5 Pro', inputPricePerMillion: '3.50', outputPricePerMillion: '10.50', regions: ['EU', 'US'] },
    { provider: 'Google', modelName: 'Gemini 1.5 Flash', inputPricePerMillion: '0.35', outputPricePerMillion: '1.05', regions: ['EU', 'US'] },
    { provider: 'Google', modelName: 'Gemini 2.0 Flash', inputPricePerMillion: '0.10', outputPricePerMillion: '0.40', regions: ['EU', 'US'], notes: 'Experimentell' },
    { provider: 'Google', modelName: 'PaLM 2', inputPricePerMillion: '0.50', outputPricePerMillion: '1.50', regions: ['EU', 'US'] },
  ],
  
  // AWS Bedrock
  'aws-bedrock': [
    { provider: 'Anthropic via AWS', modelName: 'Claude 3 Haiku', inputPricePerMillion: '0.25', outputPricePerMillion: '1.25', regions: ['EU', 'US'] },
    { provider: 'Anthropic via AWS', modelName: 'Claude 3 Sonnet', inputPricePerMillion: '3.00', outputPricePerMillion: '15.00', regions: ['EU', 'US'] },
    { provider: 'Anthropic via AWS', modelName: 'Claude 3 Opus', inputPricePerMillion: '15.00', outputPricePerMillion: '75.00', regions: ['EU', 'US'] },
    { provider: 'Meta via AWS', modelName: 'Llama 3.1 70B', inputPricePerMillion: '0.99', outputPricePerMillion: '0.99', regions: ['EU', 'US'] },
    { provider: 'Meta via AWS', modelName: 'Llama 3.1 405B', inputPricePerMillion: '5.32', outputPricePerMillion: '16.00', regions: ['US'], notes: 'Nur US-Region' },
    { provider: 'Mistral via AWS', modelName: 'Mistral Large', inputPricePerMillion: '4.00', outputPricePerMillion: '12.00', regions: ['EU', 'US'] },
  ],
  
  // Mistral Le Chat
  'mistral': [
    { provider: 'Mistral', modelName: 'Mistral Small', inputPricePerMillion: '1.00', outputPricePerMillion: '3.00', regions: ['EU'], notes: 'Französisches Unternehmen' },
    { provider: 'Mistral', modelName: 'Mistral Medium', inputPricePerMillion: '2.70', outputPricePerMillion: '8.10', regions: ['EU'] },
    { provider: 'Mistral', modelName: 'Mistral Large', inputPricePerMillion: '4.00', outputPricePerMillion: '12.00', regions: ['EU'] },
    { provider: 'Mistral', modelName: 'Codestral', inputPricePerMillion: '1.00', outputPricePerMillion: '3.00', regions: ['EU'], notes: 'Spezialisiert auf Code' },
  ],
  
  // ka1.ai
  'ka1ai': [
    { provider: 'OpenAI via ka1', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'], notes: 'DSGVO-konform' },
    { provider: 'OpenAI via ka1', modelName: 'GPT-4o mini', inputPricePerMillion: '0.20', outputPricePerMillion: '0.80', regions: ['EU'] },
    { provider: 'Anthropic via ka1', modelName: 'Claude 3.5 Sonnet', inputPricePerMillion: '3.50', outputPricePerMillion: '17.50', regions: ['EU'] },
  ],
  
  // Logicc
  'logicc': [
    { provider: 'OpenAI via Logicc', modelName: 'GPT-4', inputPricePerMillion: '35.00', outputPricePerMillion: '70.00', regions: ['EU'], notes: 'Enterprise-Paket' },
    { provider: 'OpenAI via Logicc', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'] },
  ],
  
  // Plotdesk
  'plotdesk': [
    { provider: 'OpenAI via Plotdesk', modelName: 'GPT-4o', inputPricePerMillion: '3.50', outputPricePerMillion: '14.00', regions: ['EU'], notes: 'Inkl. in Abonnement' },
  ],
  
  // kamium
  'kamium': [
    { provider: 'OpenAI via kamium', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'] },
    { provider: 'Anthropic via kamium', modelName: 'Claude 3.5 Sonnet', inputPricePerMillion: '3.50', outputPricePerMillion: '17.50', regions: ['EU'] },
  ],
  
  // patris.ai
  'patrisai': [
    { provider: 'OpenAI via patris', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'], notes: 'Schweizer Hosting' },
  ],
  
  // BaseGPT
  'basegpt': [
    { provider: 'OpenAI via BaseGPT', modelName: 'GPT-4', inputPricePerMillion: '30.00', outputPricePerMillion: '60.00', regions: ['EU'] },
    { provider: 'OpenAI via BaseGPT', modelName: 'GPT-4o', inputPricePerMillion: '2.50', outputPricePerMillion: '10.00', regions: ['EU'] },
  ],
  
  // DSGPT
  'dsgpt': [
    { provider: 'OpenAI via DSGPT', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'], notes: 'DSGVO-zertifiziert' },
  ],
  
  // nele.ai
  'neleai': [
    { provider: 'OpenAI via nele', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'] },
    { provider: 'Anthropic via nele', modelName: 'Claude 3 Sonnet', inputPricePerMillion: '3.00', outputPricePerMillion: '15.00', regions: ['EU'] },
  ],
  
  // amberAI
  'amberai': [
    { provider: 'OpenAI via amberAI', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'], notes: 'Österreichisches Hosting' },
  ],
  
  // AI-UI (AIVA)
  'aiui': [
    { provider: 'OpenAI via AIVA', modelName: 'GPT-4o', inputPricePerMillion: '3.00', outputPricePerMillion: '12.00', regions: ['EU'] },
  ],
  
  // Mistral AI
  'mistral-ai': [
    { provider: 'Mistral', modelName: 'Mistral Small', inputPricePerMillion: '1.00', outputPricePerMillion: '3.00', regions: ['EU'], notes: 'Französisches Unternehmen' },
    { provider: 'Mistral', modelName: 'Mistral Medium', inputPricePerMillion: '2.70', outputPricePerMillion: '8.10', regions: ['EU'] },
    { provider: 'Mistral', modelName: 'Mistral Large', inputPricePerMillion: '4.00', outputPricePerMillion: '12.00', regions: ['EU'] },
    { provider: 'Mistral', modelName: 'Codestral', inputPricePerMillion: '1.00', outputPricePerMillion: '3.00', regions: ['EU'], notes: 'Spezialisiert auf Code' },
  ],
  
  // Cohere
  'cohere': [
    { provider: 'Cohere', modelName: 'Command R', inputPricePerMillion: '0.50', outputPricePerMillion: '1.50', regions: ['EU', 'US'] },
    { provider: 'Cohere', modelName: 'Command R+', inputPricePerMillion: '3.00', outputPricePerMillion: '15.00', regions: ['EU', 'US'] },
    { provider: 'Cohere', modelName: 'Embed v3', inputPricePerMillion: '0.10', outputPricePerMillion: '0.10', regions: ['EU', 'US'], notes: 'Embedding-Modell' },
  ],
  
  // SAP AI Core
  'sap-ai-core': [
    { provider: 'SAP', modelName: 'GPT-4 via SAP', inputPricePerMillion: '35.00', outputPricePerMillion: '70.00', regions: ['EU'], notes: 'Enterprise-Preise' },
    { provider: 'SAP', modelName: 'Claude via SAP', inputPricePerMillion: '18.00', outputPricePerMillion: '90.00', regions: ['EU'] },
  ],
  
  // OpenAI Enterprise
  'openai-enterprise': [
    { provider: 'OpenAI', modelName: 'GPT-4', inputPricePerMillion: '30.00', outputPricePerMillion: '60.00', regions: ['US', 'EU'], notes: 'Enterprise-Vertrag erforderlich' },
    { provider: 'OpenAI', modelName: 'GPT-4 Turbo', inputPricePerMillion: '10.00', outputPricePerMillion: '30.00', regions: ['US', 'EU'] },
    { provider: 'OpenAI', modelName: 'GPT-4o', inputPricePerMillion: '2.50', outputPricePerMillion: '10.00', regions: ['US', 'EU'] },
    { provider: 'OpenAI', modelName: 'GPT-4o mini', inputPricePerMillion: '0.15', outputPricePerMillion: '0.60', regions: ['US', 'EU'] },
  ],
};

async function seedApiPricing() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  console.log('Starting API pricing seed...');

  // Get all platforms
  const allPlatforms = await db.select().from(platforms);
  console.log(`Found ${allPlatforms.length} platforms`);

  let totalInserted = 0;

  for (const platform of allPlatforms) {
    const pricing = pricingByPlatform[platform.slug];
    
    if (!pricing) {
      console.log(`No pricing data for: ${platform.name}`);
      continue;
    }

    console.log(`Inserting pricing for: ${platform.name} (${pricing.length} models)`);

    for (const price of pricing) {
      try {
        await db.insert(apiPricing).values({
          platformId: platform.id,
          provider: price.provider,
          modelName: price.modelName,
          modelVersion: price.modelVersion || null,
          inputPricePerMillion: price.inputPricePerMillion,
          outputPricePerMillion: price.outputPricePerMillion,
          regions: price.regions || null,
          notes: price.notes || null,
          isAvailable: true,
        });
        totalInserted++;
      } catch (error) {
        console.error(`Error inserting ${price.modelName}:`, error);
      }
    }
  }

  console.log(`\nSeed complete! Inserted ${totalInserted} pricing entries.`);
  process.exit(0);
}

// Run if called directly
seedApiPricing().catch(console.error);
