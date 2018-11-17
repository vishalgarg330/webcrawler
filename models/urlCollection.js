var mongoose = require('mongoose');

var data = mongoose.Schema({
        name:String,
        url:String
    }
);

module.exports= mongoose.model('urls',data);
