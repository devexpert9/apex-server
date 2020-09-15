'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var securityprivacySchema = new Schema({
    heading : {
      type: String
    },
    content : {
      type: String
    },
    image : {
      type: String
    },
    created_at:{
      type: Date
    }
});

// Web About US Data------------------------------

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webAbout = new Schema({
    heading : {
      type: String
    },
    content : {
      type: String
    },
    image : {
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('webAbout', webAbout);
module.exports = mongoose.model('securityprivacy', securityprivacySchema);


