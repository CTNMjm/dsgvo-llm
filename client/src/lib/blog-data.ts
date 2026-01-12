export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "ki-im-unternehmen-einfuehren",
    title: "KI im Unternehmen erfolgreich einführen: Ein 5-Schritte-Plan",
    excerpt: "Die Einführung von Künstlicher Intelligenz ist kein reines IT-Projekt. Erfahren Sie, wie Sie LLMs strategisch, sicher und gewinnbringend in Ihre Geschäftsprozesse integrieren.",
    author: "Dr. Julia Meyer",
    date: "20. Januar 2026",
    category: "Strategie",
    readTime: "5 Min.",
    image: "/images/blog/strategy.jpg",
    content: `
      <h2>1. Use Cases identifizieren</h2>
      <p>Beginnen Sie nicht mit der Technologie, sondern mit dem Problem. Wo verlieren Ihre Mitarbeiter am meisten Zeit? Typische Startpunkte sind:</p>
      <ul>
        <li>Automatisierte Beantwortung von Kundenanfragen</li>
        <li>Zusammenfassung langer Dokumente</li>
        <li>Unterstützung bei der Programmierung (Coding Assistants)</li>
      </ul>

      <h2>2. Datenschutz und Compliance klären</h2>
      <p>Bevor das erste Prompt geschrieben wird, muss der rechtliche Rahmen stehen. Nutzen Sie DSGVO-konforme Plattformen (siehe unseren Vergleich), die Serverstandorte in der EU garantieren und keine Nutzerdaten zum Training der Modelle verwenden.</p>

      <h2>3. Das richtige Tool auswählen</h2>
      <p>Entscheiden Sie zwischen "Out-of-the-box"-Lösungen wie ChatGPT Enterprise oder spezialisierten B2B-Plattformen wie Langdock oder Logicc. Letztere bieten oft bessere Integrationsmöglichkeiten in bestehende Workflows.</p>

      <h2>4. Mitarbeiter schulen (Prompt Engineering)</h2>
      <p>Ein LLM ist nur so gut wie der Input. Investieren Sie in Schulungen für Prompt Engineering, damit Ihre Teams präzise und nützliche Ergebnisse erhalten.</p>

      <h2>5. Messen und Skalieren</h2>
      <p>Definieren Sie KPIs (z.B. Zeitersparnis pro Ticket). Starten Sie mit einem Pilotprojekt und rollen Sie das Tool erst nach erfolgreicher Evaluierung unternehmensweit aus.</p>
    `
  },
  {
    id: "dsgvo-checkliste-llm",
    title: "Die ultimative DSGVO-Checkliste für LLMs",
    excerpt: "Worauf müssen Sie achten, wenn Sie ChatGPT & Co. im europäischen Raum nutzen? Unsere Checkliste hilft Ihnen, Bußgelder zu vermeiden und Daten sicher zu verarbeiten.",
    author: "Thomas Rechts",
    date: "15. Januar 2026",
    category: "Recht & Compliance",
    readTime: "7 Min.",
    image: "/images/blog/compliance.jpg",
    content: `
      <h2>Grundlagen der DSGVO bei KI</h2>
      <p>Die Nutzung von Large Language Models (LLMs) verarbeitet fast immer personenbezogene Daten. Daher greift die DSGVO vollumfänglich.</p>

      <h2>Die Checkliste</h2>
      
      <h3>1. Auftragsverarbeitungsvertrag (AVV)</h3>
      <p>Haben Sie einen AVV mit dem Anbieter geschlossen? Dieser ist zwingend erforderlich, wenn externe Server genutzt werden.</p>

      <h3>2. Serverstandort</h3>
      <p>Werden die Daten in der EU verarbeitet? Bei US-Anbietern muss das Data Privacy Framework oder Standardvertragsklauseln (SCC) geprüft werden.</p>

      <h3>3. Trainingsdaten-Ausschluss</h3>
      <p>Stellt der Anbieter sicher, dass Ihre Eingaben (Prompts) und hochgeladenen Dateien <strong>nicht</strong> zum Training der KI-Modelle verwendet werden? Dies ist der häufigste Stolperstein.</p>

      <h3>4. Löschfristen</h3>
      <p>Wie lange werden Chat-Verläufe gespeichert? Können Sie diese manuell oder automatisch löschen lassen?</p>

      <h3>5. Betroffenenrechte</h3>
      <p>Können Sie Auskunft geben, wenn ein Kunde fragt, welche Daten die KI über ihn verarbeitet hat? Und können Sie diese Daten gezielt löschen?</p>

      <h2>Fazit</h2>
      <p>Sicherheit geht vor Geschwindigkeit. Nutzen Sie Plattformen, die "Privacy by Design" bieten, um rechtliche Risiken zu minimieren.</p>
    `
  }
];
