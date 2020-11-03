var express = require('express'),
  https = require("https"),
  app          = express(),
  fs = require('fs'),
  port         = process.env.PORT || 8080,
  mongoose     = require('mongoose'),
  users        = require('./api/models/userModel'), 
  admin        = require('./api/models/adminModel'), 
  superadmin   = require('./api/models/superadminModel'), 
  cmspage      = require('./api/models/cmspageModel'),
  dashboard    = require('./api/models/dashboardModel'),
  cmscontent   = require('./api/models/cmscontentModel'),
  subscription = require('./api/models/subscriptionModel'),
  package      = require('./api/models/packageModel'),
  testimonial  = require('./api/models/testimonialModel'),
  section      = require('./api/models/sectionModel'),
  glossary     = require('./api/models/glossaryModel'),
  dashboardsection  = require('./api/models/dashboardsectionModel'),
  agentsubscription = require('./api/models/agentsubscriptionModel'),
  securityprivacy   = require('./api/models/securityprivacyModel'),
  signuppackage  = require('./api/models/signuppackageModel'),
  multer       = require('multer'),
  bodyParser   = require('body-parser');

 
mongoose.Promise = global.Promise;

//var connectionUrl = 'mongodb://root:HG3eFtw60KcU@localhost:27017/hats?authSource=admin';
var connectionUrl = 'mongodb://root:NTGwKptW4Wt9@localhost:27017/hats?authSource=admin';
mongoose.connect(connectionUrl); 

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});

var path = __dirname;

path = path.split('/server');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', port);

var webroutes = require('./api/routes/webRoutes');
  webroutes(app);
app.use('/images', express.static(path[0] + '/images'));

const options = {
  key: fs.readFileSync("private.key"),
  cert: fs.readFileSync("certificate.crt")
};


https.createServer(options, app).listen(port, function () {
  console.log('APIs started at '+port)
});

var cards = mongoose.model('cards'),
subscription = mongoose.model('subscription'),
users = mongoose.model('users');
/*var PAYPAL_CLIENT = 'AUJwMArV3OrlX73_R8aOCpP3QlI_MeDOsoxwVI2ufXFon_8Va_xRRbSJakVsV4P32x3xR6bB2f4jWdd7';
var PAYPAL_SECRET = 'ENYFR3iyybskBAfmHf7bWnc8PnHLg2LD2JCAYpq-vlRzWELGpyZDJl_1OW-V6aEwNrEeo7-m1yOuQxrR';*/

var PAYPAL_CLIENT = 'AfYnCuUFzmKXJQm6A_C3z1UoR8Bq6ewoONrdznTaWlIhY3QkUT1kraO47cAv81z9Et77Mv11w-N5xMvu';
var PAYPAL_SECRET = 'EMaWrXLbB6DHxyIsA4O68DrJ259KcCp-vxgqIPvy1lYeC2-qz8vhRlC_T6neAApyaL4HBhtZUJTR1Vjt';

var paypal = require('paypal-rest-sdk');
paypal.configure({
  //'mode': 'sandbox', //sandbox or live
  'mode': 'live', //sandbox or live
  'client_id': PAYPAL_CLIENT, 
  'client_secret': PAYPAL_SECRET,
  'headers': {
    'custom': 'header'
  }
});

var CronJob = require('cron').CronJob;
//00 00 00 * * *--midnight
var job = new CronJob('00 00 00 * * *', function() {
  //console.log('You will see this message every second');
  var d = new Date();
  var yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1)
  d = yesterday;
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
      // date = date - 1;

      date = date < 10 ? '0' + date : date;
  var dateStr = year + "-" + month + "-" + date;
  console.log(dateStr);
  //which users expiry cuurent date
  users.find({'expiry_date': dateStr}, function(err, doc){
    console.log(doc)
    var data = doc,
        counter = 0;
    function recurringPayment(){
      if(counter < data.length){
        cards.findOne({'userId': doc[counter]._id}, function(err, card_doc){
          console.log(card_doc)
          if(card_doc != null){
            subscription.findOne({'userId': doc[counter]._id}, function (err, sub_doc){
              if(sub_doc != null){
                var dict = {
                  "intent": "sale",
                  "payer": {
                    "payment_method": "credit_card",
                    "funding_instruments": [ {
                      "credit_card_token": {
                        "credit_card_id": card_doc.card_data.id,
                        "external_customer_id": card_doc.card_data.external_customer_id
                      }
                    } ]
                  },
                  "transactions": [{
                    "amount": {
                      "total": sub_doc.payment_data.transactions[0].amount.total,
                      "currency": sub_doc.payment_data.transactions[0].amount.currency
                    },
                    "description": "This is the payment transaction description."
                  }]
                };

                paypal.payment.create(dict, function(error, payment){
                  if(!error){
                    console.log(JSON.stringify(payment));
                    var new_pack = new subscription({
                        userId:   doc[counter]._id,
                        payment_data:   payment,
                        package_data: sub_doc.package_data,
                        created_at: new Date()
                    });

                    new_pack.save(function(err, new_doc){
                      //update user expiry
                      let userExpiry = doc[counter].expiry_date;
                      let timePeriod = sub_doc.package_data.timePeriod;

                      let addMnths = 0;

                      if(timePeriod == 'indefinate'){
                        addMnths = 360;
                      }
                      else if(timePeriod == '1'){
                        addMnths = 360;
                      }
                      else if(timePeriod == '1-1'){
                        addMnths = 1;
                      }
                      else if(timePeriod == '6'){
                        addMnths = 6;
                      }
                      else if(timePeriod == '12'){
                        addMnths = 12;
                      }
                      
                      var d = new Date(userExpiry);
                      let updatedExpiry = d.setMonth(d.getMonth() + addMnths);

                      let dt    = new Date(updatedExpiry);
                      let year  = dt.getFullYear();
                      let month = (dt.getMonth() + 1).toString().padStart(2, "0");
                      let day   = dt.getDate().toString().padStart(2, "0");

                      let formatted_date = year+'-'+month+'-'+day;

                      users.update({_id: doc[counter]._id},{ $set: {'expiry_date': formatted_date} }, {new: true}, function(err, user)
                      {
                        counter += 1;
                        recurringPayment();
                      });
                    });
                  }else{
                    counter += 1;
                    recurringPayment();
                  }
                });
              }else{
                counter += 1;
                recurringPayment();
              }
            });
          }else{
            counter += 1;
            recurringPayment();
          }
        });
      }
    };
    recurringPayment();
  });
});
job.start();
// app.listen(port);
module.exports = app;
// console.log('todo list RESTful API server started on: ' + port);