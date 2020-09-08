'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
package       = mongoose.model('package');
var path      = require('path');

//--- Create Package-----------------------------
exports.create_package = function(req, res) {
  package.findOne({name: req.body.name}, function(err, pack) {
    if(pack == null)
    {
      var new_pack = new package({
        name:         req.body.name,
        price:        req.body.price,
        timePeriod:   req.body.timePeriod,
        description:  req.body.description,
        status:       req.body.status,
        created_on:   new Date()
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
exports.getAllPackages = function(req, res) 
{
  package.find({}, function(err, pack)
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

// Update Package -----------------------------------
exports.updatePackage = function(req, res)
{
  package.findOne({name: req.body.name, '_id': { $ne: req.body.packID}}, function(err, user)
  {
    if(user == null)
    {
      package.findOne({name: req.body.name, '_id': { $ne: req.body.packID}}, function(err, username)
      {
        if(username == null)
        {
          users.update({_id: req.body.packID},{$set:{ 'name': req.body.name, 'price': req.body.price, 'timePeriod':req.body.timePeriod, 'description': req.body.description, 'status': req.body.status } }, {new: true}, function(err, user)
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
exports.deletePackage = function(req, res)
{
    package.remove({_id:req.body.packID}, function(err, pack) {
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