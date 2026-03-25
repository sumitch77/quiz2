const express = require('express'); 
const path = require('path');
const router2 = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {Resend} = require('resend');
const { check , validationResult} = require('express-validator');
const resendClient = new Resend(process.env.TOKEN);
let verificationCodes= new Map();
let verificationCode;


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedError = errors.array()[0].msg;
  
  return res.status(400).json({
    success: false,
    message: extractedError,
  });
};


const userSchema = new mongoose.Schema({
    name1: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model('user', userSchema);

  router2.get('/index', (req, res,next) => {
       if(req.session.userId&& req.session.userName){
        console.log(`User ${req.session.userId} is accessing the setTest page.`);
      res.sendFile(path.join(__dirname, '../views/setTest.html'));
  }
  else {
      res.redirect('/login');
  }
  });
router2.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/abc.html'));

  
});

router2.post('/login', async(req, res) => {
    const { name1 , password, email } = req.body;
    
    try {
        const user = await User.findOne({ name1: name1, email: email , password: password });
         if (user) {
            req.session.userId = user._id.toString();
            req.session.userName = user.name1;
      res.json({ success: true, message: 'Login successful!' });
      console.log(`User ${req.session.userId} logged in successfully.`);
      console.log(`Session data: ${JSON.stringify(req.session.userName)}`);

      
    } else {
      res.json({ success: false, message: 'Invalid credentials. Please try again Wrong email or password.' });
    }
    }catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ success: false, message: 'An error occurred during login', error: err.message });    
    }
   
    });



router2.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router2.post('/signup',
  [ check('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail() ],
    validate,
  async (req, res, next) => {

  const { email } = req.body;
 

   verificationCode = Math.floor(100000 + Math.random() * 900000);
  verificationCodes.set(email, verificationCode);
setTimeout(() =>
   verificationCodes.delete(email),
 5 * 60 * 1000);

  try {
    await resendClient.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Verification Code',
      text: `Your 6-digit verification code is: ${verificationCode}. It expires in 5 minutes.`
    });
    res.json({ success: true, message: 'Email sent' });
    console.log(`Verification code ${verificationCode}`);
  } catch (error) {
    console.log('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});


router2.post('/verify2', (req, res) => {
  const {code, email} = req.body; 
  const stored = verificationCodes.get(email);
  if (code == stored) {
    req.session.verified = true;
    req.session.verifiedEmail = email;
    res.json({ success: true, message: 'Verification successful!' });
    
  } else {  
    res.json({ success: false, message: 'Wrong code, Please try again.' });
  }
  
});

router2.post('/signupco',
  [ check('email')
      .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    check('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('name1').notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 20 }).withMessage('Name must be between 2 and 20 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Invalid phone number format'),
    check('confirmpass')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })

  ],
    validate,
  
    
async (req, res) => {
  console.log("Data received by server:", req.body);
  const { name1 , phone , email , password, confirmpass } = req.body;
  if(req.session.verified && req.session.verifiedEmail === email) {
    try {
  const newUser = new User({ name1, phone, email, password });
            await newUser.save();
            req.session.verified = false;
             req.session.userId = newUser._id;
            req.session.userName = newUser.name1;
    res.json({ success: true, message: 'Signup successful!' });

    } catch (err) {
        console.log('Signup error:', err);
        res.status(500).json({ success: false, message: 'An error occurred during signup', error: err.message });    
    }
  } else {
    res.json({ success: false, message: 'Email not verified. Please verify your email before signing up.' });
  }
    
});


module.exports = {
    router2
};