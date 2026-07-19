
const express = require('express');
const path = require('path');
const { router } = require('./routes/index');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongostore = require('connect-mongo');
const dotenv = require('dotenv');
const { router2 } = require('./routes/auth');
const router3 = require('./routes/routeforgot');
const { router4 } = require('./routes/oauth');
const multer = require('multer');
const cors = require('cors');
const passport = require('passport');
const { User } = require('./routes/auth');

dotenv.config();
const allowedOrigins = [process.env.ALLOWED, process.env.THIRDALLOWED, process.env.FOURTHALLOWED];
app.use(cors({
   origin: function (origin, callback) {
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
          callback(null, false);
        }
    }
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
// const store = new mongostore({
//     uri: process.env.URL,
//     collection: 'sessions',
// });
app.set('trust proxy', 1);
app.use(express.json());

app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: new mongostore({ 
        mongoUrl: process.env.MONGO_URL
    }),
    cookie: { 
        httpOnly: true, 
        secure: true, 
        maxAge: 7*24 * 60 * 60 * 1000 
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization & deserialization
passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

app.use(router);
app.use(router2);
app.use(router3);
app.use(router4);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

 const port = 3069;
 mongoose.connect(process.env.URL).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    
 }).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
 });    

module.exports = { session};


