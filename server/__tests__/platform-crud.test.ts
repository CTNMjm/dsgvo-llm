import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from '../db';

describe('Platform CRUD Operations', () => {
  let testPlatformId: number;
  const testSlug = `test-platform-${Date.now()}`;

  describe('Create Platform', () => {
    it('should create a new platform', async () => {
      const platform = await db.createPlatform({
        slug: testSlug,
        name: 'Test Platform',
        company: 'Test Company',
        pricingModel: 'Nutzungsbasiert',
        location: 'Germany',
        description: 'A test platform for unit testing',
        isActive: true,
      });

      expect(platform).toBeDefined();
      expect(platform.id).toBeDefined();
      expect(platform.slug).toBe(testSlug);
      expect(platform.name).toBe('Test Platform');
      expect(platform.company).toBe('Test Company');
      expect(platform.pricingModel).toBe('Nutzungsbasiert');
      
      testPlatformId = platform.id;
    });
  });

  describe('Read Platform', () => {
    it('should get platform by ID', async () => {
      const platform = await db.getPlatformById(testPlatformId);
      
      expect(platform).toBeDefined();
      expect(platform?.id).toBe(testPlatformId);
      expect(platform?.slug).toBe(testSlug);
    });

    it('should get platform by slug', async () => {
      const platform = await db.getPlatformBySlug(testSlug);
      
      expect(platform).toBeDefined();
      expect(platform?.id).toBe(testPlatformId);
      expect(platform?.name).toBe('Test Platform');
    });

    it('should list all platforms (admin)', async () => {
      const platforms = await db.getAllPlatformsAdmin();
      
      expect(Array.isArray(platforms)).toBe(true);
      expect(platforms.length).toBeGreaterThan(0);
      
      const testPlatform = platforms.find(p => p.id === testPlatformId);
      expect(testPlatform).toBeDefined();
    });
  });

  describe('Update Platform', () => {
    it('should update platform details', async () => {
      const updated = await db.updatePlatform(testPlatformId, {
        name: 'Updated Test Platform',
        basePrice: '€99/Monat',
        tokenBased: true,
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Test Platform');
      expect(updated?.basePrice).toBe('€99/Monat');
      expect(updated?.tokenBased).toBe(true);
      // Original values should remain
      expect(updated?.company).toBe('Test Company');
    });

    it('should update platform compliance array', async () => {
      const updated = await db.updatePlatform(testPlatformId, {
        compliance: ['DSGVO', 'ISO 27001'],
      });

      expect(updated).toBeDefined();
      expect(updated?.compliance).toEqual(['DSGVO', 'ISO 27001']);
    });
  });

  describe('Delete Platform', () => {
    it('should soft delete (deactivate) platform', async () => {
      await db.deletePlatform(testPlatformId);
      
      const platform = await db.getPlatformById(testPlatformId);
      expect(platform?.isActive).toBe(false);
    });

    it('should not show deactivated platform in public list', async () => {
      const platforms = await db.getAllPlatforms();
      const testPlatform = platforms.find(p => p.id === testPlatformId);
      expect(testPlatform).toBeUndefined();
    });

    it('should show deactivated platform in admin list', async () => {
      const platforms = await db.getAllPlatformsAdmin();
      const testPlatform = platforms.find(p => p.id === testPlatformId);
      expect(testPlatform).toBeDefined();
      expect(testPlatform?.isActive).toBe(false);
    });

    it('should reactivate platform', async () => {
      const updated = await db.updatePlatform(testPlatformId, {
        isActive: true,
      });

      expect(updated?.isActive).toBe(true);
    });
  });

  // Cleanup
  afterAll(async () => {
    // Hard delete the test platform
    if (testPlatformId) {
      await db.hardDeletePlatform(testPlatformId);
    }
  });
});
