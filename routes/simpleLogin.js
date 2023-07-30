var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'express_test'
});

router.post('/simpleLogin', async (req, res) => {
  console.log(req.body)
  const { email, user_password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log("Database query error:", error);
      res.status(500).json({ status: 'error', message: 'Database query error' });
      return;
    }

    if (results.length === 0) {
      // No user found
      res.status(401).json({ status: 'error', message: 'User not found' });
      return;
    }

    // 成功ステータスをフロントに返す
    res.status(200).json({ status: 'success', message: 'User found', user: results[0] });
  });
});


router.post('/signup', async (req, res) => {
  const {
    email,
    user_password,
    firstName,
    lastName,
    firstNameKana,
    lastNameKana,
    phone,
    job,
    gender,
    dateOfBirth
  } = req.body;

  const saltRounds = 10;

  bcrypt.hash(user_password, saltRounds, function(err, hash) {
    db.query(
      'INSERT INTO users (email, user_password, firstName, lastName, firstNameKana, lastNameKana, phone, job, gender, dateOfBirth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, hash, firstName, lastName, firstNameKana, lastNameKana, phone, job, gender, dateOfBirth],
      function(error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.json({ status: 'success' });
        }
      }
    );
  });
});


module.exports = router;
