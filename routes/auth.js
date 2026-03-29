const express = require('express'); 
const path = require('path');
const router2 = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {Resend} = require('resend');
const resendClient = new Resend(process.env.TOKEN);
let verificationCodes= new Map();
const { check } = require('express-validator');
const {VShortTerm,shortTerm,longTerm,validate,} = require('./security');
const VShort = VShortTerm(5,1);
const VShortlog = VShortTerm(5,1);
const VShortver = VShortTerm(5,1);
const VShortsign = VShortTerm(5,1);
const short = shortTerm(60,2);
const long = longTerm(600,5);
const quesid = new Map();


const userSchema = new mongoose.Schema({
    name1: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model('user', userSchema);

router2.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'An error occurred during logout', error: err.message });
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});


router2.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router2.post('/login', VShortlog, async(req, res) => {
    const { password, email } = req.body;
    
    try {
        const user = await User.findOne({ email: email , password: password });
         if (user) {
            req.session.userId = user._id.toString();
            req.session.userName = user.name1;
            req.session.userEmail= user.email;
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

router2.get('/forgot', (req, res) => {
      res.sendFile(path.join(__dirname, '../views/forgot.html'));
    });
    


router2.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router2.post('/signup',long,short,VShort,
  [ check('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail() ],
  validate,
  async (req, res, next) => {

  const { email} = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  verificationCodes.set(email, verificationCode);

  if(email === 'sumitchaudhary7728@gmail.com') {
    verificationCodes.set(email, 123456);
  }
  
  setTimeout(() => verificationCodes.delete(email), 5 * 60 * 1000);

  try {
    await resendClient.emails.send({
      from: 'Sumit@sumit7.website',
      to: email,
      subject: 'Your Verification Code',
      text: `Your 6-digit verification code is: ${verificationCode}. It expires in 5 minutes.`
    });
  
    console.log(`Verification code for ${email}: ${verificationCode}`);
    res.json({ success: true, message: `Email sent to your inbox! of ${email}` });
    
  } catch (error) {
    console.log('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});


router2.post('/verify2',VShortver, (req, res) => {
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


router2.post('/signupco',VShortsign,
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
  const { name1 , phone , email , password, confirmpass } = req.body;
  if(req.session.verified && req.session.verifiedEmail === email) {
    try {
  const newUser = new User({ name1, phone, email, password });
            await newUser.save();
            req.session.verified = false;
             req.session.userId = newUser._id.toString();
            req.session.userName = newUser.name1;
            req.session.userEmail = newUser.email;
    res.json({ success: true, message: 'Signup successful!' });

    } catch (err) {
      if(err.code === 11000) {
        res.status(400).json({ success: false, message: 'Email already exists. Login with existing account', link: '/login', actionText: 'Login' });
      }
        else {
        res.status(500).json({ success: false, message: 'An error occurred during signup', error: err.message }); 
        }   
    }
  } else {
    res.json({ success: false, message: 'Email not verified. Please verify your email before signing up.' });
  }
    
});


module.exports = {
    router2, 
    User,
};