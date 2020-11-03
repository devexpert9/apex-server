'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
dashboardsection      = mongoose.model('dashboardsection');
var path      = require('path');

//-- Add data---------
exports.updateDashboardSection = function(req, res)
{
  dashboardsection.findOne({user_id:req.body.user_id, section: req.body.section}, function(err, doc) 
  {
    if(doc == null)
    {
      var new_pack = new dashboardsection({
        title:    req.body.title,
        section:  req.body.section,
        user_id:  req.body.user_id
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
            error: 'Data added successfully!'
          });
        }
      });
    }
    else
    {
      dashboardsection.update({user_id: req.body.user_id, section: req.body.section},{$set:{ 'title': req.body.title} }, {new: true}, function(err, user)
      {
        if(user == null)
        {
          res.send({
            error: err,
            status: 0,
            msg:"Try Again"
          });
        }
        else
        {
          res.json({
            error: null,
            status: 1,
            data:user,
            msg:"Data updated successfully!"
          });
        }
      });
    }
  });
};

exports.getDashboardSectionData = function(req, res)
{
  dashboardsection.findOne({user_id:req.body.user_id, section: req.body.section}, function(err, doc) 
  {
      if(doc == null)
      {
        res.send({
          data: null,
          error: 'Something went wrong.Please try later.',
          status: 0
        });
      }else{
        res.send({
          data: doc,
          status: 1,
          error: 'Data fetch successfully!'
        });
      }
  });
};