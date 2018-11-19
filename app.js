const compression = require('compression');
const express= require('express');
const app = express();
const port = 3000;

var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var httpErrors = require('http-errors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var todoRouter = require('./routes/todo');
var authorRouter = require('./routes/author');

var mongoDB = 'mongodb://localhost/todosAPP';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(helmet());

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(compression());

app.use('/', indexRouter);
app.use('/todo', todoRouter);
app.use('/author', authorRouter);

app.use(function (req,res,next) {
  next(httpErrors(404));
});

app.listen(port, function(){
  console.log('Server listen on port '+ port +'!');
});

module.exports = app