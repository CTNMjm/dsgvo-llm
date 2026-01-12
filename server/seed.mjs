// Seed script to populate the database with initial data
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// Platform data
const platforms = [
  {
    slug: 'langdock',
    name: 'Langdock',
    company: 'Langdock GmbH',
    location: 'Berlin',
    url: 'https://www.langdock.com',
    pricingModel: 'Hybrid',
    basePrice: '€20/User/Monat',
    tokenBased: true,
    compliance: JSON.stringify(['ISO 27001', 'SOC 2 Type II', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Assistants',
    features: JSON.stringify(['GPT-4o', 'Claude', 'Gemini', 'Mistral', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO/SAML', 'Team-Collaboration', 'Prompt-Management']),
    pros: JSON.stringify(['Umfangreiche Modellauswahl', 'Y Combinator-backed', 'Exzellente Compliance', 'Intuitive UI']),
    cons: JSON.stringify(['Relativ hoher Preis pro User', 'Junges Unternehmen', 'API-Aufschlag von 10%']),
    description: 'Langdock ist eine führende DSGVO-konforme Chat-Plattform aus Berlin, die es Unternehmen ermöglicht, verschiedene LLMs (wie GPT-4, Claude, etc.) sicher zu nutzen. Sie zeichnet sich durch eine besonders intuitive Benutzeroberfläche und starke Compliance-Features aus.',
    screenshotUrl: '/images/screenshots/langdock-dashboard.png',
    employees: 'ca. 11',
    customers: '2.000+ Unternehmen',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'ka1ai',
    name: 'ka1.ai',
    company: 'kai.zen GmbH',
    location: 'Zwönitz',
    url: 'https://ka1.ai',
    pricingModel: 'Nutzungsbasiert',
    basePrice: 'k.A.',
    tokenBased: true,
    compliance: JSON.stringify(['DSGVO']),
    customGPTs: false,
    customGPTDetails: 'k.A.',
    features: JSON.stringify(['Mehrere Modelle', 'Dokumentenverarbeitung', 'Datenschutz-Fokus']),
    pros: JSON.stringify(['Nutzungsbasierte Abrechnung', 'DSGVO-konform', 'Deutsches Unternehmen']),
    cons: JSON.stringify(['Noch in Early Access', 'Wenig öffentliche Informationen', 'Unklarer Funktionsumfang']),
    description: 'ka1.ai ist eine neue Plattform der kai.zen GmbH, die sich auf datenschutzkonforme KI-Nutzung spezialisiert. Aktuell befindet sich das Angebot noch in einer frühen Phase (Early Access).',
    screenshotUrl: '/images/screenshots/ka1ai-dashboard.png',
    employees: 'k.A.',
    customers: 'Early Access',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'logicc',
    name: 'Logicc',
    company: 'Logicc GmbH',
    location: 'Hamburg',
    url: 'https://www.logicc.com',
    pricingModel: 'Pro User',
    basePrice: '€19,90/User/Monat',
    tokenBased: false,
    compliance: JSON.stringify(['EU-Hosting', 'Kein KI-Training', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Assistenten',
    features: JSON.stringify(['GPT-4o', 'Claude', 'Gemini', 'Llama', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO (Enterprise)', 'Zentrale Verwaltung']),
    pros: JSON.stringify(['Günstiger Einstiegspreis', 'Kein KI-Training', 'Zentrale Plattform', 'EU-Hosting']),
    cons: JSON.stringify(['Kleineres Team', 'Weniger etabliert', 'Begrenzte Enterprise-Features']),
    description: 'Logicc bietet eine zentrale KI-Plattform für Unternehmen, die Wert auf Datenschutz und Einfachheit legen.',
    screenshotUrl: '/images/screenshots/logicc-dashboard.png',
    employees: 'Startup',
    customers: '800+ Unternehmen',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'plotdesk',
    name: 'Plotdesk',
    company: 'Plotdesk',
    location: 'Deutschland',
    url: 'https://plotdesk.com',
    pricingModel: 'Hybrid',
    basePrice: 'ab ca. €2.000/Jahr',
    tokenBased: true,
    compliance: JSON.stringify(['Deutsche Server', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Use Cases',
    features: JSON.stringify(['50+ Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO', 'White-Label Option']),
    pros: JSON.stringify(['Über 50 KI-Modelle', '10.000+ aktive Nutzer', 'Namhafte Referenzkunden', 'Schnelles Setup']),
    cons: JSON.stringify(['Preise nur über Partner', 'Weniger transparente Preisgestaltung']),
    description: 'Plotdesk positioniert sich als umfassende KI-Plattform mit einer riesigen Auswahl von über 50 KI-Modellen.',
    screenshotUrl: '/images/screenshots/plotdesk-dashboard.png',
    employees: 'k.A.',
    customers: '10.000+ Nutzer',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'kamium',
    name: 'kamium',
    company: 'Zweitag GmbH',
    location: 'Münster',
    url: 'https://www.kamium.de',
    pricingModel: 'Hybrid',
    basePrice: '€600/Monat (30 User)',
    tokenBased: true,
    compliance: JSON.stringify(['Private Cloud', 'Azure', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Assistenten',
    features: JSON.stringify(['GPT-4o', 'Claude', 'Gemini', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO', 'Beratung inklusive']),
    pros: JSON.stringify(['15+ Jahre Erfahrung', 'Private Cloud', 'Starker Support', 'Umfassende Beratung']),
    cons: JSON.stringify(['Höherer Einstiegspreis', 'Mindestens 30 User', 'Für kleine Teams teuer']),
    description: 'Hinter kamium steht die erfahrene Software-Agentur Zweitag aus Münster. Die Lösung besticht durch ein Private-Cloud-Setup.',
    screenshotUrl: '/images/screenshots/kamium-dashboard.png',
    employees: '50 (Gesamt)',
    customers: '200+',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'patrisai',
    name: 'patris.ai',
    company: 'patris',
    location: 'Deutschland',
    url: 'https://patris.ai',
    pricingModel: 'Pro User',
    basePrice: '€10/User/Monat',
    tokenBased: false,
    compliance: JSON.stringify(['KI Bundesverband', 'Deutsche Server', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Assistenten Baukasten',
    features: JSON.stringify(['GPT-4o', 'Claude', 'Gemini', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO', 'Baukasten-System']),
    pros: JSON.stringify(['Günstiger Starter-Tarif', 'KI Bundesverband Mitglied', 'Assistenten-Baukasten', 'Deutsche Server']),
    cons: JSON.stringify(['Weniger bekannt', 'Begrenzte öffentliche Informationen']),
    description: 'patris.ai bietet einen sehr günstigen Einstieg in die Welt der Unternehmens-KI.',
    screenshotUrl: '/images/screenshots/patris-dashboard.png',
    employees: 'k.A.',
    customers: 'k.A.',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'basegpt',
    name: 'BaseGPT',
    company: 'BaseGPT',
    location: 'Deutschland',
    url: 'https://basegpt.eu',
    pricingModel: 'Hybrid',
    basePrice: 'Auf Anfrage',
    tokenBased: true,
    compliance: JSON.stringify(['EU-Hosting', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Custom Models',
    features: JSON.stringify(['ChatGPT', 'Claude', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO', 'Managed Service']),
    pros: JSON.stringify(['Vollständig verwaltet', 'EU-Datenresidenz', 'Branchenspezifische Lösungen']),
    cons: JSON.stringify(['Preise nur auf Anfrage', 'Weniger Transparenz']),
    description: 'BaseGPT ist eine vollständig verwaltete KI-Plattform, die sich durch branchenspezifische Lösungen auszeichnet.',
    screenshotUrl: '/images/screenshots/basegpt-dashboard.png',
    employees: 'k.A.',
    customers: 'k.A.',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'dsgpt',
    name: 'DSGPT',
    company: 'Next Strategy AI GmbH',
    location: 'Hamburg',
    url: 'https://dsgpt.de',
    pricingModel: 'Einmalzahlung',
    basePrice: '€2.495 (Lifetime)',
    tokenBased: true,
    compliance: JSON.stringify(['On-Premise', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Prompts',
    features: JSON.stringify(['GPT-4o', 'Llama', 'DeepSeek', 'Mistral', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO', 'Lokale Modelle']),
    pros: JSON.stringify(['Einmalzahlung (Lifetime)', 'Keine monatlichen Kosten', 'Volle Datenkontrolle', 'Lokale Modelle']),
    cons: JSON.stringify(['On-Premise Installation nötig', 'Höhere Anfangsinvestition', 'Selbst-Hosting', 'Support kostenpflichtig']),
    description: 'DSGPT geht einen Sonderweg mit einem Lifetime-Lizenzmodell.',
    screenshotUrl: '/images/screenshots/dsgpt-dashboard.png',
    employees: 'k.A.',
    customers: 'k.A.',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'neleai',
    name: 'nele.ai',
    company: 'GAL Digital GmbH',
    location: 'Hungen',
    url: 'https://www.nele.ai',
    pricingModel: 'Nutzungsbasiert',
    basePrice: 'Volumenbasiert',
    tokenBased: true,
    compliance: JSON.stringify(['ISO 27001', 'Deutscher Server', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Prompt-Bibliothek',
    features: JSON.stringify(['Mehrere Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'Umfangreiche Prompt-Bibliothek']),
    pros: JSON.stringify(['ISO 27001 zertifiziert', 'Nutzungsbasierte Credits', 'Keine Kosten pro User', 'Deutscher Server']),
    cons: JSON.stringify(['Weniger bekannte Marke', 'Preise nicht transparent']),
    description: 'nele.ai von der GAL Digital GmbH setzt auf ein reines Credit-Modell ohne monatliche Nutzergebühren.',
    screenshotUrl: '/images/screenshots/neleai-dashboard.png',
    employees: 'k.A.',
    customers: 'Tausende',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'amberai',
    name: 'amberAI',
    company: 'AmberSearch GmbH',
    location: 'Aachen/Köln',
    url: 'https://ambersearch.de',
    pricingModel: 'Enterprise',
    basePrice: 'Auf Anfrage',
    tokenBased: false,
    compliance: JSON.stringify(['ISO 27001', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'AI Assistants',
    features: JSON.stringify(['Mehrere Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement (Kern)', 'API-Zugang', 'SSO', 'Enterprise Search']),
    pros: JSON.stringify(['Europäischer Marktführer', 'Starkes Wissensmanagement', 'ISO 27001 zertifiziert', 'Etabliert']),
    cons: JSON.stringify(['Enterprise-Fokus', 'Teuer', 'Nicht für kleine Teams', 'Preise intransparent']),
    description: 'amberAI (AmberSearch) kommt ursprünglich aus dem Bereich Enterprise Search und hat diese Stärke in die KI-Welt übertragen.',
    screenshotUrl: '/images/screenshots/amberai-dashboard.png',
    employees: 'ca. 50',
    customers: 'Enterprise',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'aiui',
    name: 'AI-UI (AIVA)',
    company: 'AI-UI',
    location: 'Thüringen',
    url: 'https://ai-ui.ai',
    pricingModel: 'Enterprise',
    basePrice: 'Auf Anfrage',
    tokenBased: false,
    compliance: JSON.stringify(['On-Premise Option', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Chat Assistants',
    features: JSON.stringify(['Mehrere Modelle', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO', 'Individuelle Entwicklung']),
    pros: JSON.stringify(['Full-Service Partner', 'On-Premise Option', 'Individuelle Lösungen']),
    cons: JSON.stringify(['Projektbasierte Preise', 'Weniger Self-Service', 'Evtl. überdimensioniert']),
    description: 'AI-UI versteht sich weniger als reiner Software-Anbieter, sondern als Full-Service-Partner.',
    screenshotUrl: '/images/screenshots/aiui-dashboard.png',
    employees: 'k.A.',
    customers: '50+ Projekte',
    developers: 'k.A.',
    isActive: true
  },
  {
    slug: 'mistral',
    name: 'Mistral Le Chat',
    company: 'Mistral AI',
    location: 'Paris (FR)',
    url: 'https://mistral.ai',
    pricingModel: 'Pro User',
    basePrice: '€14,99/User/Monat',
    tokenBased: false,
    compliance: JSON.stringify(['EU-Unternehmen', 'DSGVO']),
    customGPTs: true,
    customGPTDetails: 'Agents',
    features: JSON.stringify(['Mistral Large', 'Mistral Medium', 'Dokumentenverarbeitung', 'Wissensmanagement', 'API-Zugang', 'SSO (Enterprise)', 'Canvas']),
    pros: JSON.stringify(['EU-Unternehmen', 'Günstige Pro-Tarife', 'Eigene Modelle', 'Starke Forschung']),
    cons: JSON.stringify(['Weniger Enterprise-Features', 'Kein deutsches Unternehmen', 'Weniger Modellvielfalt']),
    description: 'Mistral AI ist Europas Antwort auf OpenAI. Mit "Le Chat" bieten sie eine leistungsfähige Chat-Oberfläche für ihre eigenen Modelle.',
    screenshotUrl: '/images/screenshots/mistral-dashboard.png',
    employees: '100+',
    customers: 'Millionen',
    developers: 'k.A.',
    isActive: true
  }
];

// Blog posts data
const blogPosts = [
  {
    slug: 'ki-im-unternehmen-einfuehren',
    title: 'KI im Unternehmen erfolgreich einführen: Ein Leitfaden für Entscheider',
    excerpt: 'Erfahren Sie, wie Sie KI-Tools wie ChatGPT & Co. sicher und effektiv in Ihrem Unternehmen einführen – von der Auswahl bis zur Schulung.',
    content: `# KI im Unternehmen erfolgreich einführen

Die Einführung von KI-Tools wie ChatGPT, Claude oder Gemini in Unternehmen ist längst keine Zukunftsmusik mehr. Immer mehr Organisationen erkennen das Potenzial dieser Technologien für Produktivitätssteigerungen, Kosteneinsparungen und Innovationen.

## Warum jetzt der richtige Zeitpunkt ist

Die aktuelle Generation von Large Language Models (LLMs) hat einen Reifegrad erreicht, der sie für den professionellen Einsatz qualifiziert. Gleichzeitig entstehen immer mehr DSGVO-konforme Plattformen, die speziell auf die Bedürfnisse europäischer Unternehmen zugeschnitten sind.

## Die 5 Schritte zur erfolgreichen KI-Einführung

### 1. Bedarfsanalyse durchführen
Identifizieren Sie zunächst die Use Cases mit dem größten Potenzial. Typische Einsatzgebiete sind Texterstellung, Recherche, Code-Unterstützung und Kundenservice.

### 2. Plattform auswählen
Wählen Sie eine Plattform, die Ihren Compliance-Anforderungen entspricht. Achten Sie auf DSGVO-Konformität, Hosting-Standort und Zertifizierungen wie ISO 27001.

### 3. Pilotprojekt starten
Beginnen Sie mit einer kleinen Gruppe von Power-Usern, die die Technologie testen und Feedback geben können.

### 4. Richtlinien etablieren
Erstellen Sie klare Guidelines für die KI-Nutzung: Was darf eingegeben werden? Wie werden Ergebnisse verifiziert?

### 5. Schulung und Rollout
Schulen Sie Ihre Mitarbeiter im effektiven Prompting und rollen Sie die Lösung schrittweise aus.

## Fazit

Die Einführung von KI-Tools erfordert sorgfältige Planung, aber die Vorteile überwiegen die Herausforderungen bei weitem. Mit dem richtigen Ansatz können Unternehmen ihre Produktivität signifikant steigern.`,
    author: 'Dr. Anna Schmidt',
    category: 'Strategie',
    readTime: '8 Min.',
    imageUrl: '/images/blog/ki-einfuehrung.jpg',
    metaTitle: 'KI im Unternehmen einführen - Leitfaden 2026',
    metaDescription: 'Erfahren Sie, wie Sie KI-Tools wie ChatGPT sicher und DSGVO-konform in Ihrem Unternehmen einführen.',
    isPublished: true,
    publishedAt: new Date('2026-01-10')
  },
  {
    slug: 'dsgvo-checkliste-llm',
    title: 'Die ultimative DSGVO-Checkliste für LLM-Plattformen',
    excerpt: 'Eine umfassende Checkliste, um sicherzustellen, dass Ihre KI-Nutzung den europäischen Datenschutzanforderungen entspricht.',
    content: `# Die ultimative DSGVO-Checkliste für LLM-Plattformen

Die Nutzung von Large Language Models (LLMs) in Unternehmen wirft wichtige Datenschutzfragen auf. Diese Checkliste hilft Ihnen, die DSGVO-Konformität Ihrer KI-Nutzung sicherzustellen.

## Grundlegende Anforderungen

### Datenverarbeitung
- [ ] Werden personenbezogene Daten an den KI-Anbieter übermittelt?
- [ ] Gibt es einen Auftragsverarbeitungsvertrag (AVV)?
- [ ] Ist die Datenübermittlung in Drittländer geregelt?

### Hosting und Infrastruktur
- [ ] Wo werden die Daten verarbeitet? (EU/EWR bevorzugt)
- [ ] Gibt es Zertifizierungen wie ISO 27001 oder SOC 2?
- [ ] Werden Daten für das Training der KI-Modelle verwendet?

### Technische Maßnahmen
- [ ] Ist die Datenübertragung verschlüsselt (TLS)?
- [ ] Gibt es Zugriffskontrollen und Audit-Logs?
- [ ] Werden Daten nach Verarbeitung gelöscht?

## Organisatorische Maßnahmen

### Richtlinien
- [ ] Gibt es eine KI-Nutzungsrichtlinie für Mitarbeiter?
- [ ] Sind sensible Datenkategorien definiert und ausgeschlossen?
- [ ] Werden Mitarbeiter regelmäßig geschult?

### Dokumentation
- [ ] Ist die KI-Nutzung im Verarbeitungsverzeichnis dokumentiert?
- [ ] Wurde eine Datenschutz-Folgenabschätzung durchgeführt?
- [ ] Sind Betroffenenrechte gewährleistet?

## Fazit

Die DSGVO-konforme Nutzung von LLMs ist möglich, erfordert aber sorgfältige Planung und die Auswahl geeigneter Plattformen.`,
    author: 'Michael Weber',
    category: 'Compliance',
    readTime: '6 Min.',
    imageUrl: '/images/blog/dsgvo-checkliste.jpg',
    metaTitle: 'DSGVO-Checkliste für LLM-Plattformen 2026',
    metaDescription: 'Umfassende DSGVO-Checkliste für die sichere Nutzung von KI-Plattformen wie ChatGPT im Unternehmen.',
    isPublished: true,
    publishedAt: new Date('2026-01-08')
  }
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Insert platforms
    console.log("📦 Inserting platforms...");
    for (const platform of platforms) {
      await connection.execute(
        `INSERT INTO platforms (slug, name, company, location, url, pricingModel, basePrice, tokenBased, compliance, customGPTs, customGPTDetails, features, pros, cons, description, screenshotUrl, employees, customers, developers, isActive) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [
          platform.slug,
          platform.name,
          platform.company,
          platform.location,
          platform.url,
          platform.pricingModel,
          platform.basePrice,
          platform.tokenBased,
          platform.compliance,
          platform.customGPTs,
          platform.customGPTDetails,
          platform.features,
          platform.pros,
          platform.cons,
          platform.description,
          platform.screenshotUrl,
          platform.employees,
          platform.customers,
          platform.developers,
          platform.isActive
        ]
      );
      console.log(`  ✓ ${platform.name}`);
    }

    // Insert blog posts
    console.log("📝 Inserting blog posts...");
    for (const post of blogPosts) {
      await connection.execute(
        `INSERT INTO blog_posts (slug, title, excerpt, content, author, category, readTime, imageUrl, metaTitle, metaDescription, isPublished, publishedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          post.author,
          post.category,
          post.readTime,
          post.imageUrl,
          post.metaTitle,
          post.metaDescription,
          post.isPublished,
          post.publishedAt
        ]
      );
      console.log(`  ✓ ${post.title}`);
    }

    console.log("✅ Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed();
