var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var engine = require('ejs-locals');
var passport = require('passport');
var domain = require('express-domain-middleware');

var index = require('./routes/index');
var users = require('./routes/users');
var boards = require('./routes/boards');
var register = require('./routes/register');
var login = require('./routes/login');
var setUser = require('./setUser');
var logout = require('./routes/logout');
var home = require('./routes/home');
var profile = require('./routes/profile');
var app = express();

app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(domain);
app.use('/', setUser, index);
app.use('/users', users);
app.use('/boards', setUser, boards);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/home', home);
app.use('/profile', profile);
app.use(passport.initialize());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
