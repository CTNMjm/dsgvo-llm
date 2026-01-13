import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Konfiguration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Maximale Zeit pro Test */
  timeout: 30 * 1000,
  
  /* Erwartungs-Timeout */
  expect: {
    timeout: 5000
  },
  
  /* Parallele Ausführung */
  fullyParallel: true,
  
  /* Fehlgeschlagene Tests nicht wiederholen in CI */
  forbidOnly: !!process.env.CI,
  
  /* Wiederholungen bei Fehlern */
  retries: process.env.CI ? 2 : 0,
  
  /* Anzahl paralleler Worker */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  /* Globale Einstellungen für alle Tests */
  use: {
    /* Base URL für relative Pfade */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    /* Screenshots bei Fehlern */
    screenshot: 'only-on-failure',
    
    /* Videos bei Fehlern */
    video: 'retain-on-failure',
    
    /* Trace bei Fehlern */
    trace: 'on-first-retry',
    
    /* Viewport */
    viewport: { width: 1280, height: 720 },
  },

  /* Projekte für verschiedene Browser */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Weitere Browser können bei Bedarf aktiviert werden:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // Mobile Tests:
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  /* Dev-Server automatisch starten */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
