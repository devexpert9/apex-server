'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dashboardsectionSchema = new Schema({
    title : {
      type: String
    },
    section : {
      type: String
    },
    user_id:{
      type: String
    }
});

module.exports = mongoose.model('dashboardsection', dashboardsectionSchema);