import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, json, serial } from "drizzle-orm/pg-core";

/**
 * PostgreSQL Enums
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const pricingModelEnum = pgEnum("pricing_model", ["Hybrid", "Nutzungsbasiert", "Pro User", "Einmalzahlung", "Enterprise"]);
export const commentStatusEnum = pgEnum("comment_status", ["pending", "approved", "rejected"]);
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);
export const interestEnum = pgEnum("interest", ["demo", "quote", "trial", "info"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "converted", "closed"]);
export const suggestionTypeEnum = pgEnum("suggestion_type", ["new_platform", "correction", "feature_request"]);
export const suggestionStatusEnum = pgEnum("suggestion_status", ["pending", "reviewed", "implemented", "rejected"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// LLM Platform Comparison Tables
// ============================================

/**
 * LLM Platforms - Core comparison data
 */
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  location: varchar("location", { length: 200 }),
  url: varchar("url", { length: 500 }),
  
  // Pricing
  pricingModel: pricingModelEnum("pricingModel").notNull(),
  basePrice: varchar("basePrice", { length: 200 }),
  tokenBased: boolean("tokenBased").default(false),
  
  // Compliance (stored as JSON text)
  compliance: json("compliance").$type<string[]>(),
  
  // Custom GPTs
  customGPTs: boolean("customGPTs").default(false),
  customGPTDetails: text("customGPTDetails"),
  
  // Features, Pros, Cons (stored as JSON arrays)
  features: json("features").$type<string[]>(),
  pros: json("pros").$type<string[]>(),
  cons: json("cons").$type<string[]>(),
  
  // Extended Info
  description: text("description"),
  screenshotUrl: varchar("screenshotUrl", { length: 500 }),
  logoUrl: varchar("logoUrl", { length: 500 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  
  // Company Details
  employees: varchar("employees", { length: 100 }),
  customers: varchar("customers", { length: 100 }),
  developers: varchar("developers", { length: 100 }),
  
  // Metadata
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = typeof platforms.$inferInsert;

/**
 * Blog Posts
 */
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: varchar("author", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }),
  readTime: varchar("readTime", { length: 50 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  
  // SEO
  metaTitle: varchar("metaTitle", { length: 200 }),
  metaDescription: text("metaDescription"),
  
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Blog Comments
 */
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  authorName: varchar("authorName", { length: 200 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }),
  content: text("content").notNull(),
  
  // Moderation
  status: commentStatusEnum("status").default("pending").notNull(),
  moderatedAt: timestamp("moderatedAt"),
  moderatedBy: integer("moderatedBy"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

/**
 * Platform Reviews (Community Ratings)
 */
export const platformReviews = pgTable("platform_reviews", {
  id: serial("id").primaryKey(),
  platformId: integer("platformId").notNull(),
  authorName: varchar("authorName", { length: 200 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 300 }),
  content: text("content"),
  isVerified: boolean("isVerified").default(false),
  
  // Moderation
  status: reviewStatusEnum("status").default("pending").notNull(),
  moderatedAt: timestamp("moderatedAt"),
  moderatedBy: integer("moderatedBy"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformReview = typeof platformReviews.$inferSelect;
export type InsertPlatformReview = typeof platformReviews.$inferInsert;

/**
 * Leads (Contact Requests)
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  platformId: integer("platformId"),
  platformName: varchar("platformName", { length: 200 }),
  
  // Contact Info
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 200 }),
  phone: varchar("phone", { length: 50 }),
  
  // Request Details
  employeeCount: varchar("employeeCount", { length: 50 }),
  interest: interestEnum("interest").default("info"),
  message: text("message"),
  
  // Status
  status: leadStatusEnum("status").default("new").notNull(),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Newsletter Subscribers
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  
  isActive: boolean("isActive").default(true),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Platform Suggestions (User Feedback)
 */
export const platformSuggestions = pgTable("platform_suggestions", {
  id: serial("id").primaryKey(),
  type: suggestionTypeEnum("type").notNull(),
  
  // Suggestion Details
  platformName: varchar("platformName", { length: 200 }),
  platformUrl: varchar("platformUrl", { length: 500 }),
  description: text("description").notNull(),
  
  // Contact
  submitterName: varchar("submitterName", { length: 200 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  
  // Status
  status: suggestionStatusEnum("status").default("pending").notNull(),
  adminNotes: text("adminNotes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PlatformSuggestion = typeof platformSuggestions.$inferSelect;
export type InsertPlatformSuggestion = typeof platformSuggestions.$inferInsert;

/**
 * Members - Public user accounts for comments/suggestions
 * Separate from admin users table
 */
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  
  // Profile
  bio: text("bio"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  
  // Status
  isVerified: boolean("isVerified").default(false),
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

/**
 * Magic Link Login Codes
 */
export const loginCodes = pgTable("login_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(), // 6-digit code
  
  // Expiration and usage
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  
  // Security
  attempts: integer("attempts").default(0),
  ipAddress: varchar("ipAddress", { length: 45 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoginCode = typeof loginCodes.$inferSelect;
export type InsertLoginCode = typeof loginCodes.$inferInsert;

/**
 * Member Sessions
 */
export const memberSessions = pgTable("member_sessions", {
  id: serial("id").primaryKey(),
  memberId: integer("memberId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
  
  // Device info
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
});

export type MemberSession = typeof memberSessions.$inferSelect;
export type InsertMemberSession = typeof memberSessions.$inferInsert;

/**
 * API Pricing - Model prices per platform
 */
export const apiPricing = pgTable("api_pricing", {
  id: serial("id").primaryKey(),
  platformId: integer("platformId").notNull(),
  
  // Model info
  provider: varchar("provider", { length: 100 }).notNull(), // OpenAI, Anthropic, Google, etc.
  modelName: varchar("modelName", { length: 200 }).notNull(),
  modelVersion: varchar("modelVersion", { length: 100 }),
  
  // Pricing (in EUR per 1M tokens)
  inputPricePerMillion: varchar("inputPricePerMillion", { length: 50 }).notNull(),
  outputPricePerMillion: varchar("outputPricePerMillion", { length: 50 }).notNull(),
  
  // Availability
  regions: json("regions").$type<string[]>(), // ["EU", "US", "Global"]
  isAvailable: boolean("isAvailable").default(true),
  
  // Supported languages (for filtering)
  supportedLanguages: json("supportedLanguages").$type<string[]>(), // ["de", "en", "fr", "es", etc.]
  
  // Model capabilities/functions (for filtering)
  capabilities: json("capabilities").$type<string[]>(), // ["chat", "code", "embedding", "vision", "audio"]
  
  // Context window size
  contextWindow: integer("contextWindow"), // in tokens
  
  // Metadata
  notes: text("notes"),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApiPricing = typeof apiPricing.$inferSelect;
export type InsertApiPricing = typeof apiPricing.$inferInsert;
