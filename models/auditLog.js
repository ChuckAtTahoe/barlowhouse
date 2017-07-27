var debug = require('debug')('barlowhouse:auditlog')
var dbconn = require('./dbconnect')
var db = dbconn.getDb()

module.exports = {
  insertAuditLog: function(source, action, next) {
    db.collection('auditlog').insertOne({'date': new Date(), 'source': source, 'action': action}, function(err, r){
      if (err) {
        debug('error on audit log insert: ' + err.message)
      } else {
        debug('audit log row inserted successfully')
      }
      return next(err)
    })
  },
  retrieveAllAuditLogs: function(max, next) {
    db.collection('auditlog').find({}).limit(max).sort({'date': -1}).toArray( function(err, result) {
      debug('query retrieved ' + result.length + ' rows from auditlog table')
      return next(err, result)
    })
  }
}
