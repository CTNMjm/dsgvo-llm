# Coolify Deployment Guide

## Übersicht

Diese Anleitung beschreibt, wie Sie das Projekt auf einem Coolify-Server mit MySQL-Datenbank deployen. Die App läuft im **Self-Hosted-Modus** mit Magic-Link-Login (E-Mail-basiert).

## Voraussetzungen

- Coolify Server (v4.x empfohlen)
- MySQL 8.0+ Datenbank
- SMTP-Server für E-Mail-Versand (erforderlich für Magic-Link-Login)
- Domain mit SSL-Zertifikat (optional, aber empfohlen)

## Umgebungsvariablen

### Erforderliche Variablen

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `DATABASE_URL` | MySQL Verbindungs-URL | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Secret für Session-Cookies (min. 32 Zeichen) | `openssl rand -base64 32` |
| `NODE_ENV` | Produktionsmodus | `production` |
| `SITE_URL` | Öffentliche URL der Website | `https://ihre-domain.de` |

### E-Mail Konfiguration (ERFORDERLICH für Login)

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `SMTP_HOST` | SMTP Server | `smtp.example.com` |
| `SMTP_PORT` | SMTP Port | `587` |
| `SMTP_USER` | SMTP Benutzername | `user@example.com` |
| `SMTP_PASS` | SMTP Passwort | `your-password` |
| `ADMIN_EMAIL` | Admin E-Mail für Benachrichtigungen | `admin@ihre-domain.de` |
| `FROM_EMAIL` | Absender E-Mail | `noreply@ihre-domain.de` |

**Wichtig:** Ohne SMTP-Konfiguration funktioniert das Magic-Link-Login nicht!

### Optionale Variablen

| Variable | Beschreibung |
|----------|--------------|
| `PORT` | Server Port (Standard: 3000) |
| `VITE_APP_TITLE` | Website Titel |
| `VITE_APP_LOGO` | Logo URL |

## Deployment Schritte

### 1. MySQL Datenbank erstellen

In Coolify:
1. Gehen Sie zu **Resources** → **New** → **Database**
2. Wählen Sie **MySQL**
3. Konfigurieren Sie:
   - Name: `llm-platform-db`
   - Database: `llm_platform`
   - User: `llm_user`
   - Password: (sicheres Passwort generieren)
4. Klicken Sie auf **Deploy**
5. Notieren Sie die Verbindungs-URL

### 2. Anwendung deployen

In Coolify:
1. Gehen Sie zu **Resources** → **New** → **Application**
2. Wählen Sie **GitHub** als Quelle
3. Verbinden Sie das Repository: `CTNMjm/dsgvo-llm`
4. Konfigurieren Sie:
   - Build Pack: **Dockerfile**
   - Port: `3000`

### 3. Umgebungsvariablen setzen

In den Application Settings → **Environment Variables**:

```env
# Datenbank (MySQL)
DATABASE_URL=mysql://llm_user:YOUR_PASSWORD@llm-platform-db:3306/llm_platform

# Sicherheit
JWT_SECRET=IHR_GENERIERTES_SECRET
NODE_ENV=production

# Website
SITE_URL=https://ihre-domain.de
VITE_APP_TITLE=DSGVO-konforme LLM-Plattformen

# E-Mail (ERFORDERLICH für Login)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
ADMIN_EMAIL=admin@ihre-domain.de
FROM_EMAIL=noreply@ihre-domain.de
```

### 4. Datenbank migrieren

Nach dem ersten Deployment:

```bash
# In Coolify Terminal oder via SSH
pnpm drizzle-kit migrate
```

### 5. Seed-Daten importieren

```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/seed-all.sql
```

Die Seed-Datei enthält:
- 12 LLM-Plattformen
- 48 API-Preiseinträge
- 3 Blog-Artikel

### 6. Datenbank-Test

Prüfen Sie, ob alles korrekt eingerichtet ist:

```bash
pnpm db:test
```

### 7. Admin-Benutzer erstellen

1. Melden Sie sich über Magic-Link mit Ihrer E-Mail an
2. Führen Sie in der Datenbank aus:

```sql
UPDATE members SET role = 'admin' WHERE email = 'ihre-email@domain.de';
```

## Login-System

Diese App verwendet **Magic-Link-Login** (E-Mail-basiert):

1. Benutzer gibt E-Mail-Adresse ein
2. Ein 6-stelliger Code wird per E-Mail gesendet
3. Benutzer gibt den Code ein und ist angemeldet
4. Session ist 30 Tage gültig

**Hinweis:** Es wird kein OAuth benötigt. Die App läuft vollständig selbstständig.

## Datenbank-Verbindung

### Verbindungs-URL Format (MySQL)

```
mysql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

### Beispiele

**Lokale Coolify MySQL:**
```
mysql://llm_user:secret123@llm-platform-db:3306/llm_platform
```

**Externe MySQL:**
```
mysql://user:pass@db.example.com:3306/llm_platform
```

## SSL/TLS Konfiguration

Für Produktionsumgebungen empfehlen wir:

1. **Let's Encrypt** über Coolify aktivieren
2. HTTPS für alle externen Verbindungen erzwingen

## Troubleshooting

### Datenbank-Verbindungsfehler

```bash
# Verbindung testen
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT 1"
```

### Migration fehlgeschlagen

```bash
# Schema neu generieren
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### E-Mail wird nicht gesendet

- Prüfen Sie SMTP-Host und Port
- Prüfen Sie Benutzername und Passwort
- Manche Provider erfordern App-Passwörter (z.B. Gmail)
- Prüfen Sie Firewall-Regeln für ausgehende SMTP-Verbindungen

### Build-Fehler "patches not found"

Die Dockerfile muss den patches-Ordner kopieren:
```dockerfile
COPY patches ./patches/
```

### Build-Fehler "Cannot find module"

Stellen Sie sicher, dass alle erforderlichen Umgebungsvariablen gesetzt sind:
- `DATABASE_URL`
- `JWT_SECRET`

## Backup & Restore

### Datenbank-Backup

```bash
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup_20260113.sql
```

## Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/CTNMjm/dsgvo-llm/issues
