import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

async function checkDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database with:', process.env.DATABASE_URL);
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL!');

    const result = await client.query('SELECT current_database() as db_name');
    console.log(`Current database: ${result.rows[0].db_name}`);
    
    // Check if the database exists
    const dbResult = await client.query(`
      SELECT EXISTS(
        SELECT 1 FROM pg_database WHERE datname = 'logidash'
      ) as exists;
    `);
    console.log(`Database 'logidash' exists: ${dbResult.rows[0].exists}`);
    
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } finally {
    await pool.end();
  }
}

checkDatabaseConnection().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
}); 