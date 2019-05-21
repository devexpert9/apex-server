'use strict';

var mongoose = require('mongoose'),
    multer  = require('multer'),
    admin = mongoose.model('admin'),
    path = require('path');

    var storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, '../images/')
      },filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
        cb(null, new Date().getTime() + '.' + fileExtn)
      }
    });


    var upload = multer({ storage: storage }).single('image');
    //****************  create_user_function ****************************
    exports.create_user_admin = function(req, res) {
      admin.findOne({email: req.body.email}, function(err, adminuser) {
        if(adminuser == null){
          var new_admin = new admin({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username:req.body.username,
            email: req.body.email,
            password: req.body.password,
            contact: req.body.contact,
            gender:req.body.gender,
            created_on: new Date(),
            registrationId: req.body.registrationId,
            image:req.body.image
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
                error: 'Admin registered successfully!'
              });
            }
          });
        }else{
          res.send({
            data: null,
            status: 0,
            error: 'Email already exist in our system!'
          });
        }
      });
    };



//**************** Admin_login_function ******************
exports.login_admin = function(req, res) {

  // admin.findOne({}, function(err, user) { //email:req.body.email, password:req.body.password
  //   console.log(user)
  //   if(user == null){
  //     res.send({
  //       data: null,
  //       status: 0,
  //       error:'Invaid logged in details.'
  //     });
  //   }else{
  //     res.send({
  //       status: 1,
  //       data: user,
  //       error:'You are logged in successfully.'
  //     });
  //   }  
  // });

    var new_user = new users({
        firstname: 'admin',
        lastname: 'admin',
        email: 'admin',
        password: 'admin@hats'
      });

      new_user.save(function(err, users) {
        res.send({
          data: users,
          status: 1,
          error: 'User registered successfully!'
        });
      });
};

// //******************** Forgot_password_function ************************
exports.forgot_password_admin = function(req, res) {
  console.log(req.body.email);
    admin.findOne({email: req.body.email}, function(err, user) {
    console.log('+++++'+user+'++++++');
      if(user){
         var numsms = Math.floor(Math.random() * 90000) + 10000;
          admin.update({_id: user._id }, { $set: { otp: numsms}}, {new: true}, function(err, task) {
          if (task == null){
            res.send({
              error: err,
              status: 0,
            });
          }else{
            // res.json({
            //   error: null,
            //   status: 1,
            //   data: user,
            // });
            var string = 'Don'+'\''+'t worry, we all forget sometimes'
                var fs = require('fs'); // npm install fs
                var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/forgotpassword.html', 'utf8');
                let dynamic_data = ''
                readStream.on('data', function(chunk) {
                    dynamic_data += chunk;
                }).on('end', function() {
                var helper = require('sendgrid').mail;
                var fromEmail = new helper.Email('babitaindiit@gmail.com'/*'priyankasharma4010@gmail.com'*/, 'Stratergy Athlete');
                var toEmail = new helper.Email('babitaindiit@gmail.com');
                //var toEmail = new helper.Email('gurmukhindiit@gmail.com');
                var subject = 'Forgot Password Request';

                dynamic_data = dynamic_data.replace("#STRING#",  string);
                dynamic_data = dynamic_data.replace("#NAME#", user.firstname) ;
                dynamic_data = dynamic_data.replace("#EMAIL#", user.email) ;
                dynamic_data = dynamic_data.replace("#PASSWORD#", user.password);
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
                    data:user
                });
              }
            })
            });
          }
        });
       }else{
        res.json({
            error: null,
            status: 0,
            msg:'Invalid Email Address'
        });
      }
  });
};

//******************** Otp_verification_function ************************
exports.otp_verification = function(req, res) {
  admin.findOne({_id:req.body._id, otp: req.body.otp }, function(err, otp) {
    if (otp == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: otp
      });
    }
  });
};

//**************** Update_admin_profile_function ******************
exports.update_admin_profile = function(req, res) {
    admin.update({_id:req.body.id},
        { $set: 
          { firstname: req.body.firstname,
            lastname: req.body.lastname,
            email:req.body.email,
            contact:req.body.contact,
            image:req.body.image,
          }}, {new: true}, function(err, user) {
            console.log(user, 'user')
          if(user.nModified != 1){
            res.send({
              error: err,
              status: 0,
              msg:"Try Again"
            });
          }else{
              admin.findOne({_id:req.body.id}, function(err, singleuser) {
              res.json({
              status: 1,
              data:singleuser,
              msg:"Profile updated successfully!"
            });
              })
           }
        });
};
//******************** Upload adminimage function ************************
exports.upload_admin_image = function(req, res) {
  upload(req,res,function(err){
    res.json(req.file.filename);
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }   
  });
};
// //**************** Update_admin_password_function ******************
exports.update_admin_password = function(req, res) {
  console.log(req.body);
   admin.findOne({_id:req.body._id}, function(err, user) {
    console.log(user)
    if (user == null){
          res.send({
            error: err,
            status: 0,
            data: null,
            msg: "Invalid user!"
          });
     }else{
      console.log(user.password, req.body.oldpassword);
      if(user.password == req.body.oldpassword){
          admin.update({_id: req.body._id }, { $set: { password: req.body.newpassword}}, {new: true}, function(err, change) {
        if (change == null){
          res.send({
            error: err,
            status: 0,
            data: null,
            msg:'Try again !!'
          });
        }else{
          res.json({
            error: null,
            status: 1,
            data: change,
            msg:'Password updated successfully!'
          });
        }
        });
      }else{
      res.json({
        error: null,
        status: 0,
        data: user,
        msg:"The old password you have entered is incorrect."
      });
    }
    }

   })

};