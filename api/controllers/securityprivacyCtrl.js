'use strict';

var mongoose  = require('mongoose'),
multer        = require('multer'),
users         = mongoose.model('users'),
inquiries     = mongoose.model('inquiries'),
subscription  = mongoose.model('subscription'),
webAbout      = mongoose.model('webAbout'),
webContact      = mongoose.model('webContact'),
securityprivacy   = mongoose.model('securityprivacy');
var path      = require('path');

//--- Create SECURITY-----------------------------
exports.addSecurityData = function(req, res)
{
  securityprivacy.findOne({}, function(err, doc) 
  {
    if(doc == null)
    {
      var new_pack = new securityprivacy({
        heading:    req.body.heading,
        content:    req.body.content,
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
            error: 'data added successfully!'
          });
        }
      });
    }
    else
    {
      securityprivacy.update({_id: doc._id},{$set:{ 'heading': req.body.heading, 'content': req.body.content, 'image':req.body.image} }, {new: true}, function(err, user)
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
    }
  });

  
};


// GET SECURITY BY ID --------------------------------
exports.getSecurityPrivacyById = function(req, res)
{
  securityprivacy.findOne({}, function(err, user)
  {
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
         error:'Data fetched successfully!'
      });
    }
  });
};


//--- Create WEBABOUT DATA-----------------------------
exports.addWebAboutData = function(req, res)
{
  webAbout.findOne({}, function(err, doc) 
  {
    if(doc == null)
    {
      var new_pack = new webAbout({
        heading:    req.body.heading,
        content:    req.body.content,
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
            error: 'data added successfully!'
          });
        }
      });
    }
    else
    {
      webAbout.update({_id: doc._id},{$set:{ 'heading': req.body.heading, 'content': req.body.content, 'image':req.body.image} }, {new: true}, function(err, user)
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
            msg:"data updated successfully!"
          });
        }
      });
    }
  });

  
};


// GET WEBABOUT DATA --------------------------------
exports.getWebAboutData = function(req, res)
{
  webAbout.findOne({}, function(err, user)
  {
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
         error:'Data fetched successfully!'
      });
    }
  });
};

//--- Create WEBCONTACT DATA-----------------------------
exports.addWebContactData = function(req, res)
{
  webContact.findOne({}, function(err, doc) 
  {
    if(doc == null)
    {
      var new_pack = new webContact({
        phone:            req.body.phone,
        desc:             req.body.desc,
        newsletterDesc:   req.body.newsletterDesc,
        email:            req.body.email,
        address:          req.body.address,
        skype:            req.body.skype,
        facebook:         req.body.facebook,
        twitter:          req.body.twitter,
        instagram:        req.body.instagram,
        google:           req.body.google,
        pintrest:         req.body.pintrest,
        linkedin:         req.body.linkedin,
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
            error: 'data added successfully!'
          });
        }
      });
    }
    else
    {
      webContact.update({_id: doc._id},{$set:{ 'phonr': req.body.phone, 'desc': req.body.desc, 'newsletterDesc':req.body.newsletterDesc, 'email':req.body.email, 'address':req.body.address, 'skype':req.body.skype, 'facebook':req.body.facebook, 'twitter':req.body.twitter, 'instagram':req.body.instagram, 'google':req.body.google, 'pintrest':req.body.pintrest, 'linkedin':req.body.linkedin} }, {new: true}, function(err, user)
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


// GET WEBABOUT DATA --------------------------------
exports.getWebContactData = function(req, res)
{
  webContact.findOne({}, function(err, user)
  {
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
         error:'Data fetched successfully!'
      });
    }
  });
};
