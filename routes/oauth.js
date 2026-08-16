const express = require('express'); 
const path = require('path');
const router4 = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const dotenv = require('dotenv');
dotenv.config();

const{ supabase} = require('./supabase');



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
        req.session.userName = req.user.name;
        req.session.userId = req.user.id;
        req.session.userEmail = req.user.email;
        req.session.profilepic = req.user.googlePhoto;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect('/login');
            }
            res.redirect('/');
        });
    }
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0]?.value;
        const name = profile.displayName;
        const photo = profile.photos[0]?.value;

        // 1. Query Supabase for existing user
        let { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', googleId)
          .maybeSingle();

        if (error) return done(error, null);

        // 2. Insert new user if they don't exist
        if (!user) {
          const { data: newUser, error: insertError } = await supabase
            .from('allusers')
            .insert([
              {
                googleid: googleId,
                email: email,
                name: name,
                googlePhoto: photo,
              },
            ])
            .select()
            .single();

          if (insertError) return done(insertError, null);
          user = newUser;
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = {router4};