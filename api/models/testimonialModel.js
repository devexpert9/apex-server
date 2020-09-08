'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testimonialSchema = new Schema({
    name : {
      type: String
    },
    position : {
      type: String
    },
    message : {
      type: String
    },
    rating : {
      type: String
    },
    image:{
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('testimonial', testimonialSchema);