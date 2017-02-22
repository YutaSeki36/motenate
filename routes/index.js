var express = require('express');
var router = express.Router();
var moment = require('moment'); // 追加
var connection = require('../mysqlConnection'); // 追加

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var title = req.body.title;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var query = 'INSERT INTO boards (title, created_at) VALUES ("' + title + '", ' + '"' + createdAt + '")';
  connection.query(query, function(err, rows) {
    res.redirect('/');
  });
});

module.exports = router;
