const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_CM0TSUYE3OWX@ep-rough-forest-ahqpb1n1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    await client.connect();
    const result = await client.query('SELECT 1 as test');
    console.log('✅ Connected to Neon!', result.rows);
    await client.end();
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();
