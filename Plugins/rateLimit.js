/**
 * Created by harsh on 26/10/18.
 */


exports.plugin = {
    name: 'limit-rate-plugin',

    register: async (server) => {
        let limitRate = {
            plugin: require('hapi-rate-limit'),
            options: {
                userLimit:300,
                pathLimit:30,
                pathCache:{
                    segment:"hapi-rate-limit-path",
                    expiresIn:60000
                }
            }
        };
        await server.register(
            limitRate
        );
        winston.info('limit Rate Loaded');
    }
};
