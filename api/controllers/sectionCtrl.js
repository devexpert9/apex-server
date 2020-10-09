'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
section       = mongoose.model('section');
var path      = require('path');

//--- Create SECTION-----------------------------
exports.create_section = function(req, res) {
  var new_pack = new section({
    name:       req.body.name,
    message:    req.body.message,
    status:    req.body.status,
    image:      req.body.image,
    created_at: new Date()
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
        error: 'Section added successfully!'
      });
    }
  });
};

// Get All sections ---------------------------------
exports.getAllSections = function(req, res) 
{
  section.find({}, function(err, pack)
  { 
    // console.log(user)
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

// Update section -----------------------------------
exports.updateSection = function(req, res)
{
  section.update({_id: req.body._id},{$set:{ 'name': req.body.name, 'message':req.body.message, 'status':req.body.status, 'image': req.body.image } }, {new: true}, function(err, user)
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
                msg:"Section updated successfully!"
              });
            }
          });
};

// GET TESTIMONIAL BY ID --------------------------------
exports.getSectionById = function(req, res) {
  section.findOne({_id:req.body._id}, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid.'
      });
    }else{
      res.json({
         status: 1,
         data: user,
         error:'Sections fetched successfully!'
      });
    }
  });
};

// DELETE TESTIMONIAL -----------------------------------
exports.deleteSection = function(req, res)
{
    section.remove({_id:req.body._id}, function(err, pack) {
      if(pack == null)
      {
        res.json({
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
          msg:"Section deleted Successfully"
        });    
      }
    });
};