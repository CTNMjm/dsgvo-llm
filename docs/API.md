# API-Dokumentation

Diese Dokumentation beschreibt die tRPC-API des LLM-Plattform Vergleich Projekts. Die API ist typsicher und bietet automatische Validierung der Eingabedaten.

---

## Übersicht

Die API ist in mehrere Router unterteilt, die jeweils einen Funktionsbereich abdecken. Alle Endpunkte sind über den tRPC-Client erreichbar und bieten vollständige TypeScript-Unterstützung.

| Router | Beschreibung | Authentifizierung |
|--------|--------------|-------------------|
| `auth` | OAuth-Authentifizierung | Öffentlich |
| `memberAuth` | Magic-Link-Login für Mitglieder | Öffentlich |
| `platforms` | Plattform-Daten | Öffentlich |
| `blog` | Blog-Artikel | Öffentlich / Admin |
| `comments` | Kommentare | Öffentlich / Admin |
| `reviews` | Bewertungen | Öffentlich / Admin |
| `apiPricing` | API-Preise | Öffentlich / Admin |
| `leads` | Kontaktanfragen | Öffentlich / Admin |
| `newsletter` | Newsletter-Abonnements | Öffentlich / Admin |
| `suggestions` | Nutzervorschläge | Öffentlich / Admin |

---

## Authentifizierung

### OAuth (Admin)

Die Admin-Authentifizierung erfolgt über OAuth 2.0. Nach erfolgreicher Anmeldung wird ein Session-Cookie gesetzt.

```typescript
// Aktuellen Benutzer abrufen
const user = await trpc.auth.me.query();

// Abmelden
await trpc.auth.logout.mutate();
```

### Magic-Link (Mitglieder)

Mitglieder können sich per E-Mail-Code anmelden. Der Prozess umfasst zwei Schritte: Code anfordern und Code verifizieren.

```typescript
// Code anfordern
await trpc.memberAuth.requestCode.mutate({ 
  email: "nutzer@example.com" 
});

// Code verifizieren
const result = await trpc.memberAuth.verifyCode.mutate({ 
  email: "nutzer@example.com", 
  code: "123456" 
});

// Aktuelles Mitglied abrufen
const member = await trpc.memberAuth.me.query();

// Profil aktualisieren
await trpc.memberAuth.updateProfile.mutate({
  name: "Max Mustermann",
  bio: "KI-Enthusiast"
});

// Abmelden
await trpc.memberAuth.logout.mutate();
```

---

## Plattformen

Der `platforms`-Router bietet Zugriff auf die LLM-Plattform-Daten.

### platforms.list

Ruft alle Plattformen ab.

```typescript
const platforms = await trpc.platforms.list.query();
```

**Rückgabe:** Array von Plattform-Objekten mit allen Details.

### platforms.getBySlug

Ruft eine einzelne Plattform anhand des URL-Slugs ab.

```typescript
const platform = await trpc.platforms.getBySlug.query({ 
  slug: "openai" 
});
```

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `slug` | `string` | URL-freundlicher Bezeichner |

### platforms.getById

Ruft eine einzelne Plattform anhand der ID ab.

```typescript
const platform = await trpc.platforms.getById.query({ 
  id: 1 
});
```

### platforms.search

Durchsucht Plattformen nach Name, Firma oder Features.

```typescript
const results = await trpc.platforms.search.query({
  query: "GPT",
  pricingModel: "subscription"
});
```

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `query` | `string?` | Suchbegriff |
| `pricingModel` | `string?` | Filter nach Preismodell |

---

## Blog

Der `blog`-Router verwaltet Blog-Artikel.

### blog.list

Ruft alle veröffentlichten Blog-Artikel ab.

```typescript
const posts = await trpc.blog.list.query();
```

### blog.listAll (Admin)

Ruft alle Blog-Artikel ab, einschließlich unveröffentlichter.

```typescript
const allPosts = await trpc.blog.listAll.query();
```

### blog.getBySlug

Ruft einen einzelnen Artikel anhand des Slugs ab.

```typescript
const post = await trpc.blog.getBySlug.query({ 
  slug: "ki-trends-2026" 
});
```

### blog.create (Admin)

Erstellt einen neuen Blog-Artikel.

```typescript
await trpc.blog.create.mutate({
  slug: "neuer-artikel",
  title: "Neuer Artikel",
  content: "Artikelinhalt...",
  author: "Max Mustermann",
  excerpt: "Kurzbeschreibung",
  category: "KI-News",
  readTime: "5 min",
  isPublished: true
});
```

### blog.update (Admin)

Aktualisiert einen bestehenden Artikel.

```typescript
await trpc.blog.update.mutate({
  id: 1,
  updates: {
    title: "Aktualisierter Titel",
    isPublished: false
  }
});
```

---

## Kommentare

Der `comments`-Router verwaltet Blog-Kommentare mit automatischer Spam-Erkennung.

### comments.listByPost

Ruft alle genehmigten Kommentare für einen Artikel ab.

```typescript
const comments = await trpc.comments.listByPost.query({ 
  postId: 1 
});
```

### comments.listAll (Admin)

Ruft alle Kommentare ab, einschließlich ausstehender.

```typescript
const allComments = await trpc.comments.listAll.query();
```

### comments.create

Erstellt einen neuen Kommentar. Der Kommentar durchläuft automatisch die Spam-Erkennung.

```typescript
await trpc.comments.create.mutate({
  postId: 1,
  authorName: "Max Mustermann",
  authorEmail: "max@example.com",
  content: "Toller Artikel!"
});
```

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `postId` | `number` | ID des Blog-Artikels |
| `authorName` | `string` | Name des Kommentators |
| `authorEmail` | `string?` | E-Mail (optional) |
| `content` | `string` | Kommentartext |

### comments.updateStatus (Admin)

Ändert den Status eines Kommentars.

```typescript
await trpc.comments.updateStatus.mutate({
  id: 1,
  status: "approved" // oder "rejected", "pending"
});
```

### comments.bulkUpdateStatus (Admin)

Ändert den Status mehrerer Kommentare gleichzeitig.

```typescript
await trpc.comments.bulkUpdateStatus.mutate({
  ids: [1, 2, 3],
  status: "approved"
});
```

---

## Bewertungen

Der `reviews`-Router verwaltet Plattform-Bewertungen.

### reviews.listByPlatform

Ruft alle genehmigten Bewertungen für eine Plattform ab.

```typescript
const reviews = await trpc.reviews.listByPlatform.query({ 
  platformId: 1 
});
```

### reviews.listAll (Admin)

Ruft alle Bewertungen ab.

```typescript
const allReviews = await trpc.reviews.listAll.query();
```

### reviews.create

Erstellt eine neue Bewertung.

```typescript
await trpc.reviews.create.mutate({
  platformId: 1,
  authorName: "Max Mustermann",
  authorEmail: "max@example.com",
  rating: 5,
  title: "Hervorragende Plattform",
  content: "Sehr zufrieden mit dem Service...",
  company: "Muster GmbH",
  useCase: "Kundenservice-Automatisierung",
  usageDuration: "6-12 Monate",
  teamSize: "11-50",
  pros: "Einfache Integration, guter Support",
  cons: "Preise könnten transparenter sein"
});
```

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `platformId` | `number` | ID der Plattform |
| `authorName` | `string` | Name des Bewerters |
| `authorEmail` | `string?` | E-Mail (optional) |
| `rating` | `number` | Bewertung 1-5 |
| `title` | `string` | Titel der Bewertung |
| `content` | `string` | Bewertungstext |
| `company` | `string?` | Firmenname |
| `useCase` | `string?` | Anwendungsfall |
| `usageDuration` | `string?` | Nutzungsdauer |
| `teamSize` | `string?` | Team-Größe |
| `pros` | `string?` | Vorteile |
| `cons` | `string?` | Nachteile |

### reviews.updateStatus (Admin)

Ändert den Status einer Bewertung.

```typescript
await trpc.reviews.updateStatus.mutate({
  id: 1,
  status: "approved"
});
```

### reviews.bulkUpdateStatus (Admin)

Ändert den Status mehrerer Bewertungen gleichzeitig.

```typescript
await trpc.reviews.bulkUpdateStatus.mutate({
  ids: [1, 2, 3],
  status: "approved"
});
```

---

## API-Preise

Der `apiPricing`-Router verwaltet Modell-Preise.

### apiPricing.getAll

Ruft alle API-Preise mit optionalen Filtern ab.

```typescript
const prices = await trpc.apiPricing.getAll.query({
  platformId: 1,
  language: "de",
  capability: "chat"
});
```

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `platformId` | `number?` | Filter nach Plattform |
| `language` | `string?` | Filter nach Sprache |
| `capability` | `string?` | Filter nach Funktion |

### apiPricing.getByPlatform

Ruft alle Preise für eine bestimmte Plattform ab.

```typescript
const prices = await trpc.apiPricing.getByPlatform.query({ 
  platformId: 1 
});
```

### apiPricing.create (Admin)

Erstellt einen neuen Preiseintrag.

```typescript
await trpc.apiPricing.create.mutate({
  platformId: 1,
  modelName: "GPT-4o",
  inputPrice: "2.50",
  outputPrice: "10.00",
  contextWindow: 128000,
  languages: ["de", "en", "fr"],
  capabilities: ["chat", "vision", "code"]
});
```

### apiPricing.update (Admin)

Aktualisiert einen bestehenden Preiseintrag.

```typescript
await trpc.apiPricing.update.mutate({
  id: 1,
  updates: {
    inputPrice: "2.00",
    outputPrice: "8.00"
  }
});
```

### apiPricing.delete (Admin)

Löscht einen Preiseintrag.

```typescript
await trpc.apiPricing.delete.mutate({ id: 1 });
```

---

## Leads

Der `leads`-Router verwaltet Kontaktanfragen.

### leads.create

Erstellt eine neue Kontaktanfrage.

```typescript
await trpc.leads.create.mutate({
  platformId: 1,
  name: "Max Mustermann",
  email: "max@example.com",
  company: "Muster GmbH",
  phone: "+49 123 456789",
  message: "Interesse an einer Demo...",
  source: "platform_detail"
});
```

### leads.listAll (Admin)

Ruft alle Kontaktanfragen ab.

```typescript
const leads = await trpc.leads.listAll.query();
```

### leads.updateStatus (Admin)

Ändert den Status einer Anfrage.

```typescript
await trpc.leads.updateStatus.mutate({
  id: 1,
  status: "contacted"
});
```

---

## Newsletter

Der `newsletter`-Router verwaltet Newsletter-Abonnements.

### newsletter.subscribe

Meldet eine E-Mail-Adresse für den Newsletter an.

```typescript
await trpc.newsletter.subscribe.mutate({
  email: "max@example.com",
  name: "Max Mustermann"
});
```

### newsletter.listAll (Admin)

Ruft alle Abonnenten ab.

```typescript
const subscribers = await trpc.newsletter.listAll.query();
```

### newsletter.unsubscribe

Meldet eine E-Mail-Adresse ab.

```typescript
await trpc.newsletter.unsubscribe.mutate({
  email: "max@example.com"
});
```

---

## Vorschläge

Der `suggestions`-Router verwaltet Nutzervorschläge für neue Plattformen.

### suggestions.create

Erstellt einen neuen Vorschlag.

```typescript
await trpc.suggestions.create.mutate({
  platformName: "Neue KI-Plattform",
  platformUrl: "https://example.com",
  description: "Interessante Features...",
  submitterEmail: "max@example.com"
});
```

### suggestions.listAll (Admin)

Ruft alle Vorschläge ab.

```typescript
const suggestions = await trpc.suggestions.listAll.query();
```

### suggestions.updateStatus (Admin)

Ändert den Status eines Vorschlags.

```typescript
await trpc.suggestions.updateStatus.mutate({
  id: 1,
  status: "reviewed"
});
```

---

## Fehlerbehandlung

Die API verwendet standardisierte tRPC-Fehlercodes:

| Code | Beschreibung |
|------|--------------|
| `NOT_FOUND` | Ressource nicht gefunden |
| `UNAUTHORIZED` | Authentifizierung erforderlich |
| `FORBIDDEN` | Keine Berechtigung |
| `BAD_REQUEST` | Ungültige Eingabedaten |
| `INTERNAL_SERVER_ERROR` | Serverfehler |

Beispiel für Fehlerbehandlung im Client:

```typescript
try {
  const platform = await trpc.platforms.getBySlug.query({ slug: "invalid" });
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('Plattform nicht gefunden');
  }
}
```

---

## Rate Limiting

Die API implementiert derzeit kein explizites Rate Limiting. Für Produktionsumgebungen wird empfohlen, ein Rate Limiting auf Reverse-Proxy-Ebene (z.B. nginx) zu konfigurieren.

---

## Versionierung

Die API ist derzeit nicht versioniert. Breaking Changes werden in den Release Notes dokumentiert.

---

*Dokumentation erstellt mit Manus AI*
