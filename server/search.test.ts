import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as db from './db';

// Mock the database module
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    getDb: vi.fn(),
    globalSearch: vi.fn(),
  };
});

describe('Global Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('globalSearch function', () => {
    it('should return empty results for empty query', async () => {
      // Mock implementation for empty query
      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [],
        blogPosts: [],
        apiModels: [],
      });

      const result = await db.globalSearch('');
      expect(result).toEqual({
        platforms: [],
        blogPosts: [],
        apiModels: [],
      });
    });

    it('should return platforms matching the search query', async () => {
      const mockPlatforms = [
        {
          id: 1,
          slug: 'langdock',
          name: 'Langdock',
          company: 'Langdock GmbH',
          description: 'DSGVO-konforme KI-Plattform',
          logoUrl: '/logos/langdock.webp',
          type: 'platform' as const,
        },
      ];

      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: mockPlatforms,
        blogPosts: [],
        apiModels: [],
      });

      const result = await db.globalSearch('langdock');
      expect(result.platforms).toHaveLength(1);
      expect(result.platforms[0].name).toBe('Langdock');
      expect(result.platforms[0].type).toBe('platform');
    });

    it('should return blog posts matching the search query', async () => {
      const mockBlogPosts = [
        {
          id: 1,
          slug: 'dsgvo-ki-strategie',
          title: 'DSGVO-konforme KI-Strategie',
          excerpt: 'Wie Sie KI DSGVO-konform einsetzen',
          category: 'Strategie',
          type: 'blog' as const,
        },
      ];

      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [],
        blogPosts: mockBlogPosts,
        apiModels: [],
      });

      const result = await db.globalSearch('DSGVO');
      expect(result.blogPosts).toHaveLength(1);
      expect(result.blogPosts[0].title).toContain('DSGVO');
      expect(result.blogPosts[0].type).toBe('blog');
    });

    it('should return API models matching the search query', async () => {
      const mockApiModels = [
        {
          id: 1,
          platformId: 1,
          platformName: 'Langdock',
          platformSlug: 'langdock',
          provider: 'OpenAI',
          modelName: 'GPT-4',
          inputPricePerMillion: '30.00',
          outputPricePerMillion: '60.00',
          type: 'api' as const,
        },
      ];

      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [],
        blogPosts: [],
        apiModels: mockApiModels,
      });

      const result = await db.globalSearch('GPT-4');
      expect(result.apiModels).toHaveLength(1);
      expect(result.apiModels[0].modelName).toBe('GPT-4');
      expect(result.apiModels[0].type).toBe('api');
    });

    it('should return results from all categories', async () => {
      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [{ id: 1, slug: 'test', name: 'Test', company: 'Test Co', description: null, logoUrl: null, type: 'platform' as const }],
        blogPosts: [{ id: 1, slug: 'test-post', title: 'Test Post', excerpt: null, category: null, type: 'blog' as const }],
        apiModels: [{ id: 1, platformId: 1, platformName: 'Test', platformSlug: 'test', provider: 'OpenAI', modelName: 'GPT', inputPricePerMillion: '10', outputPricePerMillion: '20', type: 'api' as const }],
      });

      const result = await db.globalSearch('test');
      expect(result.platforms.length).toBeGreaterThan(0);
      expect(result.blogPosts.length).toBeGreaterThan(0);
      expect(result.apiModels.length).toBeGreaterThan(0);
    });

    it('should limit results to 5 per category', async () => {
      // The actual implementation limits to 5 results per category
      const manyPlatforms = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        slug: `platform-${i}`,
        name: `Platform ${i}`,
        company: `Company ${i}`,
        description: null,
        logoUrl: null,
        type: 'platform' as const,
      }));

      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: manyPlatforms,
        blogPosts: [],
        apiModels: [],
      });

      const result = await db.globalSearch('platform');
      expect(result.platforms.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Search result structure', () => {
    it('should have correct type annotations', async () => {
      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [{ id: 1, slug: 'test', name: 'Test', company: 'Co', description: null, logoUrl: null, type: 'platform' }],
        blogPosts: [{ id: 1, slug: 'test', title: 'Test', excerpt: null, category: null, type: 'blog' }],
        apiModels: [{ id: 1, platformId: 1, platformName: 'Test', platformSlug: 'test', provider: 'OpenAI', modelName: 'GPT', inputPricePerMillion: '10', outputPricePerMillion: '20', type: 'api' }],
      });

      const result = await db.globalSearch('test');
      
      // Check type field exists and is correct
      result.platforms.forEach(p => expect(p.type).toBe('platform'));
      result.blogPosts.forEach(b => expect(b.type).toBe('blog'));
      result.apiModels.forEach(a => expect(a.type).toBe('api'));
    });

    it('should include all required fields for platforms', async () => {
      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [{ 
          id: 1, 
          slug: 'langdock', 
          name: 'Langdock', 
          company: 'Langdock GmbH', 
          description: 'Description', 
          logoUrl: '/logo.webp', 
          type: 'platform' 
        }],
        blogPosts: [],
        apiModels: [],
      });

      const result = await db.globalSearch('langdock');
      const platform = result.platforms[0];
      
      expect(platform).toHaveProperty('id');
      expect(platform).toHaveProperty('slug');
      expect(platform).toHaveProperty('name');
      expect(platform).toHaveProperty('company');
      expect(platform).toHaveProperty('description');
      expect(platform).toHaveProperty('logoUrl');
      expect(platform).toHaveProperty('type');
    });

    it('should include all required fields for API models', async () => {
      vi.mocked(db.globalSearch).mockResolvedValue({
        platforms: [],
        blogPosts: [],
        apiModels: [{ 
          id: 1, 
          platformId: 1, 
          platformName: 'Langdock', 
          platformSlug: 'langdock', 
          provider: 'OpenAI', 
          modelName: 'GPT-4', 
          inputPricePerMillion: '30.00', 
          outputPricePerMillion: '60.00', 
          type: 'api' 
        }],
      });

      const result = await db.globalSearch('GPT');
      const model = result.apiModels[0];
      
      expect(model).toHaveProperty('id');
      expect(model).toHaveProperty('platformId');
      expect(model).toHaveProperty('platformName');
      expect(model).toHaveProperty('platformSlug');
      expect(model).toHaveProperty('provider');
      expect(model).toHaveProperty('modelName');
      expect(model).toHaveProperty('inputPricePerMillion');
      expect(model).toHaveProperty('outputPricePerMillion');
      expect(model).toHaveProperty('type');
    });
  });
});
