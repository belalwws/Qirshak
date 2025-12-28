require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test connection and create tables
async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon PostgreSQL!');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK(type IN ('income', 'expense')),
        amount DECIMAL(12,2) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    `);
    
    console.log('✅ Database tables ready!');
    client.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

initDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// =====================
// AUTH ROUTES
// =====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, avatar, created_at',
      [name, email.toLowerCase(), hashedPassword]
    );

    const newUser = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =====================
// TRANSACTION ROUTES
// =====================

// Get all transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.userId]
    );

    res.json(result.rows.map(t => ({
      id: t.id,
      type: t.type,
      amount: parseFloat(t.amount),
      categoryId: t.category_id,
      description: t.description,
      date: t.date,
      createdAt: t.created_at,
    })));
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create transaction
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { type, amount, categoryId, description, date } = req.body;

    if (!type || !amount || !categoryId || !date) {
      return res.status(400).json({ message: 'Type, amount, categoryId, and date are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }

    const result = await pool.query(
      'INSERT INTO transactions (user_id, type, amount, category_id, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.userId, type, amount, categoryId, description || '', date]
    );

    const t = result.rows[0];
    res.status(201).json({
      id: t.id,
      type: t.type,
      amount: parseFloat(t.amount),
      categoryId: t.category_id,
      description: t.description,
      date: t.date,
      createdAt: t.created_at,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, categoryId, description, date } = req.body;

    // Check if transaction exists and belongs to user
    const existing = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const current = existing.rows[0];

    const result = await pool.query(
      'UPDATE transactions SET type = $1, amount = $2, category_id = $3, description = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [
        type || current.type,
        amount || current.amount,
        categoryId || current.category_id,
        description !== undefined ? description : current.description,
        date || current.date,
        id,
        req.user.userId
      ]
    );

    const t = result.rows[0];
    res.json({
      id: t.id,
      type: t.type,
      amount: parseFloat(t.amount),
      categoryId: t.category_id,
      description: t.description,
      date: t.date,
      createdAt: t.created_at,
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sync transactions (bulk insert)
app.post('/api/transactions/sync', authenticateToken, async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Transactions array is required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const t of transactions) {
        await client.query(
          'INSERT INTO transactions (user_id, type, amount, category_id, description, date) VALUES ($1, $2, $3, $4, $5, $6)',
          [req.user.userId, t.type, t.amount, t.categoryId, t.description || '', t.date]
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    // Fetch all user transactions
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.userId]
    );

    res.json({
      message: `Synced ${transactions.length} transactions`,
      transactions: result.rows.map(t => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        categoryId: t.category_id,
        description: t.description,
        date: t.date,
        createdAt: t.created_at,
      })),
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Server error during sync' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const txCount = await pool.query('SELECT COUNT(*) as count FROM transactions');

    res.json({
      status: 'ok',
      database: 'Neon PostgreSQL',
      stats: {
        users: parseInt(userCount.rows[0].count),
        transactions: parseInt(txCount.rows[0].count),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 قرشك API Server Running!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server:    http://localhost:${PORT}`);
  console.log(`📊 Health:    http://localhost:${PORT}/api/health`);
  console.log('💾 Database:  Neon PostgreSQL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/auth/profile');
  console.log('  GET    /api/transactions');
  console.log('  POST   /api/transactions');
  console.log('  PUT    /api/transactions/:id');
  console.log('  DELETE /api/transactions/:id');
  console.log('  POST   /api/transactions/sync');
  console.log('');
});
