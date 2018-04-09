/**
 * Created by AntonioGiordano on 17/06/16.
 */
const RobotManager = require('./robotManager')
// import RobotManager from './robotManager'
exports.register = (server, options, next) => {
  let IO = require('socket.io')(server.listener)
  const {log} = server.plugins['hapi-log']
    let robotManager = new RobotManager()
    if (robotManager.init() === -1){
        next(new Error('CanBus not connected'))

    }
  IO.on('connection', (socket) => {
    log('SOCKET', 'SUCCESS', 'CLIENT CONNECTED', {
      socketId: socket.id

    })
	//var that = this
    socket.on('cmd', function (data) {
		switch(data.commandId) {
            case 'reset':
                robotManager.reset()
                break

            case 'ctrlLed':
                robotManager.ctrlLed()
                break

            case 'goOn':
                robotManager.leftTrackForward()
                robotManager.rightTrackForward()
                break

            case 'goBack':
                robotManager.leftTrackBackward()
                robotManager.rightTrackBackward()
                break

            case 'goLeft':
                robotManager.rightTrackForward()
                robotManager.leftTrackBackward()
                break

            case 'goRight':
                robotoManager.leftTrackForward()
                robotManager.rightTrackBackward()
                break

            case 'lookUp':
                robotManager.lookUp()
                break

            case 'lookDown':
                robotManager.lookDown()
                break

            case 'lookLeft':
                robotManager.lookLeft()
                break

            case 'lookRight':
                robotManager.lookRight()
                break

            case 'bendForward':
                robotManager.bendForward()
                break

            case 'bendBackward':
                robotManager.bendBackward()
                break

            case 'turnBustLeft':
                robotManager.turnBustLeft()
                break

            case 'turnBustRight':
                robotManager.turnBustRight()
                break

		}
      console.log(data)
    })
      socket.on('stop', function () {
          robotManager.reset()
      })
  })
  const expose = {
    isValidSocketId: (socketId) => (typeof IO.sockets.server.eio.clients[socketId]) !== 'undefined',
    IO: IO
  }

  if (options.decorate) {
    server.decorate('server', 'hapi-socket.io', expose)
    server.decorate('request', 'hapi-socket.io', expose)
  } else {
    Object.keys(expose).forEach((key) => {
      server.expose(key, expose[key])
    })
  }

  next()
}

exports.register.attributes = {
  name: 'hapi-socket.io',
  version: '0.0.1'
}
