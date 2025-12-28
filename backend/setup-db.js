require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  console.log('🚀 Setting up Qirshak database...\n');

  try {
    // Create users table
    console.log('📋 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created\n');

    // Create transactions table
    console.log('📋 Creating transactions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        amount DECIMAL(12, 2) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        description TEXT,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Transactions table created\n');

    // Create index for faster queries
    console.log('📋 Creating indexes...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)
    `;
    console.log('✅ Indexes created\n');

    // Create updated_at trigger function
    console.log('📋 Creating trigger function...');
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    console.log('✅ Trigger function created\n');

    // Create triggers for updated_at
    console.log('📋 Creating triggers...');
    
    // Drop existing triggers if they exist
    await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`;
    await sql`DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions`;
    
    await sql`
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;
    
    await sql`
      CREATE TRIGGER update_transactions_updated_at
      BEFORE UPDATE ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;
    console.log('✅ Triggers created\n');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Tables created:');
    console.log('   - users');
    console.log('   - transactions');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
