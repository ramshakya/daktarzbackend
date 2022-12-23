/**
 * Created by Prince on 17/05/18.
 */

const Hapi = require('hapi'),
    path = require('path'),
    Config = require('./Config'),
    Plugins = require('./Plugins'),
    winston = require('winston');
    https = require('https');
    DAO = require('./DAOManager').queries;
    Models = require('./Models/');
    mongoose = require('mongoose');
    cronFile = require('./Utils/cron');
    global.ObjectId = mongoose.Types.ObjectId;


    const CronJob = require('cron').CronJob;
    

const numCPUs = require('os').cpus().length;
// const cluster = require('cluster');

console.log("====numCPUs=======",numCPUs)


if (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'client' && process.env.NODE_ENV !== 'yetoTesting') {
    console.log(
        `Please specify one of the following environments to run your server
            - development
            - production

    Example :NODE_ENV=development pm2 start server.js --log-date-format 'DD-MM HH:mm:ss.SSS' --name="dev"`
    );
    // throw { abc: 'abc' };

    process.env.NODE_ENV ='development'
}
    // if(process.env.NODE_ENV == "production" ){
    //     console.log =  function() {};
    // }

Routes = require('./Routes');
bootstrap = require('./Utils/bootstrap');
//const scheduler = require('./Libs/scheduler');

process.env.NODE_CONFIG_DIR = __dirname + '/Config/';

// const serverOptions = {
//     key: fs.readFileSync('localhosprivkey.key'),
//     cert: fs.readFileSync('localhostcert.crt')
// };
//
// const listener = http2.createServer();
// const listener = http2.createSecureServer(serverOptions);


// Create Server

let server = new Hapi.Server({
    app: {
        name: "daktarz"
    },
    // cache: { engine: require('catbox-memory'), name: 'memory' },
    port:3000,
    routes: {
        cors: true
    }
});


process.on('uncaughtException',(code) => {
    console.log(`About to exit with code: ${code}`);
});


process.on('unhandledRejection',(code) => {
    console.log(`About to exit with code: ${code}`);
});

(async initServer => {

    // Register All Plugins
    
      await server.register(Plugins);
    console.log("=========listener-------==============")


    // API Routes
       await server.route(Routes);
       
//commented by abhishek 
    /*server.events.on('response', request => {
        winston.log("info",`[${request.method.toUpperCase()} ${request.url.path} ]`)
winston.log('info',`[${request.method.toUpperCase()} ${request.url.path} ](${request.response.statusCode || "error null status code"}) : ${request.info.responded-request.info.received} ms`);
    });*/ 
    /*upto this */
    
    // server.ext({
    //     type: 'onRequest',
    //     method: function (request, h) {
    //
    //         // Change all requests to '/test'
    //
    //         console.log("aaaaaaaaaa",(request));
    //         request.setUrl('/');
    //         return h.continue;
    //     }
    // });
    
    // Default Routes
    server.route(
        [{
            method: 'GET',
            path: '/',
            handler: (request, reply)=> {
                return "Welcome"
                
            },
            config: {
                auth: false
            }
        }]
        );
        
        // hapi swagger workaround(but a ugly hack for version 9.0.1)
        server.ext('onRequest', async (request, h) => {
            request.headers['x-forwarded-host'] = (request.headers['x-forwarded-host'] || request.info.host);
            return h.continue;
        });
        
        
        process.on('uncaughtException',(err)=>{
            console.log("==============uncaughtException=================",err)
        });


        process.on('unhandledRejection',(err)=>{
            console.log("==============unhandledRejection=================",err)
        });
        
        
        // Start Server
        try {
            await server.start();
            cronFile.pushCron.start();
            let findAdmin = await DAO.getData(Models.admins,{email:"admin@gmail.com"},{lean:true},{_id:1});
        
        if(!(findAdmin.length)){
            let saveData = [
                {
                    email : "admin@gmail.com",
                    password:"qwerty"
                },
                {
                    email : "admin2@gmail.com",
                    password:"qwerty"
                },
                {
                    email : "admin3@gmail.com",
                    password:"qwerty"
                }

            ]

            findAdmin = await DAO.insertMany(Models.admins,saveData,{multi : true});
        }
        
        winston.log("info",`Server running at ${server.info.uri}`);
    } catch (error) {
        winston.log("info",error);
    }
})();

