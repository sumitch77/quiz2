const express = require('express'); 
const path = require('path');
const router = express.Router();
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
let db;

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const MongoConnect=(callback)=>{
    MongoClient.connect(process.env.url).then((client)=>{
        db = client.db('quiz');
        callback();
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:', err);
        
    });
};

const newdb=()=>{
if (!db) {
    throw new Error('Database connection not established');
}   
    return db;
};


router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/list', async (req, res, next) => {
    try {

      const db = newdb();
     const result = await db.collection('questions').find().toArray();
            res.render('list', { questions: result });

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('<h1>Error fetching data</h1>');
    }
});


router.get('/index', (req, res,next) => {
    res.sendFile(path.join(__dirname, '../views/setTest.html'));
});
router.post('/index', async(req, res) => {
   
    const { q1, q2, q3, q4, q5 } = req.body;
    try {
        const db = newdb();
        await db.collection('questions').insertOne({ q1, q2, q3, q4, q5 }
        );
    
        res.redirect('/index');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('<h1>Error inserting data into database</h1>');
    }
});
module.exports = {
    router,
    MongoConnect,
    newdb,
};


