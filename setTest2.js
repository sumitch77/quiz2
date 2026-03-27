
const express = require('express');
const path = require('path');
const { router } = require('./routes/index');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongostore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const { router2 } = require('./routes/auth');
const router3 = require('./routes/routeforgot');
dotenv.config();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const store = new mongostore({
    uri: process.env.url,
    collection: 'sessions',
});
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'papasecretkey',
    resave: false,
    saveUninitialized: true,
    store: store
}));

app.use(router);
app.use(router2);
app.use(router3);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

 const port = 3069;
 mongoose.connect(process.env.url).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    
 }).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
 });    

module.exports = { session };


