'use strict';

var mongoose = require('mongoose'),
multer  = require('multer'),
dashboard = mongoose.model('dashboard');
var path = require('path');


// const bcrypt = require('bcrypt');
//****************  create and edit_cmspages_function ****************************
exports.add_dash_section = function(req, res) {
  dashboard.find({section: req.body.section, user_id: req.body.user_id }, null, { sort:{ 'index': 1 } }).exec(function(err, allRecords) 
  {

    var data = allRecords;
    var counter = 0;

    var newadd = new dashboard({
      section: req.body.section,
      data: req.body.data,
      user_id: req.body.user_id,
      created_on: new Date(),
      index: req.body.index,
    });

    //-- Save New Entry On Index 0 ------------ 
    newadd.save(function(err, save) {
      if(save == null){
        res.send({
          error: err,
          status: 0,
          data: null
        });
      }else{
        updateDashEntry();
        // res.send({
        //   error: null,
        //   status: 1,
        //   data: req.body.section + 'record has been added successfully!'
        // });
      }
    });

    function updateDashEntry(){
      if(counter < data.length){
        var new_index = counter + 1;
        dashboard.update({_id: data[counter]._id},{ $set: { index: new_index} }, {new: true}, function(err, doc) {
          counter = counter + 1;
          updateDashEntry();
        });
      }else{
        res.json({
          error: null,
          status: 1,
          msg:"updated Successfully"
        });
      }
    };
    

    //-- Update Index of other entries -------- 
  });
};

exports.getPageData = function(req, res) 
{
  // console.log(req);
  dashboard.find({user_id:req.body.user_id, section: 'quoteEngines'}, null, { sort:{ 'index': 1 } }).exec(function(err, doc) {
    dashboard.find({user_id:req.body.user_id, section: 'frontPage'}, null,{ sort:{ 'index': 1 } }).exec( function(err, doc1) {
      dashboard.find({user_id:req.body.user_id, section: 'marketingSystem'}, null,{ sort:{ 'index': 1 } }).exec( function(err, doc2) {
        dashboard.find({user_id:req.body.user_id, section: 'virtualSalePlatform'}, null,{ sort:{ 'index': 1 } }).exec( function(err, doc3) {
          dashboard.find({user_id:req.body.user_id, section: 'preferredCarriers'}, null,{ sort:{ 'index': 1 } }).exec( function(err, doc4) {
            dashboard.find({user_id:req.body.user_id, section: 'AddOn'}, null,{ sort:{ 'index': 1 } }).exec( function(err, doc5) {

              res.send({
                status: 1,
                data: {
                  'quoteEngines': doc,
                  'frontPage': doc1,
                  'marketingSystem': doc2,
                  'virtualSalePlatform': doc3,
                  'preferredCarriers': doc4,
                  'add': doc5
                },
                error: null
              });

            });
          });
        });
      });
    });
  });
};


exports.update_dash_section_item = function(req, res){
  dashboard.update({_id: req.body._id}, { $set: { data: req.body.data}}, {new: true}, function(err, save) {
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

exports.delete_dash_section_item = function(req, res){
  dashboard.remove({_id:req.body._id}, function(err, feed) {
    if(feed == null){
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
        msg:"Deleted Successfully"
      });
    }
  });
}

exports.updateDropList = function(req, res){
  
  var data = req.body.data;
  var section_name = req.body.section;
  var counter = 0;

  function updateDashEntry(){
    if(counter < data.length){
      dashboard.update({_id: data[counter]._id},{ $set: { section: section_name, index: counter} }, {new: true}, function(err, doc) {
        counter = counter + 1;
        updateDashEntry();
      });
    }else{
      res.json({
        error: null,
        status: 1,
        msg:"updated Successfully"
      });
    }
  };
  updateDashEntry();
}