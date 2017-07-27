var config = require('../config')
var MongoClient = require( 'mongodb' ).MongoClient
var _db

module.exports = {
  connectToServer: function( callback ) {
    var url = 'mongodb://' + config.mongodb.hostname +
                       ':' + config.mongodb.port +
                       '/' + config.mongodb.database
    MongoClient.connect( url, function( err, db ) {
      _db = db
      return callback( err )
    } )
  },

  getDb: function() {
    return _db
  }
}
