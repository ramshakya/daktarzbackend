var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
  {
    method: "POST",
    path: "/Doctor/Login",
    options: {
      description: "Doctor Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.doctorLogin(request.payload)
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
    path: "/Doctor/editProfile",
    options: {
      description: "Doctor Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.updateProfile(request.payload, request.auth.credentials)
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
            email : Joi.string().email().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().optional(),
            alternateNumber : Joi.number().optional(),
            gender : Joi.string().valid(Config.APP_CONSTANTS.GENDER.MALE,Config.APP_CONSTANTS.GENDER.FEMALE).optional(),
            lat : Joi.number().required(),
            lng : Joi.number().required(),
            city : Joi.string().required(),
            address : Joi.string().optional(),
            consultantFees : Joi.number().optional(),
            education : Joi.array().optional(),
            experience : Joi.number().optional(),
            awards : Joi.array().optional(),
            languages : Joi.array().optional(),
            membership : Joi.array().optional(),
            speciality : Joi.array().optional(),
            registrationNo : Joi.string().optional(),
            regImage :  Joi.string().optional(),
            about : Joi.string().optional(),
            discount : Joi.number().optional(),
            password : Joi.string().optional(),
            services : Joi.array().optional()
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
    path: "/Doctor/OtpVerification",
    options: {
      description: "OTP Verification API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.otpVerify(request.payload)
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
    path: "/Doctor/otpResend",
    options: {
      description: "OTP Resend API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.otpResend(request.payload)
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
    path: "/Doctor/listDoctor",
    options: {
      description: "List Doctor  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listDoctors(request.query,request.auth.credentials)
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
    path: "/Doctor/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listHospitals(request.query,request.auth.credentials)
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
    path: "/Doctor/addTreatments",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        
        return Controller.doctorController.addTreatments(request.payload,request.auth.credentials)
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
            price : Joi.number().required(),
            discount : Joi.number().optional(),
            _id : Joi.string().optional(),
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
    method: "POST",
    path: "/Doctor/listTreatments",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listTreatments(request.auth.credentials)
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
    path: "/Doctor/addEditBlog",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.addEditBlog(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          doctorId : Joi.string().required(),
          _id:Joi.string().optional(),
          text :Joi.string().required(),
          image:Joi.string().required(),
          title:Joi.string().required(),
          type : Joi.string().valid(
            Config.APP_CONSTANTS.BLOG_TYPE.YOGA,
            Config.APP_CONSTANTS.BLOG_TYPE.HEALTH
            ).optional(),
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
    path: "/Doctor/listBlog",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listBlog(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload:{
          _id :  Joi.string().optional()

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
    path: "/Doctor/addEditTiming",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.addTiming(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload:{
          timing:Joi.array().required(),
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
    path: "/Doctor/accessTokenLogin",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.accessTokenLogin(request.auth.credentials)
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
    path: "/Doctor/listTiming",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listTiming(request.auth.credentials)
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
    path: "/Doctor/listBookings",
    options: {
      description: "List Bookings API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listBookings(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query : {
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
    path: "/Doctor/bookingStatusUpdate",
    options: {
      description: "Booking Status Update API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.bookingStatusUpdate(request.payload, request.auth.credentials)
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
                  Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.PENDING,
                  Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL,
                  Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE,
                  Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.APPROVE
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
    path: "/Doctor/setPassword",
    options: {
      description: "Set Password API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.setPassword(request.payload,request.auth.credentials)
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
    path: "/Doctor/passwordLogin",
    options: {
      description: "Login With Password API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.passwordLogin(request.payload,request.auth.credentials)
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
    method: "PUT",
    path: "/Doctor/deleteBlog",
    options: {
      description: "Delete Blog API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.deleteBlog(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          blogId : Joi.string().required(),
          isDeleted : Joi.boolean().optional()
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
    path: "/Doctor/listReview",
    options: {
      description: "List Review  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listReview(request.query,request.auth.credentials)
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
    method: "POST",
    path: "/Doctor/sendMessage",
    options: {
      description: "/Doctor/sendMessage",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.sendMessage(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload:{
          userId :  Joi.string().required(),
          bookingId : Joi.string().optional(),
          message : Joi.string().required()
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
    path: "/Doctor/listUsers",
    options: {
      description: "List Users Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listusers(request.query,request.auth.credentials)
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
            //_id :  Joi.string().optional(),
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
    path: "/Doctor/listMessages",
    options: {
      description: "List Messages Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listMessages(request.query,request.auth.credentials)
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
          userId : Joi.string().required(),
          skip : Joi.number().required(),
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
    path: "/Doctor/addPrescription",
    options: {
      description: "add Prescription",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.addPrescription(request.payload,request.auth.credentials)
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
          description : Joi.array().optional(),
          prescription : Joi.string().optional(),
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
    path: "/Doctor/revenueGraph",
    options: {
      description: "revenue Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.revenueGraph(request.query,request.auth.credentials)
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
    path: "/Doctor/patientGraph",
    options: {
      description: "patient Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.patientGraph(request.query,request.auth.credentials)
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
    path: "/Doctor/listUsersDetails",
    options: {
      description: "list Users Details  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.listUsersDetails(request.query,request.auth.credentials)
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
            userId :  Joi.string().required(),
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
    path: "/Doctor/deleteTreatments",
    options: {
      description: "Delete Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.deleteTreatments(request.payload, request.auth.credentials)
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
          isDeleted : Joi.boolean().required()
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
    path: "/Doctor/forgotPassword",
    options: {
      description: "Delete Treatments API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.forgotPassword(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          phoneNo : Joi.string().required(),
          type : Joi.number().optional()
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
    path: "/Doctor/readMessages",
    options: {
      description: "read Messages API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.DOCTOR] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.doctorController.readMessages(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
           
           userId : Joi.string().required()
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
