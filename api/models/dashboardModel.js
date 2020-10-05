'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dashSchema = new Schema({
    section : {
      type: String
    },
    data: {
      type: Object
    },
    user_id:{
      type: String
    },
    created_at:{
      type: Date
    },
    index:{
      type: Number
    }
});

module.exports = mongoose.model('dashboard', dashSchema);