const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

const router = express.Router();

// Tylko admin może dodawać/edytować/usuwać użytkowników
function requireAdmin(req, res, next) {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ message: 'Brak uprawnień' });
    }
    next();
}

router.get('/', async (req, res) => {
    const users = await getDb().collection('users').find().toArray();
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await getDb().collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

router.post('/', requireAdmin, async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email
    };
    await getDb().collection('users').insertOne(user);
    res.status(201).json(user);
});

router.put('/:id', requireAdmin, async (req, res) => {
    await getDb().collection('users').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { name: req.body.name, email: req.body.email } }
    );
    res.json({ message: 'OK' });
});

router.delete('/:id', requireAdmin, async (req, res) => {
    await getDb().collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
});

module.exports = router;