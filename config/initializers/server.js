var express = require('express');
var path = require('path');
// Local dependecies
var config = require('nconf');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app;

var start =  function(cb) {
  'use strict';
  // Configure express
  app = express();

  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: '*/*'}));

  logger.info('[SERVER] Initializing routes');
  require('../../routes/index')(app);

  app.use(express.static(path.join(__dirname, '../../public')));

  // view engine setup
  app.set('views', path.join(__dirname, '../../views'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'production' ? err : {})
    });
    next(err);
  });

  var port = (process.env.VCAP_APP_PORT || 21062);

  app.listen(port);
  logger.info('[SERVER] Listening on port ' + port);

  if (cb) {
    return cb();
  }
};

module.exports = start;