const express = require('express'); 
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
let db;
let verificationCode;

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




const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS   
  },
  connectionTimeout: 5000,
  socketTimeout: 5000
});
router.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/abc.html'));
});
router.post('/verify', async (req, res) => {
  
  const { email } = req.body;
   verificationCode = Math.floor(100000 + Math.random() * 900000);
   setTimeout(() => {
      verificationCode = null;
    }, 5 * 60 * 1000);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your 6-digit verification code is: ${verificationCode}. It expires in 5 minutes.`
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent' });
 
} catch (error) {
    console.log('Email error:', error);
    
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});


router.post('/verify2', (req, res) => {
  const { code } = req.body;
  if (code == verificationCode) {
    res.json({ success: true, message: 'Verification successful!' });
  } else {  
    res.json({ success: false, message: 'Wrong code, Please try again.' });
  }
  
});

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


