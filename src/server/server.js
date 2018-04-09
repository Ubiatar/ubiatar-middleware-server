/**
 * Created by AntonioGiordano on 27/05/16.
 */

'use strict'

const fs = require('fs')
const Hapi = require('hapi')
const HapiSocketIO = require('./hapi-socket-io.js')
const HapiLog = require('./hapiInternalLog.js')
const Joi = require('joi')
const path = require('path')
const minimist = require('minimist')
const async = require('async')
const config = require('./server-config.js')

const noop = (err) => {
  if (err) throw err
}

const handleError = (err) => {
  if (err) {
    console.log(err)
    throw err
  }
}

const build = (opts, cb) => {
  console.log(opts)
  const server = new Hapi.Server()
  cb = cb || noop
  var keyPath = ''
  process.env.NODE_ENV = opts.env
  if (opts.env !== 'PRODUCTION') {
    keyPath = path.join(__dirname, '../', '../', 'protected/', 'keys', opts.env, '/')
    server.connection({
      port: opts.port,
      tls: {
        key: fs.readFileSync(keyPath + 'privkey.pem'),
        cert: fs.readFileSync(keyPath + 'fullchain.pem')
      }
    })
  }

  async.series([
    (cb) => {
      // Hapi Socket IO plugin
      server.register(HapiLog, (err) => {
        console.log('HapiLog loaded')
        cb(err, 'log')
      })
    },
    (cb) => {
      // Hapi Socket IO plugin
      server.register({
        register: HapiSocketIO,
        options: {
          redisUrl: opts.redisUrl
        }
      }, (err) => {
        console.log('Socket.io loaded')
        cb(err, 'socket.io')
      })
    }
  ], (err) => {
    if (err) return handleError(err)

    cb(null, server)
  })

  return server
}

module.exports = build

const start = (opts, cb) => {
  opts.port = config.port(opts.env)
  build(opts, (err, server) => {
    if (err) return cb(err)
    server.start((err) => {
      cb(err, server)
    })
  })
}

module.exports.start = start

if (require.main === module) {
  var opts = minimist(process.argv.slice(2), {
    integer: ['port'],
    alias: {
      port: 'p',
      env: 'e',
      mediaPath: 'm'
    },
    default: {
      port: config.serverDefaultPort
    }
  })
  Joi.validate(opts, Joi.object().keys({
    env: Joi.string().valid(['LOCALE', 'STAGE', 'TEST_STAGE', 'PRODUCTION']).required(),
    mediaPath: Joi.string().allow([null, '']).optional()
  }), {
    allowUnknown: true
  }, (err, opts) => {
    if (err) throw err
    start((opts), (err, server) => {
      handleError(err)

      console.log('Server running at:', server.info.uri + ' in ' + opts.env + ' mode')
    })
  })
} else {
  console.log('Running in test mode')
}
