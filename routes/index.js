var changeCase = require('change-case');
var express = require('express');
var routes = require('require-dir')();

module.exports = function(app) {

    'use strict';

    var router = express.Router();

    /* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

    // Initialize all routes
    Object.keys(routes).forEach(function(routeName) {
    	console.log("Creating route " + routeName);
	    // You can add some middleware here
	    // router.use(someMiddleware);

	    // Initialize the route to add its functionality to router
	    require('./' + routeName)(router);

	    // Add router to the speficied route name in the app
	    app.use('/' + changeCase.paramCase(routeName), router);
    });

    app.use('/', router);

};