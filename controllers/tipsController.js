var tipsService = require('../services/tipsService.js');
var q = require('q');

var tipsController = {};

tipsController.createTips = function(tips) {
	var deferred = q.defer();

	tipsService.createTips(tips).then(function(success) {
		deferred.resolve(success);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

module.exports = tipsController;