'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
signuppackages      = mongoose.model('signuppackage');
var path      = require('path');

//--- Create Package-----------------------------
exports.signup_create_package = function(req, res) {
  signuppackages.findOne({name: req.body.name}, function(err, pack) {
    if(pack == null)
    {
      var new_pack = new signuppackages({
        name:         req.body.name,
        price:        req.body.price,
        timePeriod:   req.body.timePeriod,
        description:  req.body.description,
        status:       0,
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
            error: 'Package added successfully!'
          });
        }
      });
    }else{
      res.send({
        data: null,
        status: 0,
        error: 'Package name already exist in our system!'
      });
    }
  });
};

// Get All Packages ---------------------------------
exports.signup_getAllPackages = function(req, res) 
{
  signuppackages.find({}, function(err, pack)
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

// GET PACKAGE BY ID --------------------------------
exports.signup_getPackageById = function(req, res) {
  signuppackages.findOne({_id:req.body._id}, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid username.'
      });
    }else{
      res.json({
         status: 1,
         data: user,
         error:'Package fetched successfully!'
      });
    }
  });
};

// Update Package -----------------------------------
exports.signup_updatePackage = function(req, res)
{
  signuppackages.findOne({name: req.body.name, '_id': { $ne: req.body._id}}, function(err, user)
  {
    if(user == null)
    {
      signuppackages.findOne({name: req.body.name, '_id': { $ne: req.body._id}}, function(err, username)
      {
        if(username == null)
        {
          signuppackages.update({_id: req.body._id},{$set:{ 'name': req.body.name, 'price': req.body.price, 'timePeriod':req.body.timePeriod, 'description': req.body.description} }, {new: true}, function(err, user)
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
                msg:"Package updated successfully!"
              });
            }
          });
        }
        else
        {
          res.send({
            status: 0,
            data: null,
            error: 'Package name already exist in our system!'
          });
        }
      })
    }
    else{
      res.send({
        status: 0,
        data: null,
        error: 'Package name already exist in our system!'
      });
    }
  });
};

// DELETE PACKAGE -----------------------------------
exports.signup_deletePackage = function(req, res)
{
    signuppackages.remove({_id:req.body._id}, function(err, pack) {
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
          msg:"Package deleted Successfully"
        });    
      }
    });
};

// UPDTAE STATUS -------------------------
exports.updatePackageStatus = function(req, res)
{
  signuppackages.update({},{$set:{ 'status':req.body.status } }, {new: true}, function(err, user)
  {
    console.log('Disable All')
  });
  /**/
};