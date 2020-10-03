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
    contact: {
      type: String
    },
    zip: {
      type: String
    },
    state: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    address: {
      type: String
    },
    created_on: {
      type: Date
    },
    status: {
      type: Number
    },
    image: {
      type: String
    },
    expiry_date: {
      type: Date
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