var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [{
    method: "POST",
    path: "/User/Login",
    options: {
      description: "User Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.userLogin(request.payload)
          .then(response => {

            console.log("..............response.........",response);
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

  {
    method: "PUT",
    path: "/User/editUser",
    options: {
      description: "User Edit Profile API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.updateProfile(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          profilePicture: Joi.string().optional(),
          name: Joi.string().optional(),
          email: Joi.string().email().optional(),
          lat: Joi.number().optional(),
          lng: Joi.number().optional(),
          address: Joi.string().optional(),
          houseNo: Joi.string().optional(),
          city: Joi.string().optional(),
          state: Joi.string().optional(),
          country: Joi.string().optional(),
          pincode: Joi.number().optional(),
          countryCode : Joi.string().optional(),
          phoneNo: Joi.number().optional(),
          about: Joi.string().optional(),
          password:Joi.string().optional(),
          education: Joi.array().optional(),
          languages: Joi.array().optional(),
          gender: Joi.string().valid(
            Config.APP_CONSTANTS.GENDER.MALE,
            Config.APP_CONSTANTS.GENDER.FEMALE).optional(),
          dob: Joi.string().optional(),
          bloodGroup: Joi.string().optional(),
          timeZone: Joi.string().optional(),
          documents: Joi.array().optional().description("[{'image' : '', 'type' : 'pdf', 'title' : ''}]")

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
    path: "/User/OtpVerification",
    options: {
      description: "OTP Verification API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.otpVerify(request.payload)
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
    path: "/User/otpResend",
    options: {
      description: "OTP Resend API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.otpResend(request.payload)
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

  //BOOK AMBULANCE
  {
    method: "POST",
    path: "/User/bookAmbulance",
    options: {
      description: "Ambulance Booking API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.bookAmbulance(request.payload, request.auth.credentials)
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
          name: Joi.string().optional(),
          phoneNo: Joi.number().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required(),
          address: Joi.string().required(),
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
    path: "/User/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listHospitals(request.query)
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
          lat: Joi.number().optional(),
          lng: Joi.number().optional(),
          city : Joi.string().optional(),
          name : Joi.string().optional(),
          treatment : Joi.string().optional(),
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
    path: "/User/getMapData",
    options: {
      description: "List labs  Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.getMapData(request.auth.credentials)
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
    path: "/User/listHospitalDetailData",
    options: {
      description: "List Hospital Detail Data Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listHospitalDetails(request.query)
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
          _id: Joi.string().required(),
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
    path: "/User/listDoctors",
    options: {
      description: "List Doctors  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listDoctors(request.query)
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

          lat : Joi.number().optional(),
          lng : Joi.number().optional(),
          city : Joi.string().optional(),
          name : Joi.string().optional(),
          treatment : Joi.string().optional(),
          timeZone : Joi.string().optional().description("Asia/Kolkata"),
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
    method: "GET",
    path: "/User/listDoctorDetailData",
    options: {
      description: "List Doctor Detail Data Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listDoctorsDetails(request.query)
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
          _id: Joi.string().required().description("pass here unique key of doctor"),
          hospitalId: Joi.string().optional(),
          bookingDate: Joi.string().optional().description("date must be in format DD-MM-YYYY")
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
    path: "/User/listPharmecies",
    options: {
      description: "List Pharmecies  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listPharmecies(request.query)
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

          lat: Joi.number().optional(),
          lng: Joi.number().optional(),
          skip: Joi.number().required(),
          city : Joi.string().optional(),
          name : Joi.string().optional(),
          timeZone: Joi.string().optional().description("Asia/Kolkata"),
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
    path: "/User/listPharmecyDetails",
    options: {
      description: "List Pharmecy Detail Data Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listPharmecyDetails(request.query)
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
          _id: Joi.string().required(),
          selectDate: Joi.string().optional(),
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
    path: "/User/listLabs",
    options: {
      description: "List Labs  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listLabs(request.query)
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

          lat: Joi.number().optional(),
          lng: Joi.number().optional(),
          city : Joi.string().optional(),
          name : Joi.string().optional(),
          tests : Joi.string().optional(),
          timeZone: Joi.string().optional().description("Asia/Kolkata"),
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
    path: "/User/listLabsDetails",
    options: {
      description: "List Labs Detail Data Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listLabsDetails(request.query)
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
          _id: Joi.string().required(),
          selectDate: Joi.string().optional(),
        },
        //   headers: UniversalFunctions.authorizationHeaderObj,
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
    path: "/User/pharmecyBooking",
    options: {
      description: "Pharmecy Booking API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.pharmecyBooking(request.payload, request.auth.credentials)
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
          pharmecyId: Joi.string().required(),
          images: Joi.array().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
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
    path: "/User/labBooking",
    options: {
      description: "Lab Booking API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.labBooking(request.payload, request.auth.credentials)
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
          labTestId: Joi.array().required().description("[{'labTestId':'','quantity' :'',price:''}]"),
          dateTime: Joi.number().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required(),
          city: Joi.string().required(),
          address: Joi.string().required(),
          transactionId:Joi.string().optional(),
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
    path: "/User/home",
    options: {
      description: "Home  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.home(request.query)
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

          lat: Joi.number().optional(),
          lng: Joi.number().optional(),
          timeZone: Joi.string().optional().description("Asia/Kolkata"),
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
    path: "/User/listBlogs",
    options: {
      description: "List Blogs Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listBlogs(request.query)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            winston.error("=====error=============", error);
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query : {
          type : Joi.string().valid(
            Config.APP_CONSTANTS.BLOG_TYPE.YOGA,
            Config.APP_CONSTANTS.BLOG_TYPE.HEALTH
            ).optional(),
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
    method: "GET",
    path: "/User/listSingleBolg",
    options: {
      description: "List Single Blog Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listSingleBolg(request.query)
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
          _id: Joi.string().required().description("pass here blog unique key"),
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
    method: "GET",
    path: "/User/listAmbulance",
    options: {
      description: "List Ambulance Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listAmbulance(request.query)
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
          lat: Joi.number().optional(),
          lng: Joi.number().optional()
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
    path: "/User/cancelBooking",
    options: {
      description: "User Cancel Bookings API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.cancelBooking(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          _id: Joi.string().required().description("insert ambulance Booking Id here")
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
    path: "/User/addEditReminder",
    options: {
      description: "Add Edit Reminder API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.addEditReminder(request.payload, request.auth.credentials)
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
          _id: Joi.string().optional(),
          name: Joi.string().required(),
          type: Joi.string().valid(
            Config.APP_CONSTANTS.REMINDER_TYPE.URGENT,Config.APP_CONSTANTS.REMINDER_TYPE.NORMAL).required(),
          date: Joi.string().required(),
          time: Joi.number().required(),

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
    path: "/User/listReminder",
    options: {
      description: "List Reminder Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listReminder(request.auth.credentials)
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
    path: "/User/deleteReminder",
    options: {
      description: "Delete Reminder API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.deleteReminder(request.payload, request.auth.credentials)
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
          _id: Joi.string().optional(),
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
    path: "/User/userProfile",
    options: {
      description: "User Profile Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.userprofile(request.auth.credentials)
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
    path: "/User/doctorBooking",
    options: {
      description: "Doctor Booking API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.bookDoctor(request.payload, request.auth.credentials)
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
          bookingDate: Joi.string().optional().description("Must Be In Format DD-MM-YYYY"),
          startTime: Joi.string().optional().description("Must Be In Format hh:mm ex (10:00 || 10:30)"),
          treatments: Joi.array().optional().description("[{'treatmentId':'','name' :'','price':''}]"),
          transactionId:Joi.string().optional()

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
    path: "/User/userHistory",
    options: {
      description: "User History Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.userHistory(request.query,request.auth.credentials)
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
          date : Joi.string().optional().description("DD-MM-YYYY")
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
    path: "/User/listDcotorBookings",
    options: {
      description: "User List Doctor Bookings Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listDoctorBookings(request.query, request.auth.credentials)
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
          //  doctorId : Joi.string().required()
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
    path: "/User/filter",
    options: {
      description: "Filter Api",
      auth: false, // { strategies: [Config.APP_CONSTANTS.SCOPE.USER] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.filter(request.query)
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
          availability: Joi.string().optional().valid('Today', 'This_week', 'Next_Week', 'Next_Month'),
          consultation: Joi.string().optional().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
          timing: Joi.string().optional().valid('Morning', 'Afternoon', 'Evening'),
          languages: Joi.string().optional().valid('English', 'Hindi'),
          gender: Joi.string().valid(Config.APP_CONSTANTS.GENDER.MALE, Config.APP_CONSTANTS.GENDER.FEMALE).optional(),
          lat : Joi.number().optional(),
          lng : Joi.number().optional(),
          radious : Joi.number().optional(),
          sortBy : Joi.string().optional().valid('Ratings'),
          city : Joi.string().optional(),
          name : Joi.string().optional(),
          treatment : Joi.string().optional()
          
        },
        //   headers: UniversalFunctions.authorizationHeaderObj,
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
    path: "/User/listCities",
    options: {
      description: "List Cities Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listCities(request.query)
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
          type : Joi.string().valid("HOSPITAL", "DOCTOR", "PHARMACY", "LABS")
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
    method: "PUT",
    path: "/User/addReview",
    options: {
      description: "User Add Review API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.addReview(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          doctorId: Joi.string().required(),
          bookingId: Joi.string().required(),
          stars: Joi.number().required(),
          comment: Joi.string().optional(),

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
    path: "/User/addLabReview",
    options: {
      description: "User Add Review API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.addLabReview(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          labId: Joi.string().required(),
          bookingId: Joi.string().required(),
          stars: Joi.number().required(),
          comment: Joi.string().optional(),

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
    path: "/User/addPharmecyReview",
    options: {
      description: "User Add Review API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.addPharmecyReview(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          pharmecyId: Joi.string().required(),
          bookingId: Joi.string().required(),
          stars: Joi.number().required(),
          comment: Joi.string().optional(),

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
    path: "/User/sendMessage",
    options: {
      description: "/User/sendMessage",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.sendMessage(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          doctorId: Joi.string().required(),
          bookingId: Joi.string().optional(),
          message: Joi.string().required()
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
    path: "/User/listMessages",
    options: {
      description: "List Messages Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listMessages(request.query, request.auth.credentials)
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
          doctorId: Joi.string().required(),
          skip: Joi.number().required()
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
    path: "/User/listHospitalCities",
    options: {
      description: "List Hospital Cities Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listHospitalCities(request.query)
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
    path: "/User/listPharmecyCities",
    options: {
      description: "List Cities Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listPharmecyCities(request.query)
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
    path: "/User/listLabsCities",
    options: {
      description: "List Cities Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listLabsCities(request.query)
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
    path: "/User/searchDoctors",
    options: {
      description: "search Doctors  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.searchDoctors(request.query)
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
          search: Joi.string().required()
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
    path: "/User/searchHospital",
    options: {
      description: "search Hospital  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.searchHospital(request.query)
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
          search: Joi.string().required()
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
    path: "/User/searchPharmecy",
    options: {
      description: "search Pharmecy  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.searchPharmecy(request.query)
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
          search: Joi.string().required()
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
    path: "/User/searchLabs",
    options: {
      description: "search Labs  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.searchLabs(request.query)
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
          search: Joi.string().required()
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
    path: "/User/pharmecyDistance",
    options: {
      description: "Pharmecy Distance  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.pharmecyDistance(request.query)
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
          pharmecyId : Joi.string().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required()
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
    method: "GET",
    path: "/User/labDistance",
    options: {
      description: "Lab Distance  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.labDistance(request.query)
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
          labId : Joi.string().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required()
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
    method: "GET",
    path: "/User/pharmecyTimingStatus",
    options: {
      description: "pharmecy Timing Status  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.pharmecyTimingStatus(request.query)
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
          pharmecyId : Joi.string().required(),
          time: Joi.number().required().description("in milliseconds"),

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
    method: "GET",
    path: "/User/labTimingStatus",
    options: {
      description: "Lab Timing Status  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.labTimingStatus(request.query)
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
          labId : Joi.string().required(),
          time: Joi.number().required().description("in milliseconds"),

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
    method: "POST",
    path: "/User/hospitalDoctorbooking",
    options: {
      description: "Hospital Doctor Booking API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.bookHospitalDoctor(request.payload, request.auth.credentials)
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
          hospitalId : Joi.string().required(),
          doctorId: Joi.string().optional(),
          bookingDate: Joi.string().optional().description("Must Be In Format DD-MM-YYYY"),
          startTime: Joi.string().optional().description("Must Be In Format hh:mm ex (10:00 || 10:30)"),
          treatments: Joi.array().optional().description("[{'treatmentId':'','name' :'','price':''}]"),
          transactionId : Joi.string().optional(),

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
    path: "/User/addHospitalReview",
    options: {
      description: "User Add Review API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.addHospitalReview(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          hospitalId: Joi.string().required(),
          bookingId: Joi.string().required(),
          stars: Joi.number().required(),
          comment: Joi.string().optional(),

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
    path: "/User/listHospiatlBookings",
    options: {
      description: "User List Hospital Bookings Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listHospiatlBookings(request.query, request.auth.credentials)
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
    path: "/User/checkPasswordStatus",
    options: {
      description: "Check Password Status",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.checkPasswordStatus(request.payload)
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
  {
    method: "POST",
    path: "/User/loginWithPassword",
    options: {
      description: "Login With Password",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.loginWithPassword(request.payload)
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
          phoneNo: Joi.number().required(),
          password:Joi.string().required(),
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
    method: "POST",
    path: "/User/forgotPassword",
    options: {
      description: "forgot password",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.forgotPassword(request.payload)
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

  {
    method: "GET",
    path: "/User/accessTokenLogin",
    options: {
      description: "access Token Login Api",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.accessTokenLogin(request.auth.credentials)
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
    method: "PUT",
    path: "/User/deleteReports",
    options: {
      description: "User delete Reports API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.USER] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.deleteLabReports(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
          //bookingId : Joi.string().required(),
          reports : Joi.string().required(),
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
    path: "/User/hospitalBooking",
    options: {
      description: "hospital Booking API",
      auth: {
        strategies: [Config.APP_CONSTANTS.SCOPE.USER]
      },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.bookHospital(request.payload, request.auth.credentials)
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
          hospitalId : Joi.string().optional(),
          bookingDate : Joi.string().optional().description("DD-MM-YYYY"),
          startTime : Joi.string().optional(),
          treatments : Joi.array().optional().description("[{'treatmentId':'','name' :'','price':''}]"),
          transactionId : Joi.string().optional()

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
    path: "/User/apply4medicalTourism",
    options: {
      description: "Apply for Medical Tourism API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.apply4medicalTourism(request.payload)
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
          countryCode : Joi.string().optional(),
          phoneNo : Joi.number().optional(),
          medicalRecords : Joi.array().optional(),
          subject : Joi.string().optional(),
          description : Joi.string().optional(),
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
    path: "/User/listOtherDetails",
    options: {
      description: "listOtherDetails  Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.userController.listOtherDetails(request.query)
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

          uniquekey : Joi.string().optional(),

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
