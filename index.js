var express = require('express'),
  app       = express(),
  port      = process.env.PORT || 3000,
  mongoose  = require('mongoose'),
  users     = require('./api/models/userModel'), 
  admin     = require('./api/models/adminModel'), 
  superadmin = require('./api/models/superadminModel'), 
  cmspage   = require('./api/models/cmspageModel'),
  dashboard = require('./api/models/dashboardModel'),
  cmscontent = require('./api/models/cmscontentModel'),
  subscription = require('./api/models/subscriptionModel'),
  multer    = require('multer'),
  bodyParser = require('body-parser');

 
mongoose.Promise = global.Promise;

var connectionUrl = 'mongodb://root:gUW1iO3eyomJ@localhost:27017/hats?authSource=admin';
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
app.listen(port);
module.exports = app;
console.log('todo list RESTful API server started on: ' + port);