# MySQL Seed-Daten Import Anleitung

Diese Anleitung erklärt, wie Sie die Seed-Daten in Ihre MySQL-Datenbank auf Coolify importieren.

## Voraussetzungen

- MySQL-Datenbank auf Coolify erstellt
- Zugriff auf die Datenbank via `mysql` CLI oder phpMyAdmin
- Das Projekt-Repository geklont

## Schritt 1: Datenbank-Schema erstellen

Bevor Sie die Seed-Daten importieren können, müssen die Tabellen existieren.

```bash
# Im Projektverzeichnis auf Coolify
cd /app

# Schema in die Datenbank pushen
pnpm db:push
```

## Schritt 2: Seed-Daten importieren

### Option A: Über die Kommandozeile (empfohlen)

```bash
# Mit mysql CLI
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/seed-all.sql

# Oder mit der vollständigen DATABASE_URL
# Beispiel: mysql://user:pass@host:3306/dbname
mysql -h HOST -P 3306 -u USER -pPASSWORD DBNAME < drizzle/seeds/seed-all.sql
```

### Option B: Über Coolify Terminal

1. Öffnen Sie das Coolify Dashboard
2. Gehen Sie zu Ihrer Anwendung → **Terminal**
3. Führen Sie aus:

```bash
cd /app
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/seed-all.sql
```

### Option C: Mit phpMyAdmin oder einem GUI-Tool

1. Öffnen Sie phpMyAdmin oder Ihr bevorzugtes MySQL-Tool
2. Wählen Sie die Datenbank aus
3. Gehen Sie zu **Import**
4. Wählen Sie die Datei `drizzle/seeds/seed-all.sql`
5. Klicken Sie auf **Ausführen**

### Option D: Einzelne Tabellen importieren

Falls Sie nur bestimmte Daten importieren möchten:

```bash
# Nur Plattformen
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/01-platforms.sql

# Nur API-Preise
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/02-api-pricing.sql

# Nur Blog-Artikel
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/03-blog-posts.sql
```

## Schritt 3: Import überprüfen

Nach dem Import können Sie die Daten überprüfen:

```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
SELECT 'Plattformen' as Tabelle, COUNT(*) as Anzahl FROM platforms
UNION ALL
SELECT 'API-Preise', COUNT(*) FROM api_pricing
UNION ALL
SELECT 'Blog-Artikel', COUNT(*) FROM blog_posts;
"
```

Erwartete Ausgabe:
```
+--------------+--------+
| Tabelle      | Anzahl |
+--------------+--------+
| Plattformen  |     12 |
| API-Preise   |     48 |
| Blog-Artikel |      3 |
+--------------+--------+
```

## Vollständiges Beispiel für Coolify

```bash
# 1. In das App-Verzeichnis wechseln
cd /app

# 2. Schema erstellen (falls noch nicht geschehen)
pnpm db:push

# 3. Seed-Daten importieren
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/seed-all.sql

# 4. Überprüfen
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) FROM platforms;"
```

## Umgebungsvariablen

Stellen Sie sicher, dass folgende Umgebungsvariablen in Coolify gesetzt sind:

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `DATABASE_URL` | Vollständige MySQL-URL | `mysql://user:pass@host:3306/dbname` |
| `DB_HOST` | Datenbank-Host | `mysql-db` oder IP |
| `DB_USER` | Datenbank-Benutzer | `llm_user` |
| `DB_PASSWORD` | Datenbank-Passwort | `geheimespasswort` |
| `DB_NAME` | Datenbank-Name | `llm_platform` |

## Fehlerbehebung

### Fehler: "Table doesn't exist"

**Ursache:** Die Tabellen wurden noch nicht erstellt.

**Lösung:**
```bash
pnpm db:push
```

### Fehler: "Duplicate entry"

**Ursache:** Die Daten wurden bereits importiert.

**Lösung:** Das Seed-Script löscht automatisch bestehende Daten mit `DELETE FROM`. Falls das nicht funktioniert:
```sql
DELETE FROM api_pricing;
DELETE FROM blog_posts;
DELETE FROM platforms;
```

### Fehler: "Access denied"

**Ursache:** Falsche Zugangsdaten.

**Lösung:** Überprüfen Sie die Umgebungsvariablen in Coolify.

## Inhalt der Seed-Daten

- **12 Plattformen**: Langdock, ka1.ai, Logicc, Plotdesk, kamium, patris.ai, BaseGPT, DSGPT, nele.ai, amberAI, AI-UI, Mistral
- **48 API-Preise**: Preise für verschiedene Modelle pro Plattform
- **3 Blog-Artikel**: DSGVO-Checkliste, KI-Einführung, KI-Tools-Implementierung
