var mongoose = require('mongoose');

var data = mongoose.Schema({
    name:String,
    details:[{
            title:String,
            pubDate:String,
            desc:String,
            link:String
    }]
    }
);

module.exports= mongoose.model('newsdetails',data);
