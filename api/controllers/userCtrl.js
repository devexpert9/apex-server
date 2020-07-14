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
      var new_user = new users({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        image: null
      });

      new_user.save(function(err, users)
      {
        // SEND EMAIL TO AGENT ----------------------------------
          var string = 'Apex'
          var fs = require('fs'); // npm install fs
          var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/agentadd.html', 'utf8');
          let dynamic_data = ''
          readStream.on('data', function(chunk) {
              dynamic_data += chunk;
          }).on('end', function() {
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
              if (error) {
                res.json({
                    msg: 'Something went wrong.Please try later.',
                    status: 0,
                    data: error
                });
                // console.log('Error response received');
              }else{
                res.json({
                    msg: 'Mail has been sent successfully',
                    status: 1,
                    data:users
                });
              }
            })
          }) 
        //-------------------------------------------------------
        // res.send({
        //   data: users,
        //   status: 1,
        //   error: 'User registered successfully!'
        // });
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



//**************** User_login_function ******************
exports.login = function(req, res) {
  users.findOne({email:req.body.email, password:req.body.password}, function(err, user) {
    if(user == null){
      res.send({
        status: 0,
        data: null,
        error:'Invalid logged in deatils.'
      });
    }else{
      users.update({_id: user._id }, { $set: {registrationId: req.body.registrationId}}, {new: true}, function(err, save) {
        res.json({
           status: 1,
           data: user,
           error:'Logged In successfully!'
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
                var helper = require('sendgrid').mail;
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
  users.find({ },function(err, users) {
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

exports.update_user = function(req, res)
{
  users.update({_id: req.body._id},{$set:{ 'name': req.body.name, 'username': req.body.username, 'email':req.body.email, 'password': req.body.password } }, {new: true}, function(err, user)
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


// //********************************************************
// exports.get_user_address_data = function(req, res) {
//   address.find({userId: req.params.id}, function(err, admin) {
//     if (admin == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: admin
//       });
//     }
//   });
// };


// //*************************************************************

// exports.update_user_address_data = function(req, res) {
//   if(req.body.status  == 1){

//      address.update({_id: req.params.id }, { $set: { address: req.body.address,  city: req.body.city,  country: req.body.country}}, {new: true}, function(err, task) {
//       if (task == null){
//         res.send({
//           error: err,
//           status: 0,
//           data: null
//         });
//       }else{
//           users.update({_id: req.body.userId }, { $set: {address:  req.body.address, city:  req.body.city , country:  req.body.country}}, {new: true}, function(err, task) {
//             if(task == null){
//               res.send({
//                 error: err,
//                 status: 0,
//                 data: null
//               });
//             }else{
//               res.json({
//                 error: null,
//                 status: 1,
//                 data: task
//              });
//             }
//          });
//       }
//     });

//   }else{

//     address.update({_id: req.params.id }, { $set: { address: req.body.address,  city: req.body.city,  country: req.body.country}}, {new: true}, function(err, task) {
//       if (task == null){
//         res.send({
//           error: err,
//           status: 0,
//           data: null
//         });
//       }else{
//         res.json({
//           error: null,
//           status: 1,
//           data: task
//         });
//       }
//     });

//   }
 
// };



// //**************************************************************

// exports.delete_address_user = function(req, res) {
//   console.log(req.body);

//   if(req.body.status == 0){
//      address.remove({'_id':req.params.id}, function(err, task) {
//       if(task == null){
//         res.send({
//           error: err,
//           status: 0,
//           data: null
//         });
//       }else{
//         res.json({
//           error: null,
//           status: 1,
//           data: task
//         });
//       }
//     });
//   }else{

//     address.findOne({userId: req.body.userId, _id:{$ne:req.params.id}}, function(err, check) {
//       console.log(check);


//       if(check){

//         address.remove({'_id':req.params.id}, function(err, task) {
//           if(task == null){
//             res.send({
//               error: err,
//               status: 0,
//               data: null
//             });
//           }else{

//             address.update({_id: check._id }, { $set: {status : '1'}}, {new: true}, function(err, task) {
//               if (task == null){
//                 res.send({
//                   error: err,
//                   status: 0,
//                   data: null
//                 });
//               }else{

//                 users.update({_id: req.body.userId }, { $set: {address: check.address, city: check.city , country: check.country}}, {new: true}, function(err, task) {
//                   if(task == null){
//                     res.send({
//                       error: err,
//                       status: 0,
//                       data: null
//                     });
//                   }else{
//                     res.json({
//                       error: null,
//                       status: 1,
//                       data: task
//                    });
//                   }
//                });
//              }
//            });
//          }
//       })
//     }else{
//       res.json({
//         error: err,
//         status: 2,
//         data: 'not allow'
//      });
//     }
//   })
//   }
// };

// //****************** login_with_fb/google_function **************************
// exports.login_with_fb = function(req, res) {
//   users.findOne({email: req.body.email}, function(err, check) {
//     if(check == null){
//       var new_user = new users({
//         fname: req.body.fname,
//         lname: req.body.lname,
//         email: req.body.email,
//         password: req.body.password,
//         status: req.body.status,
//         address: req.body.address,
//         date_created: new Date(),
//         registrationId: req.body.registrationId,
//         type:'user'
//       });

//       new_user.save(function(err, users) {
//         if (users == null){
//            res.send({
//             error: err,
//             status: 0,
//             data: null
//           });
//         }else{

//            if(req.body.loginwithfb == 'true'){
//                 // var helper = require('sendgrid').mail;
//                 // var fromEmail = new helper.Email('noreply@cleanme.com');
//                 // var toEmail = new helper.Email('info@cleanmebh.com');
//                 // var subject = 'New User Resgister';
//                 // var content = new helper.Content('text/html', ''+req.body.fname +' '+ req.body.lname +'is new user to register in the "Cleanme App"');

//                 // var string = 'A new user register in "Cleanme App". Information regarding the user is given below'


//                 // //var content = new helper.Content('text/plain', 'A new order has been placed by a customer for your services');
//                 // var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//                 // var sg = require('sendgrid')('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');
//                 // var request = sg.emptyRequest({
//                 //     method: 'POST',
//                 //     path: '/v3/mail/send',
//                 //     body: mail.toJSON()
//                 // });

//                 // sg.API(request, function (error, response) {
//                 //   if (error) {
//                 //     res.json({
//                 //         error: 'Something went wrong.Please try later.',
//                 //         status: 0,
//                 //         data: null
//                 //     });
//                 //   }                              
//                 // });



//                ////////////////////////////////////////////////////////////////

//                 var string = 'A new user register in "Cleanme App". Information regarding the user is given below'
//                 var fs = require('fs'); // npm install fs
//                 var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/signup.html', 'utf8');
//                 let dynamic_data = ''
//                 readStream.on('data', function(chunk) {
//                     dynamic_data += chunk;
//                 }).on('end', function() {
//                 var helper = require('sendgrid').mail;
//                 var fromEmail = new helper.Email('noreply@cleanme.com'/*'priyankasharma4010@gmail.com'*/, 'Cleanme');
//                 var toEmail = new helper.Email('info@cleanmebh.com');
//                 //var toEmail = new helper.Email('gurmukhindiit@gmail.com');
                
               
//                 var subject = 'New User Registered';

//                 dynamic_data = dynamic_data.replace("#STRING#",  string);

//                 dynamic_data = dynamic_data.replace("#FIRSTNAME#",  req.body.fname);

//                 dynamic_data = dynamic_data.replace("#LASTNAME#", req.body.lname);

//                 dynamic_data = dynamic_data.replace("#NUMBER#", 'xxx-xxxx-xxx');

//                 dynamic_data = dynamic_data.replace("#EMAIL#", req.body.email);
             
//                 dynamic_data = dynamic_data.replace("#LOCATION#", req.body.address);

//                 var content = new helper.Content('text/html', dynamic_data);

//                 var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//                 // var sg = require('sendgrid')(constants.SENDGRID_API_ID);
//                 var sg = require('sendgrid')('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');
//                 var request = sg.emptyRequest({
//                     method: 'POST',
//                     path: '/v3/mail/send',
//                     body: mail.toJSON()
//                 });

//                 sg.API(request);
//             });

//           }

//           if(req.body.loginwithfb == 'true'){
//             var helper = require('sendgrid').mail;
//             var fromEmail = new helper.Email('noreply@cleanme.com');
//             var toEmail = new helper.Email(req.body.email);
//             var subject = 'Login Cleanme';
//             var content = new helper.Content('text/plain', 'Your cleanme login password is ' + req.body.password);
//             var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//             var sg = require('sendgrid')('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');
//             var request = sg.emptyRequest({
//                 method: 'POST',
//                 path: '/v3/mail/send',
//                 body: mail.toJSON()
//             });

//             sg.API(request, function (error, response) {
//               if (error) {
//                 res.json({
//                     error: 'Something went wrong.Please try later.',
//                     status: 0,
//                     data: null
//                 });
//                 // console.log('Error response received');
//               }

//             var adminnotification_save = new adminnotification({
//               userId: users._id,
//               bookStatus:'newuser',
//               isRead:'0',
//               date_created: new Date(),
//             });

//             adminnotification_save.save(function(err, notification) {
//               if(notification == null){
//                 res.send({
//                   error: err,
//                   status: 0,
//                   data: null
//                 });
//               }else{


//                   var new_address = new address({
//                       address: req.body.address,
//                       city: req.body.city,
//                       country: req.body.country,
//                       userId: users._id,
//                       date_created: new Date(),
//                       status : req.body.status
//                     });

//                     new_address.save(function(err, address) {
//                       if(address == null){
//                         res.send({
//                           error: err,
//                           status: 0,
//                           data: null
//                         });
//                       }else{
//                         res.json({
//                           error: null,
//                           status: 1,
//                           data: users
//                         });
//                       }
//                     });
//                 // res.json({
//                 //   error: null,
//                 //   status: 1,
//                 //   data: users
//                 // });
//               }   
//             })   
//             });
//           }else{
//             res.json({
//               error: null,
//               status: 1,
//               data: users
//             });
//           }
//         }
//       });
//     }else{



//       users.findOne({registrationId:req.body.registrationId}, function(err, regId) {
//         console.log(regId);

//         if(regId == null){
//           users.update({_id: check._id }, { $set: {registrationId: req.body.registrationId}}, {new: true}, function(err, save) {
//               if(save == null){
//                 res.send({
//                   error: err,
//                   status: 0,
//                   data: null
//                 });

//               }else{
//                 res.json({
//                   error: null,
//                   status: 1,
//                   data: check
//                 });
//               }
//             });
//         }else{

//           users.update({_id: regId._id }, { $set: {registrationId: null}}, {new: true}, function(err, regnull) {

//              if(regnull == null){
//                 res.send({
//                   error: err,
//                   status: 0,
//                   data: null
//                 });
//               }else{
                
//                 users.update({_id: check._id }, { $set: {registrationId: req.body.registrationId}}, {new: true}, function(err, task) {
//                     if(task == null){
//                       res.send({
//                         error: err,
//                         status: 0,
//                         data: null
//                       });

//                     }else{
//                       res.json({
//                         error: null,
//                         status: 1,
//                         data: check
//                       });
//                     }
//                   });
//               }
//             })
//         }
//       })



//       // console.log(req.body.registrationId);
//       // users.update({_id: check._id }, { $set: {registrationId: req.body.registrationId}}, {new: true}, function(err, task) {
//       //   if(task == null){
//       //     res.send({
//       //       error: err,
//       //       status: 0,
//       //       data: null
//       //     });

//       //   }else{
//       //     res.json({
//       //         error: null,
//       //         status: 2,
//       //         data: check
//       //     });
//       //   }
//       // });
      
//     }
//   });
// };






// //*************** Get_service_provider_profile)function *****************
// exports.get_service_provider_profile = function(req, res) {
//   users.find({_id: req.params.id }, function(err, servicedata) {
//     var data = [];
//     var servicedata = servicedata;
//     var counter = 0,
//         dict = {};
//     //is record available
//     if(servicedata.length > 0){
//       function getCompany(){
//         //get array index data
//         dict = servicedata[counter];
//         //console.log("dict----"+dict);
//         serviceSetting.find({userId: dict._id}, function(err, newcategory){
//           if(newcategory && newcategory.length > 0){  
//           // console.log(newcategory);  
//             dict = {
//               'addvanceBooking':  newcategory[0].addvanceBooking,
//               'multiBook' : newcategory[0].multiBook,
//               'days':newcategory[0].days,
//               'payLocal':newcategory[0].payLocal,
//               'paypalExpress':newcategory[0].paypalExpress,
//               'timeSlote': newcategory[0].timeSlote,
//               'serviceFee':newcategory[0].serviceFee,
//               'companyName':dict.companyName,
//               'companyaddress':dict.companyaddress,
//               'email': dict.email,
//               'contact': dict.contact,
//               'city': dict.city,
//               'state': dict.state,
//               'country': dict.country,
//               'zip':dict.zip,
//               'fname':dict.fname,
//               'lname': dict.lname,
//               'logo': dict.logo,
//               'password':dict.password,
//               'atstore':dict.atstore,
//               'athome':dict.athome,
//               '_id': dict._id,
//               'profilePic':dict.profilePic,
//               'minminuOrder':dict.minminuOrder
//             };
          
           
//             if(counter < servicedata.length - 1){
//               data.push(dict);
//               counter = counter + 1;
//               getCompany();
//             }else{
//               data.push(dict);
//               res.json(data);
//             } 
//           }else{
//             // //increase counter value
//             if(counter < servicedata.length - 1){
//               data.push(dict);
//               counter = counter + 1;
//               getCompany();
//             }else{
//               data.push(dict);
//               res.json(data);
//             } 
//           }
//         });
//       };
//       //call function
//       getCompany();
//     }else{
//       res.json(data);
//     }
//   });
// };



// //***************  Get_user_profile_data_function **********************
// exports.get_user_profile_data = function(req, res) {
//   users.find({_id: req.params.id}, function(err, admin) {
//     if (admin == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: admin
//       });
//     }
//   });
// };


// //************ Update_service_provider_password_function **************
// exports.update_service_provider_password = function(req, res) {
//   users.update({_id: req.params.id }, { $set: { password: req.body.password}}, {new: true}, function(err, task) {
//     if (task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };




// //************ Update_service_provider_password_function **************
// exports.update_reg_id = function(req, res) {
//   users.update({_id: req.body.userId }, { $set: { registrationId: req.body.registrationId}}, {new: true}, function(err, task) {
//     if (task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };



// //**************** Update_user_password_function ******************
// exports.update_user_password = function(req, res) {
//   users.update({_id: req.params.id }, { $set: { password: req.body.password}}, {new: true}, function(err, task) {
//     if (task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };



// //**************** Update_user_address_function ******************
// exports.update_user_address = function(req, res) {
//   users.update({_id: req.params.id }, { $set: { city: req.body.city,country: req.body.country, address:req.body.address }}, {new: true}, function(err, task) {
//     if(task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };


// //**************** Update_user_profile_function ******************
// exports.update_user_profile = function(req, res) {
//   users.update({_id: req.params.id }, { $set: {fname: req.body.fname,lname: req.body.lname, email: req.body.email, contact: req.body.contact}}, {new: true}, function(err, task) {
//     if (task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };



// //**************** Update_user_Image_function ******************
// exports.update_User_Image = function(req, res) {
//   upload(req,res,function(err){
//     var data = JSON.parse(req.body.fields);
//     //console.log(data.userId)
//     //console.log(req.file.filename);
//     if(err){
//       res.json({error_code:1,err_desc:err});
//       return;
//     }
//     users.update({_id: data.userId }, { $set: {logo: req.file.filename}}, {new: true}, function(err, task) {
//       if (err)
//         res.send(err);
//       res.json(task);
//     });
//   });
// };



// //**************** Get_customer_list_function ******************
// exports.get_customer_list = function(req, res) {
//   users.find({type:'user'},null,{sort: {'_id': -1}}, function(err, admin) {
//     if(admin == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: admin
//       });
//     }
//   });
// };



// //**************** Update_customer_function ******************
// exports.update_customer = function(req, res) {

//   users.findOne({'_id':{$ne:req.params.id}, contact: req.body.contact}, function(err, check) {  

//     console.log('----'+check);

//   if(check == null){

//     users.update({_id: req.params.id }, { $set: {fname: req.body.fname,lname: req.body.lname,email: req.body.email,contact: req.body.contact, address: req.body.address}}, {new: true}, function(err, task) {
//       if(task == null){
//         res.send({
//           error: err,
//           status: 0,
//           data: null
//         });
//       }else{
//         res.json({
//           error: null,
//           status: 1,
//           data: task
//         });
//       }
//     });
//   }else{
//     res.json({
//           error: null,
//           status: 2,
//           data: check
//     });
//   }
//   })
// }




// //**************** Delete_customer_function ******************
// exports.delete_customer = function(req, res) {
//   users.remove({'_id':req.params.id}, function(err, task) {
//     if(task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{

//         bookingorder.find({userId:req.params.id}, function(err, booking) {
//             console.log('---'+booking+'-----');
//             if(booking == null ){
//               res.json({
//                   error: null,
//                   status: 1,
//                   data: task
//               });

//             }else{
//               // console.log('id===='+booking[0].userId + '=====id')
//               bookingorder.remove({'userId':booking[0].userId}, function(err, remove) {
//                console.log('---'+remove+'-----');
//                 if(remove == null){
//                   res.send({
//                     error: err,
//                     status: 0,
//                     data: null
//                   });

//                 }else{ 

//                    adminnotification.remove({'userId':req.params.id}, function(err, noti) {

//                      if(noti == null){
//                           res.send({
//                             error: err,
//                             status: 0,
//                             data: null
//                           });

//                         }else{ 
//                           notification.remove({'userId':req.params.id}, function(err, usernoti) {

//                             if(usernoti == null){
//                                 res.send({
//                                   error: err,
//                                   status: 0,
//                                   data: null
//                                 });

//                               }else{ 
//                                 res.json({
//                                   error: null,
//                                   status: 1,
//                                   data: usernoti
//                                 });
//                               }
//                         })
//                         }
//                     })
//                 }
//               })
//             }
//         })
//     }
//   });
// };




// //**************** Update_customer_status_function ******************
// exports.update_customer_status = function(req, res) {
//   //console.log(req.params.status);
//   users.update({_id: req.params.id }, { $set: {status: req.params.status}}, {new: true}, function(err, task) {
//     if(task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };

// //**********************************************************
// exports.make_address_defualt = function(req, res) {
//   console.log(req.body);

//   address.update({_id: req.params.id }, { $set: {status: req.body.status}}, {new: true}, function(err, task) {
//     if(task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });                                                   
//     }else{

//       users.update({_id: req.body.userId }, { $set: {address: req.body.address, city: req.body.city , country: req.body.country}}, {new: true}, function(err, task) {
//       if(task == null){
//         res.send({
//           error: err,
//           status: 0,
//           data: null
//         });
//       }else{

//         address.update({userId: req.body.userId, _id:{$ne:req.params.id} }, { $set: {status:'0' }}, {multi: true}, function(err, task) {
//             if(task == null){
//               res.send({
//                 error: err,
//                 status: 0,
//                 data: null
//               });
//             }else{
//               res.json({
//                 error: null,
//                 status: 1,
//                 data: task
//               });
//             }
//         });
//       }
//     });
//     }
//   I});
// };




// //**************** Admin_login_function ******************
// exports.admin_login = function(req, res) {
//   users.findOne({email:req.body.email, password: req.body.password,type:'admin' }, function(err, admin) {
//     if(admin == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: admin
//       });
//     }
//   });
// };



// //******************** admin_Detail_help_function ******************
// exports.admin_Detail_help = function(req, res) {
//   users.find({type:'admin'}, function(err, admin) {
//      if (admin == null){
//        res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//        res.json({
//           error: null,
//           status: 1,
//           data: admin
//       });
//     }
//   });
// };



// //******************** admin_Detail_function ******************
// exports.admin_Detail = function(req, res) {
//   users.findOne({_id:req.params.id, type:'admin' }, function(err, admin) {
//      if (admin == null){
//        res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//        res.json({
//           error: null,
//           status: 1,
//           data: admin
//       });
//     }
//   });
// };



// //******************** Update_admin_detail_function ******************
// exports.update_admin_detail = function(req, res) {

//   upload(req,res,function(err){
//     if(err){
//       res.json({error_code:1,err_desc:err});
//       return;
//     }

//     console.log(req.body);
//     console.log(req.params.id);

//      users.find({'contact': req.body.contact, '_id':{$ne:req.params.id}}, function(err, numberCheck) {
//     //console.log('---------'+numberCheck.length);

//     if(numberCheck.length == 0){

//     if(req.file){
//       users.update({_id: req.params.id }, { $set: {fname: req.body.firstname, lname: req.body.lastname,email: req.body.email,logo: req.file.filename, contact:req.body.contact, serviceFee:req.body.serviceFee, cancelTime : req.body.cancelTime, countrycode : req.body.countrycode}}, {new: true}, function(err, task) {
//         if (task == null){
//           res.send({
//            error: err,
//            status: 0,
//            data: null
//           });
//         }else{
//           res.json({
//             error: null,
//             status: 1,
//             data: task
//           });
//         }
//       });
//     }else{
//       users.update({_id: req.params.id }, { $set: {fname: req.body.firstname, lname: req.body.lastname,email: req.body.email, contact:req.body.contact, serviceFee:req.body.serviceFee, cancelTime : req.body.cancelTime, countrycode : req.body.countrycode}}, {new: true}, function(err, task) {
//         if(task == null){
//           res.send({
//             error: err,
//             status: 0,
//             data: null
//           });
//         }else{
//           res.json({
//             error: null,
//             status: 1,
//             data: task
//           });
//         }
//       });
//      }
//     }else{
//       res.json({
//         error: 'null',
//         status: 2,
//         data: 'contact exits'
//       });
//     }
//    })
    
//    });
// };




// //******************** Update_admin_password_function ******************
// exports.update_admin_password = function(req, res) {
//   users.update({_id: req.params.id }, { $set: { password: req.body.password}}, {new: true}, function(err, task) {
//     if (task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };


// exports.reset_password = function(req, res) {
//   console.log(req.body)
//   console.log('reset password')
//     users.find({email:req.body.email,type:'admin'}, function(err, user) {
//     // console.log(user)
//     // console.log(user.length)
//      if (user.length==0){
//              res.send({
//               error:'Email does not exist',
//               status: 0
//             });
//      }else{
//       console.log("else");

//                 var string = 'Don'+'\''+'t worry, we all forget sometimes'
//                 var fs = require('fs'); // npm install fs
//                 var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/forgotpassword.html', 'utf8');
//                 let dynamic_data = ''
//                 readStream.on('data', function(chunk) {
//                     dynamic_data += chunk;
//                 }).on('end', function() {
//                 var helper = require('sendgrid').mail;
//                 var fromEmail = new helper.Email('noreply@cleanme.com'/*'priyankasharma4010@gmail.com'*/, 'Cleanme');
//                 var toEmail = new helper.Email(req.body.email);
//                 //var toEmail = new helper.Email('gurmukhindiit@gmail.com');
                
               
//                 var subject = 'Forgot Password Request';

//                 dynamic_data = dynamic_data.replace("#STRING#",  string);
//                 dynamic_data = dynamic_data.replace("#NAME#", user[0].fname) ;
//                 dynamic_data = dynamic_data.replace("#EMAIL#", user[0].email) ;
//                 dynamic_data = dynamic_data.replace("#PASSWORD#", user[0].password);
//                  var content = new helper.Content('text/html', dynamic_data);

//                 var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//                 // var sg = require('sendgrid')(constants.SENDGRID_API_ID);
//                 var sg = require('sendgrid')('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');
//                 var request = sg.emptyRequest({
//                     method: 'POST',
//                     path: '/v3/mail/send',
//                     body: mail.toJSON()
//                 });
//               sg.API(request, function (error, response) {
//               if (error) {
//                 res.json({
//                     error: 'Something went wrong.Please try later.',
//                     status: 0
                   
//                 });
//                 // console.log('Error response received');
//               }else{
//                 res.json({
//                     msg: 'Mail has been sent successfully',
//                     status: 1
//                 });
//               }
//             })
//             });


//             // var helper = require('sendgrid').mail;
//             // var fromEmail = new helper.Email('noreply@cleanme.com');
//             // var toEmail = new helper.Email(req.body.email);
//             // var subject = 'Forgot Password';
//             // var numsms = user[0].fname+Math.floor(Math.random() * 90000) + 10000+user[0].lname;
//             // var content = new helper.Content('text/plain', 'Your cleanme new password is ' + numsms);
//             // var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//             // var sg = require('sendgrid')('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');
//             // var request = sg.emptyRequest({
//             //     method: 'POST',
//             //     path: '/v3/mail/send',
//             //     body: mail.toJSON()
//             // });

//             // sg.API(request, function (error, response) {
//             //   if (error) {
//             //     res.json({
//             //         error: 'Something went wrong.Please try later.',
//             //         status: 0
                   
//             //     });
//             //     // console.log('Error response received');
//             //   }else{
//             //     res.json({
//             //         msg: 'Mail sent successfully',
//             //         status: 1
//             //     });
//             //   }
//             // })
//       //  res.json({
//       //     error: null,
//       //     status: 1,
//       //     data: user
//       // });
//     }
//   });
// }





// //******************** OTP_verification_for_profile_function ************************
// exports.otp_verification_for_profile = function(req, res) {
//   users.findOne({$and : [
//     {countrycode: req.body.countrycode},
//     {contact: req.body.contact}
//     ] }, function(err, contactnumber) {
//     //console.log(contactnumber);
//       if(contactnumber == null){
//         var reciceverContact = req.body.countrycode + req.body.contact
//         console.log(reciceverContact);
//         // var numsms = Math.floor(Math.random() * 90000) + 10000;
//         var numsms = req.body.numsms 
//         // users.update({_id: contactnumber._id }, { $set: { otp: numsms}}, {new: true}, function(err, task) {
//         //       if (task == null){
//         //        res.send({
//         //         error: err,
//         //         status: 0,
//         //         data: null
//         //       });
//         //     }else{
//         //        res.json({
//         //           error: null,
//         //           status: 1,
//         //           data: contactnumber
//         //       });
//         //     }
//         //   });
//         res.json({
//             error: null,
//             status: 1,
//             data: 'available'
//         });

//           var params = {
//           'dst': reciceverContact, // Receiver's phone number with country code
//           'src' : '+919855607503', // Sender's phone Number with country code
//           'text' : "Your cleanme OTP for update mobile number is " + numsms, // Your SMS Text Message - English
//           //'text' : "こんにちは、元気ですか？" // Your SMS Text Message - Japanese
//           //'text' : "Ce est texte généré aléatoirement" // Your SMS Text Message - French
//           //'url' : "https://intense-brook-8241.herokuapp.com/report/", // The URL to which with the status of the message is sent
//           'method' : "GET" // The method used to call the url
//         };

//        // Prints the complete response
//         p.send_message(params, function (status, response) {
//             // console.log('Status: ', status);
//             // console.log('API Response:\n', response);
//         });
//       }else{
//         res.json({
//             error: null,
//             status: 2,
//             data: 'Not available'
//         });
//       }
//     });
// };

// //******************** Otp_verification_function ************************
// exports.otp_verification = function(req, res) {
//   users.findOne({_id:req.body._id, otp: req.body.otp }, function(err, otp) {
//     if (otp == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: otp
//       });
//     }
//   });
// };



// //******************** Update_forgor_password_function ************************
// exports.update_forgor_password = function(req, res) {
//   users.update({_id: req.params.id }, { $set: { password: req.body.password, otp:null}}, {new: true}, function(err, task) {
//     if (task == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: task
//       });
//     }
//   });
// };




// //******************** SignUp_verification_function ************************
// exports.signUp_verification = function(req, res) {
//   console.log( req.body.countrycode);
//   console.log( req.body.contact);

//   users.findOne({$and : [
//     {countrycode: req.body.countrycode},
//     {contact: req.body.contact}
//     ] }, function(err, contactnumber) {
//     //console.log(contactnumber);
//       if(contactnumber == null){
//         var reciceverContact = req.body.countrycode + req.body.contact
//         //console.log(reciceverContact);
//         // var numsms = Math.floor(Math.random() * 90000) + 10000;
//         var numsms = req.body.numsms 
//         // users.update({_id: contactnumber._id }, { $set: { otp: numsms}}, {new: true}, function(err, task) {
//         //       if (task == null){
//         //        res.send({
//         //         error: err,
//         //         status: 0,
//         //         data: null
//         //       });
//         //     }else{
//         //        res.json({
//         //           error: null,
//         //           status: 1,
//         //           data: contactnumber
//         //       });
//         //     }
//         //   });
//         res.json({
//             error: null,
//             status: 1,
//             data: 'available'
//         });




//           var params = {
//           'dst': reciceverContact, // Receiver's phone number with country code
//           'src' : '+91123456789', // Sender's phone Number with country code
//           'text' : "Your cleanme OTP for signup is " + numsms, // Your SMS Text Message - English
//           //'text' : "こんにちは、元気ですか？" // Your SMS Text Message - Japanese
//           //'text' : "Ce est texte généré aléatoirement" // Your SMS Text Message - French
//           //'url' : "https://intense-brook-8241.herokuapp.com/report/", // The URL to which with the status of the message is sent
//           'method' : "GET" // The method used to call the url
//         };

//        // Prints the complete response
//         p.send_message(params, function (status, response) {
//             // console.log('Status: ', status);
//             // console.log('API Response:\n', response);
//         });
//       }else{
//         res.json({
//             error: null,
//             status: 2,
//             data: 'Not available'
//         });
//       }
//     });
// };



// //******************** Check_user_status_function ************************
// exports.check_user_status = function(req, res) {
//   users.findOne({_id:req.params.id}, function(err, checkuser) {
//     if (checkuser == null){
//       res.send({
//         error: err,
//         status: 0,
//         data: null
//       });
//     }else{
//       res.json({
//         error: null,
//         status: 1,
//         data: checkuser
//       });
//     }
//   });
// };


// db.users.update({"_id":ObjectId("5bf2718e20c36c0501ab501c") }, { $set: {"followers": [] }})
