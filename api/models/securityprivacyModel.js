'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var securityprivacySchema = new Schema({
    heading : {
      type: String
    },
    content : {
      type: String
    },
    image : {
      type: String
    },
    created_at:{
      type: Date
    }
});

module.exports = mongoose.model('securityprivacy', securityprivacySchema);