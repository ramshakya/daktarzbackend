var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
  {
    method: "POST",
    path: "/Labs/Login",
    options: {
      description: "Labs Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.labsLogin(request.payload)
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
    path: "/Labs/editLab",
    options: {
      description: "Labs Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.updateProfile(request.payload, request.auth.credentials)
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
            discount:Joi.number().optional(),
            about : Joi.string().optional(),
            registrationNo : Joi.string().optional(),
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
    path: "/Labs/OtpVerification",
    options: {
      description: "OTP Verification API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.otpVerify(request.payload)
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
    path: "/Labs/otpResend",
    options: {
      description: "OTP Resend API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.otpResend(request.payload)
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
    path: "/Labs/listLabs",
    options: {
      description: "List Labs  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.listLabs(request.query,request.auth.credentials)
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
    path: "/Labs/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.listHospitals(request.query,request.auth.credentials)
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
    path: "/Labs/addLabTests",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.addTests(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            name : Joi.string().required(),
            description : Joi.string().required(),
            price : Joi.number().required(),
            _id:Joi.string().optional(),
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
    path: "/Labs/listLabTests",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.listLabTests(request.auth.credentials)
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
    path: "/Labs/deleteTest",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.deleteTest(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id:Joi.string().required(),
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
    path: "/Labs/accessTokenLogin",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {

        
        return Controller.labsController.accessTokenLogin(request.auth.credentials)
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
    path: "/Labs/addEditTiming",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.addEditTiming(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
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
    path: "/Labs/listTiming",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.listTiming(request.auth.credentials)
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
    method: "GET",
    path: "/Labs/listBookings",
    options: {
      description: "List Bookings Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.listBookings(request.query,request.auth.credentials)
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
         /* status : Joi.string().valid(
            Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING,
            Config.APP_CONSTANTS.LAB_STATUS.COMPLETE
           /* Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE,
            Config.APP_CONSTANTS.PHARMECY_STATUS.SHIPPED,
            Config.APP_CONSTANTS.LAB_STATUS.CANCEL,
            Config.APP_CONSTANTS.LAB_STATUS.RATED,
           ).optional(),*/

           date : Joi.string().optional().description("DD-MM-YYYY"),
           phoneNo : Joi.number().optional()

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
    path: "/Labs/bookingStatusUpdate",
    options: {
      description: "Booking Status Update API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.bookingStatusUpdate(request.payload, request.auth.credentials)
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

                    Config.APP_CONSTANTS.LAB_STATUS.PENDING,
                    Config.APP_CONSTANTS.LAB_STATUS.CANCEL,
                    Config.APP_CONSTANTS.LAB_STATUS.COMPLETE,
                    Config.APP_CONSTANTS.LAB_STATUS.APPROVE,
                    Config.APP_CONSTANTS.LAB_STATUS.SHIPPED,
                  


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
    path: "/Labs/setPassword",
    options: {
      description: "Set Password API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.setPassword(request.payload,request.auth.credentials)
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
    path: "/Labs/passwordLogin",
    options: {
      description: "Login With Password API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.passwordLogin(request.payload,request.auth.credentials)
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
    path: "/Labs/listReview",
    options: {
      description: "List Review  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.listReview(request.query,request.auth.credentials)
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
    path: "/Labs/revenueGraph",
    options: {
      description: "revenue Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.revenueGraph(request.query,request.auth.credentials)
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
    path: "/Labs/patientGraph",
    options: {
      description: "patient Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.patientGraph(request.query,request.auth.credentials)
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
    method: "PUT",
    path: "/Labs/uploadReports",
    options: {
      description: "Labs upload Reports API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.uploadReports(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          bookingId : Joi.string().required(),
          reports : Joi.array().required().description("[{'image' : '', 'type' : 'pdf', 'title' : ''}]")
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
    path: "/Labs/inesrtLabTests",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.inesrtLabTests(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
         // tests : Joi.array().required().description("[{'name' : '', 'description' : '' , 'price' : ''}]"),
          tests: Joi.array().items(Joi.object({
            name : Joi.string().required().description("enter name here").label("name"),
            description : Joi.string().required().description("enter description here").label("description"),
            price : Joi.number().required().description("enter price here").label("price")
            })).required().description("[{'name' : '', 'description' : '' , 'price' : ''}]"),                          
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
    path: "/Labs/writeDescription",
    options: {
      description: "write description",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.writeDescription(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload:{
          bookingId : Joi.string().required(),
          description : Joi.string().required(),
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
    path: "/Labs/deleteReports",
    options: {
      description: "Labs delete Reports API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.LABS] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.labsController.deleteReports(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          bookingId : Joi.string().required(),
          reports : Joi.string().required(),
        //  reports : Joi.array().required().description("['','',so on ...]")
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
