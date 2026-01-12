/**
 * Spam Detection Service
 * 
 * Provides automatic spam detection for comments and reviews
 * using multiple heuristics and pattern matching.
 */

// Common spam words in German and English
const SPAM_WORDS = [
  // German spam indicators
  'casino', 'gewinn', 'gratis', 'kostenlos', 'kredit', 'darlehen',
  'viagra', 'cialis', 'potenz', 'abnehmen', 'diät', 'schlank',
  'millionär', 'reich werden', 'schnell geld', 'nebenverdienst',
  'krypto', 'bitcoin', 'trading', 'forex', 'investition',
  'klicken sie hier', 'jetzt kaufen', 'limitiertes angebot',
  'nur heute', 'letzte chance', 'exklusiv',
  
  // English spam indicators
  'click here', 'buy now', 'limited offer', 'act now',
  'free money', 'make money fast', 'work from home',
  'congratulations', 'you won', 'lottery', 'prize',
  'nigerian prince', 'inheritance', 'wire transfer',
  
  // URL patterns often used in spam
  'bit.ly', 'tinyurl', 'goo.gl', 't.co',
  
  // Crypto/scam related
  'nft', 'airdrop', 'whitelist', 'presale',
  'pump', 'moon', '100x', '1000x'
];

// Suspicious patterns (regex)
const SPAM_PATTERNS = [
  // Excessive URLs
  /https?:\/\/[^\s]+/gi,
  // Email addresses in content
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  // Phone numbers
  /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  // Excessive punctuation
  /[!?]{3,}/g,
  // All caps words (more than 3 in a row)
  /\b[A-Z]{4,}\b/g,
  // Repeated characters
  /(.)\1{4,}/g,
  // Currency symbols with numbers
  /[$€£]\s*\d+[.,]?\d*/g,
  // Percentage claims
  /\d{2,3}\s*%/g
];

// Legitimate patterns that reduce spam score
const LEGITIMATE_PATTERNS = [
  // German formal language
  /sehr geehrte|mit freundlichen grüßen|vielen dank/gi,
  // Professional terms
  /unternehmen|mitarbeiter|projekt|lösung|software/gi,
  // DSGVO/compliance related
  /dsgvo|datenschutz|compliance|sicherheit/gi,
  // LLM/AI related
  /llm|ki|künstliche intelligenz|machine learning|gpt|chatbot/gi
];

export interface SpamCheckResult {
  isSpam: boolean;
  score: number; // 0-100, higher = more likely spam
  reasons: string[];
  confidence: 'low' | 'medium' | 'high';
}

export function checkForSpam(content: string, authorName?: string, authorEmail?: string): SpamCheckResult {
  const reasons: string[] = [];
  let score = 0;
  
  const lowerContent = content.toLowerCase();
  const lowerName = (authorName || '').toLowerCase();
  
  // Check for spam words
  let spamWordCount = 0;
  for (const word of SPAM_WORDS) {
    if (lowerContent.includes(word)) {
      spamWordCount++;
      if (spamWordCount <= 3) {
        reasons.push(`Enthält verdächtiges Wort: "${word}"`);
      }
    }
  }
  score += Math.min(spamWordCount * 10, 40);
  
  // Check for spam patterns
  let urlCount = 0;
  for (const pattern of SPAM_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      if (pattern.source.includes('https?')) {
        urlCount = matches.length;
        if (urlCount > 1) {
          score += (urlCount - 1) * 15;
          reasons.push(`Enthält ${urlCount} URLs`);
        }
      } else if (pattern.source.includes('[!?]')) {
        score += 10;
        reasons.push('Übermäßige Zeichensetzung');
      } else if (pattern.source.includes('A-Z')) {
        score += 10;
        reasons.push('Übermäßige Großschreibung');
      } else if (pattern.source.includes('\\1')) {
        score += 15;
        reasons.push('Wiederholte Zeichen');
      } else if (pattern.source.includes('[$€£]')) {
        score += 10;
        reasons.push('Enthält Währungsbeträge');
      }
    }
  }
  
  // Check content length
  if (content.length < 10) {
    score += 20;
    reasons.push('Sehr kurzer Inhalt');
  } else if (content.length > 2000) {
    score += 15;
    reasons.push('Ungewöhnlich langer Inhalt');
  }
  
  // Check for suspicious author names
  const suspiciousNames = ['admin', 'test', 'user', 'guest', 'anonymous', 'xxx', 'aaa'];
  if (suspiciousNames.some(n => lowerName.includes(n))) {
    score += 15;
    reasons.push('Verdächtiger Benutzername');
  }
  
  // Check for name with numbers
  if (/\d{3,}/.test(authorName || '')) {
    score += 10;
    reasons.push('Name enthält viele Zahlen');
  }
  
  // Check email domain (if provided)
  if (authorEmail) {
    const disposableDomains = ['tempmail', 'throwaway', 'guerrilla', 'mailinator', '10minute'];
    if (disposableDomains.some(d => authorEmail.toLowerCase().includes(d))) {
      score += 25;
      reasons.push('Wegwerf-E-Mail-Adresse');
    }
  }
  
  // Reduce score for legitimate patterns
  for (const pattern of LEGITIMATE_PATTERNS) {
    if (pattern.test(content)) {
      score -= 10;
    }
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  // Determine confidence
  let confidence: 'low' | 'medium' | 'high';
  if (reasons.length >= 4 || score >= 70) {
    confidence = 'high';
  } else if (reasons.length >= 2 || score >= 40) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }
  
  return {
    isSpam: score >= 50,
    score,
    reasons,
    confidence
  };
}

/**
 * Check if content should be auto-approved
 * Returns true if content appears legitimate and safe
 */
export function shouldAutoApprove(content: string, authorName?: string): boolean {
  const result = checkForSpam(content, authorName);
  
  // Auto-approve if score is very low and content looks legitimate
  if (result.score < 15 && content.length >= 20 && content.length <= 1000) {
    // Additional check: must contain at least some German/professional words
    const hasLegitimateContent = LEGITIMATE_PATTERNS.some(p => p.test(content));
    return hasLegitimateContent;
  }
  
  return false;
}

/**
 * Get moderation priority based on spam score
 * Higher priority = needs more urgent review
 */
export function getModerationPriority(spamScore: number): 'low' | 'normal' | 'high' | 'urgent' {
  if (spamScore >= 70) return 'urgent';
  if (spamScore >= 50) return 'high';
  if (spamScore >= 30) return 'normal';
  return 'low';
}
