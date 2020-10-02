'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
glossary      = mongoose.model('glossary');
var path      = require('path');

//--- Create glossary-----------------------------
exports.create_glossary = function(req, res) {
  var new_pack = new glossary({
    topic:      req.body.topic,
    defination: req.body.defination,
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
        error: 'Glossary added successfully!'
      });
    }
  });
};

// Get All glossaries ---------------------------------
exports.getAllGlossaries = function(req, res) 
{
  glossary.find({}, function(err, pack)
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

// Update glossary -----------------------------------
exports.updateGlossary = function(req, res)
{
  glossary.update({_id: req.body._id},{$set:{ 'topic': req.body.topic, 'defination': req.body.defination } }, {new: true}, function(err, user)
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
                msg:"Glossary updated successfully!"
              });
            }
          });
};

// GET glossary BY ID --------------------------------
exports.getGlossaryById = function(req, res) {
  glossary.findOne({_id:req.body._id}, function(err, user) {
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
         error:'Glossary fetched successfully!'
      });
    }
  });
};

// DELETE glossary -----------------------------------
exports.deleteGlossary = function(req, res)
{
    glossary.remove({_id:req.body._id}, function(err, pack) {
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
          msg:"Glossary deleted Successfully"
        });    
      }
    });
};