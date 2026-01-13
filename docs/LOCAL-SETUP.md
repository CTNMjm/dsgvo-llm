# Lokale Entwicklungsumgebung einrichten

Diese Anleitung beschreibt, wie Sie das LLM-Plattform Vergleich Projekt in einer lokalen Docker-Umgebung mit Visual Studio Code einrichten können.

---

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgende Software auf Ihrem System installiert ist:

| Software | Mindestversion | Download |
|----------|----------------|----------|
| Docker Desktop | 4.0+ | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| Visual Studio Code | 1.80+ | [code.visualstudio.com](https://code.visualstudio.com) |
| Git | 2.30+ | [git-scm.com](https://git-scm.com) |

Zusätzlich benötigen Sie die VS Code Extension **Dev Containers** (ms-vscode-remote.remote-containers), die Sie über den Extensions Marketplace installieren können.

---

## Schritt 1: Projekt herunterladen

Laden Sie zunächst den Projektcode von der Manus-Plattform herunter. Klicken Sie dazu im Management UI auf **Code** und dann auf **Download All Files**. Entpacken Sie das heruntergeladene ZIP-Archiv in einen Ordner Ihrer Wahl, beispielsweise `C:\Projekte\llm-platform-compare` (Windows) oder `~/Projekte/llm-platform-compare` (macOS/Linux).

Alternativ können Sie das Projekt über Git klonen, falls Sie es zuvor mit GitHub verbunden haben:

```bash
git clone https://github.com/IHR-USERNAME/llm-platform-compare.git
cd llm-platform-compare
```

---

## Schritt 2: Umgebungsvariablen konfigurieren

Erstellen Sie im Projektverzeichnis eine Datei namens `.env` mit folgendem Inhalt:

```env
# Datenbank Konfiguration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=llm_platform

# Authentifizierung (mindestens 32 Zeichen)
JWT_SECRET=ihr-geheimer-schluessel-mindestens-32-zeichen-lang

# Anwendung
VITE_APP_TITLE=LLM-Plattform Vergleich
NODE_ENV=development

# E-Mail Konfiguration (optional, für Magic-Link-Login)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
```

Passen Sie die Werte nach Bedarf an. Der `JWT_SECRET` sollte ein sicherer, zufälliger String sein.

---

## Schritt 3: Projekt in VS Code öffnen

Öffnen Sie Visual Studio Code und navigieren Sie zu **File → Open Folder**. Wählen Sie das Projektverzeichnis aus.

VS Code erkennt automatisch die Dev Container Konfiguration und zeigt eine Benachrichtigung an:

> **Folder contains a Dev Container configuration file. Reopen folder to develop in a container?**

Klicken Sie auf **Reopen in Container**. Falls die Benachrichtigung nicht erscheint, können Sie den Container manuell starten:

1. Öffnen Sie die Befehlspalette mit `Ctrl+Shift+P` (Windows/Linux) oder `Cmd+Shift+P` (macOS)
2. Suchen Sie nach **Dev Containers: Reopen in Container**
3. Wählen Sie den Befehl aus

---

## Schritt 4: Container-Start abwarten

VS Code baut nun die Docker-Container und startet die Entwicklungsumgebung. Dieser Vorgang kann beim ersten Mal einige Minuten dauern, da Docker-Images heruntergeladen und Dependencies installiert werden müssen.

Sie können den Fortschritt im Terminal-Panel verfolgen. Der Prozess ist abgeschlossen, wenn Sie folgende Ausgabe sehen:

```
Server running on http://localhost:3000/
```

---

## Schritt 5: Datenbank initialisieren

Nach dem ersten Start müssen Sie die Datenbank mit dem Schema und den Beispieldaten initialisieren. Öffnen Sie ein Terminal in VS Code (`Ctrl+`` ` oder **Terminal → New Terminal**) und führen Sie folgende Befehle aus:

```bash
# Datenbank-Schema erstellen
pnpm db:push

# Beispieldaten importieren (Plattformen)
npx tsx server/seed.ts

# API-Preise importieren
npx tsx server/seed-api-pricing.ts
```

---

## Schritt 6: Anwendung testen

Öffnen Sie Ihren Browser und navigieren Sie zu:

| Dienst | URL | Beschreibung |
|--------|-----|--------------|
| Anwendung | [http://localhost:3000](http://localhost:3000) | Hauptanwendung |
| pgAdmin | [http://localhost:5050](http://localhost:5050) | Datenbank-Management (optional) |

Die Anwendung sollte nun vollständig funktionsfähig sein. Änderungen am Quellcode werden automatisch erkannt und die Anwendung wird neu geladen (Hot Reload).

---

## Alternative: Ohne Dev Container

Falls Sie die Entwicklungsumgebung ohne VS Code Dev Containers nutzen möchten, können Sie Docker Compose direkt verwenden:

```bash
# Container starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f app

# Container stoppen
docker-compose down

# Container mit Datenbank-Volumes löschen
docker-compose down -v
```

---

## Nützliche Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm dev` | Entwicklungsserver starten |
| `pnpm build` | Produktions-Build erstellen |
| `pnpm test` | Unit-Tests ausführen |
| `pnpm db:push` | Datenbank-Schema aktualisieren |
| `pnpm db:studio` | Drizzle Studio öffnen (Datenbank-UI) |

---

## Fehlerbehebung

**Problem: Container startet nicht**

Stellen Sie sicher, dass Docker Desktop läuft und keine anderen Dienste Port 3000 oder 5432 belegen.

```bash
# Ports prüfen (Windows PowerShell)
netstat -ano | findstr :3000

# Ports prüfen (macOS/Linux)
lsof -i :3000
```

**Problem: Datenbank-Verbindung fehlgeschlagen**

Warten Sie, bis der PostgreSQL-Container vollständig gestartet ist. Der Health-Check kann bis zu 30 Sekunden dauern.

```bash
# Container-Status prüfen
docker-compose ps
```

**Problem: Node Modules fehlen**

Falls Dependencies fehlen, installieren Sie diese manuell:

```bash
pnpm install
```

---

## Projektstruktur

```
llm-platform-compare/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # UI-Komponenten
│   │   ├── pages/          # Seiten-Komponenten
│   │   ├── hooks/          # Custom Hooks
│   │   └── lib/            # Hilfsfunktionen
├── server/                 # Backend (Express + tRPC)
│   ├── services/           # Business Logic
│   ├── routers.ts          # API-Routen
│   └── db.ts               # Datenbank-Funktionen
├── drizzle/                # Datenbank-Schema
├── .devcontainer/          # VS Code Dev Container
├── docker-compose.yml      # Docker Compose Konfiguration
├── Dockerfile              # Docker Image Definition
└── package.json            # Projekt-Dependencies
```

---

## Nächste Schritte

Nach erfolgreicher Einrichtung können Sie:

1. **Code anpassen**: Änderungen im `client/` oder `server/` Ordner werden automatisch übernommen
2. **Neue Plattformen hinzufügen**: Über das Admin-Dashboard oder durch Bearbeitung von `server/seed.ts`
3. **E-Mail aktivieren**: SMTP-Zugangsdaten in der `.env` Datei hinterlegen
4. **Tests ausführen**: Mit `pnpm test` die Unit-Tests starten

Bei Fragen oder Problemen können Sie die Dokumentation im `docs/` Ordner konsultieren.
