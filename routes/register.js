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

router.get('/', function(req, res, next) {
  res.render('register', {
    title: '新規会員登録'
  });
});

router.post('/', upload.single('image_file'),  function(req, res, next) {
  var path = req.file.path;
  var gendar = req.body.gendar;
  var address = req.body.prefecture;
  console.log(address);
  var userName = req.body.user_name;
  var email = req.body.email;
  var password = req.body.password;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var emailExistsQuery = 'SELECT * FROM users WHERE email = "' + email + '" LIMIT 1'; // 追加
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    var registerQuery = 'INSERT INTO users (user_name, email, password, created_at,user_img,gendar,address) VALUES ("' + userName + '", ' + '"' + email + '", ' + '"' + password + '", ' + '"' + createdAt + '", ' + '"' + imagePath + '", ' + '"' + gendar + '", ' + '"' + address + '")'; // 変更
  connection.query(emailExistsQuery, function(err, email) {
    var emailExists = email.length === 1;
    if (emailExists) {
      res.render('register', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです'
      });
    } else {
      connection.query(registerQuery, function(err, rows) {
        res.redirect('/login');
      });
    }
  });
 });
});

module.exports = router;
