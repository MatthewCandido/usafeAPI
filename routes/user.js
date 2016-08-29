var userController = require('../controllers/userController.js');

module.exports = function(router) {
  'use strict';

  router.route('/')
  .get(function(req, res) {
    res.status(200).json({result : "user API"});
  });

  router.route('/signUp')
  .post(function(req, res, next) {
    console.log("Request body = " + JSON.stringify(req.body));

    if (JSON.stringify(req.body) === '{}') {
      console.log("Error: Empty Request body");
      res.status(400).json({"errorMessage" : 'Empty request body'});
    } else {
        userController.signUp(req.body).then(function(result) {
          if (result.hasOwnProperty("customError")) {
            res.status(400).json({"errorMessage" : result.customError});
          } else {
            res.status(200).json(result);
          }

        }, function(result) {
          res.status(400).json({"errorMessage" : result.customError});
        });
    }

  });

  router.route('/signIn')
  .post(function(req, res, next) {
    console.log("Request body = " + JSON.stringify(req.body));

    if (JSON.stringify(req.body) === '{}') {
      console.log("Error: Empty Request body");
      res.status(400).json({"errorMessage" : 'Empty request body'});
    } else {
        userController.signIn(req.body).then(function(result) {
          if (result.hasOwnProperty("customError")) {
            res.status(400).json({"errorMessage" : result.customError});
          } else {
            res.status(200).json(result);
          }

        }, function(result) {
          res.status(400).json({"errorMessage" : result.customError});
        });
    }

  });

};