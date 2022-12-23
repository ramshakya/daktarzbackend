var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
  {
    method: "POST",
    path: "/Pharmecy/Login",
    options: {
      description: "Pharmecy Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.pharmecyLogin(request.payload)
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
            phoneNo : Joi.number().required()
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
    path: "/Pharmecy/editPharmecy",
    options: {
      description: "Pharmecy Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.updateProfile(request.payload, request.auth.credentials)
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
          name : Joi.string().optional(),
          countryCode : Joi.string().optional(),
          phoneNo : Joi.number().optional(),
          alternateNumber : Joi.number().optional(),
          lat : Joi.number().required(),
          lng : Joi.number().required(),
          city : Joi.string().required(),
          address : Joi.string().optional(),
          images : Joi.array().optional(),
          registrationNo : Joi.string().optional(),
          about : Joi.string().optional(),
          discount:Joi.number().optional(),
          email : Joi.string().email().optional().allow(''),
          awards : Joi.array().optional().allow(''),
          membership : Joi.array().optional().allow(''),
          regImage :  Joi.string().optional().allow(''),
          password : Joi.string().optional()
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
    path: "/Pharmecy/OtpVerification",
    options: {
      description: "OTP Verification API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.otpVerify(request.payload)
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
    path: "/Pharmecy/otpResend",
    options: {
      description: "OTP Resend API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.otpResend(request.payload)
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
    path: "/Pharmecy/listPharmecy",
    options: {
      description: "List Pharmecy  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.listPharmecy(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
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
    path: "/Pharmecy/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.listHospitals(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
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
    path: "/Pharmecy/accessTokenLogin",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.accessTokenLogin(request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
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
    path: "/Pharmecy/addEditTiming",
    options: {
      description: "List Pharmecy  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.pharmecyTiming(request.payload,request.auth.credentials)
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
            timing :  Joi.array().optional(),
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
    path: "/Pharmecy/listTiming",
    options: {
      description: "List Pharmecy  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.listPharmecyTiming(request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
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
    method: "GET",
    path: "/Pharmecy/listBookings",
    options: {
      description: "List Bookings Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.listBookings(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {

          date : Joi.string().optional().description("DD-MM-YYYY"),
          phoneNo : Joi.number().optional()
          
         /* status : Joi.string().valid(
                    Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING,
                   // Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE,
                   // Config.APP_CONSTANTS.PHARMECY_STATUS.SHIPPED,
                    Config.APP_CONSTANTS.LAB_STATUS.COMPLETE
                   ).optional(),
          startDate : Joi.string().optional(),
          endDate : Joi.string().optional()*/
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
    path: "/Pharmecy/bookingStatusUpdate",
    options: {
      description: "Booking Status Update API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.bookingStatusUpdate(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          _id : Joi.string().required(),
          status : Joi.string().valid(
                  Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING,
                  Config.APP_CONSTANTS.PHARMECY_STATUS.CANCEL,
                  Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE,
                  Config.APP_CONSTANTS.PHARMECY_STATUS.SHIPPED,
                  Config.APP_CONSTANTS.PHARMECY_STATUS.COMPLETE
                  ).required(),
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
    path: "/Pharmecy/setPassword",
    options: {
      description: "Set Password API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.setPassword(request.payload,request.auth.credentials)
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
    method: "POST",
    path: "/Pharmecy/passwordLogin",
    options: {
      description: "Login With Password API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.passwordLogin(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          countryCode : Joi.string().required(),
          phoneNo : Joi.number().required(),
          password : Joi.string().required()
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
    method: "GET",
    path: "/Pharmecy/listReview",
    options: {
      description: "List Review  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.listReview(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
           
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
    path: "/Pharmecy/patientGraph",
    options: {
      description: "patient Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.PHARMECY] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.pharmecyController.patientGraph(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
         
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


];
