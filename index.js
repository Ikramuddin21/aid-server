const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilfiw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        await client.connect();
        const database = client.db('aidListing');
        const aidCollection = database.collection('users');
        const volunteersCollection = database.collection('volunteers');

        // get api
        app.get('/aidUsers', async (req, res) => {
            const query = aidCollection.find({});
            const result = await query.toArray();
            res.send(result);
        });

        // post api
        app.post('/volunteers', async (req, res) => {
            const volunteer = req.body;
            const result = await volunteersCollection.insertOne(volunteer);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Aid Server Running');
});

app.listen(port, () => {
    console.log('Running Aid port', port);
});