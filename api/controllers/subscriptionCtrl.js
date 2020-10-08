'use strict';

var mongoose = require('mongoose'),
multer      = require('multer'),
users = mongoose.model('users'),
inquiries   = mongoose.model('inquiries'),
cards         = mongoose.model('cards'),
subscription   = mongoose.model('subscription');
var path    = require('path');

//--- Send Message From Web Side-----------------------------
exports.subscriptionRequestWeb = function(req, res) 
{
  console.log(req.body.email);

  subscription.findOne({email: req.body.email}, function(err, doc)
  {
    if(doc)
    {
      res.json({
        msg: 'Email already subscribed.',
        status: 0         
      });
    }
    else
    {
      var newadd = new subscription({
        email: req.body.email,
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
          var string = 'Don'+'\''+'t worry, we all forget sometimes'
          var fs = require('fs'); // npm install fs
          var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/subscription.html', 'utf8');
          let dynamic_data = '';
          //----SEND TO super admin------------------------------
          readStream.on('data', function(chunk) {
              dynamic_data += chunk;
          }).on('end', function() {
            var sg = require('sendgrid')('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');
      var helper = sg.mail;
            var fromEmail = new helper.Email('noreply@apex.com','APEX Insurance Services');
            // var toEmail   = new helper.Email(req.body.data.currentAgentEmail);
            var toEmail  = new helper.Email(req.body.email);
            var subject = 'Subscribed With APEX';
            dynamic_data = dynamic_data.replace("#EMAIL#", req.body.email);
            var content = new helper.Content('text/html', dynamic_data);

            var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            var sg = require('sendgrid')('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');
            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });
            sg.API(request, function (error, response) {
              if (error)
              {
                console.log(error);
                res.json({
                    msg: 'Something went wrong.Please try later.',
                    status: 0
                   
                });
              }else{
                console.log('done');
                res.json({
                    msg: 'Mail has been sent successfully',
                    status: 1,
                    data:null
                });
              }
            })
          }) 
        }
      });
    }
  });
};

exports.getUserSubscriptions = function(req, res) 
{
  subscription.find({'userId': req.body.user_id}, function(err, doc){
    console.log(doc);
    console.log(req.body.user_id)
    res.send({
      data: doc,
      status: 1,
      error:'nothing found'
    });
  });
};

exports.getAllSubscriptions = function(req, res) {
  subscription.find({}, function(err, doc)
  {
    if(doc)
    {
      res.send({
        data: doc,
        status: 1,
        error:''
      });
    }
    else
    {
      res.send({
        data: null,
        status: 0,
        error:'nothing found'
      });
    }
  });
};

//----------------------------------------------------------- 

exports.subscriptionGet = function(req, res) 
{
  subscription.find({}, function(err, user)
  { 
    console.log(user)
    if(user == null)
    {
      res.send({
        data: null,
        status: 0,
        error:'nothing found'
      });
    }else{
      res.send({
        status: 1,
        data: user,
        error:''
      });
    }  
  });
};

exports.deleteSubscriptions = function(req, res) 
{
  console.log(req);
  subscription.remove({}, function(err, doc) {
    res.json({
        msg: 'inquiry table delet',
        status: 1,
        data:doc
    });
  });
};

// ---GET AGENT SAVED CARD -----------------------------
exports.getUserCards = function (req, res) {
  cards.find({userId: req.body.userId}, function(err, doc)
  {
    if(doc)
    {
      res.send({
        data: doc,
        status: 1,
        error:''
      });
    }
    else
    {
      res.send({
        data: null,
        status: 0,
        error:'nothing found'
      });
    }
  });
};