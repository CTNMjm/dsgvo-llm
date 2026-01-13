# PostgreSQL Seed-Daten Import Anleitung

Diese Anleitung erklärt Schritt für Schritt, wie Sie die Seed-Daten in Ihre PostgreSQL-Datenbank importieren.

## Voraussetzungen

- PostgreSQL-Datenbank (lokal oder auf Coolify/Server)
- Zugriff auf die Datenbank via `psql` oder einem GUI-Tool
- Das Projekt-Repository geklont

## Schritt 1: Datenbank-Verbindung vorbereiten

### Verbindungs-URL Format

```
postgresql://BENUTZER:PASSWORT@HOST:PORT/DATENBANKNAME?sslmode=require
```

### Beispiele

**Lokale PostgreSQL:**
```bash
export DATABASE_URL="postgresql://postgres:meinpasswort@localhost:5432/llm_platform"
```

**Coolify PostgreSQL:**
```bash
export DATABASE_URL="postgresql://llm_user:geheimespasswort@llm-db:5432/llm_platform?sslmode=require"
```

**Externe Anbieter (Supabase, Neon, etc.):**
```bash
export DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/postgres?sslmode=require"
```

## Schritt 2: Datenbank-Schema erstellen

Bevor Sie die Seed-Daten importieren können, müssen die Tabellen existieren.

### Option A: Mit Drizzle (empfohlen)

```bash
# Im Projektverzeichnis
cd /pfad/zum/projekt

# Schema in die Datenbank pushen
pnpm db:push
```

### Option B: Manuell mit SQL

Falls Drizzle nicht verfügbar ist, können Sie die Tabellen manuell erstellen. Die Schema-Definition finden Sie in `drizzle/schema.ts`.

## Schritt 3: Seed-Daten importieren

### Option A: Über die Kommandozeile (empfohlen)

```bash
# Mit psql direkt
psql $DATABASE_URL -f drizzle/seeds/seed-postgres.sql

# Oder mit expliziter URL
psql "postgresql://user:pass@host:5432/db" -f drizzle/seeds/seed-postgres.sql
```

### Option B: Über Coolify Terminal

1. Öffnen Sie das Coolify Dashboard
2. Gehen Sie zu Ihrer Anwendung → **Terminal**
3. Führen Sie aus:

```bash
cd /app
psql $DATABASE_URL -f drizzle/seeds/seed-postgres.sql
```

### Option C: Mit einem GUI-Tool (DBeaver, pgAdmin, etc.)

1. Verbinden Sie sich mit Ihrer Datenbank
2. Öffnen Sie ein neues SQL-Fenster
3. Kopieren Sie den Inhalt von `drizzle/seeds/seed-postgres.sql`
4. Führen Sie das Script aus

### Option D: Einzelne Tabellen importieren

Falls Sie nur bestimmte Daten importieren möchten:

```bash
# Nur Plattformen
psql $DATABASE_URL -f drizzle/seeds/01-platforms.sql

# Nur API-Preise
psql $DATABASE_URL -f drizzle/seeds/02-api-pricing.sql

# Nur Blog-Artikel
psql $DATABASE_URL -f drizzle/seeds/03-blog-posts.sql
```

## Schritt 4: Import überprüfen

Nach dem Import können Sie die Daten überprüfen:

```bash
# Verbindung zur Datenbank
psql $DATABASE_URL

# Anzahl der Einträge prüfen
SELECT 'Plattformen' as tabelle, COUNT(*) as anzahl FROM platforms
UNION ALL
SELECT 'API-Preise', COUNT(*) FROM api_pricing
UNION ALL
SELECT 'Blog-Artikel', COUNT(*) FROM blog_posts;
```

Erwartete Ausgabe:
```
   tabelle    | anzahl
--------------+--------
 Plattformen  |     12
 API-Preise   |     48
 Blog-Artikel |      3
```

## Fehlerbehebung

### Fehler: "relation does not exist"

**Ursache:** Die Tabellen wurden noch nicht erstellt.

**Lösung:**
```bash
pnpm db:push
```

### Fehler: "duplicate key value violates unique constraint"

**Ursache:** Die Daten wurden bereits importiert.

**Lösung:** Das Seed-Script löscht automatisch bestehende Daten. Falls das nicht funktioniert:
```sql
DELETE FROM api_pricing;
DELETE FROM blog_posts;
DELETE FROM platforms;
```

### Fehler: "permission denied"

**Ursache:** Der Datenbankbenutzer hat keine Schreibrechte.

**Lösung:** Stellen Sie sicher, dass der Benutzer die nötigen Rechte hat:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ihr_benutzer;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ihr_benutzer;
```

### Fehler: "SSL required"

**Ursache:** Die Datenbank erfordert SSL, aber die Verbindung ist unverschlüsselt.

**Lösung:** Fügen Sie `?sslmode=require` zur DATABASE_URL hinzu.

### Fehler: "syntax error" bei JSON-Feldern

**Ursache:** Möglicherweise ein Encoding-Problem.

**Lösung:** Stellen Sie sicher, dass die Datei als UTF-8 gespeichert ist:
```bash
file drizzle/seeds/seed-postgres.sql
# Sollte "UTF-8 Unicode text" anzeigen
```

## Vollständiges Beispiel

Hier ein komplettes Beispiel für den Import auf einem frischen System:

```bash
# 1. Repository klonen
git clone https://github.com/CTNMjm/dsgvo-llm.git
cd dsgvo-llm

# 2. Abhängigkeiten installieren
pnpm install

# 3. Umgebungsvariablen setzen
export DATABASE_URL="postgresql://user:pass@localhost:5432/llm_platform"

# 4. Schema erstellen
pnpm db:push

# 5. Seed-Daten importieren
psql $DATABASE_URL -f drizzle/seeds/seed-postgres.sql

# 6. Überprüfen
psql $DATABASE_URL -c "SELECT COUNT(*) FROM platforms;"
```

## Inhalt der Seed-Daten

### Plattformen (12 Einträge)

| Name | Unternehmen | Standort |
|------|-------------|----------|
| Langdock | Langdock GmbH | Berlin |
| ka1.ai | kai.zen GmbH | Zwönitz |
| Logicc | Logicc GmbH | Hamburg |
| Plotdesk | Plotdesk | Deutschland |
| kamium | Zweitag GmbH | Münster |
| patris.ai | patris | Deutschland |
| BaseGPT | BaseGPT | Deutschland |
| DSGPT | Next Strategy AI GmbH | Hamburg |
| nele.ai | GAL Digital GmbH | Hungen |
| amberAI | AmberSearch GmbH | Aachen/Köln |
| AI-UI (AIVA) | AI-UI | Thüringen |
| Mistral Le Chat | Mistral AI | Paris (FR) |

### API-Preise (48 Einträge)

Preise für verschiedene Modelle (Claude, GPT-4o, Gemini, Mistral, Llama) pro Plattform.

### Blog-Artikel (3 Einträge)

1. Die ultimative DSGVO-Checkliste für LLM-Plattformen
2. KI im Unternehmen erfolgreich einführen
3. Wie man KI-Tools in Unternehmen implementiert

## Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/CTNMjm/dsgvo-llm/issues
