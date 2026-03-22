const express = require('express'); 
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
//dns.setDefaultResultOrder('ipv4first');
const questionSchema = new mongoose.Schema({
    q1:{ type: String , required: true }, 
    q2: String,
    q3: String,
    q4: String,
    q5: String,
});
const Question = mongoose.model('Question', questionSchema);



router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});


router.get('/list', async (req, res, next) => {
    try {

      Question.find({}, (err, questions) => {
        if (err) {
          console.error('Error fetching questions:', err);
          res.status(500).send('<h1>Error fetching questions from database</h1>');
        }
        else {
          res.render('list', { questions });
        }

      });
    }
    catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).send('<h1>Error fetching questions from database</h1>');
    }


});


router.get('/index', (req, res,next) => {
    res.sendFile(path.join(__dirname, '../views/setTest.html'));
});
router.post('/index', async(req, res) => {
   
    const { q1, q2, q3, q4, q5 } = req.body;
    try {
        const newQuestion = new Question({ q1, q2, q3, q4, q5 });
        await newQuestion.save();
        res.json({ success: true, message: 'Question saved successfully!' });
        res.redirect('/list');
    } catch (err) {
        console.error('Error saving question:', err);
        res.status(500).json({ success: false, message: 'Failed to save question', error: err.message });
    } 
});
module.exports = {
    router
};


