/**
 * Created by AntonioGiordano on 17/06/16.
 */


  exports.plugin ={
    register : (server,options)=>{
        let IO = require('socket.io')(server.listener)

        const expose = {
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
    },
      name : 'hapi-socket.io',
      version : '0.0.1'
  }

