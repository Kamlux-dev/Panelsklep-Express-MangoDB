const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    const orders = await getDb().collection('orders').find().toArray();
    res.json(orders);
});

router.get('/:id', async (req, res) => {
    const order = await getDb().collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

router.post('/', async (req, res) => {
    const order = {
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: Number(req.body.quantity)
    };
    await getDb().collection('orders').insertOne(order);
    res.status(201).json(order);
});

router.put('/:id', async (req, res) => {
    await getDb().collection('orders').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { userId: req.body.userId, productId: req.body.productId, quantity: Number(req.body.quantity) } }
    );
    res.json({ message: 'OK' });
});

router.delete('/:id', async (req, res) => {
    await getDb().collection('orders').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
});

module.exports = router;