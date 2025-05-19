const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const path = require("path");

require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const WEATHER_API_KEY = "cb73af7b2cd5463db71230938251805";
const URI = process.env.MONGO_CONNECTION_STRING;
const DATABASE_NAME = "weatherApp";
const COLLECTION_NAME = "recentCities";

router.get('/search', async (request, response) => {
    const city = request.query.city;
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    const apiResponse = await fetch(url);

    if (!apiResponse.ok) {
        return response.render('search', { error: 'Invalid city name, please try again.' });
    }

    const weatherData = await apiResponse.json();

    const client = new MongoClient(URI, { serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        
        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const entry = {
            name: city,
            temp: weatherData.current.temp_f,
            condition: weatherData.current.condition.text,
            icon: weatherData.current.condition.icon,
            humidity: weatherData.current.humidity,
            date: new Date()
        };

        await collection.insertOne(entry);

    } catch(error) {
        console.error(error);
    } finally {
        await client.close();
    }

    response.render("weather", { city, weather: weatherData });
});

module.exports = router;