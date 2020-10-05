'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cmscontentSchema = new Schema({
   
    template : {
      type: String
    },
    selfHeading: {
      type: String
    },
    selfHeadingCheckbox: {
      type: Boolean
    },
    selfservice_image: {
      type: String
    },
    selfservice_content: {
      type: String
    },
    disabilityHeading: {
      type: String,
    }, 
    disabilityHeadingCheckbox: {
      type: Boolean,
    },
    disability_image: {
      type: String,
    },
    disability_content: {
      type : String
    },
    propHeading: {
      type : String
    },
    propHeadingCheckbox: {
      type : Boolean
    },
    property_casuality_image: {
      type : String
    },
    property_casuality_content: {
      type : String
    }
});

module.exports = mongoose.model('cmscontent', cmscontentSchema);