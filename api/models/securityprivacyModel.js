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

// Web Contact US Data------------------------------

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webContact = new Schema({
    phone : {
      type: String
    },
    desc : {
      type: String
    },
    newsletterDesc : {
      type: String
    },
    email : {
      type: String
    },
    address : {
      type: String
    },
    skype : {
      type: String
    },
    facebook : {
      type: String
    },
    twitter : {
      type: String
    },
    instagram : {
      type: String
    },
    google : {
      type: String
    },
    pintrest : {
      type: String
    },
    linkedin : {
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('webContact', webContact);
module.exports = mongoose.model('webAbout', webAbout);
module.exports = mongoose.model('securityprivacy', securityprivacySchema);


