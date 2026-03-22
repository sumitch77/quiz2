const express = require('express'); 
const path = require('path');
const router2 = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {Resend} = require('resend');
const resendClient = new Resend(process.env.TOKEN);
let verificationCodes= new Map();
let verificationCode;


const userSchema = new mongoose.Schema({
    name1: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model('user', userSchema);

  
router2.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/abc.html'));

  
});

router2.post('/login', async(req, res) => {
    const { name1 , password, email } = req.body;
    
    try {
        const user = await User.findOne({ name1: name1, email: email , password: password });
         if (user) {
            req.session.userId = user._id;
            req.session.userName = user.name1;
      res.json({ success: true, message: 'Login successful!' });
      
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
router2.post('/signup', async (req, res) => {
  
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

router2.post('/signupco', async (req, res) => {
  const { name1 , phone , email , password, confirmpass } = req.body;
  console.log(req.session.verified);
  console.log(req.session.verifiedEmail);
  console.log(email);
  if(req.session.verified && req.session.verifiedEmail === email) {
    try {
  const newUser = new User({ name1, phone, email, password });
            await newUser.save();
            req.session.verified = false;
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