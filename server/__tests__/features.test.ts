import { describe, it, expect } from 'vitest';
import { checkForSpam, getModerationPriority, shouldAutoApprove } from '../services/spam';
import { generateRobotsTxt } from '../sitemap';

describe('Spam Detection Service', () => {
  describe('checkForSpam', () => {
    it('should detect obvious spam content', () => {
      const result = checkForSpam(
        'CLICK HERE to win FREE MONEY!!! Visit bit.ly/scam now!!!',
        'user123',
        'test@tempmail.com'
      );
      
      expect(result.isSpam).toBe(true);
      expect(result.score).toBeGreaterThan(50);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('should not flag legitimate German business content', () => {
      const result = checkForSpam(
        'Vielen Dank für die ausführliche Übersicht der LLM-Plattformen. Die DSGVO-Compliance ist für unser Unternehmen sehr wichtig.',
        'Max Mustermann'
      );
      
      expect(result.isSpam).toBe(false);
      expect(result.score).toBeLessThan(50);
    });

    it('should detect excessive URLs', () => {
      const result = checkForSpam(
        'Check out https://example1.com and https://example2.com and https://example3.com',
        'Spammer'
      );
      
      expect(result.score).toBeGreaterThan(20);
      expect(result.reasons).toContain('Enthält 3 URLs');
    });

    it('should flag suspicious usernames', () => {
      const result = checkForSpam(
        'This is a normal comment.',
        'admin123'
      );
      
      expect(result.reasons.some(r => r.includes('Benutzername'))).toBe(true);
    });

    it('should flag disposable email addresses', () => {
      const result = checkForSpam(
        'Normal comment here.',
        'John',
        'test@mailinator.com'
      );
      
      expect(result.reasons.some(r => r.includes('Wegwerf-E-Mail'))).toBe(true);
    });

    it('should detect crypto/scam keywords', () => {
      const result = checkForSpam(
        'Join our NFT airdrop! 100x gains guaranteed with our presale! Click here for FREE bitcoin!!!',
        'CryptoKing123'
      );
      
      // Score should be elevated due to crypto keywords
      expect(result.score).toBeGreaterThan(30);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('getModerationPriority', () => {
    it('should return urgent for high spam scores', () => {
      expect(getModerationPriority(80)).toBe('urgent');
      expect(getModerationPriority(70)).toBe('urgent');
    });

    it('should return high for medium-high spam scores', () => {
      expect(getModerationPriority(60)).toBe('high');
      expect(getModerationPriority(50)).toBe('high');
    });

    it('should return normal for medium spam scores', () => {
      expect(getModerationPriority(40)).toBe('normal');
      expect(getModerationPriority(30)).toBe('normal');
    });

    it('should return low for low spam scores', () => {
      expect(getModerationPriority(20)).toBe('low');
      expect(getModerationPriority(10)).toBe('low');
    });
  });

  describe('shouldAutoApprove', () => {
    it('should auto-approve legitimate German content', () => {
      const result = shouldAutoApprove(
        'Sehr geehrte Damen und Herren, vielen Dank für die hilfreiche Übersicht der DSGVO-konformen Plattformen.',
        'Maria Schmidt'
      );
      
      expect(result).toBe(true);
    });

    it('should not auto-approve very short content', () => {
      const result = shouldAutoApprove('OK', 'User');
      expect(result).toBe(false);
    });

    it('should not auto-approve spam content', () => {
      const result = shouldAutoApprove(
        'FREE MONEY CLICK HERE NOW!!!',
        'spammer123'
      );
      
      expect(result).toBe(false);
    });
  });
});

describe('Sitemap and Robots.txt', () => {
  describe('generateRobotsTxt', () => {
    it('should generate valid robots.txt content', () => {
      const robotsTxt = generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Sitemap:');
      expect(robotsTxt).toContain('Disallow: /admin');
      expect(robotsTxt).toContain('Disallow: /api/');
    });
  });
});

describe('SEO Components', () => {
  it('should have SEO presets defined', async () => {
    // Import dynamically to avoid React context issues in tests
    const { SEOPresets } = await import('../../client/src/components/SEO');
    
    expect(SEOPresets.home).toBeDefined();
    expect(SEOPresets.home.title).toBeDefined();
    expect(SEOPresets.home.description).toBeDefined();
    expect(SEOPresets.home.url).toBe('/');
    
    expect(SEOPresets.blog).toBeDefined();
    expect(SEOPresets.blog.url).toBe('/blog');
  });
});
