/**
 * Created by Prince
 */
var TokenManager = require('../Libs/tokenManager');

var Config = require('../Config');

exports.plugin = {
    name: 'auth',
    register: async (server, options) => {
        await server.register(require('hapi-auth-jwt2'));

       server.auth.strategy(Config.APP_CONSTANTS.SCOPE.ADMIN, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_ADMIN,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });
     
        server.auth.strategy(Config.APP_CONSTANTS.SCOPE.USER, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_USER,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });

        server.auth.strategy(Config.APP_CONSTANTS.SCOPE.AMBULANCE, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_AMBULANCE,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });

        server.auth.strategy(Config.APP_CONSTANTS.SCOPE.HOSPITAL, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_HOSPITAL,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });

       server.auth.strategy(Config.APP_CONSTANTS.SCOPE.DOCTOR, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_DOCTOR,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });
        
        server.auth.strategy(Config.APP_CONSTANTS.SCOPE.PHARMECY, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_PHARMECY,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });

        server.auth.strategy(Config.APP_CONSTANTS.SCOPE.LABS, 'jwt',
            { key: Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_LABS,          // Never Share your secret key
                validate: TokenManager.verifyToken, // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ],ignoreExpiration:false } // pick a strong algorithm
            });

        server.auth.default(Config.APP_CONSTANTS.SCOPE.ADMIN);
    }
};
