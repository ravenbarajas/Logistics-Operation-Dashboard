// This script sets up the database schema using Drizzle ORM

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to run SQL script for initial database setup
async function runSqlScript() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Connect to postgres to create the database if it doesn't exist
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL.replace('/logidash', '/postgres'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Running initial SQL setup script...');
    
    // Execute the SQL script directly as one transaction
    const sqlScript = fs.readFileSync(join(__dirname, 'db-setup.sql'), 'utf8');
    try {
      await pgPool.query(sqlScript);
      console.log('SQL setup completed successfully.');
    } catch (err) {
      console.error('Error executing SQL script:');
      console.error(err);
    }
    
  } catch (err) {
    console.error('Error running SQL script:', err);
  } finally {
    await pgPool.end();
  }
}

// Function to run drizzle migrations
async function runDrizzleMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Running Drizzle migrations...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  const db = drizzle(pool);
  
  try {
    // Ensure migrations folder exists
    const migrationsFolder = join(process.cwd(), 'migrations');
    if (!fs.existsSync(migrationsFolder)) {
      console.log('Creating migrations folder...');
      fs.mkdirSync(migrationsFolder, { recursive: true });
      
      // Create initial meta folder and _journal.json
      const metaFolder = join(migrationsFolder, 'meta');
      fs.mkdirSync(metaFolder, { recursive: true });
      fs.writeFileSync(
        join(metaFolder, '_journal.json'),
        JSON.stringify({ version: '5', entries: [] }, null, 2)
      );
      console.log('Created initial migration journal file.');
    }
    
    // Run migrations if they exist
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    await pool.end();
  }
}

// Main function
async function main() {
  console.log('Starting database setup...');
  
  // First run the SQL script to create the database and tables
  await runSqlScript();
  
  // Then run the Drizzle migrations
  await runDrizzleMigrations();
  
  console.log('Database setup completed!');
}

main().catch(err => {
  console.error('Error in main function:', err);
  process.exit(1);
}); 