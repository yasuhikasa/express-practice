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
  // 1ページあたりのユーザー数
  const usersPerPage = 10;

  // 現在のページ番号（1から始まる）
  const currentPage = req.query.page || 1;

  // MySQLのOFFSETは0から始まるので、1を引く
  const offset = (currentPage - 1) * usersPerPage;

  const query = 'SELECT * FROM users LIMIT ? OFFSET ?';

  connection.query(query, [usersPerPage, offset], function(err, result) {
    if (err) {
      console.error('Error getting data from database:', err);
      res.status(500).send('Error getting data from database');
      return;
    }

    res.status(200).json(result);
  });
});

// 全ユーザー数を取得するエンドポイントを追加します。
router.get('/get-total-users', function(req, res) {
  const query = 'SELECT COUNT(*) as totalCount FROM users';

  connection.query(query, function(err, result) {
    if (err) {
      console.error('Error getting total user count:', err);
      res.status(500).send('Error getting total user count');
      return;
    }

    // ユーザー数を返す
    res.status(200).json(result[0].totalCount);
  });
});

// 編集用に個別のユーザーを取得するエンドポイントを追加します。
router.get('/get-user/:id', function(req, res) {
  const id = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';

  connection.query(query, [id], function(err, result) {
    if (err) {
      console.error('Error getting user from database:', err);
      res.status(500).send('Error getting user from database');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('No user found with the given ID');
      return;
    }

    res.status(200).json(result[0]);
  });
});

router.put('/edit-user/:id', function(req, res) {
  const id = req.params.id;
  const userUpdates = req.body;

  const query = 'UPDATE users SET ? WHERE id = ?';

  connection.query(query, [userUpdates, id], function(err, result) {
    if (err) {
      console.error('Error updating data in database:', err);
      res.status(500).send('Error updating data in database');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('No user found with the given ID');
      return;
    }

    res.status(200).send('User successfully updated');
  });
});

router.delete('/delete-user/:id', function(req, res) {
  const id = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';

  connection.query(query, [id], function(err, result) {
    if (err) {
      console.error('Error deleting user from database:', err);
      res.status(500).send('Error deleting user from database');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('No user found with the given ID');
      return;
    }

    res.status(200).send('User successfully deleted');
  });
});


module.exports = router;
