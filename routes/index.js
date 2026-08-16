const express = require("express");
const path = require("path");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const dns = require("dns");
const crypto = require("crypto");
const { check } = require("express-validator");
const {
  TimeLimiter,
  VaultLimiter,
  validate,
  docupload,
  cloudinary,
} = require("./security");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const { createProxyMiddleware } = require("http-proxy-middleware");


router.get("/", async (req, res) => {
  res.render("index", { title: "Quiz App" });
});

router.get("/alltime", (req, res, next) => {
  return res.json("hello");
});

router.get("/Privacy-Policy", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/privacy.html"));
});
router.get("/Terms-of-Use", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/terms.html"));
});

router.post("/fingerprint", async (req, res) => {
  const { fingerprint } = req.body;
  // req.session.finalfingerprint = fingerprint;
  res.json({ success: true });
});

router.get("/check", async (req, res) => {
   if(req.session.userId){
    return res.json({ login: true, userId: req.session.userId });
   }
   return res.json({ login: false });


});

router.get("/help", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/help.html"));
});

router.get("/dashboard", (req,res)=>{
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));

});

router.post("/captcha", async (req, res) => {
  const { email, token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing reCAPTCHA token." });
  }

  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA}&response=${token}`;

    const response = await fetch(googleVerifyUrl, { method: "POST" });
    const data = await response.json();

    if (data.success && data.score >= 0.5 && data.action === "signup") {
      req.session.captcha = {
        valid: true,
        email,
        issuedAt: Date.now(),
      };
      return res.json({
        success: true,
        message: "Captcha verification successful!",
      });
    } else {
      req.session.captcha = null;
      return res.status(403).json({
        success: false,
        message: "Captcha verification failed , Please try again",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Not your fault ,Internal verification error.",
      });
  }
});

module.exports = {
  router,
};
