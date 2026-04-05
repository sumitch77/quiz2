const express = require('express'); 
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const dns = require("dns");
const { check } = require('express-validator');
const {VShortTerm,shortTerm,longTerm,validate,} = require('./security');
const VShort = VShortTerm(5,1);
const VShort1 = VShortTerm(5,1);
const short = VShortTerm(60,2);
const long = VShortTerm(600,5);
let quizdata = new Map();

dns.setServers(["1.1.1.1", "8.8.8.8"]);
//dns.setDefaultResultOrder('ipv4first');


const questionSchema = new mongoose.Schema({
    q1:{ type: String , required: true }, 
    a1: String,
    a2: String,
    a3: String,
    a4: String,
    ans:{type:String, required:true},
    spid:String,
});

const Question = mongoose.model('Quizdata', questionSchema);

const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  total: Number,
  percent: Number,
  playedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  questions: [questionSchema], 
   scores: [scoreSchema],
});

const Quiz = mongoose.model('Quizall', quizSchema);



router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    res.render('index', {
      username: req.session.userName || null,
      quizzes: quizzes
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

router.get('/index', (req, res,next) => {
       if(req.session.userId&& req.session.userName){
        req.session.randomid = (req.session.userId+req.session.userName+Date.now()).toString();
         req.session.questions = [];
        console.log(`User ${req.session.randomid} is accessing the setTest page.`);
      res.sendFile(path.join(__dirname, '../views/setTest.html'));
  }
  else {
      res.redirect('/login');
  }
  });

router.get('/check', (req, res, next) => {
  if(req.session.userId && req.session.userName) {
    res.json({ success: true , loggedIn: true, username: req.session.userName, useremail : req.session.userEmail });
  } else {
    res.json({ loggedIn: false });
  }
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


router.post('/sendques',VShort,short,
 [ check('q1').notEmpty().withMessage("please Enter question"),
  check('a1').notEmpty().withMessage("please Enter option"),
  check('a2').notEmpty().withMessage("please Enter option"),
  check('a3').notEmpty().withMessage("please Enter option"),
  check('a4').notEmpty().withMessage("please Enter option"),
  check('ans').notEmpty().withMessage("please Select right option"),
 ],
 validate,
  
  async(req, res) => {
   
    const { q1, a1, a2, a3, a4, ans } = req.body;
    const spid = req.session.randomid;
    try {
         if (!req.session.questions) {
      req.session.questions = [];
    }
    req.session.questions.push({ q1, a1, a2, a3, a4, ans });
        
        res.json({ success: true, message: 'Question saved successfully! , Submit next question' });
        
    } catch (err) {
        console.error('Error saving question:', err);
        res.status(500).json({ success: false, message: 'Failed to save question', error: err.message });
    } 

});

router.post('/submitques', VShort1, async (req, res) => {
  
    const questions = req.session.questions;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions to save' });
    }

  try {
    const newQuiz = new Quiz({
      createdBy: req.session.userName,
      questions: questions,
    });

    await newQuiz.save();
    req.session.questions = [];

    return res.status(200).json({ success: true, message: 'Quiz saved successfully!' });  // ✅

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to save quiz', error: err.message }); // ✅
  }
});


router.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    res.render('alltest', {
      username: req.session.userName || null,
      quiz: quiz
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

router.get('/quiz/:id/leaderboard', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    res.render('leaderboard', {
      username: req.session.userName || null,
      quiz: quiz,
      scores: quiz.scores || []     // scores array from DB
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

router.post('/quiz/:id/score', async (req, res) => {
  try {
    const { score, total } = req.body;

    await Quiz.findByIdAndUpdate(req.params.id, {
      $push: {
        scores: {
          username: req.session.userName || 'Anonymous',
          score: score,
          total: total,
          percent: Math.round((score / total) * 100),
          playedAt: new Date()
        }
      }
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/profile', (req, res) => {
  if (req.session.userId && req.session.userName) {
    res.json({ success: true, username: req.session.userName, useremail: req.session.userEmail , photourl : req.session.photourl });
  } else {
    res.json({ success: false, message: 'User not logged in' });
  }
});

router.get('/admin/login', (req, res) => {
  if(req.session.userName){
  res.sendFile(path.join(__dirname, '../views/adminlog.html'));
  }else{
    res.redirect('/login');
  }
});

router.post('/vault', async (req, res) => {
  const { email , password } = req.body;
  if (email === process.env.ADMINEMAIL && password === process.env.ADMINPASS) {
    req.session.admin = true;
    res.json({ success: true, message: 'Admin login successful!' });
  }
  else {
    res.json({ success: false, message: 'Invalid credentials. Please try again Wrong email or password.' });
  }
});
router.get('/secvault', (req, res) => {
  if (req.session.admin) {
    res.sendFile(path.join(__dirname, '../views/vault.html'));
  }
  else {
    res.redirect('/admin/login');
   }
});
module.exports = {
    router

};



