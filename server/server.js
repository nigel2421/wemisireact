// server/server.js
// Production-ready server for WemisiReact
// - Serves the Vite-built frontend from /dist
// - Provides API endpoints under /api/*
// - Uses sqlite3 + express-session (sqlite store)
// - Robust path detection so it works whether server.js is in /server or project root
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); // Add this line

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Determine project root and dist paths robustly
// If this file is /project/server/server.js then projectRoot = ../
// If this file is /project/server.js then projectRoot = .
const thisDir = __dirname;
let projectRoot = thisDir;
if (path.basename(thisDir).toLowerCase() === 'server') {
  projectRoot = path.join(thisDir, '..');
}
// locations
const serverDir = path.join(projectRoot, 'server'); // storage for DB + sessions
const distDirCandidates = [
  path.join(thisDir, 'dist'),
  path.join(projectRoot, 'dist'),
  path.join(projectRoot, 'client', 'dist'),
];
const distDir = distDirCandidates.find(d => fs.existsSync(d)) || path.join(projectRoot, 'dist');

if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}

// Database file
const DB_FILE = path.join(serverDir, 'wemisireact.db');

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite at', DB_FILE);
  // Create tables if missing and seed minimal data
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      imageUrls TEXT,
      category TEXT,
      price REAL,
      isNewArrival INTEGER,
      isInStock INTEGER,
      reviews TEXT,
      isVisible INTEGER DEFAULT 1
    )`);
    // seed users if empty
    db.get("SELECT COUNT(*) AS c FROM users", (err, row) => {
      if (!err && row && row.c === 0) {
        const insertUser = db.prepare("INSERT INTO users (username, password) VALUES (?,?)");
        const ADMIN_CREDENTIALS = [
          { username: 'superadmin', password: 'supersecretpassword!@#' },
          { username: 'admin', password: 'babatibim1' }
        ];
        ADMIN_CREDENTIALS.forEach(u => insertUser.run(u.username, u.password));
        insertUser.finalize();
        console.log("Seeded admin users.");
      }
    });
    // seed categories if empty
    db.get("SELECT COUNT(*) AS c FROM categories", (err, row) => {
      if (!err && row && row.c === 0) {
        const insertCategory = db.prepare("INSERT INTO categories (name) VALUES (?)");
        ['Tiles', 'Marble', 'Fences', 'Stone'].forEach(c => insertCategory.run(c));
        insertCategory.finalize();
        console.log("Seeded categories.");
      }
    });
  });
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS: allow same origin by default. If you host API separately,
// set origin accordingly and allow credentials.
app.use(cors({
  origin: true,
  credentials: true
}));

// Session store (sqlite)

app.use(session({
  store: new SQLiteStore({
    dir: serverDir,
    db: 'sessions.sqlite',
    table: 'sessions'
  }),
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ensure HTTPS in prod
    sameSite: 'lax'
  }
}));

// Simple request logging for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

// ---- API endpoints under /api ----

// Return product list as an array (frontend expects raw array)
app.get('/api/products', (req, res) => {
  const sql = "SELECT * FROM products";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const products = rows.map(p => ({
      ...p,
      imageUrls: JSON.parse(p.imageUrls || '[]'),
      reviews: JSON.parse(p.reviews || '[]'),
      isNewArrival: !!p.isNewArrival,
      isInStock: !!p.isInStock,
      isVisible: !!p.isVisible
    }));
    return res.json(products);
  });
});

app.get('/api/categories', (req, res) => {
  const sql = "SELECT name FROM categories";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows.map(r => r.name));
  });
});

// Session-status (admin)
app.get('/api/auth/status', (req, res) => {
  res.json({ isAuthenticated: !!req.session.isAdmin });
});

// Login -- session-based
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(sql, [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid username or password' });

    // Regenerate session to prevent fixation
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Session error' });
      req.session.isAdmin = true;
      req.session.username = username;
      req.session.cart = [];
      req.session.wishlist = [];
      // Successful login: session cookie is set automatically
      return res.json({ message: 'success' });
    });
  });
});

// Backwards-compatible login path (some clients use /api/login)
app.post('/api/login', (req, res) => {
  // simply proxy to the auth/login handler by calling it
  req.url = '/api/auth/login';
  app._router.handle(req, res);
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Could not log out' });
    res.clearCookie('connect.sid');
    return res.json({ message: 'logged out' });
  });
});

// Protected update endpoints (require session.isAdmin)
app.put('/api/products', (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ error: 'Unauthorized' });
  const products = req.body;
  if (!Array.isArray(products)) return res.status(400).json({ error: 'Expected array' });

  db.serialize(() => {
    const updateSql = `UPDATE products SET
      name = ?, description = ?, imageUrls = ?, category = ?, price = ?,
      isNewArrival = ?, isInStock = ?, reviews = ?, isVisible = ? WHERE id = ?`;
    const insertSql = `INSERT INTO products
      (id, name, description, imageUrls, category, price, isNewArrival, isInStock, reviews, isVisible)
      VALUES (?,?,?,?,?,?,?,?,?,?)`;

    products.forEach(p => {
      db.get("SELECT id FROM products WHERE id = ?", [p.id], (err, row) => {
        if (err) {
          console.error('DB check error', err.message);
          return;
        }
        const baseParams = [
          p.name || '',
          p.description || '',
          JSON.stringify(p.imageUrls || []),
          p.category || '',
          Number(p.price) || 0,
          p.isNewArrival ? 1 : 0,
          p.isInStock ? 1 : 0,
          JSON.stringify(p.reviews || []),
          p.isVisible === false ? 0 : 1
        ];
        if (row) {
          db.run(updateSql, [...baseParams, p.id], (err) => {
            if (err) console.error('Update error', err.message);
          });
        } else {
          db.run(insertSql, [p.id, ...baseParams], (err) => {
            if (err) console.error('Insert error', err.message);
          });
        }
      });
    });

    return res.json({ message: 'success' });
  });
});

app.put('/api/categories', (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ error: 'Unauthorized' });
  const categories = req.body;
  if (!Array.isArray(categories)) return res.status(400).json({ error: 'Expected array' });

  db.serialize(() => {
    const insert = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
    const del = db.prepare("DELETE FROM categories WHERE name = ?");
    // Simple approach: remove all then insert fresh
    db.run("DELETE FROM categories", (err) => {
      if (err) console.error('Delete categories error', err.message);
      categories.forEach(c => insert.run(c));
      insert.finalize();
      del.finalize();
      return res.json({ message: 'success' });
    });
  });
});

// Session-backed cart/wishlist endpoints (unchanged)
app.get('/api/session/cart', (req, res) => res.json(req.session.cart || []));
app.post('/api/session/cart', (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart)) return res.status(400).json({ error: 'Invalid cart' });
  req.session.cart = cart;
  res.json({ message: 'ok' });
});
app.get('/api/session/wishlist', (req, res) => res.json(req.session.wishlist || []));
app.post('/api/session/wishlist', (req, res) => {
  const { wishlist } = req.body;
  if (!Array.isArray(wishlist)) return res.status(400).json({ error: 'Invalid wishlist' });
  req.session.wishlist = wishlist;
  res.json({ message: 'ok' });
});

// ---- Static file serving for the React app ----
if (fs.existsSync(distDir)) {
  console.log('Serving static from', distDir);
  app.use(express.static(distDir));
  // React Router fallback (send index.html for non-API routes)
  // In Express 5, a plain '*' is a named parameter. For a true wildcard
  // catch-all, a regex is now required.
  app.get(/(.*)/, (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    return res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  console.warn('dist directory not found at', distDir, '— static files will not be served.');
  app.get('/', (req, res) => {
    res.send('API is running. Frontend not built or dist/ missing.');
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
