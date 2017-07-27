module.exports = {
  environment: {
    name: 'null',
    appDir: 'null'
  },
  http: {
    hostname: 'localhost',
    port: 7300
  },
  logs: {
    accessLogPath: '/var/log/node/access.log'
  },
  mongodb: {
    hostname: 'localhost',
    port: 27017,
    database: 'barlowhouse'
  },
  postgres: {
    dbPool: {
      user: 'bh_dev',
      password: 'my_secret',
      host: 'localhost',
      port: 5432,
      database: 'bh_dev',
      max: 10, 
      idleTimeoutMillis: 1000
    }
  }
}
