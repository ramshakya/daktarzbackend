var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
    {
            method: 'POST',
            path: '/Upload/images',
            options: {
                description: 'settings',
                auth: false,
                payload: {
                    maxBytes: 2000000000000000,
                    parse: true,
                    output: 'file',
                    allow: 'multipart/form-data'
                },
                tags: ['api'],
                handler: async (request, reply) => {
                    return await Controller.commonController.imageUpload(request.payload)
                        .then(response => {
                            console.log(".......response.......",response);
                            let data = {}
                            data.original = response[0].finalUrl;
                            data.thumb = response[0].finalUrl;
                            
                            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, data, reply);
                        })
                        .catch(error => {
                            winston.error("=====error=" +
                                "============", error);
                            return UniversalFunctions.sendError("en", error, reply);
                        });
                },
                validate: {
                    
                    payload: {
                        file:   Joi.any()
                                    .meta({ swaggerType: 'file' })
                                    .required()
                                    .description('File upload')
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
                }
            }
        },



      {
            method: 'POST',
            path: '/Upload/pdfUpload',
            options: {
                description: 'settings',
                auth: false,
                payload: {
                    maxBytes: 2000000000000000,
                    parse: true,
                    output: 'file',
                    allow: 'multipart/form-data'
                },
                tags: ['api'],
                handler: async (request, reply) => {
                    return await Controller.commonController.pdfUpload(request.payload)
                        .then(response => {
                            console.log(".......response.......",response);
                            let data = {}
                            data.original = response;
                            
                            
                            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, data, reply);
                        })
                        .catch(error => {
                            winston.error("=====error=" +
                                "============", error);
                            return UniversalFunctions.sendError("en", error, reply);
                        });
                },
                validate: {
                    
                    payload: {
                        file:   Joi.any()
                                    .meta({ swaggerType: 'file' })
                                    .required()
                                    .description('File upload')
                    },
                    failAction: UniversalFunctions.failActionFunction
                },
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form',
                        responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
                }
            }
        },




];
