
const express = require('express');
const router = require('./routes/index');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});

 const port = 3000;
 app.listen(port, () => {
     console.log(`Server is running on port ${port}`);    
    });




