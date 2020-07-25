'use strict';

var mongoose = require('mongoose'),
multer  = require('multer'),
users = mongoose.model('users'),
cmspages = mongoose.model('cmspages');
var path = require('path');

 
// const bcrypt = require('bcrypt');
//****************  create and edit_cmspages_function ****************************
exports.add_cmspage = function(req, res) {
  users.find({'email': req.body.data.email , '_id': { $ne: req.body.user_id} }, function(err, doc){
    if(doc.length > 0){
      //email already exist
      res.send({
        status: 0,
        data: save,
        msg:'Try Again'
      });
    }else{
      users.update({'_id': req.body.user_id}, {$set: {'email': req.body.data.email, 'name': req.body.data.name} }, {new: true}, function(err, doc1){
        cmspages.findOne({page: req.body.page, user_id: req.body.user_id }, function(err, doc) {
          if(doc == null){
            var newadd = new cmspages({
                  page: req.body.page,
                  data: req.body.data,
                  user_id: req.body.user_id,
                  created_on: new Date()
                });

            newadd.save(function(err, save) {
              if(save == null){
                res.send({
                  error: err,
                  status: 0,
                  data: null
                });
              }else{
                res.send({
                  error: null,
                  status: 1,
                  data: req.body.page + 'has been added successfully!'
                });
              }
            });
          }else{
         
            cmspages.update({page: req.body.page, user_id: req.body.user_id}, { $set: { page: req.body.page, data: req.body.data}}, {new: true}, function(err, save) {
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
      });
    }
  });
      
};

exports.getPageData = function(req, res) 
{
  console.log(req);
  cmspages.findOne({page:req.body.page, user_id:req.body.user_id}, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Error.'
      });
    }else{
      res.json({
        status: 1,
        data: user,
        error:'Page data fetched successfully!'
      });
    }
  });
};