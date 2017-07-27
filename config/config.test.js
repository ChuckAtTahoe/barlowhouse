var cfg = require('./config.global')
// place here any override config property values
cfg.http.port = 7301
cfg.mongodb.database = 'bh_test'
module.exports = cfg
