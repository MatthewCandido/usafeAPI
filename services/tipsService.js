var mysql = require("mysql");
var q = require('q');
var nconf = require('nconf');
var logger = require('winston');

var tipsService = {};
var con;

function finishDbConnection() {
  con.end(function(err) {
    logger.error(err);
  });
}

tipsService.createTips = function(tips) {
	var deferred = q.defer();

	if (tips.hasOwnProperty('tip_id')     &&
		  tips.hasOwnProperty('user_id')    &&
		  tips.hasOwnProperty('tip_desc')   &&
		  tips.hasOwnProperty('country_id') &&
		  tips.hasOwnProperty('city_id')) {

		con = mysql.createConnection({host: 'mysql.usafe.kinghost.net',
                                      user: 'usafe',
                                      password: 'farmusafe123',
                                      database: 'usafe'});

	    con.connect(function(err){

	      if(err){
	        logger.error('Error connecting to Db ' + err);
	        deferred.reject({'customError' : err});
	      }
	      
          var tipsObj = { 
          				tip_id		: tips.tip_id, 
          				user_id			: tips.user_id, 
          				tip_desc 		: tips.tip_desc, 
          				country_id		: tips.country_id, 
          				city_id		: tips.city_id, 
          			};

          con.query('INSERT INTO tips SET ?', tipsObj, function(err,res){
            if(err) {
              finishDbConnection();
              logger.error('Error while inserting to Db' + err);
              deferred.reject({'customError' : err});
            } else {
              finishDbConnection();
              deferred.resolve({'message' : 'success'});
            }

          });

        });

	} else {
		deferred.reject({"customError" : 'Invalid request body'});
	}

	return deferred.promise; 
};

module.exports = tipsService;

