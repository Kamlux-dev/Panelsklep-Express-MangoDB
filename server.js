const express = require('express');
const session = require('express-session');
const { connect } = require('./db');

const authRoutes = require('./routes/auth');
const adminsRoutes = require('./routes/admins');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const app = express();
app.use(express.json());

app.use(session({
    secret: 'sklep-sekret-sesji',
    resave: false,
    saveUninitialized: false
}));

// Logowanie jest dostępne bez sesji
app.use('/api/auth', authRoutes);

// Strona logowania i style są publiczne, reszta wymaga zalogowania
app.use((req, res, next) => {
    if (req.path === '/login.html' || req.path === '/style.css' || req.path === '/auth.js' || req.path === '/theme.js') {
        return next();
    }
    if (!req.session.adminId) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.redirect('/login.html');
    }
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/api/admins', adminsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);

connect().then(() => {
 app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
 });
});
