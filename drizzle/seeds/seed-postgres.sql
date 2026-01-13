-- ============================================
-- PostgreSQL Seed Data
-- DSGVO-konforme LLM-Plattformen Vergleich
-- Generated: 2026-01-13
-- ============================================
-- 
-- WICHTIG: Führen Sie zuerst die Drizzle-Migration aus:
-- pnpm db:push
--
-- Dann dieses Seed-Script:
-- psql $DATABASE_URL -f drizzle/seeds/seed-postgres.sql
-- ============================================

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- ============================================
-- PLATFORMS (12 Einträge)
-- ============================================

DELETE FROM platforms;

INSERT INTO platforms (slug, name, company, location, url, "pricingModel", "basePrice", "tokenBased", compliance, "customGPTs", "customGPTDetails", features, pros, cons, description, "screenshotUrl", employees, customers, developers, "isActive", "logoUrl", "websiteUrl") VALUES
('langdock', 'Langdock', 'Langdock GmbH', 'Berlin', 'https://www.langdock.com', 'Hybrid', '€20/User/Monat', true, '["ISO 27001","SOC 2 Type II","DSGVO"]', true, 'Assistants', '["GPT-4o","Claude","Gemini","Mistral","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO/SAML","Team-Collaboration","Prompt-Management"]', '["Umfangreiche Modellauswahl","Y Combinator-backed","Exzellente Compliance","Intuitive UI"]', '["Relativ hoher Preis pro User","Junges Unternehmen","API-Aufschlag von 10%"]', 'Langdock ist eine führende DSGVO-konforme Chat-Plattform aus Berlin, die es Unternehmen ermöglicht, verschiedene LLMs (wie GPT-4, Claude, etc.) sicher zu nutzen.', '/images/screenshots/langdock-dashboard.png', 'ca. 11', '2.000+ Unternehmen', 'k.A.', true, '/logos/langdock.webp', 'https://langdock.com'),

('ka1ai', 'ka1.ai', 'kai.zen GmbH', 'Zwönitz', 'https://ka1.ai', 'Nutzungsbasiert', 'k.A.', true, '["DSGVO"]', false, 'k.A.', '["Mehrere Modelle","Dokumentenverarbeitung","Datenschutz-Fokus"]', '["Nutzungsbasierte Abrechnung","DSGVO-konform","Deutsches Unternehmen"]', '["Noch in Early Access","Wenig öffentliche Informationen","Unklarer Funktionsumfang"]', 'ka1.ai ist eine neue Plattform der kai.zen GmbH, die sich auf datenschutzkonforme KI-Nutzung spezialisiert.', '/images/screenshots/ka1ai-dashboard.png', 'k.A.', 'Early Access', 'k.A.', true, '/logos/openai.webp', 'https://ka1.ai'),

('logicc', 'Logicc', 'Logicc GmbH', 'Hamburg', 'https://www.logicc.com', 'Pro User', '€19,90/User/Monat', false, '["EU-Hosting","Kein KI-Training","DSGVO"]', true, 'Assistenten', '["GPT-4o","Claude","Gemini","Llama","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO (Enterprise)","Zentrale Verwaltung"]', '["Günstiger Einstiegspreis","Kein KI-Training","Zentrale Plattform","EU-Hosting"]', '["Kleineres Team","Weniger etabliert","Begrenzte Enterprise-Features"]', 'Logicc bietet eine zentrale KI-Plattform für Unternehmen, die Wert auf Datenschutz und Einfachheit legen.', '/images/screenshots/logicc-dashboard.png', 'Startup', '800+ Unternehmen', 'k.A.', true, '/logos/logicc.webp', 'https://logicc.ai'),

('plotdesk', 'Plotdesk', 'Plotdesk', 'Deutschland', 'https://plotdesk.com', 'Hybrid', 'ab ca. €2.000/Jahr', true, '["Deutsche Server","DSGVO"]', true, 'Use Cases', '["50+ Modelle","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO","White-Label Option"]', '["Über 50 KI-Modelle","10.000+ aktive Nutzer","Namhafte Referenzkunden","Schnelles Setup"]', '["Preise nur über Partner","Weniger transparente Preisgestaltung"]', 'Plotdesk positioniert sich als umfassende KI-Plattform mit einer riesigen Auswahl von über 50 KI-Modellen.', '/images/screenshots/plotdesk-dashboard.png', 'k.A.', '10.000+ Nutzer', 'k.A.', true, '/logos/plotdesk.webp', 'https://plotdesk.com'),

('kamium', 'kamium', 'Zweitag GmbH', 'Münster', 'https://www.kamium.de', 'Hybrid', '€600/Monat (30 User)', true, '["Private Cloud","Azure","DSGVO"]', true, 'Assistenten', '["GPT-4o","Claude","Gemini","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO","Beratung inklusive"]', '["15+ Jahre Erfahrung","Private Cloud","Starker Support","Umfassende Beratung"]', '["Höherer Einstiegspreis","Mindestens 30 User","Für kleine Teams teuer"]', 'Hinter kamium steht die erfahrene Software-Agentur Zweitag aus Münster.', '/images/screenshots/kamium-dashboard.png', '50 (Gesamt)', '200+', 'k.A.', true, '/logos/openai.webp', 'https://kamium.de'),

('patrisai', 'patris.ai', 'patris', 'Deutschland', 'https://patris.ai', 'Pro User', '€10/User/Monat', false, '["KI Bundesverband","Deutsche Server","DSGVO"]', true, 'Assistenten Baukasten', '["GPT-4o","Claude","Gemini","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO","Baukasten-System"]', '["Günstiger Starter-Tarif","KI Bundesverband Mitglied","Assistenten-Baukasten","Deutsche Server"]', '["Weniger bekannt","Begrenzte öffentliche Informationen"]', 'patris.ai bietet einen sehr günstigen Einstieg in die Welt der Unternehmens-KI.', '/images/screenshots/patris-dashboard.png', 'k.A.', 'k.A.', 'k.A.', true, '/logos/patris.webp', 'https://patris.ai'),

('basegpt', 'BaseGPT', 'BaseGPT', 'Deutschland', 'https://basegpt.eu', 'Hybrid', 'Auf Anfrage', true, '["EU-Hosting","DSGVO"]', true, 'Custom Models', '["ChatGPT","Claude","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO","Managed Service"]', '["Vollständig verwaltet","EU-Datenresidenz","Branchenspezifische Lösungen"]', '["Preise nur auf Anfrage","Weniger Transparenz"]', 'BaseGPT ist eine vollständig verwaltete KI-Plattform.', '/images/screenshots/basegpt-dashboard.png', 'k.A.', 'k.A.', 'k.A.', true, '/logos/openai.webp', 'https://openai.com'),

('dsgpt', 'DSGPT', 'Next Strategy AI GmbH', 'Hamburg', 'https://dsgpt.de', 'Einmalzahlung', '€2.495 (Lifetime)', true, '["On-Premise","DSGVO"]', true, 'Prompts', '["GPT-4o","Llama","DeepSeek","Mistral","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO","Lokale Modelle"]', '["Einmalzahlung (Lifetime)","Keine monatlichen Kosten","Volle Datenkontrolle","Lokale Modelle"]', '["On-Premise Installation nötig","Höhere Anfangsinvestition","Selbst-Hosting","Support kostenpflichtig"]', 'DSGPT geht einen Sonderweg mit einem Lifetime-Lizenzmodell.', '/images/screenshots/dsgpt-dashboard.png', 'k.A.', 'k.A.', 'k.A.', true, '/logos/openai.webp', 'https://openai.com'),

('neleai', 'nele.ai', 'GAL Digital GmbH', 'Hungen', 'https://www.nele.ai', 'Nutzungsbasiert', 'Volumenbasiert', true, '["ISO 27001","Deutscher Server","DSGVO"]', true, 'Prompt-Bibliothek', '["Mehrere Modelle","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","Umfangreiche Prompt-Bibliothek"]', '["ISO 27001 zertifiziert","Nutzungsbasierte Credits","Keine Kosten pro User","Deutscher Server"]', '["Weniger bekannte Marke","Preise nicht transparent"]', 'nele.ai von der GAL Digital GmbH setzt auf ein reines Credit-Modell.', '/images/screenshots/neleai-dashboard.png', 'k.A.', 'Tausende', 'k.A.', true, '/logos/neuroflash.webp', 'https://neuroflash.com'),

('amberai', 'amberAI', 'AmberSearch GmbH', 'Aachen/Köln', 'https://ambersearch.de', 'Enterprise', 'Auf Anfrage', false, '["ISO 27001","DSGVO"]', true, 'AI Assistants', '["Mehrere Modelle","Dokumentenverarbeitung","Wissensmanagement (Kern)","API-Zugang","SSO","Enterprise Search"]', '["Europäischer Marktführer","Starkes Wissensmanagement","ISO 27001 zertifiziert","Etabliert"]', '["Enterprise-Fokus","Teuer","Nicht für kleine Teams","Preise intransparent"]', 'amberAI kommt ursprünglich aus dem Bereich Enterprise Search.', '/images/screenshots/amberai-dashboard.png', 'ca. 50', 'Enterprise', 'k.A.', true, '/logos/amberai.webp', 'https://amberai.de'),

('aiui', 'AI-UI (AIVA)', 'AI-UI', 'Thüringen', 'https://ai-ui.ai', 'Enterprise', 'Auf Anfrage', false, '["On-Premise Option","DSGVO"]', true, 'Chat Assistants', '["Mehrere Modelle","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO","Individuelle Entwicklung"]', '["Full-Service Partner","On-Premise Option","Individuelle Lösungen"]', '["Projektbasierte Preise","Weniger Self-Service","Evtl. überdimensioniert"]', 'AI-UI versteht sich weniger als reiner Software-Anbieter, sondern als Full-Service-Partner.', '/images/screenshots/aiui-dashboard.png', 'k.A.', '50+ Projekte', 'k.A.', true, '/logos/ai-ui.webp', 'https://ai-ui.de'),

('mistral', 'Mistral Le Chat', 'Mistral AI', 'Paris (FR)', 'https://mistral.ai', 'Pro User', '€14,99/User/Monat', false, '["EU-Unternehmen","DSGVO"]', true, 'Agents', '["Mistral Large","Mistral Medium","Dokumentenverarbeitung","Wissensmanagement","API-Zugang","SSO (Enterprise)","Canvas"]', '["EU-Unternehmen","Günstige Pro-Tarife","Eigene Modelle","Starke Forschung"]', '["Weniger Enterprise-Features","Kein deutsches Unternehmen","Weniger Modellvielfalt"]', 'Mistral AI ist Europas Antwort auf OpenAI.', '/images/screenshots/mistral-dashboard.png', '100+', 'Millionen', 'k.A.', true, '/logos/mistral.webp', 'https://mistral.ai');

-- ============================================
-- API PRICING (48 Einträge)
-- ============================================

DELETE FROM api_pricing;

INSERT INTO api_pricing ("platformId", provider, "modelName", "modelVersion", "inputPricePerMillion", "outputPricePerMillion", regions, "isAvailable", "supportedLanguages", capabilities, "contextWindow", notes) VALUES
-- Langdock API Preise
(1, 'Anthropic', 'Claude Haiku', NULL, '€0.75/M', '€3.77/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","code"]', 128000, 'Schnelles, günstiges Modell'),
(1, 'Anthropic', 'Claude Sonnet', NULL, '€2.82/M', '€14.12/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","code","vision"]', 128000, 'Ausgewogenes Modell'),
(1, 'Anthropic', 'Claude Opus', NULL, '€14.12/M', '€70.62/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","code","vision"]', 128000, 'Leistungsstärkstes Claude Modell'),
(1, 'OpenAI', 'GPT-4o', NULL, '€2.35/M', '€9.42/M', '["EU","Global"]', true, '["de","en","fr","es","it","ja","zh"]', '["chat","code","vision"]', 128000, 'Multimodales Flaggschiff'),
(1, 'OpenAI', 'GPT-4o mini', NULL, '€0.14/M', '€0.56/M', '["EU","Global"]', true, '["de","en","fr","es","it","ja","zh"]', '["chat","code"]', 128000, 'Schnell und günstig'),
(1, 'Google', 'Gemini 1.5 Pro', NULL, '€1.18/M', '€4.71/M', '["EU","Global"]', true, '["de","en","fr","es","it","ja","zh"]', '["chat","code","vision"]', 1000000, 'Großes Kontextfenster'),
(1, 'Google', 'Gemini 1.5 Flash', NULL, '€0.07/M', '€0.28/M', '["EU","Global"]', true, '["de","en","fr","es","it","ja","zh"]', '["chat","code"]', 1000000, 'Schnellstes Gemini'),

-- ka1.ai API Preise
(2, 'Anthropic', 'Claude 3.5 Sonnet', 'Anthropic via ka1', '€3.50/M', '€17.50/M', '["EU"]', true, '["de","en"]', '["chat","code","vision"]', 128000, NULL),
(2, 'OpenAI', 'GPT-4o', 'OpenAI via ka1', '€2.50/M', '€10.00/M', '["EU"]', true, '["de","en"]', '["chat","code","vision"]', 128000, NULL),
(2, 'Mistral', 'Mistral Large', 'Mistral via ka1', '€2.00/M', '€6.00/M', '["EU"]', true, '["de","en","fr"]', '["chat","code"]', 32000, NULL),

-- Logicc API Preise
(3, 'OpenAI', 'GPT-4o', NULL, '€2.50/M', '€10.00/M', '["EU"]', true, '["de","en","fr","es"]', '["chat","code","vision"]', 128000, 'EU-Hosting'),
(3, 'Anthropic', 'Claude 3.5 Sonnet', NULL, '€3.00/M', '€15.00/M', '["EU"]', true, '["de","en","fr","es"]', '["chat","code","vision"]', 128000, 'EU-Hosting'),
(3, 'Meta', 'Llama 3.1 70B', NULL, '€0.90/M', '€0.90/M', '["EU"]', true, '["de","en"]', '["chat","code"]', 128000, 'Open Source'),

-- Plotdesk API Preise
(4, 'OpenAI', 'GPT-4o', NULL, '€2.50/M', '€10.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Deutsche Server'),
(4, 'Anthropic', 'Claude 3.5 Sonnet', NULL, '€3.00/M', '€15.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Deutsche Server'),
(4, 'Google', 'Gemini 1.5 Pro', NULL, '€1.25/M', '€5.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 1000000, 'Deutsche Server'),
(4, 'Mistral', 'Mistral Large', NULL, '€2.00/M', '€6.00/M', '["DE"]', true, '["de","en","fr"]', '["chat","code"]', 32000, 'Deutsche Server'),

-- kamium API Preise
(5, 'OpenAI', 'GPT-4o', 'Azure OpenAI', '€2.35/M', '€9.42/M', '["EU"]', true, '["de","en","fr","es"]', '["chat","code","vision"]', 128000, 'Azure Private Cloud'),
(5, 'Anthropic', 'Claude 3.5 Sonnet', NULL, '€3.00/M', '€15.00/M', '["EU"]', true, '["de","en","fr","es"]', '["chat","code","vision"]', 128000, 'Private Cloud'),
(5, 'Google', 'Gemini 1.5 Pro', NULL, '€1.25/M', '€5.00/M', '["EU"]', true, '["de","en"]', '["chat","code","vision"]', 1000000, 'Private Cloud'),

-- patris.ai API Preise
(6, 'OpenAI', 'GPT-4o', NULL, '€2.50/M', '€10.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Deutsche Server'),
(6, 'Anthropic', 'Claude 3.5 Sonnet', NULL, '€3.00/M', '€15.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Deutsche Server'),
(6, 'Google', 'Gemini 1.5 Pro', NULL, '€1.25/M', '€5.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 1000000, 'Deutsche Server'),

-- BaseGPT API Preise
(7, 'OpenAI', 'GPT-4o', 'Managed', '€3.00/M', '€12.00/M', '["EU"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Managed Service Aufschlag'),
(7, 'Anthropic', 'Claude 3.5 Sonnet', 'Managed', '€4.00/M', '€18.00/M', '["EU"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Managed Service Aufschlag'),

-- DSGPT API Preise
(8, 'OpenAI', 'GPT-4o', 'API Key', '€2.35/M', '€9.42/M', '["On-Premise"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Eigener API Key'),
(8, 'Meta', 'Llama 3.1 70B', 'Lokal', '€0.00/M', '€0.00/M', '["On-Premise"]', true, '["de","en"]', '["chat","code"]', 128000, 'Lokale Installation'),
(8, 'Mistral', 'Mistral Large', 'Lokal', '€0.00/M', '€0.00/M', '["On-Premise"]', true, '["de","en","fr"]', '["chat","code"]', 32000, 'Lokale Installation'),
(8, 'DeepSeek', 'DeepSeek V3', 'Lokal', '€0.00/M', '€0.00/M', '["On-Premise"]', true, '["de","en","zh"]', '["chat","code"]', 64000, 'Lokale Installation'),

-- nele.ai API Preise
(9, 'OpenAI', 'GPT-4o', NULL, '€2.50/M', '€10.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'ISO 27001'),
(9, 'Anthropic', 'Claude 3.5 Sonnet', NULL, '€3.00/M', '€15.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'ISO 27001'),
(9, 'Google', 'Gemini 1.5 Pro', NULL, '€1.25/M', '€5.00/M', '["DE"]', true, '["de","en"]', '["chat","code","vision"]', 1000000, 'ISO 27001'),

-- amberAI API Preise
(10, 'OpenAI', 'GPT-4o', 'Enterprise', '€3.00/M', '€12.00/M', '["EU"]', true, '["de","en","fr","es"]', '["chat","code","vision"]', 128000, 'Enterprise Pricing'),
(10, 'Anthropic', 'Claude 3.5 Sonnet', 'Enterprise', '€4.00/M', '€18.00/M', '["EU"]', true, '["de","en","fr","es"]', '["chat","code","vision"]', 128000, 'Enterprise Pricing'),
(10, 'Google', 'Gemini 1.5 Pro', 'Enterprise', '€2.00/M', '€8.00/M', '["EU"]', true, '["de","en"]', '["chat","code","vision"]', 1000000, 'Enterprise Pricing'),

-- AI-UI API Preise
(11, 'OpenAI', 'GPT-4o', 'Projekt', '€2.50/M', '€10.00/M', '["DE","On-Premise"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Projektbasiert'),
(11, 'Anthropic', 'Claude 3.5 Sonnet', 'Projekt', '€3.00/M', '€15.00/M', '["DE","On-Premise"]', true, '["de","en"]', '["chat","code","vision"]', 128000, 'Projektbasiert'),
(11, 'Meta', 'Llama 3.1 70B', 'On-Premise', '€0.00/M', '€0.00/M', '["On-Premise"]', true, '["de","en"]', '["chat","code"]', 128000, 'Lokale Installation'),

-- Mistral API Preise
(12, 'Mistral', 'Mistral Large', NULL, '€2.00/M', '€6.00/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","code"]', 128000, 'Eigenes Modell'),
(12, 'Mistral', 'Mistral Medium', NULL, '€2.70/M', '€8.10/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","code"]', 32000, 'Eigenes Modell'),
(12, 'Mistral', 'Mistral Small', NULL, '€0.20/M', '€0.60/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","code"]', 32000, 'Schnell und günstig'),
(12, 'Mistral', 'Codestral', NULL, '€0.20/M', '€0.60/M', '["EU","Global"]', true, '["de","en"]', '["code"]', 32000, 'Code-spezialisiert'),
(12, 'Mistral', 'Pixtral Large', NULL, '€2.00/M', '€6.00/M', '["EU","Global"]', true, '["de","en","fr","es","it"]', '["chat","vision"]', 128000, 'Vision-Modell');

-- ============================================
-- BLOG POSTS (3 Einträge)
-- ============================================

DELETE FROM blog_posts;

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, "readTime", "imageUrl", "metaTitle", "metaDescription", "isPublished", "publishedAt") VALUES
('dsgvo-checkliste-llm', 'Die ultimative DSGVO-Checkliste für LLM-Plattformen', 'Erfahren Sie, welche Kriterien eine LLM-Plattform erfüllen muss, um DSGVO-konform zu sein. Mit praktischer Checkliste zum Download.', E'# Die ultimative DSGVO-Checkliste für LLM-Plattformen\n\nDie Einführung von Large Language Models (LLMs) in Unternehmen bringt erhebliche Datenschutzherausforderungen mit sich. Dieser Leitfaden hilft Ihnen, die DSGVO-Konformität sicherzustellen.\n\n## Warum DSGVO-Konformität bei LLMs wichtig ist\n\nLLM-Plattformen verarbeiten oft sensible Unternehmensdaten. Bei Verstößen gegen die DSGVO drohen Bußgelder von bis zu 20 Millionen Euro oder 4% des weltweiten Jahresumsatzes.\n\n## Die wichtigsten Prüfpunkte\n\n### 1. Datenverarbeitung und Speicherung\n\n- **Serverstandort**: Werden die Daten in der EU verarbeitet?\n- **Auftragsverarbeitung**: Liegt ein AV-Vertrag vor?\n- **Datenlöschung**: Können Daten auf Anfrage gelöscht werden?\n\n### 2. Technische Sicherheitsmaßnahmen\n\n- **Verschlüsselung**: TLS 1.3 für Datenübertragung\n- **Zugangskontrolle**: SSO/SAML-Integration\n- **Audit-Logs**: Nachvollziehbarkeit aller Zugriffe\n\n### 3. Organisatorische Maßnahmen\n\n- **Zertifizierungen**: ISO 27001, SOC 2 Type II\n- **Datenschutzbeauftragter**: Ansprechpartner vorhanden?\n- **Schulungen**: Mitarbeiter-Awareness\n\n## Praktische Checkliste\n\n| Kriterium | Erforderlich | Empfohlen |\n|-----------|--------------|------------|\n| EU-Serverstandort | ✓ | ✓ |\n| AV-Vertrag | ✓ | ✓ |\n| ISO 27001 | - | ✓ |\n| SOC 2 Type II | - | ✓ |\n| SSO/SAML | - | ✓ |\n| Audit-Logs | ✓ | ✓ |\n| Datenlöschung | ✓ | ✓ |\n\n## Fazit\n\nDie DSGVO-Konformität sollte bei der Auswahl einer LLM-Plattform oberste Priorität haben. Nutzen Sie unsere Checkliste, um die richtige Entscheidung zu treffen.', 'Michael Weber', 'Compliance', '6 Min.', '/images/blog/dsgvo-checkliste.jpg', 'DSGVO-Checkliste für LLM-Plattformen | Compliance Guide', 'Umfassende DSGVO-Checkliste für die Auswahl einer LLM-Plattform. Erfahren Sie, welche Kriterien für Datenschutz-Konformität erfüllt sein müssen.', true, '2026-01-07 10:00:00'),

('ki-im-unternehmen-einfuehren', 'KI im Unternehmen erfolgreich einführen: Ein Leitfaden für Entscheider', 'Von der Strategie bis zur Implementierung: So gelingt die erfolgreiche Einführung von KI-Tools in Ihrem Unternehmen.', E'# KI im Unternehmen erfolgreich einführen\n\nDie Einführung von Künstlicher Intelligenz ist mehr als nur die Auswahl eines Tools. Es erfordert eine durchdachte Strategie, Change Management und kontinuierliche Optimierung.\n\n## Die 5 Phasen der KI-Einführung\n\n### Phase 1: Bedarfsanalyse\n\nBevor Sie eine KI-Lösung auswählen, sollten Sie folgende Fragen klären:\n\n- Welche Prozesse sollen optimiert werden?\n- Welche Daten stehen zur Verfügung?\n- Welche Compliance-Anforderungen gelten?\n\n### Phase 2: Pilotprojekt\n\nStarten Sie mit einem überschaubaren Pilotprojekt:\n\n- Wählen Sie eine Abteilung mit hoher Motivation\n- Definieren Sie messbare Erfolgskriterien\n- Planen Sie 3-6 Monate für die Pilotphase\n\n### Phase 3: Rollout\n\nNach erfolgreichem Pilot folgt der schrittweise Rollout:\n\n- Schulungen für alle Mitarbeiter\n- Klare Nutzungsrichtlinien\n- Support-Strukturen aufbauen\n\n### Phase 4: Integration\n\nIntegrieren Sie die KI in bestehende Workflows:\n\n- API-Anbindungen an bestehende Systeme\n- Automatisierung von Routineaufgaben\n- Qualitätssicherung etablieren\n\n### Phase 5: Optimierung\n\nKontinuierliche Verbesserung:\n\n- Nutzungsdaten analysieren\n- Feedback der Mitarbeiter einholen\n- Neue Use Cases identifizieren\n\n## Typische Herausforderungen\n\n| Herausforderung | Lösung |\n|-----------------|--------|\n| Widerstand der Mitarbeiter | Frühzeitige Einbindung, Schulungen |\n| Datenschutzbedenken | DSGVO-konforme Anbieter wählen |\n| Unklarer ROI | Klare KPIs definieren |\n| Technische Integration | Schrittweise Anbindung |\n\n## Fazit\n\nDie erfolgreiche KI-Einführung erfordert Geduld und eine strukturierte Vorgehensweise. Mit dem richtigen Ansatz können Sie die Produktivität Ihres Unternehmens signifikant steigern.', 'Dr. Anna Schmidt', 'Strategie', '8 Min.', '/images/blog/ki-einfuehrung.jpg', 'KI im Unternehmen einführen | Leitfaden für Entscheider', 'Praxisleitfaden für die erfolgreiche Einführung von KI-Tools im Unternehmen. Von der Strategie bis zur Implementierung.', true, '2026-01-09 10:00:00'),

('ki-tools-unternehmen-implementieren', 'Wie man KI-Tools in Unternehmen erfolgreich implementiert', 'Ein praxisnaher Leitfaden zur erfolgreichen Implementierung von KI-Tools in Unternehmen - von der Bedarfsanalyse bis zur kontinuierlichen Optimierung.', E'# Wie man KI-Tools in Unternehmen erfolgreich implementiert\n\nDie Implementierung von KI-Tools in Unternehmen ist eine strategische Entscheidung, die weit über die reine Technologieauswahl hinausgeht. Dieser Leitfaden zeigt Ihnen den Weg von der ersten Idee bis zur erfolgreichen Integration.\n\n## Phase 1: Bedarfsanalyse und Zielsetzung\n\n### Identifizieren Sie Ihre Use Cases\n\nBevor Sie sich für eine KI-Lösung entscheiden, sollten Sie konkrete Anwendungsfälle definieren:\n\n- **Textgenerierung**: Marketing-Texte, E-Mails, Dokumentation\n- **Datenanalyse**: Reports, Zusammenfassungen, Insights\n- **Kundenservice**: Chatbots, FAQ-Automatisierung\n- **Wissensmanagement**: Interne Suche, Dokumentenanalyse\n\n### Stakeholder einbinden\n\nErfolgreiche KI-Projekte erfordern die Unterstützung aller Beteiligten:\n\n| Stakeholder | Rolle | Erwartungen |\n|-------------|-------|-------------|\n| Geschäftsführung | Sponsor | ROI, Strategie |\n| IT-Abteilung | Implementierung | Sicherheit, Integration |\n| Datenschutz | Compliance | DSGVO, Richtlinien |\n| Fachabteilungen | Anwender | Usability, Nutzen |\n\n## Phase 2: Anbieterauswahl\n\n### Kriterien für die Auswahl\n\n1. **DSGVO-Konformität**: EU-Serverstandort, AV-Vertrag\n2. **Sicherheit**: ISO 27001, SOC 2, Verschlüsselung\n3. **Funktionsumfang**: Modellauswahl, Integrationen\n4. **Preismodell**: Pro User, Token-basiert, Flatrate\n5. **Support**: Deutschsprachig, SLA, Schulungen\n\n### Empfohlene Vorgehensweise\n\n- Erstellen Sie eine Shortlist von 3-5 Anbietern\n- Führen Sie Proof-of-Concept Tests durch\n- Holen Sie Referenzen ein\n- Vergleichen Sie Total Cost of Ownership\n\n## Phase 3: Pilotprojekt\n\n### Struktur des Piloten\n\n**Dauer**: 4-8 Wochen\n**Teilnehmer**: 10-20 ausgewählte Mitarbeiter\n**Ziele**: Validierung der Use Cases, Usability-Test\n\n### Erfolgskriterien definieren\n\n- Zeitersparnis pro Aufgabe\n- Qualität der Ergebnisse\n- Nutzerzufriedenheit\n- Technische Stabilität\n\n## Phase 4: Rollout und Schulung\n\n### Schulungskonzept\n\n1. **Grundlagenschulung** (2h): Was ist KI, Prompt-Basics\n2. **Anwendungsschulung** (4h): Tool-spezifische Funktionen\n3. **Best Practices** (2h): Effektive Prompts, Qualitätssicherung\n\n### Change Management\n\n- Kommunizieren Sie den Nutzen klar\n- Adressieren Sie Ängste proaktiv\n- Feiern Sie Quick Wins\n- Etablieren Sie KI-Champions in den Teams\n\n## Phase 5: Kontinuierliche Optimierung\n\n### Monitoring und KPIs\n\n- **Nutzungsrate**: Aktive User pro Monat\n- **Produktivitätsgewinn**: Zeitersparnis in Stunden\n- **Qualitätsmetriken**: Fehlerrate, Nachbearbeitungszeit\n- **ROI**: Kosten vs. Einsparungen\n\n### Feedback-Schleifen\n\n- Regelmäßige Nutzerbefragungen\n- Feature-Requests sammeln\n- Best Practices teilen\n- Neue Use Cases identifizieren\n\n## Häufige Fehler vermeiden\n\n| Fehler | Konsequenz | Lösung |\n|--------|------------|--------|\n| Zu schneller Rollout | Überforderung, Ablehnung | Schrittweise Einführung |\n| Keine klaren Richtlinien | Datenschutz-Risiken | Nutzungsrichtlinien erstellen |\n| Fehlende Schulungen | Geringe Akzeptanz | Umfassendes Schulungsprogramm |\n| Kein Executive Sponsor | Mangelnde Ressourcen | Frühzeitig Unterstützung sichern |\n\n## Fazit\n\nDie erfolgreiche Implementierung von KI-Tools erfordert mehr als nur die richtige Technologie. Mit einer strukturierten Vorgehensweise, klaren Zielen und kontinuierlicher Optimierung können Sie das volle Potenzial von KI für Ihr Unternehmen erschließen.\n\n**Nächste Schritte:**\n1. Definieren Sie Ihre Top-3 Use Cases\n2. Erstellen Sie eine Anbieter-Shortlist\n3. Planen Sie ein Pilotprojekt\n4. Sichern Sie sich Executive Sponsorship', 'Redaktion', 'Praxis', '12 Min.', '/images/blog/ki-implementierung.jpg', 'KI-Tools in Unternehmen implementieren | Praxis-Leitfaden', 'Praxisnaher Leitfaden zur erfolgreichen Implementierung von KI-Tools in Unternehmen. Von der Bedarfsanalyse bis zur kontinuierlichen Optimierung.', true, '2026-01-13 10:00:00');

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset sequences (PostgreSQL auto-increment)
SELECT setval('platforms_id_seq', (SELECT MAX(id) FROM platforms));
SELECT setval('api_pricing_id_seq', (SELECT MAX(id) FROM api_pricing));
SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));

-- ============================================
-- IMPORT COMPLETE
-- ============================================
-- Platforms: 12
-- API Pricing: 48  
-- Blog Posts: 3
-- ============================================
