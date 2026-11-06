const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb+srv://sklep:sklep123@sklep.meltxvu.mongodb.net/');
let db;

async function connect() {
    await client.connect();
    db = client.db('mydatabase');
    console.log('Connected to MongoDB');
}

function getDb() {
    return db;
}

module.exports = { connect, getDb };