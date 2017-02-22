var express = require('express');
var router = express.Router();
var moment = require('moment'); // 追加
var connection = require('../mysqlConnection'); // 追加

/* GET home page. */
router.get('/', function(req, res) {
  var userId = req.session.user_id? req.session.user_id: 0;
  var query = 'SELECT B.board_id, B.user_id, B.title, ifnull(U.user_name, \'名無し\') AS user_name,B.with_user_id, DATE_FORMAT(B.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM boards B LEFT OUTER JOIN users U ON B.user_id = U.user_id WHERE B.user_id='+userId+' OR B.with_user_id='+userId+' ORDER BY B.created_at DESC '; // 変更
  connection.query(query, function(err, rows) {
    console.log(query);
    res.render('index', {
      title: 'はじめてのNode.js',
      boardList: rows
    });
  });
});

router.post('/', function(req, res, next) {
  var title = req.body.title;
  var userId = req.session.user_id? req.session.user_id: 0; // 追加
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var query = 'INSERT INTO boards (user_id, title, created_at) VALUES ("' + userId + '", ' + '"' + title + '", ' + '"' + createdAt + '")'; // 変更
  connection.query(query, function(err, rows) {
    res.redirect('/');
  });
});

module.exports = router;
