#!/usr/bin/env node
/**
 * Lighthouse Performance Audit Script
 * Führt einen Performance-Audit der Website durch und speichert die Ergebnisse
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT_DIR = './lighthouse-reports';

async function runAudit() {
  console.log(`🔍 Starte Lighthouse-Audit für: ${URL}\n`);

  // Chrome starten
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'info',
    output: ['html', 'json'],
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    }
  };

  try {
    const runnerResult = await lighthouse(URL, options);

    // Report-Verzeichnis erstellen
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // HTML-Report speichern
    const htmlReport = runnerResult.report[0];
    const htmlPath = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.html`);
    fs.writeFileSync(htmlPath, htmlReport);
    
    // JSON-Report speichern
    const jsonReport = runnerResult.report[1];
    const jsonPath = path.join(OUTPUT_DIR, `lighthouse-${timestamp}.json`);
    fs.writeFileSync(jsonPath, jsonReport);

    // Ergebnisse ausgeben
    const { categories, audits } = runnerResult.lhr;
    
    console.log('\n📊 LIGHTHOUSE AUDIT ERGEBNISSE\n');
    console.log('═'.repeat(50));
    
    // Kategorien-Scores
    console.log('\n🎯 SCORES:\n');
    Object.values(categories).forEach(category => {
      const score = Math.round(category.score * 100);
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`  ${emoji} ${category.title}: ${score}/100`);
    });

    // Performance-Metriken
    console.log('\n⚡ PERFORMANCE-METRIKEN:\n');
    const metrics = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'total-blocking-time',
      'cumulative-layout-shift',
      'speed-index',
      'interactive'
    ];
    
    metrics.forEach(metricId => {
      const audit = audits[metricId];
      if (audit) {
        const emoji = audit.score >= 0.9 ? '🟢' : audit.score >= 0.5 ? '🟡' : '🔴';
        console.log(`  ${emoji} ${audit.title}: ${audit.displayValue}`);
      }
    });

    // Verbesserungsvorschläge
    console.log('\n💡 TOP VERBESSERUNGSVORSCHLÄGE:\n');
    const opportunities = Object.values(audits)
      .filter(audit => audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1)
      .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
      .slice(0, 5);
    
    opportunities.forEach((opp, i) => {
      console.log(`  ${i + 1}. ${opp.title}`);
      if (opp.displayValue) {
        console.log(`     Potenzial: ${opp.displayValue}`);
      }
    });

    console.log('\n═'.repeat(50));
    console.log(`\n📄 Reports gespeichert in: ${OUTPUT_DIR}/`);
    console.log(`   - ${path.basename(htmlPath)}`);
    console.log(`   - ${path.basename(jsonPath)}\n`);

    // Zusammenfassung für Dokumentation erstellen
    const summary = {
      url: URL,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100)
      },
      metrics: {
        fcp: audits['first-contentful-paint']?.displayValue,
        lcp: audits['largest-contentful-paint']?.displayValue,
        tbt: audits['total-blocking-time']?.displayValue,
        cls: audits['cumulative-layout-shift']?.displayValue,
        si: audits['speed-index']?.displayValue,
        tti: audits['interactive']?.displayValue
      },
      opportunities: opportunities.map(o => ({
        title: o.title,
        potential: o.displayValue
      }))
    };

    const summaryPath = path.join(OUTPUT_DIR, `summary-${timestamp}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    return summary;
  } finally {
    await chrome.kill();
  }
}

runAudit()
  .then(summary => {
    console.log('✅ Audit erfolgreich abgeschlossen!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Audit fehlgeschlagen:', error.message);
    process.exit(1);
  });
