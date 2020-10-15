'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signuppackageSchema = new Schema({
    name : {
      type: String
    },
    price : {
      type: String
    },
    timePeriod : {
      type: String
    },
    description : {
      type: String
    },
    status:{
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('signuppackage', signuppackageSchema);