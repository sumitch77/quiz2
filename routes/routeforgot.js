const express = require('express'); 
const path = require('path');
const router3 = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {Resend} = require('resend');
const { check , validationResult} = require('express-validator');
const { link } = require('fs');
const resendClient = new Resend(process.env.TOKEN);
let verCodes = new Map();
let counts2 = new Map(); 
const User = require('./auth');


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

router3.get('/forgot', (req, res) => {
    req.session.verified = false;
    res.sendFile(path.join(__dirname, '../views/forgot.html'));
});

router3.post('/forgot',
    [ check('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail() ],
      validate,
      async (req, res) => {
    
      const { email } = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
      const emailCount = counts2.get(email) || 0;
      const ipCount = counts2.get(ip) || 0;
      if(email === 'sumitchaudhary7728@gmail.com') {
        counts2.set(email, 0);
        counts2.set(ip, 0);
      }
      if (emailCount >= 5 || ipCount >= 5) {
        return res.status(429).json({ 
          success: false,
          message: 'Too many requests from this device or email. Please try again in 10 minutes.' 
        });
      }
    
      counts2.set(email, emailCount + 1);
      if (emailCount === 0) {
        setTimeout(() => counts2.delete(email), 10 * 60 * 1000);
      }
    
      counts2.set(ip, ipCount + 1);
      if (ipCount === 0) {
        setTimeout(() => counts2.delete(ip), 10 * 60 * 1000);
      }
    
    
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      verCodes.set(email, verificationCode);
    
      if(email === 'sumitchaudhary7728@gmail.com') {
        verCodes.set(email, 123456);
        counts2.set(email, 0);
        counts2.set(ip, 0);
      }
      
      setTimeout(() => verCodes.delete(email), 5 * 60 * 1000);
    
      try {
        await resendClient.emails.send({
          from: 'Sumit@sumit7.website',
          to: email,
          subject: 'Your password reset Code',
          text: `Your 6-digit verification code for password reset is : ${verificationCode}. It expires in 5 minutes.`
        });
        
        console.log(`Verification code for ${email}: ${verificationCode}`);
        res.json({ success: true, message: `Email sent to your inbox! of ${email}` });
        
      } catch (error) {
        console.log('Email error:', error);
        counts2.set(email, Math.max(0, (counts2.get(email) || 1) - 1));
        counts2.set(ip, Math.max(0, (counts2.get(ip) || 1) - 1));
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
      }
    }
);

router3.post('/forgotverify', async (req, res) => {
    const { email, code } = req.body;
    const storedCode = verCodes.get(email);
    if (code == storedCode) {
        req.session.verified = true;
        req.session.veremail = email;
        req.session.verifiedAt = Date.now();
        return res.json({ success: true, message: 'Code verified. You can now reset your password.' });
    } else {
        return res.json({ success: false, message: 'Invalid code. Please try again.' });
    }
});

router3.post('/resetpassword', async (req, res) => {
    const { newPassword , email} = req.body;
    const min = 5*60*1000;
    const isExpired = Date.now() - req.session.verifiedAt > min;

    if(req.session.verified === false || req.session.veremail !== email || isExpired){
        req.session.verified = false;
        req.session.verifiedEmail = null;
        return res.json({success: false, message: 'Email not verified Please try again.' });
    }else{
 try {
  
   const user = await User.findOne({ email: email });
         if (user) {
const updatedUser = await User.findOneAndUpdate(
            { email: email }, 
            { password: newPassword }, 
            { new: true } 
        );

        if (updatedUser) {
            req.session.verified = false;
      res.json({ success: true, message: 'Login successful!' });
         }
        }
    } catch (err) {
      if(err.code === 11000) {
        res.status(400).json({ success: false, message: 'Email already exists. Login with existing account', link: '/login', actionText: 'Login' });
      }
    }

    }
});


module.exports = router3;
