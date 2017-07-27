var debug = require('debug')('barlowhouse:dbpg')
var config = require('../config')
var Pool = require('pg').Pool
var _dbPool
if (typeof(_dbPool) === 'undefined') {
  config.postgres.dbPool.user = config.credentials.postgresql.username
  config.postgres.dbPool.password = config.credentials.postgresql.password
  _dbPool = new Pool(config.postgres.dbPool)
  debug('Database connection pool has been created')
}

module.exports = {
  getPool: function() {
    return _dbPool
  },
  query: function(sql, values) {
    debug('query: ', sql, values)
    return _dbPool.query(sql, values)
  }
}
