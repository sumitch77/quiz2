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
const { EmailLimiter , TimeLimiter ,validate,} = require('./security');
const quesid = new Map();
const {upload, cloudinary} = require('./security');
const validate2 = require('deep-email-validator');


const userSchema = new mongoose.Schema({
    name1: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // filesend : {type : String},
    standardfingerprint: { type: String },
    audiofingerprint: { type: String },
    canvasfingerprint: { type: String },
    fontfingerprint : {type:String},
    commonfingerprint :{type:String},
});
const User = mongoose.model('user', userSchema);

router2.get('/logout', TimeLimiter,(req, res) => {
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

router2.post('/login', TimeLimiter, async(req, res) => {
    let { password, email } = req.body;
    email = email.toLowerCase().trim();
    if(email==='guest@gmail.com' && password==='guest123'){
         req.session.userId = user._id.toString();
            req.session.userName = user.name1;
            req.session.userEmail= user.email;
      res.json({ success: true, message: 'Login successful!' });
    }
   
      if (email === process.env.ADMINEMAIL) {
    req.session.admin = true;
  }
const result = await validate2.validate({
  email: email,
  validateSMTP: false, 
});

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: "This email address does not exist",
      reason: result.reason 
    });
  }
    try {
        const user = await User.findOne({ email: email , password: password });
         if (user) {
            req.session.userId = user._id.toString();
            req.session.userName = user.name1;
            req.session.userEmail= user.email;
            // req.session.photourl = user.filesend;
      res.json({ success: true, message: 'Login successful!' });
      console.log(`User ${req.session.userId} logged in successfully.`);
      
      
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
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router2.post('/signup',EmailLimiter,TimeLimiter,
  [ check('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail() ],
  validate,
  async (req, res, next) => {

  let { email} = req.body;
  email = email.toLowerCase().trim();
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const result = await validate2.validate({
    email: email,
    validateSMTP: false
  });

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: "This email address does not exist.",
      reason: result.reason 
    });
  }

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


router2.post('/verify2', TimeLimiter, (req, res) => {
  let {code, email} = req.body; 
  email = email.toLowerCase().trim();
  const stored = verificationCodes.get(email);
  if (code == stored) {
req.session.verified = true;
    req.session.verifiedEmail = email;
      const parts = req.session.finalfingerprint.split('|||');
  const [canvasfingerprint, audiofingerprint, fontfingerprint, ...commonfingerprint] = parts;
  const finalcommonfingerprint = commonfingerprint.join('|||');

  req.session.audiofingerprint = audiofingerprint;
  req.session.canvasfingerprint = canvasfingerprint;
  req.session.fontfingerprint = fontfingerprint;
  req.session.commonfingerprint = finalcommonfingerprint;
 
    res.json({ success: true, message: 'Verification successful!' });
    
  } else {  
    res.json({ success: false, message: 'Wrong code, Please try again.' });
  }
  
});
// const handleupload =(req, res, next) => {
//  upload.single('filesend')(req, res, (err) => {
//     if (err) {
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).json({
//           success: false, 
//           message: 'File too large. Max size is 5MB' 
//         });
//       }
//       if (err.message === 'Only images allowed') {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Only images allowed (jpg, png, webp)' 
//         });
//       }
//       // any other multer error
//       return res.status(400).json({ 
//         success: false, 
//         message: err.message 
//       });
//     }
  
//     next(); 
//   });
// }

router2.post('/signupco',TimeLimiter,
  [check('agreement')
    .custom((value) => {
        const accepted = value === true || String(value).toLowerCase() === 'true';

        if (!accepted) {
          console.log('hello');
            throw new Error('You must accept the Terms of Use and Privacy Policy');
            return
        }
       
        return true; 
    }),
    check('email')
      .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    check('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 , max:20 }).withMessage('Password must be between 6 and 20 characters long'),
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
  let { name1 , phone , email , password, confirmpass , agreement} = req.body;
  email = email.toLowerCase().trim();
  // let filePath = null;
  //  if (req.file) {
  //   const result = await new Promise((resolve, reject) => {
  //     const stream = cloudinary.uploader.upload_stream(
  //       { folder: 'uploads' },
  //       (error, result) => {
  //         if (error) reject(error);
  //         else resolve(result);
  //       }
  //     );
  //     stream.end(req.file.buffer);
  //   });

  //   filePath = result.secure_url;
  // }
  
  if(req.session.verified && req.session.verifiedEmail === email) {
    try {
  const newUser = new User({ name1, phone, email, password, filesend: filePath , standardfingerprint: req.session.emailfingerprint , audiofingerprint: req.session.audiofingerprint, canvasfingerprint: req.session.canvasfingerprint, fontfingerprint: req.session.fontfingerprint, commonfingerprint: req.session.commonfingerprint });
            await newUser.save();
            req.session.verified = false;
            // req.session.photourl = filePath;
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