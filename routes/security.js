const express = require('express'); 
const { check , validationResult} = require('express-validator');
const { link } = require('fs');
let ratelimit = require('express-rate-limit');
const multer = require('multer');

const storage = multer.diskStorage({
  destination:
   (req, file, cb) => 
    cb(null, 'uploads/'),
  filename: (req, file, cb) => 
    cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
const VShortTerm = (sec,max)=>{
return ratelimit({
  windowMs:  5 * 1000, 
  max: max,
  standardHeaders: true, 
    legacyHeaders: false,
   handler: (req, res) => {
    res.status(429).json({
      success: false,
      total : sec,
      message: "Please wait few seconds before clicking again.",
      retryAfter: sec,
    });
 }
});
}
const shortTerm =(sec,max)=>{
return ratelimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: max, 
  standardHeaders: true, 
    legacyHeaders: false,
   handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime; 
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
 
    res.status(429).json({
      success: false,
      total : sec,
      message: "Please wait 60 seconds before requesting another code.",
     secondsLeft: secondsLeft,
    });
 }
});
}


const longTerm =(sec,max)=>{
  return ratelimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: max,
  standardHeaders: true, 
    legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime; 
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
 
    res.status(429).json({
      success: false,
      total : sec,
      message: " Your limit has reached ,Please Try again after 10 Minutes.",
      secondsLeft: secondsLeft,
    });
 }
});
}



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
VShortTerm,
shortTerm,
longTerm,
validate,
upload,
};

