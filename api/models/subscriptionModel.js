'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subscriptionSchema = new Schema({
   
    email : {
      type: String
    },
    created_on:{
      type: Date
    }
});

module.exports = mongoose.model('subscription', subscriptionSchema);