require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
require('./services/passport');

var AuthRouter = require('./routes/AuthenticationRoutes');
var index = require('./routes/index');
var users = require('./routes/users');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/austin-animal-alerts')
  .then(function () {
    console.log('[mongoose] Connected to MongoDB')
  })
  .catch(function () {
    console.log('[mongoose] Error connecting to MongoDB')
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(AuthRouter);
app.use('/', index);
app.use('/users', users);

// secret page to test auth
const authStrategy = passport.authenticate('authStrategy', { session: false });
app.get('/api/secret', authStrategy, function (req, res) {
  res.send(`The current user is ${req.user.username}`);
});

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
