require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


const indexRouter = require('./routes/index');
const userRouter = require('./routes/user-router');
const dataRouter = require('./routes/data-router');

const app = express();

app.use(require('connect-history-api-fallback')())
app.use(cors());

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - logger
app.use(logger('dev'));
//middleware - body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//middleware - cookie-parser
app.use(cookieParser());
//middleware - static
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/data', dataRouter);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//middleware - error-handler
app.use((err, req, res, next) => {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  //render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
