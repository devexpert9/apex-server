'use strict';

var mongoose = require('mongoose'),
multer  = require('multer'),
// stores = mongoose.model('store'),
// newsfeed = mongoose.model('newsfeed'),
users = mongoose.model('users');
var path = require('path');
var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, '../images/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn)
       // var fileName = file.originalname.split('.');
       // cb(null, fileName[0] + '-' + Date.now() + '.jpg')
       // ////console.log('filename', fileName)
   }
});
var upload = multer({ storage: storage }).single('image');

exports.getInfoAboutAgent = function(req, res) {
  users.findOne({_id: req.body._id}, function(err, user)
  { 
    console.log(user)
    if(user == null){
      res.send({
        data: null,
        status: 0,
        error:'Invaid logged in details.'
      });
    }else{
      res.send({
        status: 1,
        data: user,
        error:'You are logged in successfully.'
      });
    }  
  });
}

// FORGOT PWD --------------
exports.forgotPasswordAdmin = function(req, res) {
  users.findOne({email: req.body.email}, function(err, user) {
    if(user)
    {
      var string = 'Don'+'\''+'t worry, we all forget sometimes';
      var fs = require('fs'); // npm install fs
      var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/emailForgotPwd.html', 'utf8');
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
      var subject = 'Password Retreive Request';

      dynamic_data = dynamic_data.replace("#NAME#", user.name) ;
      dynamic_data = dynamic_data.replace("#EMAIL#", user.email) ;
      dynamic_data = dynamic_data.replace("#PASSWORD#", user.password) ;

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
    else
    {
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }
  });
};

exports.update_admin_password = function(req, res) {
  console.log(req.body);
   users.findOne({email: req.body.email}, function(err, doc) {
    console.log(doc)
    if (doc == null){
          res.send({
            error: err,
            status: 0,
            data: null,
            msg: "Invalid user!"
          });
     }else{
      console.log(doc.password, req.body.oldpassword);
      //if(doc.password == req.body.oldpassword){
        users.update({_id: doc._id }, { $set: { password: req.body.newpassword}}, {new: true}, function(err, change) {
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
      // }else{
      // res.json({
      //   error: null,
      //   status: 0,
      //   data: user,
      //   msg:"The old password you have entered is incorrect."
      // });
    }

   })

};
// const bcrypt = require('bcrypt');
//****************  create_user_function ****************************
exports.addUser = function(req, res)
{
  users.findOne({email: req.body.email}, function(err, user)
  {
    if(user == null)
    {
      users.findOne({username: req.body.username}, function(err, username)
      {
        if(username == null)
        {
          var new_user = new users({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            contact: req.body.contact,
            zip: req.body.zip,
            state: req.body.state,
            city: req.body.city,
            country: req.body.country,
            address: req.body.address,
            status: 1,
            image: null,
            created_on:new Date(),
            expiry_date: req.body.expiry_date
          });

          new_user.save(function(err, users)
          {
             res.json({
                        msg: 'Mail has been sent successfully',
                        status: 1,
                        data:users
                    });
            // SEND EMAIL TO AGENT ----------------------------------
              var string = 'Apex';
              var fs = require('fs'); // npm install fs
              var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/agentRegister.html', 'utf8');
              let dynamic_data = ''
              readStream.on('data', function(chunk) {
                  dynamic_data += chunk;
              }).on('end', function() {
                var sg = require('sendgrid')('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');
                // var helper = sg.mail;
                var helper = require('sendgrid').mail;
                var fromEmail = new helper.Email('noreply@apex.com','APEX Insurance Services');
                var toEmail   = new helper.Email(req.body.email);
                //var toEmail = new helper.Email('gurmukhindiit@gmail.com');
                var subject = 'Apex Agent Account Login Details';

                // dynamic_data = dynamic_data.replace("#STRING#",  string);
                dynamic_data = dynamic_data.replace("#NAME#", req.body.name) ;
                dynamic_data = dynamic_data.replace("#EMAIL#", req.body.email) ;
                dynamic_data = dynamic_data.replace("#PASSWORD#", req.body.password);
                // dynamic_data = dynamic_data.replace("#MESSAGE#", req.body.data.message);
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
                  // if (error) {
                  //   res.json({
                  //       msg: 'Something went wrong.Please try later.',
                  //       status: 0,
                  //       data: error
                  //   });
                  // }else{
                    // res.json({
                    //     msg: 'Mail has been sent successfully',
                    //     status: 1,
                    //     data:users
                    // });
                  // }
                })
              }) 
            //-------------------------------------------------------
            /*res.send({
              data: users,
              status: 1,
              error: 'User registered successfully!'
            });*/
          });
        }
        else{
          res.send({
            status: 0,
            data: null,
            error: 'Username already exist in our system!'
          });
        }
      });

      
    }else{
      res.send({
        status: 0,
        data: null,
        error: 'Email already exist in our system!'
      });
    }
  });
};

exports.update_user = function(req, res)
{
  users.findOne({email: req.body.email, '_id': { $ne: req.body._id}}, function(err, user)
  {
    if(user == null)
    {
      users.findOne({username: req.body.username, '_id': { $ne: req.body._id}}, function(err, username)
      {
        if(username == null)
        {
          console.log(req.body)
          users.update({_id: req.body._id},{ $set: { 'name': req.body.name, 'username': req.body.username, 'email':req.body.email, 'password': req.body.password, 'contact': req.body.contact, 'zip': req.body.zip, 'state': req.body.state, 'city': req.body.city, 'country': req.body.country, 'address': req.body.address, 'expiry_date': req.body.expiry_date} }, {new: true}, function(err, user)
          {
            if(user == null)
            {
              res.send({
                error: err,
                status: 0,
                msg:"Try Again"
              });
            }
            else
            {
              res.json({
                error: err,
                status: 1,
                data: user,
                msg:"Agent updated successfully!"
              });
            }
          });
        }
        else
        {
          res.send({
            status: 0,
            data: null,
            error: 'Username already exist in our system!'
          });
        }
      })
    }
    else{
      res.send({
        status: 0,
        data: null,
        error: 'Email already exist in our system!'
      });
    }
  });
};

exports.updateAgentStatus = function(req, res)
{
  users.update({_id: req.body._id},{$set:{ 'status':req.body.status } }, {new: true}, function(err, user)
  {
    if(user == null)
    {
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
        data:user,
        msg:"Agent status updated successfully!"
      });
    }
  });
};



//**************** checkEmailExist ******************
exports.checkEmailExist = function(req, res) {
  users.findOne({email:req.body.email}, function(err, user) {
    if(user == null)
    {
      res.send({
        status: 0,
        data: null,
        error:'Email Not Exist.'
      });
    }else{
      res.send({
        status: 1,
        data: null,
        error:'Email Exist.'
      });
    }
  });
};


//**************** User_login_function ******************
exports.login = function(req, res) {
  users.findOne({$or: [ {email: req.body.email, password: req.body.password}, {username: req.body.email, password: req.body.password} ] }, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid logged in deatils.'
      });
    }else{
      users.update({_id: user._id }, { $set: {registrationId: req.body.registrationId}}, {new: true}, function(err, save) {
        
        res.json({
           status: user.status == 1 ? 1 : 2,
           data: user.status == 1 ? user : null,
           error: user.status == 1 ? 'Logged In successfully!' : null
        });
      });
    }
  });
};

//**************** User_login_function ******************
exports.getUserDomain = function(req, res) {
  users.findOne({username:req.body.username}, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid username.'
      });
    }else{
      res.json({
         status: 1,
         data: user,
         error:'User fetched successfully!'
      });
    }
  });
};

//delete all users
exports.removeAllUsers = function(req, res) {
  users.remove({}, function(err, user) {
      res.json({
         status: 1,
         data: user,
         error:'User fetched successfully!'
      });
  });
};

exports.getUserByID = function(req, res) {
  users.findOne({_id:req.body.id}, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid username.'
      });
    }else{
      res.json({
         status: 1,
         data: user,
         error:'User fetched successfully!'
      });
    }
  });
};

// //******************** Forgot_password_function ************************
exports.forgot_password = function(req, res) {
    users.findOne({email: req.body.email}, function(err, user) {
      if(user){
         var numsms = Math.floor(Math.random() * 90000) + 10000;
          users.update({_id: user._id }, { $set: { otp: numsms}}, {new: true}, function(err, task) {
          if (task == null){
            res.send({
              error: err,
              status: 0,
            });
          }else{
            var string = 'Don'+'\''+'t worry, we all forget sometimes'
                var fs = require('fs'); // npm install fs
                var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/forgotpassword.html', 'utf8');
                let dynamic_data = ''
                readStream.on('data', function(chunk) {
                    dynamic_data += chunk;
                }).on('end', function() {
                var sg = require('sendgrid')('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');
      var helper = sg.mail;
                var fromEmail = new helper.Email('babitaindiit@gmail.com'/*'priyankasharma4010@gmail.com'*/, 'Stratergy Athlete');
                var toEmail = new helper.Email(req.body.email);
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
  users.findOne({_id:req.body._id, otp: req.body.otp }, function(err, otp) {
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

exports.userlist = function(req, res) {
  console.log('sorting');
  users.find({}, null, {sort: {'created_on': -1}})
       .exec(function(err, users) {
    if(users == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: users
      });
    }
  });
};

//******************** Otp_verification_function ************************
exports.deleteuser = function(req, res)
{
    users.remove({_id:req.body.userid}, function(err, user) {
      if(user == null)
      {
        res.json({
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
};



exports.update_userLess = function(req, res)
{
  users.update({_id: req.body._id},{$set:{ 'name': req.body.name, 'email':req.body.email} }, {new: true}, function(err, user)
  {
    if(user == null)
    {
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
        data:user,
        msg:"Agent updated successfully!"
      });
    }
  });
};

//******************** Update user image function ************************
exports.update_user_image = function(req, res) {
  upload(req,res,function(err){
    var data = JSON.parse(req.body.fields);
    //console.log(data.userId)
    console.log(req.file.filename);
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    users.update({_id: req.params.id}, { $set: {logo: req.file.filename}}, {new: true}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  });
};



//******************** Upload image function ************************
exports.upload_image = function(req, res) {
  upload(req,res,function(err){
    res.json(req.file.filename);
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }   
  });
};

//**************** Update_user_profile_function ******************
exports.update_user_profile = function(req, res) {
    users.update({_id:req.params.id},
        { $set: 
          { firstname: req.body.firstname,
            lastname: req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            contact:req.body.contact,
            image:req.body.image,
            gpa:req.body.gpa,
            sat:req.body.sat,
            act:req.body.act,
            athletics:req.body.athletics,
            bench_press:req.body.bench_press,
            pro_agility:req.body.pro_agility,
            school:req.body.school,
            awards:req.body.awards,
            father_phone:req.body.father_phone,
            father_email:req.body.father_email,
            father_occupation:req.body.father_occupation,
            mother_phone:req.body.mother_phone,
            mother_email:req.body.mother_email,
            mother_occupation:req.body.mother_occupation,
            coverimage:req.body.coverimage,
            graduating:req.body.graduating,
          }}, {new: true}, function(err, user) {
            console.log(user, 'user')
      if(user == null){
        res.send({
          error: err,
          status: 0,
          msg:"Try Again"
        });
      }else{
        res.json({
          error: null,
          status: 1,
          data:user,
          msg:"Profile updated successfully!"
        });
      }
    });
};

//**************** View_user_profile_function ******************
exports.viewprofile = function(req, res) {
  users.findOne({_id:req.body._id}, function(err, user) {
    if (user == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.json({
        error: null,
        status: 1,
        data: user
      });
    }
  });
};
// //**************** Update_user_password_function ******************
exports.update_user_password = function(req, res) {
  console.log(req.body);
   users.findOne({_id:req.body._id}, function(err, user) {
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
          users.update({_id: req.body._id }, { $set: { password: req.body.newpassword}}, {new: true}, function(err, change) {
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
//******************** User list for app ************************

exports.user_listing = function(req, res) {
 var data=[];
 var counter = 0,
 dict = {};
 var perPage = 10;
 var page =req.body.page;
 users.find({}, null, {sort: {'created_on': -1}})
       .skip((perPage * page) - perPage)
       .limit(perPage)
       .exec(function(err, user) {
          function list(){
           dict = user[counter];
           console.log(dict._id,"userid");
           users.findOne({_id: dict._id}, function(err, singleuser) {
            if(singleuser!=null){
            // users.find({"followers": { $elemMatch: { "userid": dict._id } } },function(err, userdata){
            // console.log(userdata,"followers",dict._id);
               dict.following = [];
               dict.username = singleuser.firstname+' '+singleuser.lastname ;
                data.push(dict);
                // console.log(data);
               if(counter < (user.length-1)){
                    counter = counter + 1;
                  list();
                }else{
                     res.send({
                     status: 1,
                     data: data,
                     current: page                
                });
               }
            // })
           }
         })
        };
       if(user.length==0){
         res.send({
           error: err,
           status: 0,
           data: []
         });
       }else{
         list();
       }
       })
 
};//******************** follow_user for app ************************

exports.follow = function(req, res) {
  users.findOne({'followers': {$elemMatch: {'userid': req.body.follower_id}}, '_id': req.body.following_id },function(err, check){
  console.log(check,"check");
  if(check == null){
     users.update({_id:req.body.following_id},{$push: {followers: {$each:[{id:req.body.id,userid:req.body.follower_id}]}}},{safe: true, upsert: true},function(err, doc) {
    console.log(doc,"dgdfg");
        if(err){
               res.json({
                   status: 0,
                   msg:'Try Again'
                });
            }else{
                  res.json({
                     status: 1,
                     followed_status:1,
                      msg:'followed successfully!'
                  });
               }
    })
 }else{
        users.update({_id:req.body.following_id},{ $pull: {followers :{userid : req.body.follower_id } } },{ multi: true },function(err, obj) {
        if(obj.nModified==1){
           res.json({
                     status: 1,
                     followed_status:0,
                      msg:'Unfollowed successfully!'
                  });
        }else{
          res.json({
                     status: 0,
                     msg:'Please try again.'
                  });
        }
      })
  }
  })
};


//**************** show users on add groups in app ******************
exports.show_users_addgroup = function(req, res) {
  var counter=0,
  data=[];

  users.findOne({_id:req.body._id}, function(err, user) {
    if (user == null){
      res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
       users.find({'followers': {$elemMatch: {'userid': req.body._id}}},function(err, result){
          console.log(result,"+++++++++++");
          if(result.length>0){
          function list(){
            users.findOne({_id:result[counter]}, function(err, singleuser) {
              console.log(singleuser, "single");
              if(singleuser!=null){
              data.push(singleuser);
              }
          if(counter < (result.length-1)){
            counter = counter + 1;
            list();
          }else{
              res.json({
                status: 1,
                data: data
              });
          }
          });
          };
          list();
          }else{
             res.json({
              error: null,
              status: 0,
              data: []
            });
          }
        })
     
        
      



      // if(user.followers.length>0){
      //   function list(){
      //   users.findOne({_id:user.followers[counter].userid}, function(err, singleuser) {
      //     console.log(singleuser, "single");
      //     if(singleuser!=null){
      //     data.push(singleuser);
      //     }
      //   if(counter < (user.followers.length-1)){
      //     counter = counter + 1;
      //     list();
      //   }else{
      //       res.json({
      //         status: 1,
      //         data: data
      //       });
      //   }
      //   });
      //   };
      //   list();
      // }else{
      //    res.json({
      //     error: null,
      //     status: 0,
      //     data: []
      //   });
      // }
      
    }
  });
};
