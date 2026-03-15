const express = require('express'); 
const path = require('path');
const mysql = require('mysql2/promise');
const router = express.Router();
 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Gtabgmi77$',
    database: 'quiz',
});

router.get('/index', (req, res,next) => {
    res.sendFile(path.join(__dirname, '../views/setTest.html'));
});
router.post('/index', async(req, res) => {
   
    const { q1, q2, q3, q4, q5 } = req.body;
    try {
        await pool.execute(
            'INSERT INTO quiz (question, `option-a`, `option-b`, `option-c`, `option-d`) VALUES (?, ?, ?, ?, ?)',
            [q1, q2, q3, q4, q5],
        );
        console.log('Data inserted successfully');
        res.redirect('/');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('<h1>Error inserting data into database</h1>');
    }
});

router.get('/', (req, res,next) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;