import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // Platform Routes
  // ============================================
  platforms: router({
    list: publicProcedure.query(async () => {
      return db.getAllPlatforms();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const platform = await db.getPlatformBySlug(input.slug);
        if (!platform) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Platform not found' });
        }
        return platform;
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const platform = await db.getPlatformById(input.id);
        if (!platform) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Platform not found' });
        }
        return platform;
      }),
    
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        pricingModel: z.string().optional()
      }))
      .query(async ({ input }) => {
        return db.searchPlatforms(input.query || '', input.pricingModel);
      }),
  }),

  // ============================================
  // Blog Routes
  // ============================================
  blog: router({
    list: publicProcedure.query(async () => {
      return db.getAllBlogPosts(true);
    }),
    
    listAll: adminProcedure.query(async () => {
      return db.getAllBlogPosts(false);
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog post not found' });
        }
        return post;
      }),
    
    create: adminProcedure
      .input(z.object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        author: z.string(),
        category: z.string().optional(),
        readTime: z.string().optional(),
        imageUrl: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isPublished: z.boolean().optional()
      }))
      .mutation(async ({ input }) => {
        await db.createBlogPost(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        updates: z.object({
          title: z.string().optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          author: z.string().optional(),
          category: z.string().optional(),
          readTime: z.string().optional(),
          imageUrl: z.string().optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          isPublished: z.boolean().optional(),
          publishedAt: z.date().optional()
        })
      }))
      .mutation(async ({ input }) => {
        await db.updateBlogPost(input.id, input.updates);
        return { success: true };
      }),
  }),

  // ============================================
  // Comments Routes
  // ============================================
  comments: router({
    listByPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return db.getCommentsByPostId(input.postId, true);
      }),
    
    listAll: adminProcedure.query(async () => {
      return db.getAllComments();
    }),
    
    create: publicProcedure
      .input(z.object({
        postId: z.number(),
        authorName: z.string().min(1),
        authorEmail: z.string().email().optional(),
        content: z.string().min(1)
      }))
      .mutation(async ({ input }) => {
        await db.createComment(input);
        return { success: true, message: 'Kommentar eingereicht. Er wird nach Prüfung veröffentlicht.' };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected'])
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateCommentStatus(input.id, input.status, ctx.user?.id);
        return { success: true };
      }),
  }),

  // ============================================
  // Reviews Routes
  // ============================================
  reviews: router({
    listByPlatform: publicProcedure
      .input(z.object({ platformId: z.number() }))
      .query(async ({ input }) => {
        return db.getReviewsByPlatformId(input.platformId, true);
      }),
    
    listAll: adminProcedure.query(async () => {
      return db.getAllReviews();
    }),
    
    getAverageRating: publicProcedure
      .input(z.object({ platformId: z.number() }))
      .query(async ({ input }) => {
        return db.getAverageRating(input.platformId);
      }),
    
    create: publicProcedure
      .input(z.object({
        platformId: z.number(),
        authorName: z.string().min(1),
        authorEmail: z.string().email().optional(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        content: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        await db.createReview(input);
        return { success: true, message: 'Bewertung eingereicht. Sie wird nach Prüfung veröffentlicht.' };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'rejected'])
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateReviewStatus(input.id, input.status, ctx.user?.id);
        return { success: true };
      }),
  }),

  // ============================================
  // Leads Routes
  // ============================================
  leads: router({
    listAll: adminProcedure.query(async () => {
      return db.getAllLeads();
    }),
    
    create: publicProcedure
      .input(z.object({
        platformId: z.number().optional(),
        platformName: z.string().optional(),
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        phone: z.string().optional(),
        employeeCount: z.string().optional(),
        interest: z.enum(['demo', 'quote', 'trial', 'info']).optional(),
        message: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        await db.createLead(input);
        return { success: true, message: 'Anfrage erfolgreich gesendet. Wir melden uns in Kürze.' };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']),
        notes: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        await db.updateLeadStatus(input.id, input.status, input.notes);
        return { success: true };
      }),
  }),

  // ============================================
  // Newsletter Routes
  // ============================================
  newsletter: router({
    listSubscribers: adminProcedure.query(async () => {
      return db.getAllSubscribers();
    }),
    
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        await db.subscribeToNewsletter(input.email, input.name);
        return { success: true, message: 'Erfolgreich zum Newsletter angemeldet!' };
      }),
    
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.unsubscribeFromNewsletter(input.email);
        return { success: true, message: 'Erfolgreich vom Newsletter abgemeldet.' };
      }),
  }),

  // ============================================
  // Suggestions Routes
  // ============================================
  suggestions: router({
    listAll: adminProcedure.query(async () => {
      return db.getAllSuggestions();
    }),
    
    create: publicProcedure
      .input(z.object({
        type: z.enum(['new_platform', 'correction', 'feature_request']),
        platformName: z.string().optional(),
        platformUrl: z.string().optional(),
        description: z.string().min(1),
        submitterName: z.string().optional(),
        submitterEmail: z.string().email().optional()
      }))
      .mutation(async ({ input }) => {
        await db.createSuggestion(input);
        return { success: true, message: 'Vielen Dank für Ihren Vorschlag!' };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'reviewed', 'implemented', 'rejected']),
        adminNotes: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        await db.updateSuggestionStatus(input.id, input.status, input.adminNotes);
        return { success: true };
      }),
  }),

  // ============================================
  // Admin Routes
  // ============================================
  admin: router({
    stats: adminProcedure.query(async () => {
      return db.getAdminStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
