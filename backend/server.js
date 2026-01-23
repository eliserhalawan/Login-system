const express = require('express');
const app = express();

app.use(express.json());

let users = [];

const PORT = 3000;

app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
});

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    const newUser = {
        id: users.length + 1,
        username: username,
        password: password
    };

    users.push(newUser);

    res.json({
        message: 'User signed up successfully!',
        user: newUser
    });
});

app.get('/api/users', (req, res) => {  
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});