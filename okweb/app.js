var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'javauser',
  password: 'javadude',
  database: 'javatest'
});

var index = require('./routes/index');
var users = require('./routes/users');
var member = require('./routes/member');

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

app.use('/', index);
app.use('/users', users);
app.use('/member', member);

app.use(multer({
  dest: './public/uploads/',
  rename: function (fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
}).any());


app.get('/link', function (req, res) {
  res.send('Hello World Get!')
})

app.post('/link', function (req, res) {
  res.send('Hello World Post!')
})

app.post('/api/photo', function (req, res) {
  var file = req.files[0];
  var filename = file.filename;
  var original = file.originalname;
  var size = file.size;
  connection.connect();

  connection.query(`INSERT INTO photo (seq, filename, original, size, reg_date)
  VALUES (null, ?, ?, ?, now());`,
    [filename, original, size]
    , function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results[0]);
    });

  connection.end();
  res.end(JSON.stringify(req.files));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
