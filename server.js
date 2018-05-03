/**
 * Created by AntonioGiordano on 27/05/16.
 */

'use strict'

var IO;
module.exports.init = async (params) => {



    const fs = require('fs')
    const Hapi = require('hapi')
    const HapiSocketIO = require('./hapi-socket-io.js')
    const HapiLog = require('./hapiInternalLog.js')
    const Joi = require('joi')
    const path = require('path')
    const minimist = require('minimist')
    const async = require('async')
    const config = require('./server-config.js')


    const build = async (opts) => {
        console.log(opts)
        var keyPath = ''
        const server = await Hapi.Server({
            port: params.port,
            tls: {
                key: fs.readFileSync(params.key),
                cert: fs.readFileSync(params.cert)
            }
        })


        await server.register(HapiLog)//ok capito
        // HapiSocketIO.
        await server.register({
            plugin: HapiSocketIO,
            options: {
                redisUrl: opts.redisUrl
            }
        })




        return server;
    }

    module.exports = build



    const start = async (opts) => {
        opts.port = params.port //config.port(opts.env)

        const server = await  build(opts)
        await server.start();

        console.log('Server running at:', server.info.uri + ' in ' + opts.env + ' mode')

        return server.plugins['hapi-socket.io'].IO;
    }


    module.exports.start = start





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
    });



    Joi.validate(opts, Joi.object().keys({
        env: Joi.string().valid(['LOCALE', 'STAGE', 'TEST_STAGE', 'PRODUCTION']).required(),
        mediaPath: Joi.string().allow([null, '']).optional()
    }), {
        allowUnknown: true
    })


    const tr = async (opts) => {

        IO = await start(opts)


        return IO;

    }
    IO = await tr(opts)

    return IO


}
