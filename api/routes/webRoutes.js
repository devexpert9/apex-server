'use strict';

module.exports = function(app) {

var userAdmin = require('../controllers/adminCtrl');
   app.route('/addUseradmin')
     .post(userAdmin.create_user_admin);

var userAdmin = require('../controllers/userCtrl');
   app.route('/get_info_about_agent')
     .post(userAdmin.getInfoAboutAgent);

var adduser = require('../controllers/userCtrl');
   app.route('/addUser')
     .post(adduser.addUser);

var adduser = require('../controllers/userCtrl');
   app.route('/checkEmailExist')
     .post(adduser.checkEmailExist);

var adminPwd = require('../controllers/userCtrl');
   app.route('/update_admin_password')
     .post(adminPwd.update_admin_password);

var loginuser = require('../controllers/userCtrl');
   app.route('/login')
     .post(loginuser.login);

var userAdmin = require('../controllers/userCtrl');
   app.route('/forgotPasswordAdmin')
     .post(userAdmin.forgotPasswordAdmin);

var userData = require('../controllers/userCtrl');
   app.route('/getUserDomain')
     .post(userData.getUserDomain);

var userData = require('../controllers/userCtrl');
   app.route('/getUserByID')
     .post(userData.getUserByID);

var userData = require('../controllers/userCtrl');
   app.route('/update_user')
     .post(userData.update_user);
     
var userData = require('../controllers/userCtrl');
   app.route('/update_userLess')
     .post(userData.update_userLess);

var userlists = require('../controllers/userCtrl');
   app.route('/listuser')
     .post(userlists.userlist);

var userlists = require('../controllers/userCtrl');
   app.route('/deleteuser')
     .post(userlists.deleteuser);

var cms = require('../controllers/cmspageCtrl');
   app.route('/add_cmspage')
     .post(cms.add_cmspage);

var cmsData = require('../controllers/cmspageCtrl');
   app.route('/getPageData')
     .post(cms.getPageData);

var imageupload = require('../controllers/userCtrl');
   app.route('/upload_image')
     .post(imageupload.upload_image);

var dashboard = require('../controllers/dashboardCtrl');
   app.route('/add_dash_section')
     .post(dashboard.add_dash_section);

var dashboard = require('../controllers/dashboardCtrl');
   app.route('/get_dash_sections')
     .post(dashboard.getPageData);

var dashboard = require('../controllers/dashboardCtrl');
   app.route('/update_dash_sections')
     .post(dashboard.update_dash_section_item);

var dashboard = require('../controllers/dashboardCtrl');
   app.route('/delete_dash_entry')
     .post(dashboard.delete_dash_section_item);

var dashboard = require('../controllers/dashboardCtrl');
   app.route('/updateDropList')
     .post(dashboard.updateDropList);


//--- SUPER ADMIN STUFF BELOW -------------------------------------

var superAdmin = require('../controllers/superadminCtrl');
   app.route('/register_super_user')
    .post(superAdmin.create_user_admin);


var superAdmin = require('../controllers/superadminCtrl');
   app.route('/super_admin_login')
     .post(superAdmin.login_superadmin);
     
var superAdmin = require('../controllers/superadminCtrl');
   app.route('/update_admin_profile')
     .post(superAdmin.update_admin_profile);

var userData = require('../controllers/inquiryCtrl');
   app.route('/contactRequest')
     .post(userData.add_contactRequest);

var userData = require('../controllers/inquiryCtrl');
   app.route('/contactRequestWeb')
     .post(userData.contactRequestWeb);
     
var userData = require('../controllers/subscriptionCtrl');
   app.route('/subscriptionRequestWeb')
     .post(userData.subscriptionRequestWeb);

     
var userData = require('../controllers/subscriptionCtrl');
   app.route('/subscriptionGet')
     .post(userData.subscriptionGet);

var userData = require('../controllers/cmscontentCtrl');
   app.route('/addCmsContent')
     .post(userData.addCmsContent);

var userData = require('../controllers/cmscontentCtrl');
   app.route('/getCmsContent')
     .post(userData.getCmsContent);

var userData = require('../controllers/inquiryCtrl');
   app.route('/contactData')
     .post(userData.getPageData);  

var userData = require('../controllers/inquiryCtrl');
   app.route('/deleteInquiry')
     .get(userData.deleteInquiry);  
};

