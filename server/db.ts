import { eq, desc, and, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  platforms, Platform, InsertPlatform,
  blogPosts, BlogPost, InsertBlogPost,
  blogComments, BlogComment, InsertBlogComment,
  platformReviews, PlatformReview, InsertPlatformReview,
  leads, Lead, InsertLead,
  newsletterSubscribers, NewsletterSubscriber, InsertNewsletterSubscriber,
  platformSuggestions, PlatformSuggestion, InsertPlatformSuggestion,
  apiPricing, ApiPricing, InsertApiPricing
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// User Functions
// ============================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// Platform Functions
// ============================================

export async function getAllPlatforms(): Promise<Platform[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(platforms).where(eq(platforms.isActive, true)).orderBy(platforms.name);
}

export async function getPlatformBySlug(slug: string): Promise<Platform | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(platforms).where(eq(platforms.slug, slug)).limit(1);
  return result[0];
}

export async function getPlatformById(id: number): Promise<Platform | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(platforms).where(eq(platforms.id, id)).limit(1);
  return result[0];
}

export async function searchPlatforms(query: string, pricingModel?: string): Promise<Platform[]> {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = [eq(platforms.isActive, true)];
  
  if (query) {
    conditions.push(
      sql`(${platforms.name} LIKE ${`%${query}%`} OR ${platforms.company} LIKE ${`%${query}%`} OR ${platforms.description} LIKE ${`%${query}%`})`
    );
  }
  
  if (pricingModel && pricingModel !== 'all') {
    conditions.push(eq(platforms.pricingModel, pricingModel as any));
  }
  
  return db.select().from(platforms).where(and(...conditions)).orderBy(platforms.name);
}

// ============================================
// Blog Functions
// ============================================

export async function getAllBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (publishedOnly) {
    return db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
  }
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function createBlogPost(post: InsertBlogPost): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(blogPosts).values(post);
}

export async function updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
}

// ============================================
// Blog Comments Functions
// ============================================

export async function getCommentsByPostId(postId: number, approvedOnly = true): Promise<BlogComment[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (approvedOnly) {
    return db.select().from(blogComments)
      .where(and(eq(blogComments.postId, postId), eq(blogComments.status, 'approved')))
      .orderBy(desc(blogComments.createdAt));
  }
  return db.select().from(blogComments)
    .where(eq(blogComments.postId, postId))
    .orderBy(desc(blogComments.createdAt));
}

export async function getAllComments(): Promise<BlogComment[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogComments).orderBy(desc(blogComments.createdAt));
}

export async function createComment(comment: InsertBlogComment): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(blogComments).values(comment);
}

export async function updateCommentStatus(id: number, status: 'pending' | 'approved' | 'rejected', moderatorId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogComments).set({
    status,
    moderatedAt: new Date(),
    moderatedBy: moderatorId
  }).where(eq(blogComments.id, id));
}

// ============================================
// Platform Reviews Functions
// ============================================

export async function getReviewsByPlatformId(platformId: number, approvedOnly = true): Promise<PlatformReview[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (approvedOnly) {
    return db.select().from(platformReviews)
      .where(and(eq(platformReviews.platformId, platformId), eq(platformReviews.status, 'approved')))
      .orderBy(desc(platformReviews.createdAt));
  }
  return db.select().from(platformReviews)
    .where(eq(platformReviews.platformId, platformId))
    .orderBy(desc(platformReviews.createdAt));
}

export async function getAllReviews(): Promise<PlatformReview[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(platformReviews).orderBy(desc(platformReviews.createdAt));
}

export async function createReview(review: InsertPlatformReview): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(platformReviews).values(review);
}

export async function updateReviewStatus(id: number, status: 'pending' | 'approved' | 'rejected', moderatorId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(platformReviews).set({
    status,
    moderatedAt: new Date(),
    moderatedBy: moderatorId
  }).where(eq(platformReviews.id, id));
}

export async function getAverageRating(platformId: number): Promise<{ average: number; count: number }> {
  const db = await getDb();
  if (!db) return { average: 0, count: 0 };
  
  const result = await db.select({
    average: sql<number>`AVG(${platformReviews.rating})`,
    count: sql<number>`COUNT(*)`
  }).from(platformReviews)
    .where(and(eq(platformReviews.platformId, platformId), eq(platformReviews.status, 'approved')));
  
  return {
    average: result[0]?.average || 0,
    count: result[0]?.count || 0
  };
}

// ============================================
// Leads Functions
// ============================================

export async function getAllLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function createLead(lead: InsertLead): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(leads).values(lead);
}

export async function updateLeadStatus(id: number, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed', notes?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(leads).set({
    status,
    notes: notes || undefined
  }).where(eq(leads.id, id));
}

// ============================================
// Newsletter Functions
// ============================================

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)).orderBy(desc(newsletterSubscribers.subscribedAt));
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(newsletterSubscribers).values({
    email,
    name
  }).onDuplicateKeyUpdate({
    set: { isActive: true, unsubscribedAt: null }
  });
}

export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(newsletterSubscribers).set({
    isActive: false,
    unsubscribedAt: new Date()
  }).where(eq(newsletterSubscribers.email, email));
}

// ============================================
// Platform Suggestions Functions
// ============================================

export async function getAllSuggestions(): Promise<PlatformSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(platformSuggestions).orderBy(desc(platformSuggestions.createdAt));
}

export async function createSuggestion(suggestion: InsertPlatformSuggestion): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(platformSuggestions).values(suggestion);
}

export async function updateSuggestionStatus(id: number, status: 'pending' | 'reviewed' | 'implemented' | 'rejected', adminNotes?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(platformSuggestions).set({
    status,
    adminNotes: adminNotes || undefined
  }).where(eq(platformSuggestions.id, id));
}

// ============================================
// Admin Statistics
// ============================================

// ============================================
// API Pricing Functions
// ============================================

export async function getApiPricingByPlatform(platformId: number): Promise<ApiPricing[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(apiPricing)
    .where(and(eq(apiPricing.platformId, platformId), eq(apiPricing.isAvailable, true)))
    .orderBy(apiPricing.provider, apiPricing.modelName);
}

export async function getAllApiPricing(): Promise<ApiPricing[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(apiPricing)
    .where(eq(apiPricing.isAvailable, true))
    .orderBy(apiPricing.provider, apiPricing.modelName);
}

export interface ApiPricingFilter {
  languages?: string[];
  capabilities?: string[];
  providers?: string[];
  minContextWindow?: number;
  maxInputPrice?: number;
  maxOutputPrice?: number;
}

export async function getFilteredApiPricing(filter: ApiPricingFilter): Promise<ApiPricing[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Get all pricing first, then filter in memory (JSON columns can't be filtered efficiently in SQL)
  const allPricing = await db.select().from(apiPricing)
    .where(eq(apiPricing.isAvailable, true))
    .orderBy(apiPricing.provider, apiPricing.modelName);
  
  return allPricing.filter(p => {
    // Filter by languages
    if (filter.languages && filter.languages.length > 0) {
      const langs = p.supportedLanguages as string[] | null;
      if (!langs || !filter.languages.some(l => langs.includes(l))) {
        return false;
      }
    }
    
    // Filter by capabilities
    if (filter.capabilities && filter.capabilities.length > 0) {
      const caps = p.capabilities as string[] | null;
      if (!caps || !filter.capabilities.some(c => caps.includes(c))) {
        return false;
      }
    }
    
    // Filter by providers
    if (filter.providers && filter.providers.length > 0) {
      if (!filter.providers.includes(p.provider)) {
        return false;
      }
    }
    
    // Filter by context window
    if (filter.minContextWindow && (!p.contextWindow || p.contextWindow < filter.minContextWindow)) {
      return false;
    }
    
    // Filter by max input price
    if (filter.maxInputPrice) {
      const inputPrice = parseFloat(p.inputPricePerMillion);
      if (inputPrice > filter.maxInputPrice) {
        return false;
      }
    }
    
    // Filter by max output price
    if (filter.maxOutputPrice) {
      const outputPrice = parseFloat(p.outputPricePerMillion);
      if (outputPrice > filter.maxOutputPrice) {
        return false;
      }
    }
    
    return true;
  });
}

export async function getApiPricingProviders(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.selectDistinct({ provider: apiPricing.provider })
    .from(apiPricing)
    .where(eq(apiPricing.isAvailable, true))
    .orderBy(apiPricing.provider);
  
  return result.map(r => r.provider);
}

export async function createApiPricing(pricing: InsertApiPricing): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(apiPricing).values(pricing);
}

export async function updateApiPricing(id: number, pricing: Partial<InsertApiPricing>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(apiPricing).set(pricing).where(eq(apiPricing.id, id));
}

export async function deleteApiPricing(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(apiPricing).where(eq(apiPricing.id, id));
}

// ============================================
// Admin Statistics
// ============================================

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [platformCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(platforms).where(eq(platforms.isActive, true));
  const [reviewCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(platformReviews);
  const [pendingReviews] = await db.select({ count: sql<number>`COUNT(*)` }).from(platformReviews).where(eq(platformReviews.status, 'pending'));
  const [leadCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(leads);
  const [newLeads] = await db.select({ count: sql<number>`COUNT(*)` }).from(leads).where(eq(leads.status, 'new'));
  const [commentCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(blogComments);
  const [pendingComments] = await db.select({ count: sql<number>`COUNT(*)` }).from(blogComments).where(eq(blogComments.status, 'pending'));
  const [suggestionCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(platformSuggestions);
  const [pendingSuggestions] = await db.select({ count: sql<number>`COUNT(*)` }).from(platformSuggestions).where(eq(platformSuggestions.status, 'pending'));
  const [subscriberCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true));
  
  return {
    platforms: platformCount?.count || 0,
    reviews: { total: reviewCount?.count || 0, pending: pendingReviews?.count || 0 },
    leads: { total: leadCount?.count || 0, new: newLeads?.count || 0 },
    comments: { total: commentCount?.count || 0, pending: pendingComments?.count || 0 },
    suggestions: { total: suggestionCount?.count || 0, pending: pendingSuggestions?.count || 0 },
    subscribers: subscriberCount?.count || 0
  };
}


// ============================================
// Global Search
// ============================================

export interface GlobalSearchResult {
  platforms: Array<{
    id: number;
    slug: string;
    name: string;
    company: string;
    description: string | null;
    logoUrl: string | null;
    type: 'platform';
  }>;
  blogPosts: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    type: 'blog';
  }>;
  apiModels: Array<{
    id: number;
    platformId: number;
    platformName: string;
    platformSlug: string;
    provider: string;
    modelName: string;
    inputPricePerMillion: string;
    outputPricePerMillion: string;
    type: 'api';
  }>;
}

export async function globalSearch(query: string): Promise<GlobalSearchResult> {
  const db = await getDb();
  if (!db || !query.trim()) {
    return { platforms: [], blogPosts: [], apiModels: [] };
  }
  
  const searchTerm = `%${query.trim()}%`;
  
  // Search platforms
  const platformResults = await db.select({
    id: platforms.id,
    slug: platforms.slug,
    name: platforms.name,
    company: platforms.company,
    description: platforms.description,
    logoUrl: platforms.logoUrl,
  })
    .from(platforms)
    .where(and(
      eq(platforms.isActive, true),
      sql`(${platforms.name} LIKE ${searchTerm} OR ${platforms.company} LIKE ${searchTerm} OR ${platforms.description} LIKE ${searchTerm})`
    ))
    .limit(5);
  
  // Search blog posts
  const blogResults = await db.select({
    id: blogPosts.id,
    slug: blogPosts.slug,
    title: blogPosts.title,
    excerpt: blogPosts.excerpt,
    category: blogPosts.category,
  })
    .from(blogPosts)
    .where(and(
      eq(blogPosts.isPublished, true),
      sql`(${blogPosts.title} LIKE ${searchTerm} OR ${blogPosts.excerpt} LIKE ${searchTerm} OR ${blogPosts.content} LIKE ${searchTerm})`
    ))
    .limit(5);
  
  // Search API models (join with platforms for name/slug)
  const apiResults = await db.select({
    id: apiPricing.id,
    platformId: apiPricing.platformId,
    platformName: platforms.name,
    platformSlug: platforms.slug,
    provider: apiPricing.provider,
    modelName: apiPricing.modelName,
    inputPricePerMillion: apiPricing.inputPricePerMillion,
    outputPricePerMillion: apiPricing.outputPricePerMillion,
  })
    .from(apiPricing)
    .innerJoin(platforms, eq(apiPricing.platformId, platforms.id))
    .where(and(
      eq(apiPricing.isAvailable, true),
      sql`(${apiPricing.provider} LIKE ${searchTerm} OR ${apiPricing.modelName} LIKE ${searchTerm})`
    ))
    .limit(5);
  
  return {
    platforms: platformResults.map(p => ({ ...p, type: 'platform' as const })),
    blogPosts: blogResults.map(b => ({ ...b, type: 'blog' as const })),
    apiModels: apiResults.map(a => ({ ...a, type: 'api' as const })),
  };
}
