'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var agentsubscriptionSchema = new Schema({
   	user_id : {
   		type: String
   	},
    data : {
  		type: String
    },
    status : {
      	type: Number
    },
    created_on:{
      	type: Date
    }
});

module.exports = mongoose.model('agentsubscription', agentsubscriptionSchema);