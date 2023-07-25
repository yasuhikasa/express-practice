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

// GET リクエストの処理を追加します。
router.get('/get-users', function(req, res) {
  const query = 'SELECT * FROM users';

  connection.query(query, function(err, result) {
    if (err) {
      console.error('Error getting data from database:', err);
      res.status(500).send('Error getting data from database');
      return;
    }

    res.status(200).json(result);
  });
});

module.exports = router;
