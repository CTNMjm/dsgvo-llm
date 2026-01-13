# Coolify Deployment Guide

## Übersicht

Diese Anleitung beschreibt, wie Sie das Projekt auf einem Coolify-Server mit PostgreSQL-Datenbank deployen.

## Voraussetzungen

- Coolify Server (v4.x empfohlen)
- PostgreSQL Datenbank
- Domain mit SSL-Zertifikat (optional, aber empfohlen)

## Umgebungsvariablen

### Erforderliche Variablen

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `DATABASE_URL` | PostgreSQL Verbindungs-URL | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | Secret für Session-Cookies (min. 32 Zeichen) | `openssl rand -base64 32` |
| `NODE_ENV` | Produktionsmodus | `production` |
| `SITE_URL` | Öffentliche URL der Website | `https://ihre-domain.de` |

### E-Mail Konfiguration (für Magic Link Login)

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `SMTP_HOST` | SMTP Server | `smtp.example.com` |
| `SMTP_PORT` | SMTP Port | `587` |
| `SMTP_USER` | SMTP Benutzername | `user@example.com` |
| `SMTP_PASS` | SMTP Passwort | `your-password` |
| `ADMIN_EMAIL` | Admin E-Mail für Benachrichtigungen | `admin@ihre-domain.de` |
| `FROM_EMAIL` | Absender E-Mail | `noreply@ihre-domain.de` |

### Optionale Variablen

| Variable | Beschreibung |
|----------|--------------|
| `PORT` | Server Port (Standard: 3000) |
| `VITE_APP_TITLE` | Website Titel |
| `VITE_APP_LOGO` | Logo URL |

## Deployment Schritte

### 1. PostgreSQL Datenbank erstellen

In Coolify:
1. Gehen Sie zu **Resources** → **New** → **Database**
2. Wählen Sie **PostgreSQL**
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
   - Build Pack: **Nixpacks** oder **Dockerfile**
   - Port: `3000`

### 3. Umgebungsvariablen setzen

In den Application Settings → **Environment Variables**:

```env
# Datenbank
DATABASE_URL=postgresql://llm_user:YOUR_PASSWORD@llm-platform-db:5432/llm_platform?sslmode=require

# Sicherheit
JWT_SECRET=IHR_GENERIERTES_SECRET
NODE_ENV=production

# Website
SITE_URL=https://ihre-domain.de
VITE_APP_TITLE=DSGVO-konforme LLM-Plattformen

# E-Mail (optional)
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
cd /app
pnpm db:push
```

Oder führen Sie das Seed-Script aus:

```bash
pnpm db:seed
```

### 5. Admin-Benutzer erstellen

Nach der ersten Anmeldung können Sie einen Benutzer zum Admin machen:

```sql
UPDATE users SET role = 'admin' WHERE email = 'ihre-email@domain.de';
```

## Datenbank-Verbindung

### Verbindungs-URL Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require
```

### Beispiele

**Lokale Coolify PostgreSQL:**
```
postgresql://llm_user:secret123@llm-platform-db:5432/llm_platform
```

**Externe PostgreSQL (z.B. Supabase, Neon):**
```
postgresql://user:pass@db.supabase.co:5432/postgres?sslmode=require
```

## SSL/TLS Konfiguration

Für Produktionsumgebungen empfehlen wir:

1. **Let's Encrypt** über Coolify aktivieren
2. `sslmode=require` in der DATABASE_URL verwenden
3. HTTPS für alle externen Verbindungen erzwingen

## Troubleshooting

### Datenbank-Verbindungsfehler

```bash
# Verbindung testen
psql $DATABASE_URL -c "SELECT 1"
```

### Migration fehlgeschlagen

```bash
# Schema neu generieren
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Build-Fehler

Stellen Sie sicher, dass alle erforderlichen Umgebungsvariablen gesetzt sind:
- `DATABASE_URL`
- `JWT_SECRET`

## Backup & Restore

### Datenbank-Backup

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
psql $DATABASE_URL < backup_20260113.sql
```

## Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/CTNMjm/dsgvo-llm/issues
