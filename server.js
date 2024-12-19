const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

// Serves static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parses JSON bodies for login and registration
app.use(express.json());

// Reads users from users.txt
function readUsers() {
    const data = fs.readFileSync(path.join(__dirname, 'users.txt'), 'utf-8');
    const users = {};
    const lines = data.split('\n');
  
    lines.forEach(line => {
        const [username, email, passwordHash] = line.split(':');
        if (username && passwordHash) {
            users[username.trim()] = { email: email.trim(), passwordHash: passwordHash.trim() };
        }
    });
    return users;
}

// Writes a new user to users.txt
function writeUser(username, email, passwordHash) {
    const data = `${username}:${email}:${passwordHash}\n`;
    fs.appendFileSync(path.join(__dirname, 'users.txt'), data, 'utf-8');
}

// Handles login requests
app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const users = readUsers();
  
    let userFound = null;
    let username = null;
  
    for (let user in users) {
        if (users[user].email === usernameOrEmail || user === usernameOrEmail) {
            userFound = users[user];
            username = user;
            break;
        }
    }

    if (userFound) {
        bcrypt.compare(password, userFound.passwordHash, (err, isMatch) => {
            if (err) {
                return res.json({ success: false, message: 'Error comparing passwords' });
            }
            if (isMatch) {
                res.json({ success: true, username });
            } 
            else {
                res.json({ success: false, message: 'Invalid username/email or password' });
            }
        });
    } 
    else {
        res.json({ success: false, message: 'Invalid username/email or password' });
    }
});

// Handles user registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsers();
  
    if (users[username]) {
        res.json({ success: false, message: 'Username already taken' });
    } 
    else {
        // Hashes the password before storing
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.json({ success: false, message: 'Error hashing password' });
            }
            writeUser(username, email, hashedPassword);
            res.json({ success: true, message: 'User created successfully' });
        });
    }
});

// Starts the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/login.html`);
});
