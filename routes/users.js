var debug = require('debug')('barlowhouse:users')
var express = require('express')
var router = express.Router()
var userdb = require('../models/user')

/* GET users listing */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

/* GET new user form */
router.get('/new', function(req, res, next) {
  res.render('userForm', { 'title': 'Barlow House New User Account Form' })
})

/* PUT new user account */
router.put('/', function(req, res, next) {
  let newRow = {}
  let problems = {}
  let fieldList = ['username', 'password', 'req_pw_change', 'nicename', 'first_name', 'middle_name', 'last_name', 'display_name', 'email', 'verified']
  let requiredFieldList = ['username', 'password', 'first_name', 'last_name', 'email']
  for (let fieldName of fieldList) {
    if (req.body[fieldName] && req.body[fieldName].trim().length > 0) {
      newRow[fieldName] = req.body[fieldName].trim()
    } else {
      newRow[fieldName] = null
      if (requiredFieldList.indexOf(fieldName) >= 0) {
        problems[fieldName] = 'Missing required field'
      }
    }
  }
  if (!problems.password) {
    if (/^[a-zA-Z0-9!@#$%^&]{6,64}$/.test(newRow.password)) {
      if (newRow.password !== req.body.confirm_password) {
        problems.confirm_password = 'Confirm password does not match the password entered above'
      }
    } else {
      problems.password = 'Invalid password suggested: must be 6 to 64 characters and use only letters, numbers, or the following special characters ! @ # $ % ^ &'
    }
  }
  if (!problems && newRow.display_name === null) {
    newRow.display_name = newRow.first_name + ' ' + newRow.last_name
  }
  /* Check for duplicate names already present in the user database */
  async.parallel([
    function(callback) {
      if (problems.username) {
        return callback(null, false)
      }
      userdb.isDuplicate(newRow.username, function (err, isDuplicate, duplicateUserId) {
        if (err) {
          return callback(err)
        }
        if (isDuplicate) {
          problems.username = 'The username is already in use by user ID ' + duplicateUserId
        }
        return callback(null, isDuplicate)
      })
    },
    function(callback) {
      if (problems.nicename || newRow.nicename.length == 0) {
        return callback(null, false)
      }
      userdb.isDuplicate(newRow.nicename, function (err, isDuplicate, duplicateUserId) {
        if (err) {
          return callback(err)
        }
        if (isDuplicate) {
          problems.nicename = 'The nicename is already in use by user ID ' + duplicateUserId
        }
        return callback(null, isDuplicate)
      })
    },
    function(callback) {
      if (problems.email) {
        return callback(null, false)
      }
      userdb.isDuplicate(newRow.email, function (err, isDuplicate, duplicateUserId) {
        if (err) {
          return callback(err)
        }
        if (isDuplicate) {
          problems.email = 'The email is already in use by user ID ' + duplicateUserId
        }
        return callback(null, isDuplicate)
      })
    }
  ],
  function(err, results) {
    if (problems) {
      res.render('userForm', { 'title': 'Barlow House New User Account Form', 'errors': problems, 'values': req.body })
      return
    }
    userdb.insertUser(newRow, function(err, user_id) {
      if (err) {
        return next(err)
      }
      /* generate & save random registration key for user validation email, unless the verified flag was set */
      /* send validation email with reg key, unless the verified flag was set */
      /* send login details email if requested by 'sendnote' checkbox */
      res.redirect('/users')
    })
  })
})

/* POST updated user account */
router.post('/', function(req, res, next) {
})

/* DELETE user account */
router.delete('/', function(req, res, next) {
})

module.exports = router
