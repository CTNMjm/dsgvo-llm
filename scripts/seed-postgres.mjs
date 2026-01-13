/**
 * Seed PostgreSQL database with initial data
 * Run with: node scripts/seed-postgres.mjs
 * 
 * This script reads the SQL seed files and executes them against PostgreSQL
 */

import pg from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  console.error('Example: DATABASE_URL=postgresql://user:pass@host:5432/db node scripts/seed-postgres.mjs');
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  });
  
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
    
    const seedDir = path.join(process.cwd(), 'drizzle', 'seeds');
    
    // Read and execute seed files in order
    const seedFiles = [
      '01-platforms.sql',
      '02-api-pricing.sql', 
      '03-blog-posts.sql'
    ];
    
    for (const file of seedFiles) {
      const filePath = path.join(seedDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} (not found)`);
        continue;
      }
      
      console.log(`\nExecuting ${file}...`);
      let sql = fs.readFileSync(filePath, 'utf-8');
      
      // Convert MySQL syntax to PostgreSQL
      // 1. Remove backticks
      sql = sql.replace(/`/g, '"');
      
      // 2. Convert boolean values
      sql = sql.replace(/\b1\b(?=\s*[,)])/g, 'true');
      sql = sql.replace(/\b0\b(?=\s*[,)])/g, 'false');
      
      // Split into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const statement of statements) {
        try {
          await client.query(statement);
          successCount++;
        } catch (err) {
          console.error(`  Error: ${err.message}`);
          errorCount++;
        }
      }
      
      console.log(`  Completed: ${successCount} successful, ${errorCount} errors`);
    }
    
    console.log('\nSeed completed!');
    
  } catch (err) {
    console.error('Database error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
