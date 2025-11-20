import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import db from './db/database';
import { Product } from './types';

const SQLiteStore = connectSqlite3(session);

// Augment the express-session SessionData type
declare module 'express-session' {
  interface SessionData {
    isAdmin: boolean;
    cart: Product[];
    wishlist: string[];
  }
}

const app = express();
const port = process.env.PORT || 3001;

// In production, you should use a more restrictive list of origins.
const allowedOrigins = ['http://localhost:3000', 'http://192.168.100.44:3000'];

const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session middleware
app.use(session({
    store: new SQLiteStore({
        db: 'wemisireact.db',
        dir: './', 
        table: 'sessions'
    }),
    secret: 'your-super-secret-key-change-me', // IMPORTANT: Change this to a long, random string
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: false, // Set to true if you're using HTTPS in production
        sameSite: 'lax',
    }
}));

// Middleware to log session data for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Request to ${req.path}`);
    console.log('Session data:', req.session);
    next();
});


// --- API Endpoints ---

// --- Auth Endpoints ---
app.get('/api/auth/status', (req, res) => {
    if (req.session.isAdmin) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// --- Session Data Endpoints ---
app.get('/api/session/cart', (req, res) => {
    res.json(req.session.cart || []);
});

app.post('/api/session/cart', (req, res) => {
    const { cart } = req.body;
    if (Array.isArray(cart)) {
        req.session.cart = cart;
        res.status(200).json({ message: 'Cart updated' });
    } else {
        res.status(400).json({ message: 'Invalid cart data' });
    }
});

app.get('/api/session/wishlist', (req, res) => {
    res.json(req.session.wishlist || []);
});

app.post('/api/session/wishlist', (req, res) => {
    const { wishlist } = req.body;
    if (Array.isArray(wishlist)) {
        req.session.wishlist = wishlist;
        res.status(200).json({ message: 'Wishlist updated' });
    } else {
        res.status(400).json({ message: 'Invalid wishlist data' });
    }
});


// Get all products
app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows: Product[]) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        // Parse JSON strings back into objects
        const products = rows.map(p => ({
            ...p,
            imageUrls: JSON.parse(p.imageUrls as unknown as string || '[]'),
            reviews: JSON.parse(p.reviews as unknown as string || '[]'),
            isNewArrival: Boolean(p.isNewArrival),
            isInStock: Boolean(p.isInStock),
            isVisible: Boolean(p.isVisible)
        }));
        res.json({
            "message": "success",
            "data": products
        })
    });
});

// Get all categories
app.get('/api/categories', (req, res) => {
    const sql = "SELECT name FROM categories";
    db.all(sql, [], (err, rows: {name: string}[]) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows.map(r => r.name)
        })
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        if (row) {
            // Regenerate session to prevent session fixation attacks
            req.session.regenerate((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error logging in' });
                }
                req.session.isAdmin = true;
                req.session.cart = [];
                req.session.wishlist = [];
                res.json({ message: "success" });
            });
        } else {
            res.status(401).json({"error": "Invalid username or password"});
        }
    });
});

// Update all products (improved to use UPDATE)
app.put('/api/products', (req, res) => {
    // Protect this route
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const products: Product[] = req.body;
    
    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Request body must be an array of products.' });
    }

    db.serialize(() => {
        const updateSql = `UPDATE products SET 
            name = ?, 
            description = ?, 
            imageUrls = ?, 
            category = ?, 
            price = ?, 
            isNewArrival = ?, 
            isInStock = ?, 
            reviews = ?,
            isVisible = ?
            WHERE id = ?`;

        const insertSql = `INSERT INTO products (id, name, description, imageUrls, category, price, isNewArrival, isInStock, reviews, isVisible) 
                           VALUES (?,?,?,?,?,?,?,?,?,?)`;

        products.forEach(p => {
            db.get("SELECT id FROM products WHERE id = ?", [p.id], function(err, row) {
                if (err) {
                    console.error("Error checking product existence", err.message);
                    return;
                }

                const params = [
                    p.name,
                    p.description,
                    JSON.stringify(p.imageUrls),
                    p.category,
                    p.price,
                    p.isNewArrival ? 1 : 0,
                    p.isInStock ? 1 : 0,
                    JSON.stringify(p.reviews || []),
                    p.isVisible === false ? 0 : 1, // Handle undefined as visible
                    p.id
                ];

                if (row) { // Product exists, update it
                    db.run(updateSql, params, function(err) {
                        if (err) {
                            console.error("Error updating product", p.id, err.message);
                        }
                    });
                } else { // Product is new, insert it
                    const insertParams = [p.id, ...params.slice(0, -1)];
                    db.run(insertSql, insertParams, function(err) {
                         if (err) {
                            console.error("Error inserting new product", p.id, err.message);
                        }
                    });
                }
            });
        });

        res.json({
            "message": "success",
        });
    });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});