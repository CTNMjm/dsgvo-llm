/**
 * Export all database data as SQL INSERT statements
 * Run with: node scripts/export-seed-data.mjs
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  const seedDir = path.join(process.cwd(), 'drizzle', 'seeds');
  if (!fs.existsSync(seedDir)) {
    fs.mkdirSync(seedDir, { recursive: true });
  }
  
  // Helper to escape SQL values
  const escapeValue = (val) => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'boolean') return val ? '1' : '0';
    if (typeof val === 'number') return val.toString();
    if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    return `'${String(val).replace(/'/g, "''")}'`;
  };
  
  // Export platforms
  console.log('Exporting platforms...');
  const [platforms] = await connection.execute('SELECT * FROM platforms ORDER BY id');
  let platformsSql = '-- Platforms seed data\n-- Generated: ' + new Date().toISOString() + '\n\n';
  platformsSql += 'DELETE FROM platforms;\n\n';
  
  for (const p of platforms) {
    const columns = Object.keys(p).filter(k => k !== 'id').join(', ');
    const values = Object.keys(p).filter(k => k !== 'id').map(k => escapeValue(p[k])).join(', ');
    platformsSql += `INSERT INTO platforms (${columns}) VALUES (${values});\n`;
  }
  fs.writeFileSync(path.join(seedDir, '01-platforms.sql'), platformsSql);
  console.log(`  Exported ${platforms.length} platforms`);
  
  // Export API pricing
  console.log('Exporting API pricing...');
  const [apiPricing] = await connection.execute('SELECT * FROM api_pricing ORDER BY id');
  let apiPricingSql = '-- API Pricing seed data\n-- Generated: ' + new Date().toISOString() + '\n\n';
  apiPricingSql += 'DELETE FROM api_pricing;\n\n';
  
  for (const p of apiPricing) {
    const columns = Object.keys(p).filter(k => k !== 'id').join(', ');
    const values = Object.keys(p).filter(k => k !== 'id').map(k => escapeValue(p[k])).join(', ');
    apiPricingSql += `INSERT INTO api_pricing (${columns}) VALUES (${values});\n`;
  }
  fs.writeFileSync(path.join(seedDir, '02-api-pricing.sql'), apiPricingSql);
  console.log(`  Exported ${apiPricing.length} API pricing entries`);
  
  // Export blog posts
  console.log('Exporting blog posts...');
  const [blogPosts] = await connection.execute('SELECT * FROM blog_posts ORDER BY id');
  let blogPostsSql = '-- Blog Posts seed data\n-- Generated: ' + new Date().toISOString() + '\n\n';
  blogPostsSql += 'DELETE FROM blog_posts;\n\n';
  
  for (const p of blogPosts) {
    const columns = Object.keys(p).filter(k => k !== 'id').join(', ');
    const values = Object.keys(p).filter(k => k !== 'id').map(k => escapeValue(p[k])).join(', ');
    blogPostsSql += `INSERT INTO blog_posts (${columns}) VALUES (${values});\n`;
  }
  fs.writeFileSync(path.join(seedDir, '03-blog-posts.sql'), blogPostsSql);
  console.log(`  Exported ${blogPosts.length} blog posts`);
  
  // Create combined seed file
  console.log('Creating combined seed file...');
  let combinedSql = '-- Combined seed data for DSGVO-konforme LLM-Plattformen Vergleich\n';
  combinedSql += '-- Generated: ' + new Date().toISOString() + '\n';
  combinedSql += '-- Import order: platforms -> api_pricing -> blog_posts\n\n';
  combinedSql += '-- ============================================\n';
  combinedSql += '-- PLATFORMS\n';
  combinedSql += '-- ============================================\n\n';
  combinedSql += platformsSql.split('\n').slice(3).join('\n');
  combinedSql += '\n\n-- ============================================\n';
  combinedSql += '-- API PRICING\n';
  combinedSql += '-- ============================================\n\n';
  combinedSql += apiPricingSql.split('\n').slice(3).join('\n');
  combinedSql += '\n\n-- ============================================\n';
  combinedSql += '-- BLOG POSTS\n';
  combinedSql += '-- ============================================\n\n';
  combinedSql += blogPostsSql.split('\n').slice(3).join('\n');
  
  fs.writeFileSync(path.join(seedDir, 'seed-all.sql'), combinedSql);
  
  console.log('\nSeed files created in drizzle/seeds/');
  console.log('  - 01-platforms.sql');
  console.log('  - 02-api-pricing.sql');
  console.log('  - 03-blog-posts.sql');
  console.log('  - seed-all.sql (combined)');
  
  await connection.end();
}

main().catch(console.error);
