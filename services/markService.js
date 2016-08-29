var mysql = require("mysql");
var q = require('q');
var nconf = require('nconf');
var logger = require('winston');

var markService = {};
var con;

function finishDbConnection() {
  con.end(function(err) {
    logger.error(err);
  });
}

markService.createMark = function(mark) {
	var deferred = q.defer();

	if (mark.hasOwnProperty('address_id') &&
		mark.hasOwnProperty('user_id') &&
		mark.hasOwnProperty('weapon_id') &&
		mark.hasOwnProperty('vehicle_id') &&
		mark.hasOwnProperty('suspect_id') &&
		mark.hasOwnProperty('crime_id') &&
		mark.hasOwnProperty('aggression_id') &&
		mark.hasOwnProperty('mark_date') &&
		mark.hasOwnProperty('mark_time') &&
		mark.hasOwnProperty('victim_gender') &&
		mark.hasOwnProperty('crime_desc') &&
		mark.hasOwnProperty('mark_location') &&
		mark.hasOwnProperty('address_desc') &&
		mark.hasOwnProperty('district') &&
		mark.hasOwnProperty('zip_code') &&
		mark.hasOwnProperty('city') &&
		mark.hasOwnProperty('country')) {

		con = mysql.createConnection({host: 'mysql.usafe.kinghost.net',
                                      user: 'usafe',
                                      password: 'farmusafe123',
                                      database: 'usafe'});

	    con.connect(function(err){

	      if(err){
	        logger.error('Error connecting to Db ' + err);
	        deferred.reject({'customError' : err});
	      }
	      
          var markObj = { 
          				address_id		: mark.address_id, 
          				user_id			: mark.user_id, 
          				weapon_id 		: mark.weapon_id, 
          				vehicle_id		: mark.vehicle_id, 
          				suspect_id		: mark.suspect_id, 
          				crime_id 		: mark.crime_id,
          				aggression_id 	: mark.aggression_id,
          				mark_date 		: mark.mark_date,
          				mark_time 		: mark.mark_time,
          				victim_gender 	: mark.victim_gender,
          				crime_desc 		: mark.crime_desc,
          				mark_location 	: mark.mark_location
          				};

          var addressObj = {'address_desc' : mark.address_desc, 'district' : mark.district, 'zip_code' : mark.zip_code, 'city' : mark.city, 'country' : mark.country};
          
          con.query('INSERT INTO address SET ?', addressObj, function(err,res){
            if(err) {
              finishDbConnection();
              logger.error('Error while inserting to Db' + err);
              deferred.reject({'customError' : err});
            } else {
              finishDbConnection();
              deferred.resolve({'message' : 'success'});
            }

          });

          con.query('INSERT INTO mark SET ?', markObj, function(err,res){
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

module.exports = markService;

