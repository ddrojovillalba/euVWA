const express = require('express');
const app = express();

// ====== SERVIDOR BÁSICO ======
app.get('/', (req, res) => {
    res.send('euVWA funcionando correctamente');
});

// ====== SIMULACIÓN BASE DE DATOS ======
const users = [
    { id: 1, username: 'admin', password: '1234' },
    { id: 2, username: 'user', password: 'pass' }
];

// ====== SQL INJECTION - VERSIÓN VULNERABLE ======
app.get('/user', (req, res) => {
    const username = req.query.username;

    if (username && username.includes("' OR '1'='1")) {
        return res.json(users);
    }

    const result = users.filter(user => user.username == username);

    res.json(result);
});

// ====== XSS REFLEJADO - VERSIÓN VULNERABLE ======
app.get('/search', (req, res) => {
    const query = req.query.q;

    res.send(`<h1>Resultado: ${query}</h1>`);
});

// ====== XSS ALMACENADO - VERSIÓN VULNERABLE ======
let comments = [];

app.get('/comment', (req, res) => {
    const comment = req.query.comment;

    comments.push(comment);

    res.send('Comentario guardado');
});

app.get('/comments', (req, res) => {
    let output = '';

    comments.forEach(c => {
        output += `<p>${c}</p>`;
    });

    res.send(output);
});

// ====== COMMAND INJECTION - VERSIÓN VULNERABLE ======
const { exec } = require('child_process');

app.get('/ping', (req, res) => {
    const ip = req.query.ip;

    exec(`ping -n 1 ${ip}`, (error, stdout, stderr) => {
        if (error) {
            return res.send(error.message);
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

// ====== INSECURE FILE UPLOAD - VERSIÓN VULNERABLE ======
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/upload-form', (req, res) => {
    res.send(`
        <h2>Subida de archivo (Vulnerable)</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit">Subir</button>
        </form>
    `);
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('Archivo subido sin validación');
});

const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== BROKEN AUTHENTICATION - VERSIÓN VULNERABLE ======
app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    const user = users.find(u => 
        u.username === username && u.password === password
    );

    if (user) {
        res.send(`Bienvenido ${username}`);
    } else {
        res.send('Credenciales incorrectas');
    }
});

// ====== SENSITIVE DATA EXPOSURE - VERSIÓN VULNERABLE ======
app.get('/profile', (req, res) => {
    const user = {
        username: 'admin',
        password: '1234',
        creditCard: '1234-5678-9012-3456'
    };

    res.json(user);
});

// ====== SECURITY MISCONFIGURATION - VERSIÓN VULNERABLE ======
app.get('/config', (req, res) => {
    throw new Error('Error interno del servidor');
});