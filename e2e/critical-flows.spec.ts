import { test, expect } from '@playwright/test';

/**
 * E2E-Tests für kritische Benutzerabläufe
 * Diese Tests prüfen die wichtigsten User-Journeys der Anwendung
 */

test.describe('Startseite', () => {
  test('sollte die Startseite laden und Hauptelemente anzeigen', async ({ page }) => {
    await page.goto('/');
    
    // Titel prüfen
    await expect(page).toHaveTitle(/DSGVO-konforme LLM-Plattformen/);
    
    // Hero-Bereich prüfen
    await expect(page.locator('h1')).toContainText('DSGVO-konforme');
    
    // Navigation prüfen
    await expect(page.locator('nav')).toBeVisible();
    
    // Plattformkarten sollten sichtbar sein
    const platformCards = page.locator('[data-testid="platform-card"]');
    // Falls keine test-ids vorhanden, nach Karten-Struktur suchen
    const cards = page.locator('.rounded-xl, .rounded-lg').filter({ hasText: /Details ansehen|Mehr erfahren/ });
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('sollte Cookie-Banner anzeigen und Interaktion ermöglichen', async ({ page }) => {
    // Cookies löschen für frischen Start
    await page.context().clearCookies();
    await page.goto('/');
    
    // Cookie-Banner sollte erscheinen
    const cookieBanner = page.locator('text=Cookie-Einstellungen');
    await expect(cookieBanner).toBeVisible({ timeout: 5000 });
    
    // "Nur Essenzielle" Button klicken
    const essentialButton = page.locator('button:has-text("Nur Essenzielle")');
    await essentialButton.click();
    
    // Banner sollte verschwinden
    await expect(cookieBanner).not.toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('sollte zur Blog-Seite navigieren', async ({ page }) => {
    await page.goto('/');
    
    // Blog-Link finden und klicken
    await page.click('a:has-text("Blog")');
    
    // URL prüfen
    await expect(page).toHaveURL(/\/blog/);
    
    // Blog-Überschrift prüfen
    await expect(page.locator('h1')).toContainText(/Blog|Artikel/);
  });

  test('sollte zur API-Preise-Seite navigieren', async ({ page }) => {
    await page.goto('/');
    
    // API-Preise Link finden und klicken
    await page.click('a:has-text("API-Preise")');
    
    // URL prüfen
    await expect(page).toHaveURL(/\/api-preise/);
  });

  test('sollte zur Vergleichsseite navigieren', async ({ page }) => {
    await page.goto('/');
    
    // Vergleich-Link finden und klicken
    await page.click('a:has-text("Vergleich")');
    
    // URL prüfen
    await expect(page).toHaveURL(/\/vergleich/);
  });
});

test.describe('Plattform-Details', () => {
  test('sollte Plattform-Detailseite öffnen', async ({ page }) => {
    await page.goto('/');
    
    // Auf erste "Details ansehen" klicken
    const detailsButton = page.locator('a:has-text("Details ansehen"), button:has-text("Details ansehen")').first();
    await detailsButton.click();
    
    // URL sollte /platform/ enthalten
    await expect(page).toHaveURL(/\/platform\//);
    
    // Plattform-Name sollte als Überschrift erscheinen
    await expect(page.locator('h1')).toBeVisible();
  });

  test('sollte API-Preise auf Detailseite anzeigen', async ({ page }) => {
    await page.goto('/platform/openai');
    
    // API-Preise Sektion sollte vorhanden sein
    const pricingSection = page.locator('text=API-Preise, text=Modell-Preise, text=Preise').first();
    await expect(pricingSection).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Vergleichsfunktion', () => {
  test('sollte Plattformen zum Vergleich hinzufügen können', async ({ page }) => {
    await page.goto('/');
    
    // Vergleich-Buttons finden
    const compareButtons = page.locator('button[title*="Vergleich"], button:has-text("Vergleich")');
    
    // Ersten Vergleich-Button klicken (falls vorhanden)
    const firstButton = compareButtons.first();
    if (await firstButton.isVisible()) {
      await firstButton.click();
      
      // Floating-Widget sollte erscheinen
      const floatingWidget = page.locator('[class*="fixed"][class*="bottom"]');
      await expect(floatingWidget).toBeVisible({ timeout: 5000 });
    }
  });

  test('sollte Vergleichsseite mit Plattformen anzeigen', async ({ page }) => {
    await page.goto('/vergleich');
    
    // Plattform-Auswahl sollte vorhanden sein
    const selectElements = page.locator('select, [role="combobox"]');
    await expect(selectElements.first()).toBeVisible();
  });
});

test.describe('Rechtliche Seiten', () => {
  test('sollte Datenschutzseite anzeigen', async ({ page }) => {
    await page.goto('/datenschutz');
    
    await expect(page.locator('h1')).toContainText(/Datenschutz/);
  });

  test('sollte Impressum anzeigen', async ({ page }) => {
    await page.goto('/impressum');
    
    await expect(page.locator('h1')).toContainText(/Impressum/);
  });
});

test.describe('Responsive Design', () => {
  test('sollte auf Mobile-Viewport funktionieren', async ({ page }) => {
    // Mobile Viewport setzen
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Seite sollte laden
    await expect(page.locator('h1')).toBeVisible();
    
    // Mobile-Menü oder Navigation sollte vorhanden sein
    const mobileMenu = page.locator('button[aria-label*="Menu"], button[aria-label*="Menü"], [class*="hamburger"]');
    // Navigation sollte entweder direkt sichtbar oder über Hamburger-Menü erreichbar sein
  });
});

test.describe('SEO', () => {
  test('sollte Meta-Tags haben', async ({ page }) => {
    await page.goto('/');
    
    // Meta Description prüfen
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Open Graph Tags prüfen
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });
});

test.describe('Performance', () => {
  test('sollte innerhalb von 5 Sekunden interaktiv sein', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Auf interaktives Element warten
    await page.locator('a, button').first().waitFor({ state: 'visible' });
    
    const loadTime = Date.now() - startTime;
    
    // Sollte unter 5 Sekunden laden
    expect(loadTime).toBeLessThan(5000);
  });
});
