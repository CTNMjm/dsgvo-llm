# LLM-Plattform Vergleich

Eine umfassende Vergleichsplattform für DSGVO-konforme KI- und LLM-Lösungen im deutschsprachigen Raum. Die Anwendung ermöglicht Unternehmen, die passende KI-Plattform basierend auf Preismodell, Funktionen, Compliance-Standards und Nutzerbewertungen zu finden.

---

## Funktionsübersicht

| Funktion | Beschreibung |
|----------|--------------|
| **Plattform-Vergleich** | Bis zu 3 Anbieter nebeneinander vergleichen mit Preisen, Features und Bewertungen |
| **API-Preise** | Detaillierte Modell-Preise mit Filtern nach Sprache, Funktion und Anbieter |
| **Bewertungssystem** | Nutzerbewertungen mit Erfahrungsberichten, Vorteilen und Nachteilen |
| **Blog** | Informative Artikel zu KI-Themen und DSGVO-Compliance |
| **Admin-Dashboard** | Moderation von Kommentaren, Bewertungen und Vorschlägen |
| **Magic-Link-Login** | Passwortlose Anmeldung per E-Mail-Code |

---

## Technologie-Stack

Die Anwendung basiert auf einem modernen Full-Stack-Setup mit folgenden Technologien:

| Bereich | Technologie |
|---------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express, tRPC |
| **Datenbank** | PostgreSQL mit Drizzle ORM |
| **Authentifizierung** | OAuth 2.0, Magic-Link (E-Mail-Code) |
| **Testing** | Vitest |
| **Containerisierung** | Docker, Docker Compose |

---

## Schnellstart

### Voraussetzungen

Stellen Sie sicher, dass folgende Software installiert ist:

- Node.js 22 oder höher
- pnpm (wird automatisch mit corepack aktiviert)
- PostgreSQL 16 oder Docker

### Installation

```bash
# Repository klonen
git clone https://github.com/CTNMjm/dsgvo-llm.git
cd dsgvo-llm

# Dependencies installieren
pnpm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# Bearbeiten Sie .env mit Ihren Datenbank-Credentials

# Datenbank initialisieren
pnpm db:push

# Beispieldaten importieren
npx tsx server/seed.ts
npx tsx server/seed-api-pricing.ts

# Entwicklungsserver starten
pnpm dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

### Docker-Entwicklung

Für eine containerisierte Entwicklungsumgebung:

```bash
# Container starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f app
```

Eine ausführliche Anleitung finden Sie in [docs/LOCAL-SETUP.md](docs/LOCAL-SETUP.md).

---

## Projektstruktur

```
llm-platform-compare/
├── client/                     # Frontend-Anwendung
│   ├── src/
│   │   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── pages/              # Seiten-Komponenten (Routing)
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── lib/                # Hilfsfunktionen und Utilities
│   │   └── _core/              # Core-Funktionalität (Auth, etc.)
│   └── index.html
├── server/                     # Backend-Anwendung
│   ├── services/               # Business Logic Services
│   │   ├── email.ts            # E-Mail-Versand
│   │   ├── magicLink.ts        # Magic-Link-Authentifizierung
│   │   └── spam.ts             # Spam-Erkennung
│   ├── __tests__/              # Unit-Tests
│   ├── routers.ts              # tRPC API-Routen
│   ├── db.ts                   # Datenbank-Funktionen
│   └── _core/                  # Server-Core (Express, tRPC)
├── drizzle/                    # Datenbank-Schema
│   └── schema.ts               # Tabellendefinitionen
├── docs/                       # Dokumentation
├── .devcontainer/              # VS Code Dev Container
├── docker-compose.yml          # Docker Compose Konfiguration
├── Dockerfile                  # Docker Image Definition
└── package.json                # Projekt-Dependencies
```

---

## Verfügbare Skripte

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm dev` | Startet den Entwicklungsserver mit Hot-Reload |
| `pnpm build` | Erstellt einen Produktions-Build |
| `pnpm test` | Führt alle Unit-Tests aus |
| `pnpm db:push` | Synchronisiert das Datenbank-Schema |
| `pnpm db:studio` | Öffnet Drizzle Studio (Datenbank-UI) |

---

## Umgebungsvariablen

| Variable | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `DATABASE_URL` | PostgreSQL Verbindungs-URL | Ja |
| `JWT_SECRET` | Geheimer Schlüssel für JWT-Token (min. 32 Zeichen) | Ja |
| `SMTP_HOST` | SMTP-Server für E-Mail-Versand | Nein |
| `SMTP_PORT` | SMTP-Port (Standard: 587) | Nein |
| `SMTP_USER` | SMTP-Benutzername | Nein |
| `SMTP_PASS` | SMTP-Passwort | Nein |
| `ADMIN_EMAIL` | E-Mail für Admin-Benachrichtigungen | Nein |

---

## API-Dokumentation

Die API basiert auf tRPC und bietet typsichere Endpunkte. Eine vollständige Dokumentation finden Sie in [docs/API.md](docs/API.md).

### Wichtige Endpunkte

| Endpunkt | Beschreibung |
|----------|--------------|
| `platforms.getAll` | Alle Plattformen abrufen |
| `platforms.getBySlug` | Einzelne Plattform nach Slug |
| `apiPricing.getAll` | Alle API-Preise mit Filtern |
| `reviews.create` | Neue Bewertung erstellen |
| `comments.create` | Neuen Kommentar erstellen |
| `memberAuth.requestCode` | Magic-Link-Code anfordern |

---

## Datenbank-Schema

Die Anwendung verwendet folgende Haupttabellen:

| Tabelle | Beschreibung |
|---------|--------------|
| `platforms` | LLM-Plattformen mit Details |
| `api_pricing` | Modell-Preise pro Plattform |
| `reviews` | Nutzerbewertungen |
| `comments` | Blog-Kommentare |
| `blog_posts` | Blog-Artikel |
| `members` | Registrierte Mitglieder |
| `magic_links` | Einmal-Codes für Login |
| `leads` | Kontaktanfragen |
| `newsletter_subscribers` | Newsletter-Abonnenten |
| `suggestions` | Nutzervorschläge |

---

## Tests

Die Anwendung enthält 51 Unit-Tests, die alle kritischen Funktionen abdecken:

```bash
# Alle Tests ausführen
pnpm test

# Tests mit Coverage
pnpm test -- --coverage

# Einzelne Test-Datei
pnpm test server/__tests__/api.test.ts
```

---

## Deployment

### Manus-Hosting

Die einfachste Deployment-Option ist das integrierte Manus-Hosting:

1. Checkpoint erstellen
2. Auf "Publish" klicken
3. Domain konfigurieren (optional)

### Docker-Deployment

Für selbst gehostete Deployments:

```bash
# Production Image bauen
docker build --target production -t llm-platform:latest .

# Container starten
docker run -d -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  llm-platform:latest
```

---

## Mitwirken

Beiträge sind willkommen! Bitte beachten Sie folgende Schritte:

1. Fork des Repositories erstellen
2. Feature-Branch erstellen (`git checkout -b feature/neue-funktion`)
3. Änderungen committen (`git commit -m 'Neue Funktion hinzugefügt'`)
4. Branch pushen (`git push origin feature/neue-funktion`)
5. Pull Request erstellen

---

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details.

---

## Kontakt

Bei Fragen oder Feedback wenden Sie sich an den Projektbetreuer oder erstellen Sie ein Issue im GitHub-Repository.

---

*Erstellt mit Manus AI*
