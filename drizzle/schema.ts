import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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
export const platforms = mysqlTable("platforms", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  location: varchar("location", { length: 200 }),
  url: varchar("url", { length: 500 }),
  
  // Pricing
  pricingModel: mysqlEnum("pricingModel", ["Hybrid", "Nutzungsbasiert", "Pro User", "Einmalzahlung", "Enterprise"]).notNull(),
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
  
  // Company Details
  employees: varchar("employees", { length: 100 }),
  customers: varchar("customers", { length: 100 }),
  developers: varchar("developers", { length: 100 }),
  
  // Metadata
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = typeof platforms.$inferInsert;

/**
 * Blog Posts
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Blog Comments
 */
export const blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorName: varchar("authorName", { length: 200 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }),
  content: text("content").notNull(),
  
  // Moderation
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  moderatedAt: timestamp("moderatedAt"),
  moderatedBy: int("moderatedBy"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

/**
 * Platform Reviews (Community Ratings)
 */
export const platformReviews = mysqlTable("platform_reviews", {
  id: int("id").autoincrement().primaryKey(),
  platformId: int("platformId").notNull(),
  authorName: varchar("authorName", { length: 200 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 300 }),
  content: text("content"),
  isVerified: boolean("isVerified").default(false),
  
  // Moderation
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  moderatedAt: timestamp("moderatedAt"),
  moderatedBy: int("moderatedBy"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformReview = typeof platformReviews.$inferSelect;
export type InsertPlatformReview = typeof platformReviews.$inferInsert;

/**
 * Leads (Contact Requests)
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  platformId: int("platformId"),
  platformName: varchar("platformName", { length: 200 }),
  
  // Contact Info
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 200 }),
  phone: varchar("phone", { length: 50 }),
  
  // Request Details
  employeeCount: varchar("employeeCount", { length: 50 }),
  interest: mysqlEnum("interest", ["demo", "quote", "trial", "info"]).default("info"),
  message: text("message"),
  
  // Status
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "closed"]).default("new").notNull(),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Newsletter Subscribers
 */
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
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
export const platformSuggestions = mysqlTable("platform_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["new_platform", "correction", "feature_request"]).notNull(),
  
  // Suggestion Details
  platformName: varchar("platformName", { length: 200 }),
  platformUrl: varchar("platformUrl", { length: 500 }),
  description: text("description").notNull(),
  
  // Contact
  submitterName: varchar("submitterName", { length: 200 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  
  // Status
  status: mysqlEnum("status", ["pending", "reviewed", "implemented", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSuggestion = typeof platformSuggestions.$inferSelect;
export type InsertPlatformSuggestion = typeof platformSuggestions.$inferInsert;

/**
 * Members - Public user accounts for comments/suggestions
 * Separate from admin users table
 */
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  
  // Profile
  bio: text("bio"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  
  // Status
  isVerified: boolean("isVerified").default(false),
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

/**
 * Magic Link Login Codes
 */
export const loginCodes = mysqlTable("login_codes", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(), // 6-digit code
  
  // Expiration and usage
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  
  // Security
  attempts: int("attempts").default(0),
  ipAddress: varchar("ipAddress", { length: 45 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoginCode = typeof loginCodes.$inferSelect;
export type InsertLoginCode = typeof loginCodes.$inferInsert;

/**
 * Member Sessions
 */
export const memberSessions = mysqlTable("member_sessions", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("memberId").notNull(),
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
export const apiPricing = mysqlTable("api_pricing", {
  id: int("id").autoincrement().primaryKey(),
  platformId: int("platformId").notNull(),
  
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
  
  // Metadata
  notes: text("notes"),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApiPricing = typeof apiPricing.$inferSelect;
export type InsertApiPricing = typeof apiPricing.$inferInsert;
