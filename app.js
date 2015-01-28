var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// timer instance
var timer = require('./schedulejob/schedulejob');
//var test = require('./schedulejob/cronjob');
// database stuff
var mongo = require('mongodb');
var monk = require('monk');
//db = monk('localhost:27017/Monit');
var mongojs = require('mongojs');
db = mongojs('localhost:27017/Monit');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// first run, empty queue and empty results table

//first run --> empty results table
//application restart --> find the jobs to run and put those into a queue


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
//app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    //mongoose.connect('mongodb://localhost');
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;