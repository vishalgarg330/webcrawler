var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var mongoConnection = 'mongodb://vgarg:qwerty1@ds163156.mlab.com:63156/newsdata';
/* GET home page. */
router.get('/', function(req, res, next) {

  MongoClient.connect(mongoConnection,function(err,db)
  {
    if(err)
       throw err;
    else
    {
      db.db('newsdata').collection('newsdata').find({}).toArray(function(err,resp)
      {
        if(err) throw err;
        else
        {
          res.render('index', {title:'home',news:resp});
        }
      });
    }
  });

});

module.exports = router;
