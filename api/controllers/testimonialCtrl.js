'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
testimonial   = mongoose.model('testimonial');
var path      = require('path');

//--- Create TESTIMONIAL-----------------------------
exports.create_testimonial = function(req, res) {
  var new_pack = new testimonial({
    name:       req.body.name,
    website:   req.body.website,
    message:    req.body.message,
    rating:     req.body.rating,
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
        error: 'Testimonial added successfully!'
      });
    }
  });
};

// Get All TESTIMONIALA ---------------------------------
exports.getAllTestimonials = function(req, res) 
{
  testimonial.find({}, function(err, pack)
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

// Update TESTIMONIAL -----------------------------------
exports.updateTestimonial = function(req, res)
{
  testimonial.update({_id: req.body._id},{$set:{ 'name': req.body.name, 'website': req.body.website, 'message':req.body.message, 'rating': req.body.rating, 'image': req.body.image } }, {new: true}, function(err, user)
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
                msg:"Testimonial updated successfully!"
              });
            }
          });
};

// GET TESTIMONIAL BY ID --------------------------------
exports.getTestimonialById = function(req, res) {
  testimonial.findOne({_id:req.body._id}, function(err, user) {
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
         error:'Testimonial fetched successfully!'
      });
    }
  });
};

// DELETE TESTIMONIAL -----------------------------------
exports.deleteTestimonial = function(req, res)
{
    testimonial.remove({_id:req.body._id}, function(err, pack) {
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
          msg:"Testimonial deleted Successfully"
        });    
      }
    });
};