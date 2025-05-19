const express = require("express");
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const URI = process.env.MONGO_CONNECTION_STRING;
const DATABASE_NAME = "weatherApp";
const COLLECTION_NAME = "recentCities";

router.get('/', async (request, response) => {
    const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();

        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const cities = await collection.find().sort({ date: -1 }).toArray();

        response.render('recent', { cities });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }   
});

router.post('/clear', async (request, response) => {
    const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });
    
    try {
        await client.connect();

        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);

        await collection.deleteMany({});
        response.redirect("/recent");

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
});

module.exports = router;