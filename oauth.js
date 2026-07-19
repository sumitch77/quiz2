const express = require('express'); 
const path = require('path');
const router4 = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const dotenv = require('dotenv');
dotenv.config();

const{ User} = require('./auth');



router4.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

// Step 2: Google handles login, then sends the user back to this explicit callback URL.
router4.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: true 
    }),
    (req, res) => {
        req.session.userName = req.user.name1;
        req.session.userId = req.user.googleId;
        req.session.UserEmail = req.user.email;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect('/login');
            }
            res.redirect('/');
        });
    }
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true 
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("Raw Google Profile Object:", profile);

    try {
        
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const profilePic = profile.photos[0]?.value; 

        let user = await User.findOne({ 
            $or: [
                { googleId: googleId },
                { email: email.toLowerCase() }
            ]
        });

        if (!user) {
            user = new User({
                name1:name,
                email: email.toLowerCase(),      

                googleId: googleId,
                Gprofile: profilePic,
                // Automatically set legal agreement fields since they clicked your OAuth button
                // agreement: {
                //     agreed: true,
                //     agreedAt: new Date()
                // }
            });
            await user.save();
        } else if (!user.googleId) {
            // User previously signed up using traditional email/password forms.
            // Link their Google profile ID securely so they can use both login methods!
            user.googleId = googleId;
            if (!user.Gprofile) user.Gprofile = profilePic;
            await user.save();
        }

        return done(null, user);

    } catch (error) {
        console.error("OAuth Processing Error:", error);
        return done(error, null);
    }
  }
));

module.exports = {router4};