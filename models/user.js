var debug = require('debug')('barlowhouse:user')
var dbpg = require('./dbpg')

module.exports = {
  /**
   * insertUser()
   *
   * This function requires an object passed as first arg,
   * which is the new user object containing these properties:
   *   username
   *   password
   *   req_pw_change
   *   nicename
   *   first_name
   *   middle_name
   *   last_name
   *   display_name
   *   email
   *   verified
   */
  insertUser: function(newUser, next) {
    var columnNames = ''
    var columnTags = ''
    var ct = ''
    var valueArray = []
    var colNumber = 0
    for (var colName in newUser) {
      if (newUser.hasOwnProperty(colName)) {
        if (colNumber > 0) {
          columnNames += ', '
          columnTags += ', '
        }
        valueArray[colNumber] = newUser[colName]
        colNumber++
        ct = '$' + colNumber
        columnNames += colName
        if (colName == 'password') {
          columnTags += 'crypt(' + ct + ', gen_salt(\'bf\', 10))'
        } else {
          columnTags += ct
        }
      }
    }
    var sqlInsert = 'INSERT INTO bh_user (' + columnNames + ')'
                  + ' VALUES (' + columnTags + ')'
                  + ' RETURNING id'
    // get a connection from the db connection pool
    var pool = dbpg.getPool()
    pool.connect((err, client, done) => {
      if (err) {
        debug('error retrieving a db connection from the pool: ' + err.message)
        return next(err)
      }
      var query = client.query(sqlInsert, valueArray, function(err) {
        // According to experimentation, *THIS* callback is invoked pretty much
        // on every query, but it is only useful if there is an error. This
        // callback does not receive the result after a successful query.
        // Unless there *is* an error, then do not call next(). This will
        // instead be done by the query.on('end') event handler below.
        if (err) {
          debug('error on user row insert: ' + err.message)
          done(err)
          return next(err)
        }
      })
      query.on('end', function(res) {
        // According to documentation, *THIS* event callback is only invoked
        // if the query successfully completes with no error.
        debug(res.rowCount + ' user row(s) inserted successfully, user id is ' + res.rows[0].id)
        done()
        return next(null, res.rows[0].id)
      })
    })
  },
  isDuplicateUser: function(aField, next) {
    var sql = 'SELECT id FROM bh_user WHERE (username = $1 OR nicename = $1 OR email = $1)'
    var pool = dbpg.getPool()
    pool.query(sql, [ aField ], function(err, result) {
      if (err) {
        return next(err)
      }
      if (result.rowCount > 0) {
        return next(null, true, result.rows[0].id)
      }
    })
    return next(null, false)
  }
}
