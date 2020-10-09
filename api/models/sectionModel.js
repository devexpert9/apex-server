'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sectionSchema = new Schema({
    name : {
      type: String
    },
    message : {
      type: String
    },
    status : {
      type: String
    },
    image:{
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('section', sectionSchema);