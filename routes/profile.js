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

router.get('/:user_id', function(req, res) {
  var userId = req.params.user_id;
  if(req.session.user_id){
  var query = 'select * from users WHERE user_id ='+userId; //画像読み込み
  connection.query(query, function(err, rows) {
    console.log(rows);
    res.render('profile', {
      title: 'ランキング',
      profile: rows[0]
    });
  });
}else{
  res.redirect('/login',{
    title: 'ログイン'
  });
}
});


router.post('/:user_id', upload.single('image_file'), function(req, res) {
  var path = req.file.path;
  var userId = req.session.user_id? req.session.user_id: 0;
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    var query = 'INSERT INTO time_line_img (image_path, user_id) VALUES ("' + imagePath + '","'+ userId +'")';
    connection.query(query, function(err, rows) {
      res.redirect('/home');
    });
  });
});

module.exports = router;
