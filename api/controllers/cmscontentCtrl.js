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
exports.addCmsContant = function(req, res)
{
  var new_admin = new superadmin({
    template:                   req.body.template,
    selfservice_image:          req.body.selfservice_image,
    selfservice_content:        req.body.selfservice_content,
    disability_image:           req.body.disability_image,
    disability_content:         req.body.disability_content,
    property_casuality_image:   req.body.property_casuality_image,
    property_casuality_content: req.body.property_casuality_content
  });
  cmscontent.save(function(err, doc) {
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
}

