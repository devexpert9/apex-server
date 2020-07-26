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
  cmscontent.findOne({template: req.body.template}, function(err, doc) {
    if(doc == null){
      var new_admin = new cmscontent({
        template: req.body.template,
        data: req.body.data
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
    }else{
      cmscontent.update({template: req.body.template}, { $set: { data: req.body.data}}, {new: true}, function(err, save) {
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

exports.getCmsContent = function(req, res){
  cmscontent.findOne({'template': req.body.template}, function(err, doc){
    res.json({
       status: 1,
       add:0,
       data: doc,
       msg:'Updated successfully!'
    });
  });
}

