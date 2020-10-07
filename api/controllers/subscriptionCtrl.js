'use strict';

var mongoose = require('mongoose'),
multer      = require('multer'),
users = mongoose.model('users'),
inquiries   = mongoose.model('inquiries'),
subscription   = mongoose.model('subscription');
var path    = require('path');

//--- Send Message From Web Side-----------------------------
exports.subscriptionRequestWeb = function(req, res) 
{
  console.log(req.body.email);

  subscription.find({userId: req.body.user_id}, function(err, doc)
  {
    if(doc)
    {
      res.send({
        data: doc,
        status: 1,
        error:''
      });
    }
    else
    {
      res.send({
        data: null,
        status: 0,
        error:'nothing found'
      });
    }
  });
};
//----------------------------------------------------------- 

exports.subscriptionGet = function(req, res) 
{
  subscription.find({}, function(err, user)
  { 
    console.log(user)
    if(user == null)
    {
      res.send({
        data: null,
        status: 0,
        error:'nothing found'
      });
    }else{
      res.send({
        status: 1,
        data: user,
        error:''
      });
    }  
  });
};

exports.deleteSubscriptions = function(req, res) 
{
  console.log(req);
  subscription.remove({}, function(err, doc) {
    res.json({
        msg: 'inquiry table delet',
        status: 1,
        data:doc
    });
  });
};