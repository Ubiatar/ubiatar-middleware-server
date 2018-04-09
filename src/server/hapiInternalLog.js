/**
 * Created by AntonioGiordano on 17/06/16.
 */

const moment = require('moment')

const log = (realm, result, message, params) => {
  switch (process.env.NODE_ENV) {
    default:
      console.log(`${moment().format('HH:mm:ss.SSS')} | ${realm} | ${result} - ${message}: ${params ? JSON.stringify(params) : ''}`)
      break
  }
}

exports.register = (server, options, next) => {
  const expose = {
    log: log
  }

  console.log('1')

  if (options.decorate) {
    server.decorate('server', 'hapi-log', expose)
    server.decorate('request', 'hapi-log', expose)
  } else {
    Object.keys(expose).forEach((key) => {
      server.expose(key, expose[key])
    })
  }

  next()
}

exports.register.attributes = {
  name: 'hapi-log',
  version: '0.0.1'
}
