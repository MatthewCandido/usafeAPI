var markService = require('../services/markService.js');
var q = require('q');

var markController = {};

markController.createMark = function(mark) {
	var deferred = q.defer();

	markService.createMark(mark).then(function(success) {
		deferred.resolve(success);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

module.exports = markController;