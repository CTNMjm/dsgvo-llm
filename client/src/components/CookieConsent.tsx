import { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';

type ConsentType = 'all' | 'essential' | 'none' | null;

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Immer aktiviert
    analytics: false,
    marketing: false,
    timestamp: ''
  });

  useEffect(() => {
    // Prüfen ob bereits Consent gegeben wurde
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          // Analytics aktivieren wenn zugestimmt
          if (parsed.preferences.analytics) {
            enableAnalytics();
          }
          return;
        }
      } catch {
        // Ungültiger Consent, Banner anzeigen
      }
    }
    // Kurze Verzögerung bevor Banner erscheint
    const timer = setTimeout(() => setShowBanner(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const enableAnalytics = () => {
    // Umami Analytics aktivieren (bereits im HTML eingebunden)
    // Hier könnten weitere Analytics-Dienste aktiviert werden
    console.log('[Cookie Consent] Analytics enabled');
  };

  const disableAnalytics = () => {
    // Analytics deaktivieren
    console.log('[Cookie Consent] Analytics disabled');
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const consent = {
      version: CONSENT_VERSION,
      preferences: prefs,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setPreferences(prefs);
    setShowBanner(false);

    if (prefs.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    });
  };

  const acceptEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    });
  };

  const saveCustom = () => {
    saveConsent({
      ...preferences,
      timestamp: new Date().toISOString()
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {}} // Verhindert Schließen durch Klick außerhalb
      />
      
      {/* Banner */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Cookie className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">Cookie-Einstellungen</h2>
          </div>
          <button
            onClick={acceptEssential}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. 
            Einige Cookies sind für den Betrieb der Website erforderlich, während andere 
            uns helfen, die Website zu analysieren und zu verbessern.
          </p>

          {/* Cookie-Kategorien */}
          {showDetails && (
            <div className="space-y-3 pt-2">
              {/* Essenzielle Cookies */}
              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="p-1.5 bg-green-500/20 rounded">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white text-sm">Essenzielle Cookies</h3>
                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                      Immer aktiv
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="p-1.5 bg-blue-500/20 rounded">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white text-sm">Analyse-Cookies</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Helfen uns zu verstehen, wie Besucher mit der Website interagieren (Umami Analytics).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            {showDetails ? 'Weniger anzeigen' : 'Cookie-Details anzeigen'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 bg-slate-800/50 border-t border-slate-700">
          <button
            onClick={acceptEssential}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Nur Essenzielle
          </button>
          {showDetails ? (
            <button
              onClick={saveCustom}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
            >
              Alle akzeptieren
            </button>
          )}
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-4 p-3 text-xs text-slate-500 border-t border-slate-700/50">
          <a href="/datenschutz" className="hover:text-slate-300 transition-colors">
            Datenschutzerklärung
          </a>
          <a href="/impressum" className="hover:text-slate-300 transition-colors">
            Impressum
          </a>
        </div>
      </div>
    </div>
  );
}

// Hook um Consent-Status abzufragen
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed.preferences);
        }
      } catch {
        // Ungültiger Consent
      }
    }
  }, []);

  const hasAnalyticsConsent = consent?.analytics ?? false;
  const hasMarketingConsent = consent?.marketing ?? false;

  return { consent, hasAnalyticsConsent, hasMarketingConsent };
}

// Funktion um Cookie-Einstellungen zu öffnen
export function openCookieSettings() {
  localStorage.removeItem(CONSENT_KEY);
  window.location.reload();
}
