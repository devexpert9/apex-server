'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
   
    name : {
      type: String
    },
    username : {
      type: String
    },
    email: {
      type: String,
    },
    password: {
      type : String
    },
    created_on: {
      type: Date
    },
    image: {
      type: String
    }
});


var inquirySchema = new Schema({
   
    domain : {
      type: String
    },
    data : {
      type: Object
    },
    created_on: {
      type: Date
    }
});

module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('inquiries', inquirySchema);