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
        // res.send({
        //   error: null,
        //   status: 1,
        //   data: 'contact request has been added successfully!'
        // });

          var string = 'Don'+'\''+'t worry, we all forget sometimes'
          var fs = require('fs'); // npm install fs
          var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/forgotpassword.html', 'utf8');
          let dynamic_data = ''
          readStream.on('data', function(chunk) {
              dynamic_data += chunk;
          }).on('end', function() {
            var helper = require('sendgrid').mail;
            var fromEmail = new helper.Email('noreply@apex.com','APEX Insurance Services');
            var toEmail   = new helper.Email(req.body.data.email);
            //var toEmail = new helper.Email('gurmukhindiit@gmail.com');
            var subject = 'Contact Request Submitted';

            // dynamic_data = dynamic_data.replace("#STRING#",  string);
            dynamic_data = dynamic_data.replace("#NAME#", req.body.data.name) ;
            dynamic_data = dynamic_data.replace("#EMAIL#", req.body.data.email) ;
            dynamic_data = dynamic_data.replace("#SUBJECT#", req.body.data.subject);
            dynamic_data = dynamic_data.replace("#MESSAGE#", req.body.data.message);
            var content = new helper.Content('text/html', dynamic_data);

            var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            // var sg = require('sendgrid')(constants.SENDGRID_API_ID);
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
                // console.log('Error response received');
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
              var dict = {
              domain: user.username,
              agent: user.name,
              agent_email: user.email,
              // agent_contact: agent.phone,
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