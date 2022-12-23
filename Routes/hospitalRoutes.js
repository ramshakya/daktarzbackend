var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
  {
    method: "POST",
    path: "/Hospital/Login",
    options: {
      description: "Hospital Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.hospitalLogin(request.payload)
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
    path: "/Hospital/editHospital",
    options: {
      description: "Hospital Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.updateProfile(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            coverPhoto : Joi.string().optional().allow(''),
            name : Joi.string().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            city : Joi.string().optional(),
            address : Joi.string().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().optional(),
            alternateNumber : Joi.number().optional(),
            images : Joi.array().optional(),
            registrationNo : Joi.string().optional(),
            fees : Joi.number().optional(),
            website : Joi.string().optional(),
            discount : Joi.number().optional(),
            email : Joi.string().email().optional().allow(''),
            awards : Joi.array().optional().allow(''),
            membership : Joi.array().optional().allow(''),
            regImage :  Joi.string().optional().allow(''),
            description :  Joi.string().optional().allow(''),
            speciality : Joi.array().optional(),
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
    path: "/Hospital/OtpVerification",
    options: {
      description: "OTP Verification API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.otpVerify(request.payload)
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
    path: "/Hospital/otpResend",
    options: {
      description: "OTP Resend API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.otpResend(request.payload)
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
    path: "/Hospital/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listHospital(request.query,request.auth.credentials)
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
    method: "POST",
    path: "/Hospital/accessTokenLogin",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.accessTokenLogin(request.auth.credentials)
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
    path: "/Hospital/serachDoctor",
    options: {
      description: "serach Doctor",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.serachDoctor(request.payload,request.auth.credentials)
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
    path: "/Hospital/serachAmbulance",
    options: {
      description: "serach Doctor",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.serachAmbulance(request.payload,request.auth.credentials)
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
    path: "/Hospital/addHospitalDoctor",
    options: {
      description: "serach Doctor",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.addDoctor(request.payload,request.auth.credentials)
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
          doctorId: Joi.string().optional(),
          profilePicture : Joi.string().optional(),
          name : Joi.string().optional(),
          email : Joi.string().email().optional(),
          countryCode : Joi.string().optional(),
          phoneNo : Joi.number().optional(),
          alternateNumber : Joi.number().optional(),
          gender : Joi.string().valid(Config.APP_CONSTANTS.GENDER.MALE,Config.APP_CONSTANTS.GENDER.FEMALE).optional(),
          lat : Joi.number().optional(),
          lng : Joi.number().optional(),
          city : Joi.string().optional(),
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
          timing:Joi.array().optional(),
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
  {
    method: "POST",
    path: "/Hospital/addAmbulance",
    options: {
      description: "serach Doctor",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.addAmbulance(request.payload,request.auth.credentials)
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
          ambulanceId: Joi.string().optional(),
          profilePicture:Joi.string().optional(),
          fullName:Joi.string().optional(),
          drivingLicence:Joi.string().optional(),
          countryCode : Joi.string().optional(),
          phoneNo:Joi.number().required(),
          registrationNo:Joi.string().optional(),
          association:Joi.string().optional(),
          vehicleNo :Joi.string().optional(),
          password : Joi.string().optional(),
          type:Joi.string().optional(),
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
    path: "/Hospital/listDoctorAmbulance",
    options: {
      description: "serach Doctor",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listDoctorAmbulance(request.auth.credentials)
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
    path: "/Hospital/addEditTreatments",
    options: {
      description: "Add Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        
        return Controller.hospitalController.addTreatments(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
          
      },
      validate: {
        payload: {
           _id:Joi.string().optional(),
            name : Joi.string().required(),
            price : Joi.number().required(),
            description:Joi.string().required(),
            discount : Joi.number().optional(),
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
    path: "/Hospital/listTreatments",
    options: {
      description: "List Treatments  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listTreatments(request.query,request.auth.credentials)
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
    method: "POST",
    path: "/Hospital/addEditBlog",
    options: {
      description: "Add Blog API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.addEditBlog(request.payload,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
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
    method: "GET",
    path: "/Hospital/listBlog",
    options: {
      description: "Add Blogs API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listBlog(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query:{
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
    method: "PUT",
    path: "/Hospital/setPassword",
    options: {
      description: "Set Password API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.setPassword(request.payload,request.auth.credentials)
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
    path: "/Hospital/passwordLogin",
    options: {
      description: "Login With Password API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.passwordLogin(request.payload,request.auth.credentials)
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
    path: "/Hospital/deleteBlog",
    options: {
      description: "Delete Blog API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.deleteBlog(request.payload,request.auth.credentials)
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
    path: "/Hospital/listDoctorDetailData",
    options: {
      description: "List Doctor Detail Data Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listDoctorsDetails(request.query)
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
            _id :  Joi.string().required().description("pass here unique key of doctor"),
            hospitalId :  Joi.string().required(),
            bookingDate : Joi.string().optional().description("date must be in format DD-MM-YYYY")
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
    method: "POST",
    path: "/Hospital/doctorOtpVerify",
    options: {
      description: "OTP Verification API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.doctorOtpVerify(request.payload,request.auth.credentials)
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
    path: "/Hospital/doctorOtpResend",
    options: {
      description: "OTP Resend API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.doctorOtpResend(request.payload,request.auth.credentials)
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
    path: "/Hospital/listBookings",
    options: {
      description: "List Bookings API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listBookings(request.query,request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
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
    method: "GET",
    path: "/Hospital/revenueGraph",
    options: {
      description: "revenue Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.revenueGraph(request.query,request.auth.credentials)
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
    path: "/Hospital/patientGraph",
    options: {
      description: "patient Graph  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.patientGraph(request.query,request.auth.credentials)
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
    path: "/Hospital/bookingStatusUpdate",
    options: {
      description: "Booking Status Update API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.bookingStatusUpdate(request.payload, request.auth.credentials)
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
    path: "/Hospital/editHospitalDoctor",
    options: {
      description: "Doctor Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.editHospitalDoctor(request.payload, request.auth.credentials)
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
            services : Joi.array().optional()
            //timing : Joi.array().optional(),
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
    path: "/Hospital/addDoctorTiming",
    options: {
      description: "Add Edit Doctor Timing API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.addDoctorTiming(request.payload, request.auth.credentials)
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
            timing : Joi.array().required(),
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
    path: "/Hospital/deleteTreatments",
    options: {
      description: "delete Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.deleteTreatments(request.payload,request.auth.credentials)
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
    path: "/Hospital/listReview",
    options: {
      description: "List Review  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.listReview(request.auth.credentials)
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
    path: "/Hospital/addPrescription",
    options: {
      description: "add Prescription API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.HOSPITAL] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.hospitalController.addPrescription(request.payload,request.auth.credentials)
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



  
];
