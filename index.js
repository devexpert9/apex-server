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
  agentsubscription     = require('./api/models/agentsubscriptionModel'),
  securityprivacy  = require('./api/models/securityprivacyModel'),
  signuppackage  = require('./api/models/signuppackageModel'),
  multer       = require('multer'),
  bodyParser   = require('body-parser');

 
mongoose.Promise = global.Promise;

var connectionUrl = 'mongodb://root:HG3eFtw60KcU@localhost:27017/hats?authSource=admin';
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

var CronJob = require('cron').CronJob;
//00 00 00 * * *--midnight
var job = new CronJob('* * * * * *', function() {
  //console.log('You will see this message every second');
  var d = new Date();
    
  var date = d.getDate() < 9 ? '0' + d.getDate() : d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
      
  var dateStr = year + "-" + month + "-" + date;
  console.log(dateStr)
});
job.start();
// app.listen(port);
module.exports = app;
// console.log('todo list RESTful API server started on: ' + port);