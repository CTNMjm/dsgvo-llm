export interface Platform {
  id: string;
  name: string;
  company: string;
  location: string;
  employees: string;
  customers: string;
  compliance: string[];
  pricingModel: 'Hybrid' | 'Nutzungsbasiert' | 'Pro User' | 'Individuell' | 'Einmalzahlung' | 'Enterprise' | 'Projekt';
  basePrice: string;
  tokenBased: boolean;
  customGPTs: boolean;
  customGPTDetails: string;
  features: string[];
  pros: string[];
  cons: string[];
  url: string;
  logo?: string;
}

export const platforms: Platform[] = [
  {
    id: 'langdock',
    name: 'Langdock',
    company: 'Langdock GmbH',
    location: 'Berlin',
    employees: 'ca. 11',
    customers: '2.000+ Unternehmen',
    compliance: ['ISO 27001', 'SOC 2 Type II', 'DSGVO'],
    pricingModel: 'Hybrid',
    basePrice: '€20/User/Monat',
    tokenBased: true,
    customGPTs: true,
    customGPTDetails: 'Assistants',
    features: ['GPT-4o', 'Claude', 'Gemini', 'Mistral', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO/SAML'],
    pros: ['Umfangreiche Modellauswahl', 'Y Combinator-backed', 'Exzellente Compliance', 'Intuitive UI'],
    cons: ['Relativ hoher Preis pro User', 'Junges Unternehmen', 'API-Aufschlag von 10%'],
    url: 'https://www.langdock.com'
  },
  {
    id: 'ka1ai',
    name: 'ka1.ai',
    company: 'kai.zen GmbH',
    location: 'Zwönitz',
    employees: 'k.A.',
    customers: 'Early Access',
    compliance: ['DSGVO'],
    pricingModel: 'Nutzungsbasiert',
    basePrice: 'k.A.',
    tokenBased: true,
    customGPTs: false, // k.A. in research, assuming false/unknown for filter safety or clarify in UI
    customGPTDetails: 'k.A.',
    features: ['Mehrere Modelle', 'Dokumentenverarbeitung'],
    pros: ['Nutzungsbasierte Abrechnung', 'DSGVO-konform', 'Deutsches Unternehmen'],
    cons: ['Noch in Early Access', 'Wenig öffentliche Informationen', 'Unklarer Funktionsumfang'],
    url: 'https://ka1.ai'
  },
  {
    id: 'logicc',
    name: 'Logicc',
    company: 'Logicc GmbH',
    location: 'Hamburg',
    employees: 'Startup',
    customers: '800+ Unternehmen',
    compliance: ['EU-Hosting', 'Kein KI-Training', 'DSGVO'],
    pricingModel: 'Pro User',
    basePrice: '€19,90/User/Monat',
    tokenBased: false,
    customGPTs: true,
    customGPTDetails: 'Assistenten',
    features: ['GPT-4o', 'Claude', 'Gemini', 'Llama', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO (Enterprise)'],
    pros: ['Günstiger Einstiegspreis', 'Kein KI-Training', 'Zentrale Plattform', 'EU-Hosting'],
    cons: ['Kleineres Team', 'Weniger etabliert', 'Begrenzte Enterprise-Features'],
    url: 'https://www.logicc.com'
  },
  {
    id: 'plotdesk',
    name: 'Plotdesk',
    company: 'Plotdesk',
    location: 'Deutschland',
    employees: 'k.A.',
    customers: '10.000+ Nutzer',
    compliance: ['Deutsche Server', 'DSGVO'],
    pricingModel: 'Individuell',
    basePrice: 'ab ca. €2.000/Jahr',
    tokenBased: true,
    customGPTs: true,
    customGPTDetails: 'Use Cases',
    features: ['50+ Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO'],
    pros: ['Über 50 KI-Modelle', '10.000+ aktive Nutzer', 'Namhafte Referenzkunden', 'Schnelles Setup'],
    cons: ['Preise nur über Partner', 'Weniger transparente Preisgestaltung'],
    url: 'https://plotdesk.com'
  },
  {
    id: 'kamium',
    name: 'kamium',
    company: 'Zweitag GmbH',
    location: 'Münster',
    employees: '50 (Gesamt)',
    customers: '200+',
    compliance: ['Private Cloud', 'Azure', 'DSGVO'],
    pricingModel: 'Hybrid',
    basePrice: '€600/Monat (30 User)',
    tokenBased: true, // €10/zusätzl. User implies scaling, but strictly token based? Research said €10/user. Let's keep as Hybrid.
    customGPTs: true,
    customGPTDetails: 'Assistenten',
    features: ['GPT-4o', 'Claude', 'Gemini', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO'],
    pros: ['15+ Jahre Erfahrung', 'Private Cloud', 'Starker Support', 'Umfassende Beratung'],
    cons: ['Höherer Einstiegspreis', 'Mindestens 30 User', 'Für kleine Teams teuer'],
    url: 'https://www.kamium.de'
  },
  {
    id: 'patrisai',
    name: 'patris.ai',
    company: 'patris',
    location: 'Deutschland',
    employees: 'k.A.',
    customers: 'k.A.',
    compliance: ['KI Bundesverband', 'Deutsche Server', 'DSGVO'],
    pricingModel: 'Pro User',
    basePrice: '€10/User/Monat',
    tokenBased: false,
    customGPTs: true,
    customGPTDetails: 'Assistenten Baukasten',
    features: ['GPT-4o', 'Claude', 'Gemini', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO'],
    pros: ['Günstiger Starter-Tarif', 'KI Bundesverband Mitglied', 'Assistenten-Baukasten', 'Deutsche Server'],
    cons: ['Weniger bekannt', 'Begrenzte öffentliche Informationen'],
    url: 'https://patris.ai'
  },
  {
    id: 'basegpt',
    name: 'BaseGPT',
    company: 'BaseGPT',
    location: 'Deutschland',
    employees: 'k.A.',
    customers: 'k.A.',
    compliance: ['EU-Hosting', 'DSGVO'],
    pricingModel: 'Individuell',
    basePrice: 'Auf Anfrage',
    tokenBased: true,
    customGPTs: true,
    customGPTDetails: 'Custom Models',
    features: ['ChatGPT', 'Claude', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO'],
    pros: ['Vollständig verwaltet', 'EU-Datenresidenz', 'Branchenspezifische Lösungen'],
    cons: ['Preise nur auf Anfrage', 'Weniger Transparenz'],
    url: 'https://basegpt.eu'
  },
  {
    id: 'dsgpt',
    name: 'DSGPT',
    company: 'Next Strategy AI GmbH',
    location: 'Hamburg',
    employees: 'k.A.',
    customers: 'k.A.',
    compliance: ['On-Premise', 'DSGVO'],
    pricingModel: 'Einmalzahlung',
    basePrice: '€2.495 (Lifetime)',
    tokenBased: true, // API Kosten
    customGPTs: true,
    customGPTDetails: 'Prompts',
    features: ['GPT-4o', 'Llama', 'DeepSeek', 'Mistral', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO'],
    pros: ['Einmalzahlung (Lifetime)', 'Keine monatlichen Kosten', 'Volle Datenkontrolle', 'Lokale Modelle'],
    cons: ['On-Premise Installation nötig', 'Höhere Anfangsinvestition', 'Selbst-Hosting', 'Support kostenpflichtig'],
    url: 'https://dsgpt.de'
  },
  {
    id: 'neleai',
    name: 'nele.ai',
    company: 'GAL Digital GmbH',
    location: 'Hungen',
    employees: 'k.A.',
    customers: 'Tausende',
    compliance: ['ISO 27001', 'Deutscher Server', 'DSGVO'],
    pricingModel: 'Nutzungsbasiert',
    basePrice: 'Volumenbasiert',
    tokenBased: true,
    customGPTs: true,
    customGPTDetails: 'Prompt-Bibliothek',
    features: ['Mehrere Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang'],
    pros: ['ISO 27001 zertifiziert', 'Nutzungsbasierte Credits', 'Keine Kosten pro User', 'Deutscher Server'],
    cons: ['Weniger bekannte Marke', 'Preise nicht transparent'],
    url: 'https://www.nele.ai'
  },
  {
    id: 'amberai',
    name: 'amberAI',
    company: 'AmberSearch GmbH',
    location: 'Aachen/Köln',
    employees: 'ca. 50',
    customers: 'Enterprise',
    compliance: ['ISO 27001', 'DSGVO'],
    pricingModel: 'Enterprise',
    basePrice: 'Auf Anfrage',
    tokenBased: false, // k.A.
    customGPTs: true,
    customGPTDetails: 'AI Assistants',
    features: ['Mehrere Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement (Kern)', 'API-Zugang', 'SSO'],
    pros: ['Europäischer Marktführer', 'Starkes Wissensmanagement', 'ISO 27001 zertifiziert', 'Etabliert'],
    cons: ['Enterprise-Fokus', 'Teuer', 'Nicht für kleine Teams', 'Preise intransparent'],
    url: 'https://ambersearch.de'
  },
  {
    id: 'aiui',
    name: 'AI-UI (AIVA)',
    company: 'AI-UI',
    location: 'Thüringen',
    employees: 'k.A.',
    customers: '50+ Projekte',
    compliance: ['On-Premise Option', 'DSGVO'],
    pricingModel: 'Projekt',
    basePrice: 'Auf Anfrage',
    tokenBased: false, // k.A.
    customGPTs: true,
    customGPTDetails: 'Chat Assistants',
    features: ['Mehrere Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO'],
    pros: ['Full-Service Partner', 'On-Premise Option', 'Individuelle Lösungen'],
    cons: ['Projektbasierte Preise', 'Weniger Self-Service', 'Evtl. überdimensioniert'],
    url: 'https://ai-ui.ai'
  },
  {
    id: 'mistral',
    name: 'Mistral Le Chat',
    company: 'Mistral AI',
    location: 'Paris (FR)',
    employees: '100+',
    customers: 'Millionen',
    compliance: ['EU-Unternehmen', 'DSGVO'],
    pricingModel: 'Pro User',
    basePrice: '€14,99/User/Monat',
    tokenBased: false, // Enterprise custom
    customGPTs: true,
    customGPTDetails: 'Agents',
    features: ['Mistral Large', 'Mistral Medium', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO (Enterprise)'],
    pros: ['EU-Unternehmen', 'Günstige Pro-Tarife', 'Eigene Modelle', 'Starke Forschung'],
    cons: ['Weniger Enterprise-Features', 'Kein deutsches Unternehmen', 'Weniger Modellvielfalt'],
    url: 'https://mistral.ai'
  }
];
