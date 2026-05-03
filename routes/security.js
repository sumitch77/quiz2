const express = require('express'); 
const { check , validationResult} = require('express-validator');
const { link } = require('fs');
let {ratelimit , ipKeyGenerator} = require('express-rate-limit');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');


cloudinary.config({
  cloud_name: process.env.CLOUDINNAME,
  api_key: process.env.CLOUDINAPI,
  api_secret: process.env.CLOUDINSEC,
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Only images allowed'), false); 
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage,
    fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
 });


 const docstorage = multer.memoryStorage();
  const docupload = multer({ docstorage,
    limits: { fileSize: 20 * 1024 * 1024 },
  });



const shortTermLimiter = ratelimit({
    windowMs: 10 * 1000,
    limit: 2, 
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(400).json({
            success: false,
            message: "Please wait a few seconds before clicking again.",
        });
    }
});

const EmailLimiter = ratelimit({
    windowMs: 10 * 60 * 1000,
    limit: 5, 
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      let normalizedEmail = 'anonymous'; 
    if (req.body && req.body.email) {
      const email = req.body.email.toLowerCase().trim();
      const [user, domain] = email.split('@');
      const cleanUser = domain === 'gmail.com' ? user.replace(/\./g, '') : user;
      normalizedEmail = `${cleanUser}@${domain}`;
    }
    const fingerprint = [
      normalizedEmail,
      ipKeyGenerator(req.ip),
      req.headers['user-agent'],
      req.headers['accept-language']
    ].join('###');

    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  },
    handler: (req, res) => {
        res.status(400).json({
            success: false,
            message: "Limit reached. Please wait 10 minutes before trying again.",
        });
    }
});


const TimeLimiter = ratelimit({
    windowMs: 5 * 1000,
    limit: 1, 
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(400).json({
            success: false,
            message: "Processing your request. Please wait a few seconds before trying again.",
        });
    }
});

const VaultLimiter = ratelimit({
    windowMs: 60 *60* 1000,
    limit: 5, 
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
       return "overall_limit";
    },
    handler: (req, res) => {
        res.status(400).json({
            success: false,
            message: "Upload limit reached. Please wait 1 hour before trying again.",
        });
    }
});
// const longTerm =(sec,max)=>{
//   return ratelimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: max,
//   standardHeaders: true, 
//     legacyHeaders: false,
//   handler: (req, res) => {
//     const resetTime = req.rateLimit.resetTime; 
//     const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
 
//     res.status(400).json({
//       success: false,
//       total : sec,
//       message: " Your limit has reached ,Please Try again after 10 Minutes.",
//       secondsLeft: secondsLeft,
//     });
//  }
// });
// }



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

module.exports={
shortTermLimiter,
EmailLimiter,
TimeLimiter,
VaultLimiter,
validate,
upload,
cloudinary,
docupload,
};

