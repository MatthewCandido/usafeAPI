var userService = require('../services/userService.js');
var q = require('q');

var userController = {};

userController.signUp = function(user) {
	var deferred = q.defer();

	userService.signUp(user).then(function(success) {
		deferred.resolve(success);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

userController.signIn = function(user) {
	var deferred = q.defer();

	userService.signIn(user).then(function(success) {
		deferred.resolve(success);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

module.exports = userController;