var debug = require('debug')('barlowhouse:user');
var dbconn = require('./dbconnect');
var db = dbconn.getDb();

module.exports = {
  insertUser: function(newUser, next) {
    // TO DO: first check for duplicate row
    var rowObject = {
      'email': newUser.email,
      'firstName': newUser.firstName,
      'lastName': newUser.lastName,
      'displayName': newUser.displayName,
      'userGroup': 'guest',
      'insertDate': new Date()
    }
    db.collection('user').insertOne(rowObject, function(err, r){
      if (err) {
        debug('error on user insert: ' + err.message);
      } else {
        debug('user row inserted successfully');
      }
      return next(err);
    });
  },
  retrieveAllUsers: function(next) {
    db.collection('user').find({}).limit(max).sort({'lastName': 1, 'firstName': 1}).toArray( function(err, result) {
      debug('query retrieved ' + result.length + ' rows from user table');
      return next(err, result);
    });
  }
};
