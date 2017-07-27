var debug = require('debug')('barlowhouse:route:index')
var express = require('express')
var router = express.Router()

var renderMainPage = function(req, res) {
  res.render('index', { 'title': 'The Barlow House' })
}

/* GET home page. */
router.get('/', renderMainPage )

module.exports = router
