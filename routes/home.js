var express = require('express');
var router = express.Router();
var moment = require('moment');
var multer = require('multer');
var connection = require('../mysqlConnection');
var upload = multer({ dest: './public/images/uploads/' });
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dldpqdfjw',
  api_key: '558487243546693',
  api_secret: 'X6itYh1kRvdyqlQIWgqSOVkCu24'
});

router.get('/', function(req, res) {
  var userId = req.session.user_id? req.session.user_id: 0;
  var query = 'select image_path from time_line_img'; //画像読み込み
  connection.query(query, function(err, rows) {
    console.log(rows[0]);
    res.render('home', {
      title: 'はじめてのNode.js',
      imageList: rows
    });
  });
});

module.exports = router;
