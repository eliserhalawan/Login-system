const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

app.use((req, res, next) => {   
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

let users = [];

const PORT = 3000;

app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
});

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = {
        id: users.length + 1,
        username: username,
        password: hashedPassword
    };

    users.push(newUser);

    res.json({
        message: 'User signed up successfully!',
        user: newUser.id
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password!' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password!' });
    }

    res.json({
        message: 'Login successful!',
        userId: user.id,
        username: user.username
    });
});

app.get('/api/users', (req, res) => {  
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});