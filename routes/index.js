const express = require('express'); 
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const dns = require("dns");
const crypto = require('crypto');
const { check } = require('express-validator');
const { TimeLimiter,VaultLimiter,validate, docupload, cloudinary} = require('./security');
dns.setServers(["1.1.1.1", "8.8.8.8"]);


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
  email : String,
  questions: [questionSchema], 
   scores: [scoreSchema],
});

const Quiz = mongoose.model('Quizall', quizSchema);

const docschema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  link : String,
});

const Doc = mongoose.model('Doc', docschema);



router.get('/', async (req, res) => {
         if(req.session.userId&& req.session.userName){

  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    res.render('index', {
      username: req.session.userName || null,
      quizzes: quizzes,
      owner :req.session.userEmail || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
}else{
  res.redirect('/login');
}
});

router.get('/index', (req, res,next) => {
       if(req.session.userId&& req.session.userName){
        req.session.randomid = (req.session.userId+req.session.userName+Date.now()).toString();
         req.session.questions = [];
      res.sendFile(path.join(__dirname, '../views/setTest.html'));
  }
  else {
      res.redirect('/login');
  }
  });
router.get('/Privacy-Policy', (req, res,next) => {
       
      res.sendFile(path.join(__dirname, '../public/privacy.html'));
  });
router.get('/Terms-of-Use', (req, res,next) => {
       
      res.sendFile(path.join(__dirname, '../public/terms.html'));
  });
 

router.get('/check',  (req, res, next) => {
  if(req.session.userId && req.session.userName) {
    res.json({ success: true , loggedIn: true, username: req.session.userName, useremail : req.session.userEmail });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post('/fingerprint', async (req, res) => {
  const { fingerprint } = req.body;
  req.session.finalfingerprint = fingerprint;
  res.json({ success: true });

  // const parts = fingerprint.split('|||');
  // const [audiofingerprint, canvasfingerprint, fontfingerprint, ...commonfingerprint] = parts;
  // const finalcommonfingerprint = commonfingerprint.join('|||');

  // req.session.audiofingerprint = audiofingerprint;
  // req.session.canvasfingerprint = canvasfingerprint;
  // req.session.fontfingerprint = fontfingerprint;
  // req.session.commonfingerprint = finalcommonfingerprint;
  // req.session.Bossfinalemailfingerprint = fingerprint;


});



router.post('/sendques',TimeLimiter,
 [ check('q1').notEmpty().withMessage("please Enter question"),
  check('a1').notEmpty().withMessage("please Enter option"),
  check('a2').notEmpty().withMessage("please Enter option"),
  check('a3').notEmpty().withMessage("please Enter option"),
  check('a4').notEmpty().withMessage("please Enter option"),
  check('ans').notEmpty().withMessage("please Select right option"),
 ],
 validate,
  
  async(req, res) => {
           if(req.session.userId&& req.session.userName){

   
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
  }else{
    res.redirect('/login');
  }

});

router.post('/submitques', TimeLimiter, async (req, res) => {
         if(req.session.userId&& req.session.userName){

  
    const questions = req.session.questions;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions to save' });
    }

  try {
    const newQuiz = new Quiz({
      createdBy: req.session.userName,
      email : req.session.userEmail,
      questions: questions,
    });

    await newQuiz.save();
    req.session.questions = [];

    return res.status(200).json({ success: true, message: 'Quiz saved successfully!' });  // ✅

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to save quiz', error: err.message }); // ✅
  }
}else{
  res.redirect('/login');
}
});


router.get('/quiz/:id', async (req, res) => {
         if(req.session.userId&& req.session.userName){

  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    res.render('alltest', {
      username: req.session.userName || null,
      quiz: quiz,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
}else{
  res.redirect('/login');
}
});

router.get('/quiz/:id/leaderboard', async (req, res) => {
         if(req.session.userId&& req.session.userName){

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
}else{
  res.redirect('/login');
}
});

router.post('/quiz/:id/score',TimeLimiter, async (req, res) => {
         if(req.session.userId&& req.session.userName){

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
}else{
  res.redirect('/login');
}
});

router.get('/profile',  (req, res) => {
  if (req.session.userId && req.session.userName) {
    res.json({ success: true, username: req.session.userName, useremail: req.session.userEmail , photourl : req.session.profilepic });
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

router.post('/captcha',async(req,res)=>{
  const { email, token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing reCAPTCHA token." });
  }

  try {
  
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA}&response=${token}`;
    
    const response = await fetch(googleVerifyUrl, { method: 'POST' });
    const data = await response.json();

    if (data.success && data.score >= 0.5 && data.action === 'signup') {
      return res.json({ success: true, message: "Login successful!" });
    } else {
      console.log(data.challenge_ts);
      return res.status(403).json({ 
        success: false, 
        message: "Captcha verification failed , Please try again" 
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Not your fault ,Internal verification error." });
  }

});

router.get('/vault', async (req, res) => {
         if(req.session.userId&& req.session.userName){

  const docs = await Doc.find().sort({ createdAt: -1 });
    res.render('list' , {
      username: req.session.userName || null,
      docs: docs

    });
  }else{
    res.redirect('/login');
  }
  
});
const handleupload =(req, res, next) => {
 docupload.single('filesend')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false, 
          message: 'File too large. Max size is 20MB' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  
    next(); 
  });
}

router.post('/vault',VaultLimiter,TimeLimiter,handleupload, async (req, res) => {
  const name = req.body.username || 'Anonymous';
  if(name === 'Anonymous'){
    return res.status(400).json({ success: false, message: 'Username is required' });
  }
 if (req.file) {
  try{
  const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { 
      folder: 'Vault',
      upload_preset: 'ml_default',
      resource_type: 'auto'        
    },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );
  stream.end(req.file.buffer);
});

    filePath = result.secure_url;
    const newDoc = new Doc({
      createdBy: name,
      realcreate: req.session.userName || 'Anonymous2',
      link: filePath,
    });
    await newDoc.save();
   
 
    res.json({ success: true, message: 'File uploaded successfully', link: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload file', error: err.message });
  }
} else {
  res.status(400).json({ success: false, message: 'No file uploaded' });
}

});

router.get('/upigen', (req, res) => {
  
    res.sendFile(path.join(__dirname, '../views/upigen.html'));
  
});

router.post('/upigen', async (req, res) => {
  const { app , type } = req.body;
});



router.get('/delete/:id',  async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;
  if(req.session.userEmail === email || req.session.admin) {
    try {
      await Quiz.findByIdAndDelete(id);
      res.send( `<html>
          <head>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9; }
              .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
              h1 { color: #28a745; }
              .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #28a745; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 1rem auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Done!</h1>
              <p>Quiz deleted successfully.</p>
              <div class="spinner"></div>
              <p>Redirecting to Home..</p>
            </div>
            <script>
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
            </script>
          </body>
        </html>` );
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to delete quiz', error: err.message });
    }
  } else {
    res.send(`<html>
          <head>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9; }
              .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
              h1 { color: #a74428; }
              .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #bb3925; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 1rem auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Access Denied</h1>
              <p> Your are not authorised to delete this.</p>
              <div class="spinner"></div>
              <p>Redirecting to Home..</p>
            </div>
            <script>
              setTimeout(() => {
                window.location.href = '/';
              }, 2000); // 2 seconds is usually enough
            </script>
          </body>
        </html>`);
  }
});
module.exports = {
    router
};



