

const start=async(params)=>{

    const server=require('./server.js')
    return await server.init({

            key: params.key,
            cert: params.certificate,
            port: params.port
        }
    )

}


module.exports.start=start;