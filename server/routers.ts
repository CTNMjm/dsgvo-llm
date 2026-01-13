import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { notifyNewLead, notifyNewReview, notifyNewComment, notifyNewSuggestion, notifyNewSubscriber } from "./services/email";
import { checkForSpam, getModerationPriority } from "./services/spam";
import * as magicLink from "./services/magicLink";

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
  // Member Auth (Magic Link)
  // ============================================
  memberAuth: router({
    // Request login code
    requestCode: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.ip || ctx.req.headers['x-forwarded-for']?.toString();
        return magicLink.requestLoginCode(input.email, ipAddress);
      }),
    
    // Verify code and login
    verifyCode: publicProcedure
      .input(z.object({ email: z.string().email(), code: z.string().length(6) }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.ip || ctx.req.headers['x-forwarded-for']?.toString();
        const userAgent = ctx.req.headers['user-agent'];
        const result = await magicLink.verifyLoginCode(input.email, input.code, ipAddress, userAgent);
        
        if (result.success && result.token) {
          // Set session cookie
          ctx.res.cookie('member_session', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
        }
        
        return result;
      }),
    
    // Get current member
    me: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.member_session;
      if (!token) return null;
      return magicLink.validateSession(token);
    }),
    
    // Logout
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const token = ctx.req.cookies?.member_session;
      if (token) {
        await magicLink.logout(token);
        ctx.res.clearCookie('member_session');
      }
      return { success: true };
    }),
    
    // Update profile
    updateProfile: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(200).optional(),
        bio: z.string().max(500).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const token = ctx.req.cookies?.member_session;
        if (!token) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Bitte melden Sie sich an.' });
        }
        
        const member = await magicLink.validateSession(token);
        if (!member) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Sitzung abgelaufen.' });
        }
        
        return magicLink.updateMemberProfile(member.id, input);
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
        // Check for spam
        const spamCheck = checkForSpam(input.content, input.authorName, input.authorEmail);
        const priority = getModerationPriority(spamCheck.score);
        
        // Log spam detection result
        console.log(`[Spam] Comment from ${input.authorName}: score=${spamCheck.score}, isSpam=${spamCheck.isSpam}, priority=${priority}`);
        if (spamCheck.reasons.length > 0) {
          console.log(`[Spam] Reasons: ${spamCheck.reasons.join(', ')}`);
        }
        
        // Create comment with spam metadata
        await db.createComment({
          ...input,
          // If spam score is very high, mark for urgent review
          // The status will still be 'pending' but admin can see priority
        });
        
        // Get post title for email notification
        const post = await db.getBlogPostById(input.postId);
        
        // Only send notification if not likely spam (to avoid alert fatigue)
        if (!spamCheck.isSpam) {
          notifyNewComment({
            authorName: input.authorName,
            content: input.content,
            postTitle: post?.title
          }).catch(err => console.error('[Email] Failed to send comment notification:', err));
        }
        
        return { 
          success: true, 
          message: 'Kommentar eingereicht. Er wird nach Prüfung veröffentlicht.',
          spamScore: spamCheck.score // Return for debugging
        };
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
    
    // Bulk actions
    bulkUpdateStatus: adminProcedure
      .input(z.object({
        ids: z.array(z.number()),
        status: z.enum(['pending', 'approved', 'rejected'])
      }))
      .mutation(async ({ input, ctx }) => {
        let successCount = 0;
        for (const id of input.ids) {
          try {
            await db.updateCommentStatus(id, input.status, ctx.user?.id);
            successCount++;
          } catch (error) {
            console.error(`[Bulk] Failed to update comment ${id}:`, error);
          }
        }
        return { success: true, updatedCount: successCount, totalCount: input.ids.length };
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
        // Get platform name for email notification
        const platform = await db.getPlatformById(input.platformId);
        // Send email notification (non-blocking)
        notifyNewReview({
          authorName: input.authorName,
          rating: input.rating,
          title: input.title,
          content: input.content,
          platformName: platform?.name
        }).catch(err => console.error('[Email] Failed to send review notification:', err));
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
    
    // Bulk actions
    bulkUpdateStatus: adminProcedure
      .input(z.object({
        ids: z.array(z.number()),
        status: z.enum(['pending', 'approved', 'rejected'])
      }))
      .mutation(async ({ input, ctx }) => {
        let successCount = 0;
        for (const id of input.ids) {
          try {
            await db.updateReviewStatus(id, input.status, ctx.user?.id);
            successCount++;
          } catch (error) {
            console.error(`[Bulk] Failed to update review ${id}:`, error);
          }
        }
        return { success: true, updatedCount: successCount, totalCount: input.ids.length };
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
        // Send email notification (non-blocking)
        notifyNewLead({
          name: input.name,
          email: input.email,
          company: input.company,
          platformName: input.platformName,
          interest: input.interest,
          message: input.message
        }).catch(err => console.error('[Email] Failed to send lead notification:', err));
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
        // Send email notification (non-blocking)
        notifyNewSubscriber({
          email: input.email,
          name: input.name
        }).catch(err => console.error('[Email] Failed to send subscriber notification:', err));
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
        // Send email notification (non-blocking)
        notifyNewSuggestion({
          type: input.type,
          platformName: input.platformName,
          description: input.description,
          submitterEmail: input.submitterEmail
        }).catch(err => console.error('[Email] Failed to send suggestion notification:', err));
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
  // API Pricing Routes
  // ============================================
  apiPricing: router({
    listByPlatform: publicProcedure
      .input(z.object({ platformId: z.number() }))
      .query(async ({ input }) => {
        return db.getApiPricingByPlatform(input.platformId);
      }),
    
    listAll: publicProcedure.query(async () => {
      return db.getAllApiPricing();
    }),
    
    // Filter API pricing by languages, capabilities, etc.
    filter: publicProcedure
      .input(z.object({
        languages: z.array(z.string()).optional(),
        capabilities: z.array(z.string()).optional(),
        providers: z.array(z.string()).optional(),
        minContextWindow: z.number().optional(),
        maxInputPrice: z.number().optional(),
        maxOutputPrice: z.number().optional()
      }))
      .query(async ({ input }) => {
        return db.getFilteredApiPricing(input);
      }),
    
    // Get list of all providers for filter dropdown
    providers: publicProcedure.query(async () => {
      return db.getApiPricingProviders();
    }),
    
    create: adminProcedure
      .input(z.object({
        platformId: z.number(),
        provider: z.string(),
        modelName: z.string(),
        modelVersion: z.string().optional(),
        inputPricePerMillion: z.string(),
        outputPricePerMillion: z.string(),
        regions: z.array(z.string()).optional(),
        notes: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        await db.createApiPricing(input);
        return { success: true, message: 'API-Preis hinzugefügt.' };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        provider: z.string().optional(),
        modelName: z.string().optional(),
        modelVersion: z.string().optional(),
        inputPricePerMillion: z.string().optional(),
        outputPricePerMillion: z.string().optional(),
        regions: z.array(z.string()).optional(),
        notes: z.string().optional(),
        isAvailable: z.boolean().optional()
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateApiPricing(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteApiPricing(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // Global Search
  // ============================================
  search: router({
    global: publicProcedure
      .input(z.object({ query: z.string().min(1).max(100) }))
      .query(async ({ input }) => {
        return db.globalSearch(input.query);
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
