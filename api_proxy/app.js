require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var cors = require('cors');
const axios = require('axios');
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const QA_SERVICE_URL = process.env.QA_SERVICE_URL;

var indexRouter = require('./routes/index');
app.use(cors({ origin: '*' }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/auth', async (req,res)=>{
  try{
    const response = await axios({      
      method: req.method,
      url: AUTH_SERVICE_URL+req.url,
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch(error){
    res.status(error.response.status).json(error.response.data);
  }
})

app.use('/qa', async (req,res)=>{
  try{
    const response = await axios({
      method: req.method,
      url: QA_SERVICE_URL+req.url,
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch(error){
    res.status(error.response.status).json(error.response.data);
  }
})



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

module.exports = app;
