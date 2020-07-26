'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cmscontentSchema = new Schema({
   
    template : {
      type: String
    },
    data: {
      type: String
    }
});

module.exports = mongoose.model('cmscontent', cmscontentSchema);