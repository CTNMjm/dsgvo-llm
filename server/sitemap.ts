import { getAllPlatforms, getAllBlogPosts } from './db';

const SITE_URL = process.env.SITE_URL || 'https://llm-vergleich.de';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(): Promise<string> {
  const urls: SitemapUrl[] = [];
  
  // Static pages
  urls.push(
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/blog', changefreq: 'daily', priority: 0.9 },
    { loc: '/impressum', changefreq: 'monthly', priority: 0.3 },
    { loc: '/datenschutz', changefreq: 'monthly', priority: 0.3 }
  );
  
  // Platform pages
  try {
    const platforms = await getAllPlatforms();
    for (const platform of platforms) {
      urls.push({
        loc: `/platform/${platform.slug}`,
        lastmod: platform.updatedAt ? new Date(platform.updatedAt).toISOString().split('T')[0] : undefined,
        changefreq: 'weekly',
        priority: 0.8
      });
    }
  } catch (error) {
    console.error('[Sitemap] Failed to fetch platforms:', error);
  }
  
  // Blog posts
  try {
    const posts = await getAllBlogPosts(true);
    for (const post of posts) {
      urls.push({
        loc: `/blog/${post.slug}`,
        lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : undefined,
        changefreq: 'monthly',
        priority: 0.7
      });
    }
  } catch (error) {
    console.error('[Sitemap] Failed to fetch blog posts:', error);
  }
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

export function generateRobotsTxt(): string {
  return `# robots.txt for ${SITE_URL}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/

# Crawl-delay for polite crawling
Crawl-delay: 1
`;
}
