const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

// Lista kont panelu widoczna tylko dla admina
function requireAdmin(req, res, next) {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ message: 'Brak uprawnień' });
    }
    next();
}

router.get('/', requireAdmin, async (req, res) => {
    const admins = await getDb()
        .collection('admins')
        .find({}, { projection: { passwordHash: 0 } })
        .toArray();
    res.json(admins);
});

module.exports = router;
