
const express = require('express');
const path = require('path');
const { router, MongoConnect } = require('./routes/index');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});

 const port = 3069;
 MongoConnect(() => {
     app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
     });
 });




