# Entwickler-Leitfaden

Dieser Leitfaden richtet sich an Entwickler, die am LLM-Plattform Vergleich Projekt mitarbeiten möchten. Er beschreibt die Entwicklungsumgebung, Coding-Standards und Best Practices.

---

## Entwicklungsumgebung einrichten

### Voraussetzungen

Stellen Sie sicher, dass folgende Tools installiert sind:

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 22+ | [nodejs.org](https://nodejs.org) |
| pnpm | 8+ | `corepack enable && corepack prepare pnpm@latest --activate` |
| PostgreSQL | 16+ | [postgresql.org](https://www.postgresql.org) oder Docker |
| Git | 2.30+ | [git-scm.com](https://git-scm.com) |

### Projekt klonen und starten

```bash
# Repository klonen
git clone https://github.com/CTNMjm/dsgvo-llm.git
cd dsgvo-llm

# Dependencies installieren
pnpm install

# Datenbank konfigurieren (siehe .env.example)
# DATABASE_URL=postgresql://user:pass@localhost:5432/llm_platform

# Datenbank initialisieren
pnpm db:push

# Seed-Daten importieren
npx tsx server/seed.ts
npx tsx server/seed-api-pricing.ts

# Entwicklungsserver starten
pnpm dev
```

Die Anwendung ist unter [http://localhost:3000](http://localhost:3000) erreichbar.

### VS Code Empfehlungen

Für die beste Entwicklungserfahrung empfehlen wir folgende VS Code Extensions:

| Extension | Zweck |
|-----------|-------|
| ESLint | Code-Linting |
| Prettier | Code-Formatierung |
| Tailwind CSS IntelliSense | CSS-Autovervollständigung |
| Prisma | Schema-Highlighting |
| Auto Rename Tag | HTML/JSX Tag-Synchronisation |

Die empfohlenen Extensions sind in `.vscode/extensions.json` definiert.

---

## Projektstruktur verstehen

### Wichtige Verzeichnisse

```
llm-platform-compare/
├── client/               # Frontend (React)
│   └── src/
│       ├── components/   # UI-Komponenten
│       ├── pages/        # Seiten (Routing)
│       ├── hooks/        # Custom Hooks
│       └── lib/          # Utilities
├── server/               # Backend (Express + tRPC)
│   ├── services/         # Business Logic
│   ├── __tests__/        # Unit-Tests
│   ├── routers.ts        # API-Endpunkte
│   └── db.ts             # Datenbank-Funktionen
├── drizzle/              # Datenbank-Schema
│   └── schema.ts         # Tabellendefinitionen
└── docs/                 # Dokumentation
```

### Wichtige Dateien

| Datei | Beschreibung |
|-------|--------------|
| `server/routers.ts` | Alle tRPC API-Endpunkte |
| `server/db.ts` | Datenbank-Abfragen |
| `drizzle/schema.ts` | Datenbank-Schema |
| `client/src/App.tsx` | Routing-Konfiguration |
| `client/src/lib/trpc.ts` | tRPC-Client |

---

## Neue Features entwickeln

### 1. Datenbank-Änderungen

Wenn Ihr Feature neue Tabellen oder Spalten benötigt:

```typescript
// drizzle/schema.ts
export const newTable = pgTable('new_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

Schema zur Datenbank pushen:

```bash
pnpm db:push
```

### 2. Backend-Logik

Erstellen Sie Datenbank-Funktionen in `server/db.ts`:

```typescript
// server/db.ts
export async function createNewItem(data: NewItemData) {
  const db = await getDb();
  return db.insert(newTable).values(data).returning();
}

export async function getAllNewItems() {
  const db = await getDb();
  return db.select().from(newTable);
}
```

Fügen Sie API-Endpunkte in `server/routers.ts` hinzu:

```typescript
// server/routers.ts
newItems: router({
  list: publicProcedure.query(async () => {
    return db.getAllNewItems();
  }),
  
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return db.createNewItem(input);
    }),
}),
```

### 3. Frontend-Komponenten

Erstellen Sie eine neue Seite in `client/src/pages/`:

```tsx
// client/src/pages/NewFeature.tsx
import { trpc } from "@/lib/trpc";

export default function NewFeature() {
  const { data: items, isLoading } = trpc.newItems.list.useQuery();
  
  if (isLoading) return <div>Laden...</div>;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Neue Funktion</h1>
      {items?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

Fügen Sie die Route in `client/src/App.tsx` hinzu:

```tsx
import NewFeature from "./pages/NewFeature";

// In der Routes-Komponente:
<Route path="/new-feature" element={<NewFeature />} />
```

### 4. Tests schreiben

Erstellen Sie Tests in `server/__tests__/`:

```typescript
// server/__tests__/new-feature.test.ts
import { describe, it, expect } from 'vitest';

describe('New Feature', () => {
  it('should create a new item', async () => {
    // Test-Logik
    expect(result).toBeDefined();
  });
});
```

Tests ausführen:

```bash
pnpm test
```

---

## Coding-Standards

### TypeScript

Verwenden Sie strenge TypeScript-Typisierung:

```typescript
// Gut
interface Platform {
  id: number;
  name: string;
  features: string[];
}

function getPlatform(id: number): Promise<Platform | null> {
  // ...
}

// Vermeiden
function getPlatform(id: any): any {
  // ...
}
```

### React-Komponenten

Verwenden Sie funktionale Komponenten mit Hooks:

```tsx
// Gut
export function PlatformCard({ platform }: { platform: Platform }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="rounded-lg border p-4">
      <h3>{platform.name}</h3>
      {isExpanded && <p>{platform.description}</p>}
    </div>
  );
}

// Vermeiden: Klassen-Komponenten
```

### Tailwind CSS

Verwenden Sie Tailwind-Klassen konsistent:

```tsx
// Gut: Utility-Klassen
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">

// Vermeiden: Inline-Styles
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### Datei-Benennung

| Typ | Konvention | Beispiel |
|-----|------------|----------|
| Komponenten | PascalCase | `PlatformCard.tsx` |
| Hooks | camelCase mit `use` | `useMember.ts` |
| Utilities | camelCase | `formatPrice.ts` |
| Tests | `*.test.ts` | `api.test.ts` |

---

## Git-Workflow

### Branch-Strategie

| Branch | Zweck |
|--------|-------|
| `main` | Produktions-Code |
| `feature/*` | Neue Features |
| `fix/*` | Bugfixes |
| `docs/*` | Dokumentation |

### Commit-Messages

Verwenden Sie aussagekräftige Commit-Messages:

```bash
# Gut
git commit -m "feat: Add API pricing filter by language"
git commit -m "fix: Correct spam detection for URLs"
git commit -m "docs: Update API documentation"

# Vermeiden
git commit -m "Update"
git commit -m "Fix bug"
```

### Pull Request erstellen

1. Feature-Branch erstellen:
   ```bash
   git checkout -b feature/new-filter
   ```

2. Änderungen committen:
   ```bash
   git add .
   git commit -m "feat: Add new filter functionality"
   ```

3. Branch pushen:
   ```bash
   git push origin feature/new-filter
   ```

4. Pull Request auf GitHub erstellen

5. Code-Review abwarten

6. Nach Genehmigung: Merge in `main`

---

## Datenbank-Migrationen

### Schema-Änderungen

Bei Schema-Änderungen:

```bash
# Schema in schema.ts bearbeiten
# Dann pushen:
pnpm db:push
```

Für Produktions-Deployments sollten Sie Migrationen verwenden:

```bash
# Migration generieren
pnpm db:generate

# Migration ausführen
pnpm db:migrate
```

### Seed-Daten aktualisieren

Neue Plattformen in `server/seed.ts` hinzufügen:

```typescript
const platforms = [
  // Bestehende Plattformen...
  {
    slug: 'neue-plattform',
    name: 'Neue Plattform',
    company: 'Firma GmbH',
    // ...
  },
];
```

Seed ausführen:

```bash
npx tsx server/seed.ts
```

---

## Debugging

### Server-Logs

Der Server loggt wichtige Ereignisse:

```typescript
console.log(`[Spam] Comment from ${authorName}: score=${score}`);
console.log(`[Email] Sent notification to ${email}`);
```

Logs im Terminal beobachten:

```bash
pnpm dev
# Oder bei Docker:
docker-compose logs -f app
```

### Datenbank inspizieren

Drizzle Studio öffnen:

```bash
pnpm db:studio
```

Oder pgAdmin unter [http://localhost:5050](http://localhost:5050) (bei Docker).

### tRPC DevTools

Im Browser können Sie die React Query DevTools verwenden, um API-Aufrufe zu inspizieren.

---

## Performance-Tipps

### Frontend

Verwenden Sie `useMemo` und `useCallback` für teure Berechnungen:

```tsx
const filteredPlatforms = useMemo(() => {
  return platforms.filter(p => p.name.includes(search));
}, [platforms, search]);
```

### Backend

Verwenden Sie selektive Queries:

```typescript
// Gut: Nur benötigte Felder
const platforms = await db
  .select({ id: platforms.id, name: platforms.name })
  .from(platforms);

// Vermeiden: Alle Felder
const platforms = await db.select().from(platforms);
```

---

## Häufige Probleme

### "Module not found"

```bash
# Dependencies neu installieren
rm -rf node_modules
pnpm install
```

### "Database connection failed"

Prüfen Sie die `DATABASE_URL` in `.env` und stellen Sie sicher, dass PostgreSQL läuft.

### "TypeScript errors"

```bash
# TypeScript-Fehler prüfen
npx tsc --noEmit
```

### "Tests fail"

```bash
# Einzelnen Test ausführen
pnpm test server/__tests__/api.test.ts
```

---

## Hilfe und Support

Bei Fragen oder Problemen:

1. Dokumentation in `docs/` lesen
2. Bestehende Issues auf GitHub prüfen
3. Neues Issue erstellen mit:
   - Problembeschreibung
   - Schritte zur Reproduktion
   - Erwartetes vs. tatsächliches Verhalten
   - Umgebungsinformationen

---

*Dokumentation erstellt mit Manus AI*
