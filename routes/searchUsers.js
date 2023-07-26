const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'express_test'
});

router.use((req, res, next) => {
  // キャッシュを無効化します
  res.set('Cache-Control', 'no-store');
  next();
});

router.get('/search', async (req, res) => {
  const { firstName, lastName, firstNameKana, lastNameKana } = req.query;

  const query = mysql.format(
    `SELECT * FROM users WHERE firstName LIKE ? OR lastName LIKE ? OR firstNameKana LIKE ? OR lastNameKana LIKE ?`,
    [`%${firstName}%`, `%${lastName}%`, `%${firstNameKana}%`, `%${lastNameKana}%`]
  );

  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.toString() });
    } else {
      res.json(results);
    }
  });
});



module.exports = router;
