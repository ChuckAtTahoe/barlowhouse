var cfg = require('./config.global')
// place here any override config property values
cfg.http.port = 7310
cfg.mongodb.database = 'bh_prod'
module.exports = cfg
