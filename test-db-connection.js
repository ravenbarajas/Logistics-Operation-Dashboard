import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:admin123@localhost:5432/logidash',
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Database connected successfully:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

testConnection();