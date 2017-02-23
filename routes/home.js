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
  if(req.session.user_id){
  var userId = req.session.user_id? req.session.user_id: 0;
  var query = 'select * from time_line_img'; //画像読み込み
  connection.query(query, function(err, rows) {
    console.log(rows);
    res.render('home', {
      title: '人気ランキング',
      imageList: rows
    });
  });
}else{
  res.redirect('/login',{
    title: 'ログイン'
  });
}
});

router.get('/new', function(req, res) {
  if(req.session.user_id){
  var userId = req.session.user_id? req.session.user_id: 0;
  var query = 'select * from time_line_img ORDER BY id DESC'; //画像読み込み
  connection.query(query, function(err, rows) {
    console.log(rows);
    res.render('home', {
      title: '新着',
      imageList: rows
    });
  });
}else{
  res.redirect('/login',{
    title: 'ログイン'
  });
}
});


router.post('/', upload.single('image_file'), function(req, res) {
  var path = req.file.path;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var userId = req.session.user_id? req.session.user_id: 0;
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    var query = 'INSERT INTO time_line_img (image_path, user_id, created_at) VALUES ("' + imagePath + '","'+ userId +'","'+ createdAt +'")';
    connection.query(query, function(err, rows) {
      res.redirect('/home');
    });
  });
});

module.exports = router;
