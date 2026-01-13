# Project TODO - LLM-Plattform Vergleich

## Full-Stack Upgrade (Phase 38-46)

- [x] Upgrade auf Full-Stack (web-db-user)
- [x] Datenbank-Schema definieren (Plattformen, Blog, Kommentare, Leads, Reviews, Newsletter, Suggestions)
- [x] Daten-Migration (Seed Script erstellen und ausführen)
- [x] Backend-API-Endpunkte entwickeln (tRPC-Router)
- [x] Frontend auf API-Nutzung umstellen (Home, Blog, BlogPost, PlatformDetail, Admin)
- [x] Newsletter-Komponente auf API umstellen
- [x] FeedbackForm-Komponente auf API umstellen
- [x] Comments-Komponente auf API umstellen
- [x] Reviews-Komponente auf API umstellen
- [x] LeadForm-Komponente auf API umstellen
- [x] Admin-Dashboard mit OAuth-Login und Moderation
- [x] Unit-Tests für API-Endpunkte erstellen
- [x] Moderations-Features im Admin-Dashboard implementieren
- [x] E-Mail-Benachrichtigungssystem implementieren
- [x] GEO-SEO Optimierung umsetzen
- [x] Abschließende Tests der Full-Stack-Anwendung

## Bestehende Features (abgeschlossen)

- [x] Basic homepage layout
- [x] Navigation menu
- [x] Platform comparison grid
- [x] Filter and search functionality
- [x] Platform detail pages
- [x] Cost calculator
- [x] PDF export
- [x] Community reviews system
- [x] Lead generation forms
- [x] Newsletter subscription
- [x] Admin dashboard
- [x] Blog section with articles
- [x] Comment system for blog posts
- [x] Feedback/suggestion form

## Neue Features (Phase 47+)

### E-Mail-Benachrichtigungen
- [x] E-Mail-Service mit Nodemailer einrichten
- [x] Benachrichtigung bei neuen Leads
- [x] Benachrichtigung bei neuen Bewertungen
- [x] Benachrichtigung bei neuen Kommentaren
- [x] Benachrichtigung bei neuen Newsletter-Abonnenten
- [x] Benachrichtigung bei neuen Vorschlägen

### GEO-SEO Optimierung
- [x] Meta-Tags Komponente erstellen
- [x] Strukturierte Daten (JSON-LD) implementieren
- [x] Open Graph Tags für Social Media
- [x] Sitemap.xml generieren
- [x] Robots.txt konfigurieren
- [x] SEO auf allen Seiten integriert (Home, Blog, BlogPost, PlatformDetail)

### Erweiterte Moderation
- [x] Bulk-Aktionen im Admin-Dashboard
- [x] Automatische Spam-Erkennung für Kommentare
- [x] Spam-Score-Logging für Debugging
- [x] Spam-Wortliste und Filterregeln (implementiert in spam.ts)
- [x] Moderations-Queue mit Prioritäten (getModerationPriority Funktion)

## Neue Features (Phase 48+)

### Rechtliche Seiten
- [x] Datenschutzseite erstellen
- [x] Impressum erstellen
- [x] Footer-Links zu rechtlichen Seiten

### Magic Link Login
- [x] E-Mail-basiertes Login mit Einmal-Code
- [x] Code-Generierung und Validierung
- [x] Session-Management für eingeloggte Nutzer
- [x] Login-UI Komponente (MemberLogin, MemberMenu, LoginPrompt)

### Basis-Profile
- [x] Profil-Datenbank-Schema (Name, E-Mail, Profilbild optional)
- [x] Profil-Bearbeitungsseite (/profil)
- [x] Profilanzeige bei Kommentaren (via Member-System)

### Zugriffsbeschränkung
- [x] Kommentare nur für eingeloggte Nutzer
- [x] Vorschläge nur für eingeloggte Nutzer
- [x] Login-Aufforderung bei nicht eingeloggten Nutzern

### API-Preise (Ausbaustufe)
- [x] Datenbank-Schema für API-Preise (Modell, Input/Output-Preis)
- [x] API-Preise UI auf Plattform-Detailseite
- [x] API-Routen (CRUD) für Admin-Interface vorbereitet

## Neue Features (Phase 49+)

### Header-Verbesserungen
- [x] Anmelde-Button im Header einbauen
- [x] MemberMenu-Komponente in Navigation integrieren

### API-Preisdaten
- [x] Preisdaten für alle Plattformen in Datenbank einfügen (34 Einträge)
- [x] Seed-Script für API-Preise erstellen

### E-Mail-Benachrichtigungen
- [x] E-Mail bei neuen Kommentaren an Admin senden (bereits implementiert)
- [x] E-Mail bei neuen Vorschlägen an Admin senden (bereits implementiert)

## Neue Features (Phase 50+)

### API-Anbieter Filter
- [x] Filter nach unterstützten Sprachen (Deutsch, Englisch, etc.)
- [x] Filter nach spezifischen Funktionen (Code, Chat, Embedding)
- [x] Filter-UI in API-Preise Übersicht integrieren (/api-preise)

### Bewertungssystem für API-Anbieter
- [x] Bewertungs-Schema für API-Anbieter erweitern (Firma, Anwendungsfall, Dauer, Team-Größe)
- [x] Erfahrungsberichte-Formular erstellen (Vorteile/Nachteile)
- [x] Bewertungsanzeige auf Plattform-Detailseiten

#### Vergleichsfunktion
- [x] Auswahl von bis zu 3 API-Anbietern
- [x] Vergleichstabelle mit Preisen und Eckdaten
- [x] Nebeneinander-Ansicht der Plattformen (/vergleich) Anbieter


## Neue Features (Phase 51+)

### PDF-Export für Vergleich
- [x] PDF-Generierung für Vergleichstabelle (via Browser-Print)
- [x] Download-Button auf Vergleichsseite
- [x] Formatierung für professionelle Entscheidungsvorlagen

### Vergleich-Button auf Plattformkarten
- [x] "Zum Vergleich hinzufügen"-Button auf Startseite
- [x] Vergleichs-Warenkorb mit ausgewählten Plattformen (Floating Widget)
- [x] Navigation zur Vergleichsseite mit Vorauswahl

### SMTP-Konfiguration
- [x] SMTP-Secrets vorbereitet (Host, Port, User, Pass, Admin-Email) - später einzugeben
- [x] E-Mail-Service bereits implementiert (server/services/email.ts)
- [x] Magic-Link-Login Code bereit (server/services/magicLink.ts)
