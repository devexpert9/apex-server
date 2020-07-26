'use strict';

var mongoose   = require('mongoose'),
    multer     = require('multer'),
    superadmin = mongoose.model('superadmin'),
    cmscontent = mongoose.model('cmscontent'),
    path       = require('path');

  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, '../images/')
    },filename: function(req, file, cb) {
      var fileExtn = file.originalname.split('.').pop(-1);
      cb(null, new Date().getTime() + '.' + fileExtn)
    }
  });


var upload = multer({ storage: storage }).single('image');

// Add CMS content---------------------------------------
exports.addCmsContent = function(req, res)
{
  cmscontent.findOne({template: req.body.template}, function(err, doc) {
    if(doc == null){
      var new_admin = new cmscontent({
        template:                   req.body.template,
        selfservice_image:          req.body.selfservice_image,
        selfservice_content:        req.body.selfservice_content,
        disability_image:           req.body.disability_image,
        disability_content:         req.body.disability_content,
        property_casuality_image:   req.body.property_casuality_image,
        property_casuality_content: req.body.property_casuality_content
      });
      
      new_admin.save(function(err, doc) {
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
            error: 'Content updated successfully!'
          });
        }
      });
    }else{
      cmscontent.update({template: req.body.template}, { $set: { selfservice_image: req.body.selfservice_image,selfservice_content: req.body.selfservice_image, disability_image: req.body.disability_image,disability_content: req.body.disability_content,property_casuality_image: req.body.property_casuality_image, property_casuality_content: req.body.property_casuality_content}}, {new: true}, function(err, save) {
        if(save == null){
          res.send({
            status: 0,
            data: save,
            msg:'Try Again'
          });

        }else{
          res.json({
             status: 1,
             add:0,
             data: save,
             msg:'Updated successfully!'
          });
        }
      });
    }
  });
}

exports.getCmsContent = function(req, res)
{
  cmscontent.find({}, function(err, doc) {
    res.json({
       status: 1,
       add:0,
       data: doc,
       msg:'Updated successfully!'
    });
  });
}

