var userController = require('../controllers/userController.js');

module.exports = function(router) {
  'use strict';

  router.route('/getUserData')
  .post(function(req, res, next) {
    console.log("Request body = " + JSON.stringify(req.body));

    if (JSON.stringify(req.body) === '{}') {
      console.log("Error: Empty Request body")
      res.status(400).json({"errorMessage" : 'Empty request body'});
    } else {
      // if (req.body.hasOwnProperty("user") &&
      //     req.body.hasOwnProperty("authenticationDate") &&
      //     req.body.hasOwnProperty("base64uid")) {

        userController.signUp(req.body).then(function(result) {
          if (result.hasOwnProperty("customError")) {
            res.status(400).json({"errorMessage" : result.customError});
          } else {
            res.status(200).json(result);
          }

        });

    // } else {
    //   res.status(400).json({"errorMessage" : 'Invalid request body'});
    // }

    }

  });

};