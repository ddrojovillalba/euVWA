const express = require('express');
const app = express();

// ====== SERVIDOR BÁSICO ======
app.get('/', (req, res) => {
    res.send('euVWA funcionando correctamente');
});

// ====== SIMULACIÓN BASE DE DATOS ======
const bcrypt = require('bcrypt');

const users = [
    {
        username: 'admin',
        password: bcrypt.hashSync('1234', 10)
    }
];

// ====== SQL INJECTION - VERSIÓN SEGURA ======
app.get('/user', (req, res) => {
    const username = req.query.username;

    if (!username || username.includes("'")) {
        return res.send('Entrada no válida');
    }

    const result = users.filter(user => user.username === username);

    res.json(result);
});

// ====== XSS REFLEJADO - VERSIÓN SEGURA ======
const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

app.get('/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.send('Sin búsqueda');
    }

    const safeQuery = escapeHtml(query);

    res.send(`<h1>Resultado: ${safeQuery}</h1>`);
});

// ====== XSS ALMACENADO - VERSIÓN SEGURA ======
let comments = [];

const escapeHtmlSecure = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

app.get('/comment', (req, res) => {
    const comment = req.query.comment;

    const safeComment = escapeHtmlSecure(comment);

    comments.push(safeComment);

    res.send('Comentario guardado de forma segura');
});

app.get('/comments', (req, res) => {
    let output = '';

    comments.forEach(c => {
        output += `<p>${c}</p>`;
    });

    res.send(output);
});

// ====== COMMAND INJECTION - VERSIÓN SEGURA ======
const { execFile } = require('child_process');

app.get('/ping', (req, res) => {
    const ip = req.query.ip;

    const validIp = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (!ip || !validIp.test(ip)) {
        return res.send('<pre>IP no válida</pre>');
    }

    execFile('ping', ['-n', '1', ip], (error, stdout, stderr) => {
        if (error) {
            return res.send('<pre>Error en ejecución</pre>');
        }

        res.send(`<pre>${stdout}</pre>`);
    });
});

// ====== INSECURE FILE UPLOAD - VERSIÓN SEGURA ======
const multerSecure = require('multer');
const path = require('path');

const storageSecure = multerSecure.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadSecure = multerSecure({
    storage: storageSecure,
    fileFilter: fileFilter
});

app.get('/upload-form', (req, res) => {
    res.send(`
        <h2>Subida de archivo (Segura)</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit">Subir</button>
        </form>
    `);
});

app.post('/upload', uploadSecure.single('file'), (req, res) => {

    if (!req.file) {
        return res.send('<h3>Tipo de archivo no permitido</h3>');
    }

    res.send('<h3>Archivo subido correctamente (seguro)</h3>');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== BROKEN AUTHENTICATION - VERSIÓN SEGURA ======
const secureUsers = [
    {
        username: 'admin',
        password: bcrypt.hashSync('1234', 10)
    }
];

app.get('/login', async (req, res) => {
    const { username, password } = req.query;

    const user = secureUsers.find(u => u.username === username);

    if (!user) {
        return res.send('Usuario no encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.send('Contraseña incorrecta');
    }

    res.send(`Login seguro correcto: ${username}`);
});

// ====== SENSITIVE DATA EXPOSURE - VERSIÓN SEGURA ======
app.get('/profile', (req, res) => {
    const user = {
        username: 'admin',
        creditCard: '****-****-****-3456'
    };

    res.json(user);
});

// ====== SECURITY MISCONFIGURATION - VERSIÓN SEGURA ======
app.get('/config', (req, res) => {
    try {
        throw new Error('Error interno del servidor');
    } catch (error) {
        res.send('Ha ocurrido un error');
    }
});

// ====== INICIAR SERVIDOR ======
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});