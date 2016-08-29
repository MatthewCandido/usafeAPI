var mysql = require("mysql");
var q = require('q');
var nconf = require('nconf');
var logger = require('winston');

var userService = {};
var con;

function finishDbConnection() {
  con.end(function(err) {
    logger.error(err);
  });
}

userService.signUp = function(user) {
  var deferred = q.defer();

  if (user.hasOwnProperty("email") &&
      user.hasOwnProperty("password") &&
      user.hasOwnProperty("access_type") &&
      user.hasOwnProperty("nickname") &&
      user.hasOwnProperty("gender") &&
      user.hasOwnProperty("outside_origin")) {

    con = mysql.createConnection({host: 'mysql.usafe.kinghost.net',
                                      user: 'usafe',
                                      password: 'farmusafe123',
                                      database: 'usafe'});

    con.connect(function(err){
      if(err){
        logger.error('Error connecting to Db' + err);
        deferred.reject({'customError' : err});
        return;
      }

      logger.info(user);

      if (user.outside_origin == 0) {
        var access = { email: user.email, password: user.password, access_type : user.access_type, access_active : 1, outside_origin : user.outside_origin };
      } else {
        var access = { email: user.email, password: null, access_type : user.access_type, access_active : 1, outside_origin : user.outside_origin };
      } 

      con.query('INSERT INTO access SET ?', access, function(err,res){
        if(err) {
          logger.error('Error while inserting to Db' + err);
          deferred.reject({'customError' : err});
        } else {
          var userObj = { access_id: res.insertId, nickname: user.nickname, gender : user.gender };

          con.query('INSERT INTO user SET ?', userObj, function(err,res){
            if(err) {
              finishDbConnection();
              logger.error('Error while inserting to Db' + err);
              deferred.reject({'customError' : err});
            } else {

              con.query("SELECT * FROM access a INNER JOIN user u ON a.access_id = u.access_id WHERE email='" + user.email + "'" ,function(err,rows){
                if(err){
                  finishDbConnection();
                  logger.error('Error connecting to Db ' + err);
                  deferred.reject({'customError' : err}); 
                } else {
                  if (rows.length > 0) {
                    finishDbConnection();
                    deferred.resolve({'message' : 'success', 'data' : rows[0]});
                  } else {
                    finishDbConnection();
                    deferred.resolve({'message' : 'failed'});
                  } 
                }
                
              });
            }

          });
        }

      });
    });

  } else {
    deferred.reject({"customError" : 'Invalid request body'});
  }
  
  return deferred.promise;
};

userService.signIn = function(user) {
  var deferred = q.defer();

  if (user.hasOwnProperty("email")) {
      
    if (user.hasOwnProperty("password")) {
      con = mysql.createConnection({host: 'mysql.usafe.kinghost.net',
                                      user: 'usafe',
                                      password: 'farmusafe123',
                                      database: 'usafe'});

      con.connect(function(err){
        if(err){
          logger.error('Error connecting to Db ' + err);
          deferred.reject({'customError' : err});
        }

        con.query("SELECT * FROM access a INNER JOIN user u ON a.access_id = u.access_id WHERE email='" + user.email + "' AND password='" + user.password + "'" ,function(err,rows){
          if(err){
            finishDbConnection();
            logger.error('Error connecting to Db ' + err);
            deferred.reject({'customError' : err}); 
          } else {
            if (rows.length > 0) {
              finishDbConnection();
              deferred.resolve({'message' : 'success', 'data' : rows[0]});
            } else {
              finishDbConnection();
              deferred.resolve({'message' : 'failed'});
            } 
          }
          
        });

      });
    } else {
      con = mysql.createConnection({host: 'mysql.usafe.kinghost.net',
                                      user: 'usafe',
                                      password: 'farmusafe123',
                                      database: 'usafe'});

      con.connect(function(err){
        if(err){
          logger.error('Error connecting to Db ' + err);
          deferred.reject({'customError' : err});
        }

        con.query("SELECT * FROM access a INNER JOIN user u ON a.access_id = u.access_id WHERE email='" + user.email + "'" ,function(err,rows){
          if(err){
            finishDbConnection();
            logger.error('Error connecting to Db ' + err);
            deferred.reject({'customError' : err}); 
          } else {
            if (rows.length > 0) {
              finishDbConnection();
              deferred.resolve({'message' : 'success', 'data' : rows[0]});
            } else {
              finishDbConnection();
              deferred.resolve({'message' : 'failed'});
            } 
          }
          
        });

      });
    }

  } else {
    deferred.reject({"customError" : 'Invalid request body'});
  }

  return deferred.promise;  
};

module.exports = userService;