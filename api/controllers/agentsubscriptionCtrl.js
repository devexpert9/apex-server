'use strict';

var mongoose      = require('mongoose'),
multer            = require('multer'),
users             = mongoose.model('users'),
inquiries         = mongoose.model('inquiries'),
agentsubs         = mongoose.model('agentsubscription'),
var path          = require('path');

//--- Create Package-----------------------------
exports.addAgentSubs = function(req, res)
{
  var new_pack = new agentsubs({
    user_id:  req.body.user_id,
    data:     req.body.price,
    status:   req.body.timePeriod,
    created_at:   new Date()
  });
  new_pack.save(function(err, doc) 
  {
    if(doc == null){
      res.send({
        data: null,
        error: 'Something went wrong.Please try later.',
        status: 0
      });
    }else{
      res.send({
        data: doc,
        status: 1,
        error: 'Subscription puchased successfully!'
      });
    }
  });
};

// Get All Packages ---------------------------------
exports.getUserSubscriptions = function(req, res) 
{
  agentsubs.find({user_id:req.body.user_id}, function(err, pack)
  { 
    if(pack == null)
    {
      res.send({
        data: null,
        status: 0,
        error:'nothing found'
      });
    }else{
      res.send({
        status: 1,
        data: pack,
        error:''
      });
    }  
  });
};