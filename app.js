var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb=require('mongodb');
var mongoose=require('mongoose');
var session=require('express-session');
var flash=require('connect-flash');
var mongoDb = require('connect-mongo')(session);
var index = require('./routes/index');
var models=require('./models');
var usersRouter = require('./routes/users');
let RssFeedEmitter = require('rss-feed-emitter');
let feeder = new RssFeedEmitter();
var MongoClient = require('mongodb').MongoClient;

var app = express();


var mongoConnection = 'mongodb://vgarg:qwerty1@ds163156.mlab.com:63156/newsdata';


mongoose.connect(mongoConnection, {useNewUrlParser: true});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
        secret: 'vishalgarg'
    })
);

var response = [ { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    name: 'Top Stories' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
    name: 'Sports' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1221656.cms',
    name: 'Most Recent Stories' } ];

function savenewsindb(){
    for(i=0;i<response.length;i++){
        feeder.add({
                url: response[i].url,
                refresh: 2000
            }
        )};
        feeder.on('new-item',function (item) {
          var result = {};
          result.title = item.title;
          result.description = item.description;
          result.summary = item.summary;
          result.pubdate = item.pubdate;
          result.link = item.link;
          result.image = item.image;
          MongoClient.connect(mongoConnection,function(err,db)
          {
            if(err)
               throw err;
            else
            {
              db.db('newsdata').collection('newsdata').find({title:result.title}).toArray(function(err,resp)
              {
                if(err) throw err;
                else
                {
                  if(resp.length==0){
                      db.db('newsdata').collection('newsdata').save(result,function(err,result)
                      {

                          if(err) throw err;
                      });
                  }
                }
              });

            }
          });
        });
}
savenewsindb();



app.use(flash());
app.use('/', index);

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
