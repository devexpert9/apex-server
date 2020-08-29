'use strict';

var mongoose = require('mongoose'),
multer      = require('multer'),
users = mongoose.model('users'),
inquiries   = mongoose.model('inquiries'),
subscription   = mongoose.model('subscription');
var path    = require('path');

//--- Send Message From Web Side-----------------------------
exports.subscriptionRequestWeb = function(req, res) {
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
      var helper = require('sendgrid').mail;
      var fromEmail = new helper.Email('noreply@apex.com','APEX Insurance Services');
      // var toEmail   = new helper.Email(req.body.data.currentAgentEmail);
      var toEmail  = new helper.Email(req.body.email);
      var subject = 'Subscribed With APEX';
      dynamic_data = "";
      var content = new helper.Content('text/html', dynamic_data);

      var mail = new helper.Mail(fromEmail, subject, toEmail, content);
      var sg = require('sendgrid')('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');
      var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
      });
      sg.API(request, function (error, response) {
        if (error) {
          res.json({
              msg: 'Something went wrong.Please try later.',
              status: 0
             
          });
        }else{
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
};
//----------------------------------------------------------- 

exports.getPageData = function(req, res) 
{
  console.log(req);
  inquiries.find({}, function(err, doc) {
    var data = [],
        counter = 0;
      console.log(doc)
      function getDomainData(){
        if(counter < doc.length){
          users.findOne({_id: doc[counter].domain}, function(err, user){
            console.log(user)
            if(user != null){

              var date = new Date(doc[counter].created_on);
              var finalDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
              
              var dict = {
              domain: user.username,
              agent: user.name,
              agent_email: user.email,
              // agent_contact: agent.phone,
              'inquiry_user': doc[counter].data.name,
              'filtered_date': finalDate,
              inquiry_data: doc[counter].data,
              date: doc[counter].created_on
            };
            data.push(dict);
            //getDomainData();
            }
            counter = counter+ 1;
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

exports.deleteInquiry = function(req, res) 
{
  console.log(req);
  inquiries.remove({}, function(err, doc) {
    res.json({
        msg: 'inquiry table delet',
        status: 1,
        data:doc
    });
  });
};