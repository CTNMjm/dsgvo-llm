#!/usr/bin/env node
/**
 * Datenbank-Testskript
 * 
 * Überprüft:
 * 1. Datenbankverbindung
 * 2. Existenz aller Tabellen
 * 3. Korrekte Anzahl der Seed-Daten
 * 
 * Verwendung:
 *   node scripts/test-database.mjs
 * 
 * Voraussetzung:
 *   DATABASE_URL muss gesetzt sein (mysql://user:pass@host:3306/dbname)
 */

import mysql from 'mysql2/promise';

// Farben für die Konsolenausgabe
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, type = 'info') {
  const prefix = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

function header(title) {
  console.log(`\n${colors.bold}${colors.blue}═══ ${title} ═══${colors.reset}\n`);
}

// Erwartete Seed-Daten
const expectedData = {
  platforms: 12,
  api_pricing: 48,
  blog_posts: 3
};

// Alle Tabellen die existieren sollten
const requiredTables = [
  'users',
  'platforms',
  'api_pricing',
  'blog_posts',
  'blog_comments',
  'platform_reviews',
  'platform_suggestions',
  'newsletter_subscribers',
  'leads',
  'members',
  'member_sessions',
  'login_codes'
];

async function main() {
  console.log(`\n${colors.bold}${colors.blue}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}║   Datenbank-Test für LLM-Plattform         ║${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}╚════════════════════════════════════════════╝${colors.reset}\n`);

  // 1. DATABASE_URL prüfen
  header('1. Umgebungsvariablen');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    log('DATABASE_URL ist nicht gesetzt!', 'error');
    log('Bitte setzen Sie die Umgebungsvariable:', 'info');
    console.log('   export DATABASE_URL="mysql://user:pass@host:3306/dbname"');
    process.exit(1);
  }
  
  // URL-Format prüfen
  if (!databaseUrl.startsWith('mysql://')) {
    log(`DATABASE_URL hat falsches Format: ${databaseUrl.substring(0, 20)}...`, 'error');
    log('Erwartet: mysql://user:pass@host:3306/dbname', 'info');
    process.exit(1);
  }
  
  log('DATABASE_URL ist gesetzt', 'success');
  
  // Host aus URL extrahieren (ohne Passwort anzuzeigen)
  const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):[^@]+@([^:]+):(\d+)\/(.+)/);
  if (urlMatch) {
    log(`Verbinde zu: ${urlMatch[2]}:${urlMatch[3]}/${urlMatch[4]} als ${urlMatch[1]}`, 'info');
  }

  // 2. Datenbankverbindung testen
  header('2. Datenbankverbindung');
  
  let connection;
  try {
    connection = await mysql.createConnection(databaseUrl);
    log('Verbindung zur Datenbank hergestellt', 'success');
    
    // Verbindungsinfo abrufen
    const [rows] = await connection.execute('SELECT VERSION() as version');
    log(`MySQL Version: ${rows[0].version}`, 'info');
    
  } catch (error) {
    log(`Verbindung fehlgeschlagen: ${error.message}`, 'error');
    
    if (error.code === 'ECONNREFUSED') {
      log('Der Datenbankserver ist nicht erreichbar', 'warning');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      log('Zugangsdaten sind falsch', 'warning');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      log('Die Datenbank existiert nicht', 'warning');
    }
    
    process.exit(1);
  }

  // 3. Tabellen prüfen
  header('3. Tabellenstruktur');
  
  let tablesOk = true;
  const missingTables = [];
  
  for (const table of requiredTables) {
    try {
      const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
      if (rows.length > 0) {
        log(`Tabelle '${table}' existiert`, 'success');
      } else {
        log(`Tabelle '${table}' fehlt!`, 'error');
        missingTables.push(table);
        tablesOk = false;
      }
    } catch (error) {
      log(`Fehler beim Prüfen von '${table}': ${error.message}`, 'error');
      tablesOk = false;
    }
  }
  
  if (!tablesOk) {
    log('\nFehlende Tabellen gefunden!', 'warning');
    log('Führen Sie aus: pnpm drizzle-kit migrate', 'info');
  }

  // 4. Seed-Daten prüfen
  header('4. Seed-Daten');
  
  let seedOk = true;
  const seedResults = {};
  
  for (const [table, expected] of Object.entries(expectedData)) {
    try {
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const actual = rows[0].count;
      seedResults[table] = actual;
      
      if (actual >= expected) {
        log(`${table}: ${actual} Einträge (erwartet: ${expected})`, 'success');
      } else if (actual > 0) {
        log(`${table}: ${actual} Einträge (erwartet: ${expected}) - unvollständig`, 'warning');
        seedOk = false;
      } else {
        log(`${table}: 0 Einträge (erwartet: ${expected}) - leer!`, 'error');
        seedOk = false;
      }
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        log(`${table}: Tabelle existiert nicht`, 'error');
      } else {
        log(`${table}: Fehler - ${error.message}`, 'error');
      }
      seedOk = false;
    }
  }
  
  if (!seedOk) {
    log('\nSeed-Daten fehlen oder sind unvollständig!', 'warning');
    log('Führen Sie aus: mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/seed-all.sql', 'info');
  }

  // 5. Stichproben-Test
  header('5. Stichproben-Test');
  
  try {
    // Erste Plattform prüfen
    const [platforms] = await connection.execute('SELECT name, company FROM platforms LIMIT 1');
    if (platforms.length > 0) {
      log(`Erste Plattform: ${platforms[0].name} (${platforms[0].company})`, 'success');
    }
    
    // Ersten Blog-Artikel prüfen
    const [posts] = await connection.execute('SELECT title FROM blog_posts LIMIT 1');
    if (posts.length > 0) {
      log(`Erster Blog-Artikel: ${posts[0].title.substring(0, 50)}...`, 'success');
    }
    
    // API-Preise prüfen
    const [pricing] = await connection.execute('SELECT provider, modelName FROM api_pricing LIMIT 1');
    if (pricing.length > 0) {
      log(`Erster API-Preis: ${pricing[0].provider} - ${pricing[0].modelName}`, 'success');
    }
    
  } catch (error) {
    log(`Stichproben-Test fehlgeschlagen: ${error.message}`, 'error');
  }

  // 6. Zusammenfassung
  header('6. Zusammenfassung');
  
  const allOk = tablesOk && seedOk;
  
  if (allOk) {
    console.log(`${colors.green}${colors.bold}`);
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   ✓ ALLE TESTS ERFOLGREICH BESTANDEN!      ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(colors.reset);
    log('Die Datenbank ist korrekt konfiguriert und enthält alle Seed-Daten.', 'success');
  } else {
    console.log(`${colors.red}${colors.bold}`);
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   ✗ EINIGE TESTS FEHLGESCHLAGEN            ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    if (missingTables.length > 0) {
      log(`Fehlende Tabellen: ${missingTables.join(', ')}`, 'error');
      log('Lösung: pnpm drizzle-kit migrate', 'info');
    }
    
    if (!seedOk) {
      log('Seed-Daten fehlen oder sind unvollständig', 'error');
      log('Lösung: mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < drizzle/seeds/seed-all.sql', 'info');
    }
  }

  // Verbindung schließen
  await connection.end();
  
  // Exit-Code setzen
  process.exit(allOk ? 0 : 1);
}

// Script ausführen
main().catch(error => {
  log(`Unerwarteter Fehler: ${error.message}`, 'error');
  process.exit(1);
});
