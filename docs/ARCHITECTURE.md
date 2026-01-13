# Architektur-Dokumentation

Diese Dokumentation beschreibt die technische Architektur des LLM-Plattform Vergleich Projekts und erläutert die wichtigsten Design-Entscheidungen.

---

## Systemübersicht

Das Projekt folgt einer modernen Full-Stack-Architektur mit klarer Trennung zwischen Frontend und Backend. Die Kommunikation erfolgt über eine typsichere tRPC-API, die automatische Validierung und TypeScript-Integration bietet.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui        │
│  ├── Pages (Routing)                                            │
│  ├── Components (UI)                                            │
│  ├── Hooks (State & Logic)                                      │
│  └── tRPC Client                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket (tRPC)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Server (Node.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  Express + tRPC + TypeScript                                    │
│  ├── Routers (API-Endpunkte)                                    │
│  ├── Services (Business Logic)                                  │
│  ├── Middleware (Auth, Logging)                                 │
│  └── Drizzle ORM                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Datenbank                        │
├─────────────────────────────────────────────────────────────────┤
│  ├── platforms          │  ├── reviews                          │
│  ├── api_pricing        │  ├── leads                            │
│  ├── blog_posts         │  ├── newsletter_subscribers           │
│  ├── comments           │  ├── suggestions                      │
│  ├── members            │  └── magic_links                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend-Architektur

### Technologie-Stack

| Komponente | Technologie | Zweck |
|------------|-------------|-------|
| Framework | React 18 | UI-Rendering mit Hooks |
| Sprache | TypeScript | Typsicherheit |
| Build-Tool | Vite | Schnelles HMR und Bundling |
| Styling | Tailwind CSS | Utility-first CSS |
| UI-Bibliothek | shadcn/ui | Wiederverwendbare Komponenten |
| Routing | React Router | Client-seitiges Routing |
| API-Client | tRPC React Query | Typsichere API-Aufrufe |
| State | React Query | Server-State-Management |

### Verzeichnisstruktur

Das Frontend folgt einer feature-basierten Struktur, bei der zusammengehörige Dateien gruppiert werden:

```
client/src/
├── components/           # Wiederverwendbare UI-Komponenten
│   ├── ui/              # shadcn/ui Basis-Komponenten
│   ├── ui-custom.tsx    # Projekt-spezifische Komponenten
│   ├── SEO.tsx          # Meta-Tags und strukturierte Daten
│   ├── Comments.tsx     # Kommentar-System
│   ├── Reviews.tsx      # Bewertungs-System
│   ├── ApiPricing.tsx   # API-Preise Anzeige
│   ├── MemberLogin.tsx  # Magic-Link Login
│   └── ...
├── pages/               # Seiten-Komponenten (Routing)
│   ├── Home.tsx         # Startseite mit Plattform-Übersicht
│   ├── PlatformDetail.tsx # Plattform-Detailseite
│   ├── Blog.tsx         # Blog-Übersicht
│   ├── BlogPost.tsx     # Einzelner Blog-Artikel
│   ├── Vergleich.tsx    # Plattform-Vergleich
│   ├── ApiPricing.tsx   # API-Preise mit Filtern
│   ├── Admin.tsx        # Admin-Dashboard
│   ├── Profil.tsx       # Mitglieder-Profil
│   ├── Datenschutz.tsx  # Datenschutzerklärung
│   └── Impressum.tsx    # Impressum
├── hooks/               # Custom React Hooks
│   └── useMember.ts     # Member-Authentifizierung
├── lib/                 # Hilfsfunktionen
│   ├── trpc.ts          # tRPC-Client Konfiguration
│   ├── utils.ts         # Allgemeine Utilities
│   └── pdf-export.ts    # PDF-Export Funktionen
├── _core/               # Core-Funktionalität
│   └── hooks/
│       └── useAuth.ts   # OAuth-Authentifizierung
└── App.tsx              # Haupt-App mit Routing
```

### Komponenten-Hierarchie

Die Anwendung verwendet eine klare Komponenten-Hierarchie mit Trennung von Container- und Präsentationskomponenten:

```
App
├── HelmetProvider (SEO)
├── QueryClientProvider (React Query)
├── MemberProvider (Auth Context)
└── Routes
    ├── Home
    │   ├── SEO
    │   ├── MemberMenu
    │   ├── PlatformCard[]
    │   ├── FilterSidebar
    │   ├── Newsletter
    │   └── FeedbackForm
    ├── PlatformDetail
    │   ├── SEO
    │   ├── ApiPricing
    │   ├── Reviews
    │   └── LeadForm
    └── ...
```

---

## Backend-Architektur

### Technologie-Stack

| Komponente | Technologie | Zweck |
|------------|-------------|-------|
| Runtime | Node.js 22 | JavaScript-Ausführung |
| Framework | Express | HTTP-Server |
| API | tRPC | Typsichere RPC-API |
| ORM | Drizzle | Datenbank-Zugriff |
| Validierung | Zod | Schema-Validierung |
| Auth | JWT + OAuth | Authentifizierung |

### Verzeichnisstruktur

```
server/
├── _core/               # Server-Core
│   ├── index.ts         # Express-Setup und Middleware
│   ├── trpc.ts          # tRPC-Konfiguration
│   ├── cookies.ts       # Cookie-Handling
│   └── systemRouter.ts  # System-Endpunkte
├── services/            # Business Logic
│   ├── email.ts         # E-Mail-Versand (Nodemailer)
│   ├── magicLink.ts     # Magic-Link-Authentifizierung
│   └── spam.ts          # Spam-Erkennung
├── __tests__/           # Unit-Tests
│   ├── api.test.ts      # API-Tests
│   ├── features.test.ts # Feature-Tests
│   └── new-features.test.ts
├── routers.ts           # tRPC-Router (API-Endpunkte)
├── db.ts                # Datenbank-Funktionen
├── seed.ts              # Plattform-Seed-Daten
└── seed-api-pricing.ts  # API-Preise Seed-Daten
```

### Request-Flow

Der typische Ablauf einer API-Anfrage:

```
1. HTTP Request
   │
2. Express Middleware
   ├── CORS
   ├── Cookie Parser
   ├── Body Parser
   └── Static Files
   │
3. tRPC Handler
   ├── Context Creation (User, DB)
   ├── Input Validation (Zod)
   └── Procedure Execution
   │
4. Router/Procedure
   ├── Authorization Check
   ├── Business Logic
   └── Database Query
   │
5. Response
   └── JSON (tRPC Format)
```

### Service-Layer

Die Business Logic ist in Services gekapselt, die von den Routern verwendet werden:

**Email Service (`services/email.ts`):**
Versendet E-Mail-Benachrichtigungen über Nodemailer. Unterstützt verschiedene Benachrichtigungstypen wie neue Leads, Bewertungen, Kommentare und Newsletter-Abonnements.

**Magic Link Service (`services/magicLink.ts`):**
Implementiert die passwortlose Authentifizierung. Generiert 6-stellige Codes, validiert diese und verwaltet Sessions.

**Spam Service (`services/spam.ts`):**
Analysiert Kommentare und Bewertungen auf Spam-Indikatoren. Verwendet Keyword-Listen, URL-Erkennung und Muster-Analyse.

---

## Datenbank-Architektur

### Schema-Design

Das Datenbankschema ist mit Drizzle ORM definiert und folgt relationalen Design-Prinzipien:

```
┌─────────────────┐     ┌─────────────────┐
│    platforms    │     │   api_pricing   │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ platformId (FK) │
│ slug            │     │ modelName       │
│ name            │     │ inputPrice      │
│ company         │     │ outputPrice     │
│ description     │     │ languages[]     │
│ features[]      │     │ capabilities[]  │
│ compliance[]    │     └─────────────────┘
│ ...             │
└─────────────────┘
        │
        │ 1:n
        ▼
┌─────────────────┐     ┌─────────────────┐
│     reviews     │     │      leads      │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ platformId (FK) │     │ platformId (FK) │
│ rating          │     │ name            │
│ content         │     │ email           │
│ status          │     │ company         │
│ ...             │     │ status          │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   blog_posts    │     │    comments     │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ postId (FK)     │
│ slug            │     │ authorName      │
│ title           │     │ content         │
│ content         │     │ status          │
│ isPublished     │     └─────────────────┘
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     members     │     │   magic_links   │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ memberId (FK)   │
│ email           │     │ code            │
│ name            │     │ expiresAt       │
│ bio             │     │ usedAt          │
└─────────────────┘     └─────────────────┘
```

### Tabellen-Übersicht

| Tabelle | Beschreibung | Beziehungen |
|---------|--------------|-------------|
| `platforms` | LLM-Plattformen | 1:n zu api_pricing, reviews, leads |
| `api_pricing` | Modell-Preise | n:1 zu platforms |
| `reviews` | Nutzerbewertungen | n:1 zu platforms |
| `leads` | Kontaktanfragen | n:1 zu platforms |
| `blog_posts` | Blog-Artikel | 1:n zu comments |
| `comments` | Blog-Kommentare | n:1 zu blog_posts |
| `members` | Registrierte Mitglieder | 1:n zu magic_links |
| `magic_links` | Login-Codes | n:1 zu members |
| `newsletter_subscribers` | Newsletter-Abonnenten | - |
| `suggestions` | Plattform-Vorschläge | - |

---

## Authentifizierung

Das Projekt implementiert zwei Authentifizierungsmethoden:

### OAuth 2.0 (Admin)

Für Admin-Benutzer wird OAuth 2.0 verwendet. Der Flow:

```
1. User klickt "Anmelden"
2. Redirect zu OAuth-Provider
3. User authentifiziert sich
4. Callback mit Authorization Code
5. Server tauscht Code gegen Token
6. Session-Cookie wird gesetzt
7. User ist eingeloggt
```

### Magic Link (Mitglieder)

Für reguläre Mitglieder wird eine passwortlose Authentifizierung verwendet:

```
1. User gibt E-Mail ein
2. Server generiert 6-stelligen Code
3. Code wird per E-Mail gesendet
4. User gibt Code ein
5. Server validiert Code
6. JWT-Token wird generiert
7. Session-Cookie wird gesetzt
```

Die Magic-Link-Implementierung bietet:
- Codes sind 15 Minuten gültig
- Maximal 3 Versuche pro Code
- Rate-Limiting pro IP-Adresse
- Automatische Code-Invalidierung nach Verwendung

---

## Sicherheit

### Implementierte Maßnahmen

| Maßnahme | Beschreibung |
|----------|--------------|
| **CORS** | Eingeschränkte Origins |
| **CSRF** | SameSite Cookies |
| **XSS** | React's automatisches Escaping |
| **SQL Injection** | Prepared Statements (Drizzle) |
| **Input Validation** | Zod Schema-Validierung |
| **Spam Protection** | Automatische Spam-Erkennung |
| **Rate Limiting** | Magic-Link Code-Versuche |

### Cookie-Konfiguration

```typescript
{
  httpOnly: true,      // Kein JavaScript-Zugriff
  secure: true,        // Nur HTTPS (Production)
  sameSite: 'lax',     // CSRF-Schutz
  maxAge: 30 * 24 * 60 * 60 * 1000  // 30 Tage
}
```

---

## Performance

### Frontend-Optimierungen

| Optimierung | Implementierung |
|-------------|-----------------|
| Code Splitting | Vite automatisches Chunking |
| Lazy Loading | React.lazy für Routen |
| Caching | React Query mit staleTime |
| Bundle Size | Tree Shaking, Minification |

### Backend-Optimierungen

| Optimierung | Implementierung |
|-------------|-----------------|
| Connection Pooling | Drizzle/pg Pool |
| Query Optimization | Selektive Felder, Indizes |
| Response Compression | gzip (Express) |

---

## Deployment

### Entwicklung

```bash
pnpm dev  # Startet Vite + Express mit HMR
```

### Produktion

```bash
pnpm build  # Erstellt optimierten Build
pnpm start  # Startet Production Server
```

### Docker

```bash
docker-compose up -d  # Startet alle Services
```

Die Docker-Konfiguration umfasst:
- Multi-stage Build für optimale Image-Größe
- PostgreSQL mit Health-Checks
- Volume-Mounts für Persistenz
- Optionales pgAdmin für DB-Management

---

## Erweiterbarkeit

Das Projekt ist für Erweiterungen vorbereitet:

**Neue Plattformen:** Über Admin-Dashboard oder Seed-Script hinzufügen.

**Neue API-Endpunkte:** In `routers.ts` neue Procedures definieren.

**Neue UI-Komponenten:** In `components/` erstellen und in Pages einbinden.

**Neue Services:** In `services/` implementieren und in Router injizieren.

---

*Dokumentation erstellt mit Manus AI*
