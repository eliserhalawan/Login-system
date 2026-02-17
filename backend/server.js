const express = require('express');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-12345';

const db = new Database('users.db');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
`);

const app = express();

app.use(express.json());

app.use((req, res, next) => {   
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token!' });
    }
};

const PORT = 3000;

app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
});

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = insert.run(username, hashedPassword);

    res.json({
        message: 'User signed up successfully!',
        userId: result.lastInsertRowid
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password!' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password!' });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Login successful!',
        token: token,
        username: user.username
    });
});

app.get('/api/users', (req, res) => {  
    const allUsers = db.prepare('SELECT id, username FROM users').all();
    res.json(allUsers);
});


app.get('/api/profile', verifyToken, (req, res) => {
  res.json({
    message: 'This is protected data!',
    user: req.user
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});