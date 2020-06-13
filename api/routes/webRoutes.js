'use strict';

module.exports = function(app) {

var userAdmin = require('../controllers/adminCtrl');
   app.route('/addUseradmin')
     .post(userAdmin.create_user_admin);

var adduser = require('../controllers/userCtrl');
   app.route('/addUser')
     .post(adduser.addUser);

var adminPwd = require('../controllers/userCtrl');
   app.route('/update_admin_password')
     .post(adminPwd.update_admin_password);

var loginuser = require('../controllers/userCtrl');
   app.route('/login')
     .post(loginuser.login);

var userData = require('../controllers/userCtrl');
   app.route('/getUserDomain')
     .post(userData.getUserDomain);

var userData = require('../controllers/userCtrl');
   app.route('/getUserByID')
     .post(userData.getUserByID);

var userlists = require('../controllers/userCtrl');
   app.route('/listuser')
     .post(userlists.userlist);

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

    
};

