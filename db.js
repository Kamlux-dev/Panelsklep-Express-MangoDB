const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const client = new MongoClient('mongodb+srv://sklep:sklep123@sklep.meltxvu.mongodb.net/');
let db;

async function connect() {
    await client.connect();
    db = client.db('mydatabase');
    console.log('Connected to MongoDB');
    await seedAdmin();
}

async function seedAdmin() {
    await ensureAccount('admin@sklep.pl', 'admin123', 'admin');
    await ensureAccount('podadmin@sklep.pl', 'podadmin123', 'podadmin');
}

async function ensureAccount(email, password, role) {
    const admins = db.collection('admins');
    const existing = await admins.findOne({ email });
    if (!existing) {
        const passwordHash = await bcrypt.hash(password, 10);
        await admins.insertOne({ email, passwordHash, role });
        console.log(`Utworzono konto (${role}): ${email} / ${password}`);
    } else if (!existing.role) {
        await admins.updateOne({ _id: existing._id }, { $set: { role } });
    }
}

function getDb() {
    return db;
}

module.exports = { connect, getDb };
