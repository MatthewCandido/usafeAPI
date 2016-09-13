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

  var country_id, city_id;

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
	      } else {
          verifyCountry(mark.country).then(function(res) {
            if (res.success) {
              country_id = res.country_id;

              verifyCity(mark.city).then(function(res) {
                if (res.success) {
                  city_id = res.city_id;
                  
                  if ()
                } else {
                  insertCity(mark.city).then(function(res) { 
                    city_id = res.insertId;
                    insertMark(mark);

                  }, function(res) {
                    deferred.reject(res);
                  });
                }
              }, function(res) {
                deferred.reject(res);
              });

            } else {
              insertCountry(country).then(function(res){
                country_id = res.insertId;

                verifyCity(mark.city).then(function(res) {
                  if (res.success) {
                    city_id = res.city_id;
                    
                    if ()
                  } else {
                    insertCity(mark.city).then(function(res) { 
                      city_id = res.insertId;
                      insertMark(mark);

                    }, function(res) {
                      deferred.reject(res);
                    });
                  }
                }, function(res) {
                  deferred.reject(res);
                });

              }, function(res) {
                deferred.reject(res);
              });
            }
          }, function(res) {
            deferred.reject(res);
          })
        }

      });
        

	} else {
		deferred.reject({"customError" : 'Invalid request body'});
	}

	return deferred.promise;
};

function verifyCountry(country_desc) {
  var deferred = q.defer();

  con.query("SELECT * FROM country WHERE country_desc='" + country_desc + "'" ,function(err,rows){
    if(err){
      finishDbConnection();
      logger.error('Error connecting to Db ' + err);
      deferred.reject({'success' : false, 'customError' : err}); 
    } else {
      if (rows.length > 0) {
        deferred.resolve({'success' : true, 'country_id' : rows[0].country_id});
      } else {
        deferred.resolve({'success' : false, 'customError' : 'Country does not exists'});
      } 
    }
  });

  return deferred.promise;
}

function verifyCity(city) {
  var deferred = q.defer();

  con.query("SELECT * FROM city WHERE city_desc='" + country_desc + "'" ,function(err,rows){
    if(err){
      finishDbConnection();
      logger.error('Error connecting to Db ' + err);
      deferred.reject({'success' : false, 'customError' : err}); 
    } else {
      if (rows.length > 0) {
        deferred.resolve({'success' : true, 'city_id' : rows[0].city_id});
      } else {
        deferred.resolve({'success' : false, 'customError' : 'Country does not exists'});
      } 
    }
  });

  return deferred.promise;
}

function insertCountry(country_desc) {
  var deferred = q.defer();

  var countryObj = {'country_desc' : country_desc};

  con.query('INSERT INTO country SET ?', countryObj, function(err,res){
    if(err) {
      finishDbConnection();
      logger.error('Error while inserting to Db ' + err);
      deferred.reject({'success' : false,'customError' : err});
    } else {
      deferred.resolve({'success' : true, 'insertId' : res.insertId})
    }

  });

  return deferred.promise;
}

function insertCity(country_desc) {
  var deferred = q.defer();

  var countryObj = {'country_desc' : country_desc};

  con.query('INSERT INTO country SET ?', countryObj, function(err,res){
    if(err) {
      finishDbConnection();
      logger.error('Error while inserting to Db ' + err);
      deferred.reject({'success' : false,'customError' : err});
    } else {
      deferred.resolve({'success' : true, 'insertId' : res.insertId})
    }

  });

  return deferred.promise;
}

function insertMark(mark) {
  var deferred = q.defer();
  var address_id;

  var markObj = { 
          user_id       : mark.user_id, 
          weapon_id     : mark.weapon_id, 
          vehicle_id    : mark.vehicle_id, 
          suspect_id    : mark.suspect_id, 
          crime_id      : mark.crime_id,
          aggression_id : mark.aggression_id,
          mark_date     : mark.mark_date,
          mark_time     : mark.mark_time,
          victim_gender : mark.victim_gender,
          crime_desc    : mark.crime_desc,
          mark_location : mark.mark_location
          };                                  

  var addressObj = {'address_desc' : mark.address_desc, 'district' : mark.district, 'zip_code' : mark.zip_code, 'city' : city_id, 'country' : country_id};
  
  con.query('INSERT INTO address SET ?', addressObj, function(err,res){
    if(err) {
      finishDbConnection();
      logger.error('Error while inserting to Db' + err);
      deferred.reject({'customError' : err});
    } else {
      address_id = res.insertId;

      markObj.address_id = address_id;

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
    }

  });

  return deferred.promise;
}

module.exports = markService;

