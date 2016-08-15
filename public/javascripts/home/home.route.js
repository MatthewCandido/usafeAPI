(function() {
	'use strict';

	angular.module('bloodHeroes.home')

	.config(function($routeProvider) {
		
		// configure our routes
	    
        $routeProvider

            // route for the home page
            .when('/', {
	            templateUrl: 'javascripts/home/home.html',
				controller: 'HomeController as HomeCtrl'
            })

	           
	    
	});

})();