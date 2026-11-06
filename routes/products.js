const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await getDb().collection('products').find().toArray();
    res.json(products);
});

router.get('/:id', async (req, res) => {
    const product = await getDb().collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if(!product){
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

router.post('/', async (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
    };
    await getDb().collection('products').insertOne(product);
    res.status(201).json(product);
});

router.put('/:id', async (req, res) => {
    await getDb().collection('products').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { name: req.body.name, price: req.body.price } }
    );
    res.json({ message: 'Product updated' });
});

router.delete('/:id', async (req, res) => {
    await getDb().collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
});

module.exports = router;