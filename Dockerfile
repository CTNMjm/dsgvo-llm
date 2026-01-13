# LLM-Plattform Vergleich - Docker Image
# Multi-stage build für optimale Image-Größe

# Stage 1: Dependencies installieren
FROM node:22-alpine AS deps
WORKDIR /app

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@latest --activate

# Package files kopieren
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches/

# Dependencies installieren
RUN pnpm install --frozen-lockfile

# Stage 2: Development Image
FROM node:22-alpine AS development
WORKDIR /app

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies von Stage 1 kopieren
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Port freigeben
EXPOSE 3000

# Development Server starten
CMD ["pnpm", "dev"]

# Stage 3: Production Build
FROM node:22-alpine AS builder
WORKDIR /app

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies von Stage 1 kopieren
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production Build erstellen
RUN pnpm build

# Stage 4: Production Image
FROM node:22-alpine AS production
WORKDIR /app

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@latest --activate

# Nur notwendige Dateien kopieren
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/drizzle ./drizzle

# Non-root User für Sicherheit
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
USER appuser

# Port freigeben
EXPOSE 3000

# Production Server starten
CMD ["node", "dist/index.js"]
