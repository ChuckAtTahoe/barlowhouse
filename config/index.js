// load the desired environment configuration from a file, such as:
//     config.development.js
//     config.test.js
//     config.staging.js
//     config.production.js
var debug = require('debug')('barlowhouse:config')

// This obtains the base (root) directory for the app,
// assumed to be one directory level up from this one
var path = require('path')
var appDir = path.dirname(path.join(module.filename, '..'))

var env = process.env.NODE_ENV || 'development'
var cfg = require('./config.' + env)
cfg.environment.name = env
cfg.environment.appDir = appDir
cfg.logs.accessLogPath = appDir + '/logs/access.log'

// CAUTION: This is the set of data being read into the config object
//          that includes security credentials / passwords!
cfg.credentials = require('./credentials/credentials.' + env)

debug('environment configuration loaded for env --> ' + env)
// CAUTION: Be careful about un-commenting this line and thus printing
//          the full configuration data into the debug log; it may
//          contain security credentials in clear text!
// debug('cfg: %j', cfg)

module.exports = cfg
