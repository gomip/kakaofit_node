// 2021.02.08 | gomip | created

// Init
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = 3031;
const secret = process.env.SECRET_KEY;
const connect = require('./schemas');

// dotenv 설정
require('dotenv').config();

// Router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recordRouter = require('./routes/records');

// DB Connection
connect()

const app = express();

// CORS Setting
app.all('/*', function(req, res, next) {
  const allowed = ['http://localhost:3001', 'http://kakaofit.gomip.ml:3001', 'http://kakaofit.gomip.ml', 'https://kakaofit.gomip.ml', 'https://kakaofit.gomip.ml:3001'];
  const origin = req.headers.origin;
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  // res.header('Access-Control-Allow-Origin', ['http://localhost:3001', 'http://kakaofit.gomip.ml:3001', 'http://kakaofit.gomip.ml]);
  res.header('Access-Control-Allow-Headers','X-Requested-With');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// API 라우팅ㅡ
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/records', recordRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(port, () => {
  console.log(`port ${port} is ready`);
});

module.exports = app;
