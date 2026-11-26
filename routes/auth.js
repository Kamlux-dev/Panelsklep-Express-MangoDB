const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await getDb().collection('admins').findOne({ email });
    if (!admin || !(await bcrypt.compare(password || '', admin.passwordHash))) {
        return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
    }
    req.session.adminId = admin._id.toString();
    req.session.email = admin.email;
    req.session.role = admin.role || 'admin';
    res.json({ email: admin.email, role: req.session.role });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'OK' });
    });
});

router.get('/me', (req, res) => {
    if (!req.session.adminId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ email: req.session.email, role: req.session.role });
});

module.exports = router;
