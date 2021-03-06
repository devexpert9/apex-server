'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var superadminSchema = new Schema({
   
    firstname : {
      type: String
    },
    lastname: {
      type: String
    },
    username: {
      type: String
    },
    email: {
      type: String,
    },
    password: {
      type : String
    },
    contact: {
      type : String
    },
    gender: {
      type : String
    },
    created_on: {
      type: Date
    },
    image: {
      type: String
    }
});

module.exports = mongoose.model('superadmin', superadminSchema);