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
   app.route('/addUserFront')
     .post(adduser.addUserFront);

var adduser = require('../controllers/userCtrl');
   app.route('/updateAgentStatus')
     .post(adduser.updateAgentStatus);

var adduser = require('../controllers/userCtrl');
   app.route('/checkEmailExist')
     .post(adduser.checkEmailExist);

var adminPwd = require('../controllers/userCtrl');
   app.route('/update_admin_password')
     .post(adminPwd.update_admin_password);

var loginuser = require('../controllers/userCtrl');
   app.route('/login')
    .put(loginuser.removeAllUsers)
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
   app.route('/update_user_expiry')
     .post(userData.update_user_expiry);


var userData = require('../controllers/userCtrl');
   app.route('/update_user_expiryDuringSignup')
     .post(userData.update_user_expiryDuringSignup);
     
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


//--- PACKAGES -------------------------------------
var pack = require('../controllers/packageCtrl');
   app.route('/create_package')
    .post(pack.create_package);

var pack = require('../controllers/packageCtrl');
   app.route('/getAllPackages')
    .post(pack.getAllPackages);

var pack = require('../controllers/packageCtrl');
   app.route('/updatePackage')
    .post(pack.updatePackage);

var pack = require('../controllers/packageCtrl');
   app.route('/deletePackage')
    .post(pack.deletePackage);

var pack = require('../controllers/packageCtrl');
   app.route('/getPackageById')
    .post(pack.getPackageById);

//--- SIGN UP PACKAGES -------------------------------------
var pack = require('../controllers/signuppackageCtrl');
   app.route('/signup_create_package')
    .post(pack.signup_create_package);

var pack = require('../controllers/signuppackageCtrl');
   app.route('/signup_getAllPackages')
    .post(pack.signup_getAllPackages);

var pack = require('../controllers/signuppackageCtrl');
   app.route('/signup_updatePackage')
    .post(pack.signup_updatePackage);

var pack = require('../controllers/signuppackageCtrl');
   app.route('/signup_deletePackage')
    .post(pack.signup_deletePackage);

var pack = require('../controllers/signuppackageCtrl');
   app.route('/signup_getPackageById')
    .post(pack.signup_getPackageById);

var pack = require('../controllers/signuppackageCtrl');
   app.route('/signup_getPackageByStatus')
    .post(pack.signup_getPackageByStatus);

var pack = require('../controllers/signuppackageCtrl');
   app.route('/updatePackageStatus')
    .post(pack.updatePackageStatus);


//--- TESTIMONIALS -------------------------------------
var pack = require('../controllers/testimonialCtrl');
   app.route('/create_testimonial')
    .post(pack.create_testimonial);

var pack = require('../controllers/testimonialCtrl');
   app.route('/getAllTestimonials')
    .post(pack.getAllTestimonials);

var pack = require('../controllers/testimonialCtrl');
   app.route('/updateTestimonial')
    .post(pack.updateTestimonial);

var pack = require('../controllers/testimonialCtrl');
   app.route('/deleteTestimonial')
    .post(pack.deleteTestimonial);
    
var pack = require('../controllers/testimonialCtrl');
   app.route('/getTestimonialById')
    .post(pack.getTestimonialById);

//--- SECTIONS -------------------------------------
var pack = require('../controllers/sectionCtrl');
   app.route('/create_section')
    .post(pack.create_section);

var pack = require('../controllers/sectionCtrl');
   app.route('/getAllSections')
    .post(pack.getAllSections);

var pack = require('../controllers/sectionCtrl');
   app.route('/updateSection')
    .post(pack.updateSection);

var pack = require('../controllers/sectionCtrl');
   app.route('/deleteSection')
    .post(pack.deleteSection);
    
var pack = require('../controllers/sectionCtrl');
   app.route('/getSectionById')
    .post(pack.getSectionById);
    
var pack = require('../controllers/sectionCtrl');
   app.route('/updateSectionStatus')
    .post(pack.updateSectionStatus);

//--- GLOSSARY -------------------------------------
var pack = require('../controllers/glossaryCtrl');
   app.route('/create_glossary')
    .post(pack.create_glossary);

var pack = require('../controllers/glossaryCtrl');
   app.route('/getAllGlossaries')
    .post(pack.getAllGlossaries);

var pack = require('../controllers/glossaryCtrl');
   app.route('/updateGlossary')
    .post(pack.updateGlossary);

var pack = require('../controllers/glossaryCtrl');
   app.route('/deleteGlossary')
    .post(pack.deleteGlossary);
    
var pack = require('../controllers/glossaryCtrl');
   app.route('/getGlossaryById')
    .post(pack.getGlossaryById);

var pack = require('../controllers/glossaryCtrl');
   app.route('/import_csv_data')
    .post(pack.import_csv_data);

//--- Dashboard Sections -------------------------------------
var pack = require('../controllers/dashboardsectionCtrl');
   app.route('/updateDashboardSection')
    .post(pack.updateDashboardSection);
 

//--- SECURITY -------------------------------------
var pack = require('../controllers/securityprivacyCtrl');
   app.route('/addSecurityData')
    .post(pack.addSecurityData);

var pack = require('../controllers/securityprivacyCtrl');
   app.route('/getSecurityPrivacyById')
    .post(pack.getSecurityPrivacyById);

//--- WEB ABOUT DATA -------------------------------------
var pack = require('../controllers/securityprivacyCtrl');
   app.route('/addWebAboutData')
    .post(pack.addWebAboutData);

var pack = require('../controllers/securityprivacyCtrl');
   app.route('/getWebAboutData')
    .post(pack.getWebAboutData);

//--- WEB CONTACT DATA -------------------------------------
var pack = require('../controllers/securityprivacyCtrl');
   app.route('/addWebContactData')
    .post(pack.addWebContactData);

var pack = require('../controllers/securityprivacyCtrl');
   app.route('/getWebContactData')
    .post(pack.getWebContactData);


//--- AGENT SUBSCRIPTIONS -------------------------------------
var pack = require('../controllers/agentsubscriptionCtrl');
   app.route('/addAgentSubs')
    .post(pack.addAgentSubs);

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
   app.route('/getAllSubscriptions')
     .post(userData.getAllSubscriptions);

     
var userData = require('../controllers/subscriptionCtrl');
   app.route('/subscriptionGet')
     .post(userData.subscriptionGet);

var userData = require('../controllers/subscriptionCtrl');
   app.route('/getUserSubscriptions')
     .post(userData.getUserSubscriptions);

var userData = require('../controllers/subscriptionCtrl');
   app.route('/deleteSubscriptions')
     .post(userData.deleteSubscriptions);

var userData = require('../controllers/subscriptionCtrl');
   app.route('/getUserCards')
     .post(userData.getUserCards);
     
var userData = require('../controllers/subscriptionCtrl');
   app.route('/DeleteCardByID')
     .post(userData.DeleteCardByID);

var userData = require('../controllers/subscriptionCtrl');
   app.route('/deleteAllCards')
     .post(userData.deleteAllCards);

var userData = require('../controllers/subscriptionCtrl');
   app.route('/deleteAllPayments')
     .post(userData.deleteAllPayments);

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

var userData = require('../controllers/paymentCtrl');
   app.route('/storeCreditCardVault')
     .post(userData.storeCreditCardVault); 

var userData = require('../controllers/paymentCtrl');
   app.route('/autoRenewalPlan')
     .post(userData.autoRenewalPlan); 

};

