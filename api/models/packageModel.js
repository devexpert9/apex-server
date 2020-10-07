'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packageSchema = new Schema({
    name : {
      type: String
    },
    price : {
      type: String
    },
    timePeriod : {
      type: String
    },
    description : {
      type: String
    },
    status:{
      type: String
    },
    created_at:{
      type: Date
    }
});


var cardSchema = new Schema({
    userId: {
      type: String
    },
    card_data: {
      type: Object
    },
    created_at: {
      type: Date
    }
});

module.exports = mongoose.model('package', packageSchema);
module.exports = mongoose.model('cards', cardSchema);