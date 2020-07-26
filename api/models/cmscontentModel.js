'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cmscontentSchema = new Schema({
   
    template : {
      type: String
    },
    selfservice_image: {
      type: String
    },
    selfservice_content: {
      type: String
    },
    disability_image: {
      type: String,
    },
    disability_content: {
      type : String
    },
    property_casuality_image: {
      type : String
    },
    property_casuality_content: {
      type : String
    }
});

module.exports = mongoose.model('cmscontent', cmscontentSchema);