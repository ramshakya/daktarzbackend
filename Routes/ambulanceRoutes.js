var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
  {
    method: "POST",
    path: "/Ambulance/Login",
    options: {
      description: "Ambulance Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.ambulanceLogin(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
         //   winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
           
            phoneNo : Joi.number().required(),
            deviceId : Joi.string().optional(),
            type : Joi.number().valid('0','1')
        },

        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: "PUT",
    path: "/Ambulance/editAmbulance",
    options: {
      description: "Ambulance Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.updateProfile(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            profilePicture : Joi.string().optional(),
            fullName : Joi.string().optional(),
            email : Joi.string().email().optional().allow(''),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().optional(),
            alternateNumber : Joi.number().optional(),
            documents : Joi.array().optional(),
            drivingLicence : Joi.string().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            address : Joi.string().optional(),
            registrationNo : Joi.string().optional(),
            vehicleNo : Joi.string().optional(),
            association : Joi.string().optional(),
            registrationImage : Joi.array().optional(),
            type : Joi.string().optional(),
            password : Joi.string().optional(),
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

    //OTP VERIFICATION
  {
    method: "POST",
    path: "/Ambulance/OtpVerification",
    options: {
      description: "OTP Verification API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.otpVerify(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
         //   winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          phoneNo: Joi.number().required(),
          otp: Joi.string().required()
        },
        // headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
        //OTP Resend
  {
    method: "POST",
    path: "/Ambulance/otpResend",
    options: {
      description: "OTP Resend API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.otpResend(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
          //  winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          phoneNo: Joi.number().required()
        },
        // headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

    {
    method: "GET",
    path: "/Ambulance/listAmbulance",
    options: {
      description: "List Ambulance  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.listAmbulance(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
          //  winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
         //   _id :  Joi.string().optional(),
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

  {
    method: "GET",
    path: "/Ambulance/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.listHospitals(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
         //   winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
            _id :  Joi.string().optional(),
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: "POST",
    path: "/Ambulance/dutyStatus",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.dutyStatus(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
          //  winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            status :  Joi.string().required().description("FREE,OFFDUTY"),
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: "POST",
    path: "/Ambulance/getBookings",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.getBookings(request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
          //  winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: "POST",
    path: "/Ambulance/updateLocation",
    options: {
      description: "update ambulace location",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.updateLocation(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          lat :  Joi.string().required(),
          lng:Joi.string().required(),
      },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: "POST",
    path: "/Ambulance/statusUpdate",
    options: {
      description: "update ambulace location",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.statusUpdate(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
        //    winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          bookingId:Joi.string().required(),
          status :  Joi.string().required().valid('START','REACHED','REACHED_HOSPITAL','COMPLETE'),
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method: "POST",
    path: "/Ambulance/accessTokenLogin",
    options: {
      description: "update ambulace location",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.accessTokenLogin(request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
          //  winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

  {
    method: "POST",
    path: "/Ambulance/passwordLogin",
    options: {
      description: "Login With Password API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.passwordLogin(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          phoneNo : Joi.number().required(),
          password : Joi.string().required(),
          deviceId : Joi.string().optional(),
        },
      //  headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

  {
    method: "PUT",
    path: "/Ambulance/changePassword",
    options: {
      description: "change Password API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.changePassword(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
        //    winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          password : Joi.string().required(),
          newPassword : Joi.string().required()
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

  {
    method: "PUT",
    path: "/Ambulance/setPassword",
    options: {
      description: "Set Password API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.setPassword(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          password : Joi.string().required()
        },
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },


  {
    method: "PUT",
    path: "/Ambulance/logout",
    options: {
      description: "logout",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.AMBULANCE] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.logout(request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        headers: UniversalFunctions.authorizationHeaderObj,
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },

  {
    method: "POST",
    path: "/Ambulance/forgotPassword",
    options: {
      description: "forgot password",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.ambulanceController.forgotPassword(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          countryCode : Joi.string().required(),
          phoneNo: Joi.number().required(),
        },
        failAction: UniversalFunctions.failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },



];
