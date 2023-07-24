const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// MySQLとの接続を設定する
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'express_test'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

router.post('/create-user', function(req, res) {
  const user = req.body;

  const query = 'INSERT INTO users SET ?';

  connection.query(query, user, function(err, result) {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).send('Error inserting data into database');
      return;
    }

    res.status(200).send('User successfully created');
  });
});

module.exports = router;
