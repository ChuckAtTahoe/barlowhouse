/**
 * Module dependencies.
 */
var config = require('../config')
var app = require('../app')
var debug = require('debug')('barlowhouse:server')
var http = require('http')

/**
 * Get port & hostname from environment or local config, and store in Express.
 */
var port = normalizePort(process.env.PORT || config.http.port || '3000')
var hostname = normalizePort(process.env.HOST || config.http.hostname || '0.0.0.0')
app.set('port', port)
app.set('hostname', hostname)

/**
 * Create HTTP server.
 */
var server = http.createServer(app)

/**
 * Listen on provided port and host interface
 */
server.listen(port, hostname)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
  debug('Process id ' + process.pid)
}

function cleanup(next) {
  server.close(function() {
    app.cleanup()
    return next()
  })
}

process.on('exit', function() {
  debug('received exit signal, terminating the server process')
  cleanup(function() {
    process.exit(0)
  })
})
process.on('SIGTERM', function() {
  debug('received SIGTERM signal, terminating the server process')
  cleanup(function() {
    process.kill(process.pid, 'SIGTERM')
  })
})
process.on('SIGINT', function() {
  debug('received SIGINT signal, terminating the server process')
  cleanup(function() {
    process.kill(process.pid, 'SIGINT')
  })
})
// SIGUSR2 kill signal is sent by nodemon to restart the app after a source change is detected
process.on('SIGUSR2', function() {
  debug('received SIGUSR2 signal, terminating the server process')
  cleanup(function() {
    process.kill(process.pid, 'SIGUSR2')
  })
})
