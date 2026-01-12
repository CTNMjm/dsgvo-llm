import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../db';

describe('Database API Functions', () => {
  describe('Platforms', () => {
    it('should return all platforms', async () => {
      const platforms = await db.getAllPlatforms();
      expect(Array.isArray(platforms)).toBe(true);
      expect(platforms.length).toBeGreaterThan(0);
    });

    it('should get platform by slug', async () => {
      const platform = await db.getPlatformBySlug('langdock');
      expect(platform).toBeDefined();
      expect(platform?.name).toBe('Langdock');
    });

    it('should return undefined for non-existent platform', async () => {
      const platform = await db.getPlatformBySlug('non-existent-platform');
      expect(platform).toBeUndefined();
    });

    it('should search platforms by query', async () => {
      const results = await db.searchPlatforms('GPT');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Blog Posts', () => {
    it('should return published blog posts', async () => {
      const posts = await db.getAllBlogPosts(true);
      expect(Array.isArray(posts)).toBe(true);
      // All returned posts should be published
      posts.forEach(post => {
        expect(post.isPublished).toBe(true);
      });
    });

    it('should get blog post by slug', async () => {
      const posts = await db.getAllBlogPosts(true);
      if (posts.length > 0) {
        const post = await db.getBlogPostBySlug(posts[0].slug);
        expect(post).toBeDefined();
      }
    });
  });

  describe('Newsletter', () => {
    it('should subscribe to newsletter', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      await db.subscribeToNewsletter(testEmail, 'Test User');
      
      const subscribers = await db.getAllSubscribers();
      const found = subscribers.find(s => s.email === testEmail);
      expect(found).toBeDefined();
      expect(found?.isActive).toBe(true);
    });

    it('should handle duplicate subscription', async () => {
      const testEmail = `duplicate-${Date.now()}@example.com`;
      await db.subscribeToNewsletter(testEmail);
      // Should not throw on duplicate
      await db.subscribeToNewsletter(testEmail);
      
      const subscribers = await db.getAllSubscribers();
      const matches = subscribers.filter(s => s.email === testEmail);
      expect(matches.length).toBe(1);
    });

    it('should unsubscribe from newsletter', async () => {
      const testEmail = `unsub-${Date.now()}@example.com`;
      await db.subscribeToNewsletter(testEmail);
      await db.unsubscribeFromNewsletter(testEmail);
      
      // After unsubscribe, the subscriber should either be inactive or removed
      const subscribers = await db.getAllSubscribers();
      const found = subscribers.find(s => s.email === testEmail);
      // Either not found (deleted) or inactive
      if (found) {
        expect(found.isActive).toBe(false);
      } else {
        expect(found).toBeUndefined();
      }
    });
  });

  describe('Suggestions', () => {
    it('should create a suggestion', async () => {
      await db.createSuggestion({
        type: 'new_platform',
        platformName: 'Test Platform',
        description: 'Test description for new platform',
        submitterEmail: 'test@example.com'
      });
      
      const suggestions = await db.getAllSuggestions();
      const found = suggestions.find(s => s.platformName === 'Test Platform');
      expect(found).toBeDefined();
      expect(found?.status).toBe('pending');
    });

    it('should update suggestion status', async () => {
      const suggestions = await db.getAllSuggestions();
      const pending = suggestions.find(s => s.status === 'pending');
      
      if (pending) {
        await db.updateSuggestionStatus(pending.id, 'reviewed', 'Admin notes');
        const updated = await db.getAllSuggestions();
        const found = updated.find(s => s.id === pending.id);
        expect(found?.status).toBe('reviewed');
      }
    });
  });

  describe('Leads', () => {
    it('should create a lead', async () => {
      await db.createLead({
        name: 'Test Lead',
        email: `lead-${Date.now()}@example.com`,
        company: 'Test Company',
        platformName: 'Langdock',
        interest: 'demo'
      });
      
      const leads = await db.getAllLeads();
      const found = leads.find(l => l.name === 'Test Lead');
      expect(found).toBeDefined();
      expect(found?.status).toBe('new');
    });

    it('should update lead status', async () => {
      const leads = await db.getAllLeads();
      const newLead = leads.find(l => l.status === 'new');
      
      if (newLead) {
        await db.updateLeadStatus(newLead.id, 'contacted', 'Called customer');
        const updated = await db.getAllLeads();
        const found = updated.find(l => l.id === newLead.id);
        expect(found?.status).toBe('contacted');
      }
    });
  });

  describe('Reviews', () => {
    it('should create a review', async () => {
      const platforms = await db.getAllPlatforms();
      const platform = platforms[0];
      
      await db.createReview({
        platformId: platform.id,
        authorName: 'Test Reviewer',
        rating: 5,
        title: 'Great platform',
        content: 'Very satisfied with the service'
      });
      
      const reviews = await db.getAllReviews();
      const found = reviews.find(r => r.authorName === 'Test Reviewer');
      expect(found).toBeDefined();
      expect(found?.status).toBe('pending');
    });

    it('should get average rating', async () => {
      const platforms = await db.getAllPlatforms();
      const platform = platforms[0];
      
      const rating = await db.getAverageRating(platform.id);
      expect(rating).toHaveProperty('average');
      expect(rating).toHaveProperty('count');
    });
  });

  describe('Comments', () => {
    it('should create a comment', async () => {
      const posts = await db.getAllBlogPosts(true);
      const post = posts[0];
      
      if (post) {
        await db.createComment({
          postId: post.id,
          authorName: 'Test Commenter',
          content: 'Great article!'
        });
        
        const comments = await db.getAllComments();
        const found = comments.find(c => c.authorName === 'Test Commenter');
        expect(found).toBeDefined();
        expect(found?.status).toBe('pending');
      }
    });

    it('should get comments by post', async () => {
      const posts = await db.getAllBlogPosts(true);
      const post = posts[0];
      
      if (post) {
        const comments = await db.getCommentsByPostId(post.id, false);
        expect(Array.isArray(comments)).toBe(true);
      }
    });
  });

  describe('Admin Stats', () => {
    it('should return admin statistics', async () => {
      const stats = await db.getAdminStats();
      
      expect(stats).toHaveProperty('platforms');
      expect(stats).toHaveProperty('reviews');
      expect(stats).toHaveProperty('leads');
      expect(stats).toHaveProperty('comments');
      expect(stats).toHaveProperty('suggestions');
      expect(stats).toHaveProperty('subscribers');
      
      expect(typeof stats.platforms).toBe('number');
      expect(stats.reviews).toHaveProperty('total');
      expect(stats.reviews).toHaveProperty('pending');
    });
  });
});
