import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCode, generateSessionToken } from '../services/magicLink';
import { checkForSpam, getModerationPriority } from '../services/spam';

describe('Magic Link Service', () => {
  describe('generateCode', () => {
    it('should generate a 6-digit code', () => {
      const code = generateCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate different codes on each call', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateCode());
      }
      // Should have at least 90 unique codes out of 100
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe('generateSessionToken', () => {
    it('should generate a 64-character hex token', () => {
      const token = generateSessionToken();
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateSessionToken());
      }
      expect(tokens.size).toBe(100);
    });
  });
});

describe('Spam Detection Service', () => {
  describe('checkForSpam score', () => {
    it('should return low score for normal text', () => {
      const result = checkForSpam('Das ist ein normaler Kommentar über die Plattform.');
      expect(result.score).toBeLessThan(50);
    });

    it('should detect spam words', () => {
      const result = checkForSpam('Klicken Sie hier für kostenloses Geld!');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect excessive caps', () => {
      const result = checkForSpam('KAUFEN SIE JETZT!!! SUPER ANGEBOT!!!');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect multiple URLs as spam indicator', () => {
      const result = checkForSpam('Besuchen Sie https://spam-site.com und https://another-spam.com für mehr Info');
      expect(result.score).toBeGreaterThan(0);
    });
  });

  describe('checkForSpam', () => {
    it('should not flag normal comments as spam', () => {
      const result = checkForSpam('Ich finde diese Plattform sehr hilfreich für unser Unternehmen.');
      expect(result.isSpam).toBe(false);
    });

    it('should flag obvious spam', () => {
      const result = checkForSpam('KLICKEN SIE HIER!!! KOSTENLOS!!! http://spam.com JETZT KAUFEN!!!');
      expect(result.isSpam).toBe(true);
    });

    it('should return a score', () => {
      const result = checkForSpam('Normaler Text');
      expect(typeof result.score).toBe('number');
    });
  });

  describe('getModerationPriority', () => {
    it('should return urgent priority for very high spam scores', () => {
      const priority = getModerationPriority(70);
      expect(priority).toBe('urgent');
    });

    it('should return high priority for high spam scores', () => {
      const priority = getModerationPriority(50);
      expect(priority).toBe('high');
    });

    it('should return normal priority for medium spam scores', () => {
      const priority = getModerationPriority(30);
      expect(priority).toBe('normal');
    });

    it('should return low priority for low spam scores', () => {
      const priority = getModerationPriority(10);
      expect(priority).toBe('low');
    });
  });
});

describe('Email Validation', () => {
  it('should validate correct email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.de',
      'user+tag@example.org'
    ];
    
    validEmails.forEach(email => {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      '@nodomain.com',
      'no@domain',
      'spaces in@email.com'
    ];
    
    invalidEmails.forEach(email => {
      expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });
});
