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

router.get('/:board_id', function(req, res, next) {
  if(req.session.user_id){
  var boardId = req.params.board_id;
  var getBoardQuery = 'SELECT * FROM boards WHERE board_id = ' + boardId;
  var getMessagesQuery = 'SELECT M.message, M.image_path, ifnull(U.user_name, \'名無し\') AS user_name, DATE_FORMAT(M.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM messages M LEFT OUTER JOIN users U ON M.user_id = U.user_id WHERE M.board_id = ' + boardId + ' ORDER BY M.created_at ASC'; // 変更
  connection.query(getBoardQuery, function(err, board) {
    connection.query(getMessagesQuery, function(err, messages) {
    //  console.log(board[0]);
      res.render('board', {
        title: board[0].title,
        board: board[0],
        messageList: messages
      });
    });
  });
  }else{
    res.redirect('/login',{
      title: 'ログイン'
    });
  }
});

router.post('/:board_id', upload.single('image_file'), function(req, res) {
  if (req.file) {
    var path = req.file.path;
  }else{
    var path = null;
  }
  var message = req.body.message;
  var boardId = req.params.board_id;
  var userId = req.session.user_id? req.session.user_id: 0;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    var query = 'INSERT INTO messages (image_path, message, board_id, user_id, created_at) VALUES ("' + imagePath + '", ' + '"' + message + '", ' + '"' + boardId + '", ' + '"' + userId + '", ' + '"' + createdAt + '")';
    connection.query(query, function(err, rows) {
      res.redirect('/boards/' + boardId);
    });
  });
});
module.exports = router;
