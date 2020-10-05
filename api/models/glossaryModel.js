'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var glossarySchema = new Schema({
    topic : {
      type: String
    },
    defination : {
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('glossary', glossarySchema);