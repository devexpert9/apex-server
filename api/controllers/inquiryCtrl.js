'use strict';

var mongoose = require('mongoose'),
multer      = require('multer'),
users = mongoose.model('users'),
inquiries   = mongoose.model('inquiries');
var path    = require('path');

exports.add_contactRequest = function(req, res) {
      var newadd = new inquiries({
        data: req.body.data,
        domain: req.body.domain,
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
          data: 'contact request has been added successfully!'
        });
      }
  });
};

exports.getPageData = function(req, res) 
{
  console.log(req);
  inquiries.find({}, function(err, doc) {
    var data = [],
        counter = 0;
    
      function getDomainData(){
        if(counter < doc.length){
          users.findOne({_id: doc[counter].domain}, function(err, user){
            var dict = {
              domain: user.username,
              agent: user.name,
              agent_email: agent.email,
              // agent_contact: agent.phone,
              inquiry_data: doc[counter].data
            };
            data.push(dict);
            getDomainData();
          });
        }else{
          res.json({
            status: 1,
            data: data,
            error:'Page data fetched successfully!'
          });
        }
      };
      getDomainData();
  });
};