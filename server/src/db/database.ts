import sqlite3 from 'sqlite3';
import { Product } from '../types';

const DBSOURCE = 'wemisireact.db';

// Copied from frontend constants for self-containment
const ADMIN_CREDENTIALS = [
  { username: 'superadmin', password: 'supersecretpassword!@#' },
  { username: 'admin', password: 'babatibim1' }
];

const INITIAL_CATEGORIES: string[] = ['Tiles', 'Marble', 'Fences', 'Stone'];

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )`, (err) => {
                if (err) {
                    console.error("Error creating users table", err);
                } else {
                    // Seed users table only if it's empty
                    db.get("SELECT COUNT(*) as count FROM users", (err, row: { count: number }) => {
                        if (row.count === 0) {
                            const insertUser = "INSERT INTO users (username, password) VALUES (?,?)";
                            ADMIN_CREDENTIALS.forEach(cred => {
                                db.run(insertUser, [cred.username, cred.password]);
                            });
                            console.log("Users table seeded.");
                        }
                    });
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )`, (err) => {
                if (err) {
                    console.error("Error creating categories table", err);
                } else {
                    // Seed categories table only if it's empty
                     db.get("SELECT COUNT(*) as count FROM categories", (err, row: { count: number }) => {
                        if (row.count === 0) {
                            const insertCategory = "INSERT INTO categories (name) VALUES (?)";
                            INITIAL_CATEGORIES.forEach(cat => {
                                db.run(insertCategory, [cat]);
                            });
                            console.log("Categories table seeded.");
                        }
                    });
                }
            });

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
            )`, (err) => {
                if (err) {
                    console.error("Error creating products table", err);
                }
                // Product seeding is now removed.
            });
        });
    }
});

export default db;
