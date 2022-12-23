var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;


module.exports = [
  {
    method: "POST",
    path: "/Admin/Login",
    options: {
      description: "Admin Login Api",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.adminLogin(request.payload)
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
          email: Joi.string().email().required().description("Enter your Email Address"),
          password: Joi.string().required().description("Enter your Password")
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
    path: "/Admin/addEditAmbulance",
    options: {
      description: "Ambulance Login API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.ambulanceLogin(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id : Joi.string().optional(),
            hospitalId : Joi.string().optional(),
            profilePicture : Joi.string().optional(),
            fullName : Joi.string().optional(),
            email : Joi.string().email().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().required(),
            alternateNumber : Joi.number().optional(),
            documents : Joi.array().optional(),
            drivingLicence : Joi.string().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            type:Joi.string().optional(),
            address : Joi.string().optional(),
            registrationNo : Joi.string().optional(),
            vehicleNo : Joi.string().optional(),
            profileUpdated:Joi.boolean().optional(),
            association : Joi.string().optional(),
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
    path: "/Admin/deleteAmbulance",
    options: {
      description: "Delete Ambulance Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deleteAmbulance(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
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
    path: "/Admin/approveAmbulance",
    options: {
      description: "Approve Ambulance Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approveAmbulance(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().required()
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
    path: "/Admin/addEditHospital",
    options: {
      description: "Hospital Login API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.hospitalLogin(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id : Joi.string().optional(),
            coverPhoto : Joi.string().optional(),
            name : Joi.string().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            city : Joi.string().optional(),
            address : Joi.string().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().required(),
            alternateNumber : Joi.number().optional(),
            images : Joi.array().optional(),
            registrationNo : Joi.string().optional(),
            fees : Joi.number().optional(),
            website : Joi.string().optional(),
            profileUpdated:Joi.boolean().optional(),
            discount : Joi.number().optional(),
            email : Joi.string().email().optional(),
            awards : Joi.array().optional(),
            membership : Joi.array().optional(),
            regImage :  Joi.string().optional(),
            description :  Joi.string().optional().allow(''),
            speciality : Joi.array().optional(),
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
    method: "PUT",
    path: "/Admin/deleteHospital",
    options: {
      description: "Delete Hospital Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deleteHospital(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
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
    path: "/Admin/approveHospital",
    options: {
      description: "Approve Hospital Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approveHospital(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().required()
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
    path: "/Admin/listAmbulance",
    options: {
      description: "List Ambulance  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listAmbulance(request.query,request.auth.credentials)
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
            phoneNo : Joi.number().optional(),
            name : Joi.string().optional(),
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
    path: "/Admin/listHospital",
    options: {
      description: "List Hospital  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listHospital(request.query,request.auth.credentials)
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
            phoneNo : Joi.number().optional(),
            name : Joi.string().optional(),
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
    path: "/Admin/addEditDoctor",
    options: {
      description: "Doctor Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.doctorLogin(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id : Joi.string().optional(),
            hospitalId : Joi.string().optional(),
            profilePicture : Joi.string().optional(),
            name : Joi.string().optional(),
            email : Joi.string().email().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().required(),
            alternateNumber : Joi.number().optional(),
            gender : Joi.string().valid(Config.APP_CONSTANTS.GENDER.MALE,Config.APP_CONSTANTS.GENDER.FEMALE).optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            city : Joi.string().optional(),
            address : Joi.string().optional(),
            education : Joi.array().optional(),
            experience : Joi.number().optional(),
            awards : Joi.array().optional(),
            languages : Joi.array().optional(),
            membership : Joi.array().optional(),
            speciality : Joi.array().optional(),
            registrationNo : Joi.string().optional(),
            regImage :  Joi.string().optional(),
            about : Joi.string().optional(),
            consultantFees : Joi.number().optional(),
            discount : Joi.number().optional(),
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
    method: "GET",
    path: "/Admin/listDoctor",
    options: {
      description: "List Doctor  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listDoctors(request.query,request.auth.credentials)
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
            phoneNo : Joi.number().optional(),
            name : Joi.string().optional(),
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
    path: "/Admin/addEditUser",
    options: {
      description: "User Edit Profile API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.USER] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.userLogin(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id : Joi.string().optional(),
            profilePicture : Joi.string().optional(),
            name : Joi.string().optional(),
            email : Joi.string().email().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            address : Joi.string().optional(),
            houseNo : Joi.string().optional(),
            city : Joi.string().optional(),
            state : Joi.string().optional(),
            country : Joi.string().optional(),
            pincode : Joi.number().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().required(),
            about : Joi.string().optional(),
            education : Joi.array().optional(),
            languages : Joi.array().optional(),
            gender : Joi.string().valid(
                  Config.APP_CONSTANTS.GENDER.MALE,
                  Config.APP_CONSTANTS.GENDER.FEMALE).optional(),
            dob : Joi.string().optional(),
            bloodGroup : Joi.string().optional(),
            timeZone : Joi.string().optional(),
            documents : Joi.array().optional(),

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
    path: "/Admin/approveDoctor",
    options: {
      description: "Approve Doctor Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approveDoctor(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().required()
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
    path: "/Admin/deleteDoctor",
    options: {
      description: "Delete Doctor Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deleteDoctor(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
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
    path: "/Admin/addEditLabs",
    options: {
      description: "Labs Edit  API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.addEditLabs(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id : Joi.string().optional(),
            profilePicture : Joi.string().optional(),
            name : Joi.string().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().required(),
            alternateNumber : Joi.number().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            city : Joi.string().optional(),
            address : Joi.string().optional(),
            images : Joi.array().optional(),
            about : Joi.string().optional(),
            registrationNo : Joi.string().optional(),
            profileUpdated:Joi.boolean().optional(),
            email : Joi.string().email().optional().allow(''),
            awards : Joi.array().optional().allow(''),
            membership : Joi.array().optional().allow(''),
            regImage :  Joi.string().optional().allow(''),
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
    path: "/Admin/listLabs",
    options: {
      description: "List Labs  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listLabs(request.query,request.auth.credentials)
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
            phoneNo : Joi.number().optional(),
            name : Joi.string().optional(),
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
    path: "/Admin/approveLabs",
    options: {
      description: "Approve Labs Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approveLabs(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().required()
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
    path: "/Admin/deleteLabs",
    options: {
      description: "Delete Labs Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deleteLabs(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
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
    path: "/Admin/approveUsers",
    options: {
      description: "Approve Users Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approveUsers(request.query,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().required()
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
    path: "/Admin/deleteUsers",
    options: {
      description: "Delete Users Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deleteUsers(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
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
    path: "/Admin/listUsers",
    options: {
      description: "List Users  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listUsers(request.query,request.auth.credentials)
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
    method: "PUT",
    path: "/Admin/approvePharmecy",
    options: {
      description: "Approve Pharmecy Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approvePharmecy(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().required()
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
    path: "/Admin/deletePharmecy",
    options: {
      description: "Delete Pharmecy Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deletePharmecy(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
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
    path: "/Admin/listPharmecy",
    options: {
      description: "List Pharmecy  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listPharmecy(request.query,request.auth.credentials)
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
            phoneNo : Joi.number().optional(),
            name : Joi.string().optional(),
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
    path: "/Admin/addEditPharmecy",
    options: {
      description: "Pharmecy Edit API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.addEditPharmecy(request.payload, request.auth.credentials)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            _id : Joi.string().optional(),
            profilePicture : Joi.string().optional(),
            name : Joi.string().optional(),
            countryCode : Joi.string().optional(),
            phoneNo : Joi.number().required(),
            alternateNumber : Joi.number().optional(),
            lat : Joi.number().optional(),
            lng : Joi.number().optional(),
            city : Joi.string().optional().allow(''),
            address : Joi.string().optional(),
            images : Joi.array().optional(),
            registrationNo : Joi.string().optional(),
            discount:Joi.number().optional(),
            about : Joi.string().optional(),
            profileUpdated:Joi.boolean().optional(),
            email : Joi.string().email().optional().allow(''),
            awards : Joi.array().optional().allow(''),
            membership : Joi.array().optional().allow(''),
            regImage :  Joi.string().optional().allow(''),
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
    path: "/Admin/addDoctorTreatments",
    options: {
      description: "Add Doctor Treatments API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.addTreatments(request.payload)
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
            name : Joi.string().required(),
            price : Joi.number().required(),
            description :  Joi.string().required(),
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
    path: "/Admin/addLabTests",
    options: {
      description: "Add Lab Tests API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.addTests(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            labId : Joi.string().required(),
            name : Joi.string().required(),
            description : Joi.string().required(),
            price : Joi.number().required()
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
    path: "/Admin/listAmbulanceBookings",
    options: {
      description: "Booking Data",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.ambulanceBooking(request.query)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
          _id :  Joi.string().optional(),
          bookingDate : Joi.string().optional(),
          
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
    path: "/Admin/listPharmecyBookings",
    options: {
      description: "List Pharmecy Booking Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listPharmecyBookings(request.query,request.auth.credentials)
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
            bookingDate : Joi.string().optional(),
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
    path: "/Admin/listLabsBookings",
    options: {
      description: "List Labs Booking Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listLabsBookings(request.query,request.auth.credentials)
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
            bookingDate : Joi.string().optional(),
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
    path: "/Admin/addEditContent",
    options: {
      description: "Add Content Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.addContent(request.payload,request.auth.credentials)
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
            type : Joi.string().valid(
                    Config.APP_CONSTANTS.CONTENT_TYPES.HELP,
                    Config.APP_CONSTANTS.CONTENT_TYPES.CONTACT_US,
                    Config.APP_CONSTANTS.CONTENT_TYPES.PRIVACY_POLICY,
                    Config.APP_CONSTANTS.CONTENT_TYPES.TERMS_CONDITIONS,
                   ).optional(),
            description :  Joi.string().optional(),
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
    path: "/Content/listContent",
    options: {
      description: "List other Details API",
      auth: false,
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listContent(request.query)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
          type : Joi.string().valid(
            Config.APP_CONSTANTS.CONTENT_TYPES.HELP,
            Config.APP_CONSTANTS.CONTENT_TYPES.CONTACT_US,
            Config.APP_CONSTANTS.CONTENT_TYPES.PRIVACY_POLICY,
            Config.APP_CONSTANTS.CONTENT_TYPES.TERMS_CONDITIONS,
           ).optional(),
      
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
    path: "/Admin/listDoctorBookings",
    options: {
      description: "List Doctor Bpoking API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listDoctorBookings(request.query)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
          _id : Joi.string().optional(),
          bookingDate : Joi.string().optional(),    
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
    path: "/Admin/verifyDoctorProfile",
    options: {
      description: "Verify Doctor Profile Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.verifyDoctorProfile(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            doctorVerified : Joi.boolean().required()
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
    path: "/Admin/block_Unblock_Labs",
    options: {
      description: "Block Unblock Labs Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.blockLabs(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            isBlocked : Joi.boolean().optional()
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
    path: "/Admin/approveBlogs",
    options: {
      description: "Approve Blogs Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.approveBlogs(request.payload,request.auth.credentials)
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
            _id :  Joi.string().required(),
            adminVerified : Joi.boolean().optional()
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
    path: "/Admin/listBlogs",
    options: {
      description: "List Blogs  Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listBlog(request.query,request.auth.credentials)
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
    method: "PUT",
    path: "/Admin/deleteBlog",
    options: {
      description: "Delete Blog Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.deleteBlog(request.payload)
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
          blogId :  Joi.string().required(),
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
    path: "/Admin/listHospitalBookings",
    options: {
      description: "List Hospital Bpoking API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listHospitalBookings(request.query)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query: {
          _id : Joi.string().optional(),
          bookingDate : Joi.string().optional(),    
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
    path: "/Admin/listMedicalTourism",
    options: {
      description: "list Medical Tourism API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listMedicalTourism(request.query)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        query : {
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
    path: "/Admin/addOtherDetails",
    options: {
      description: "Add Other Details API",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.addOtherDetails(request.payload)
          .then(response => {
            return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply);
          })
          .catch(error => {
            return UniversalFunctions.sendError("en", error, reply);
          });
      },
      validate: {
        payload: {
            type : Joi.string().valid(        
              Config.APP_CONSTANTS.OTHER_DETAILS.ABOUT,
              Config.APP_CONSTANTS.OTHER_DETAILS.CONTACT_US,
              Config.APP_CONSTANTS.OTHER_DETAILS.PRIVACY_POLICY,
              Config.APP_CONSTANTS.OTHER_DETAILS.TERMS_AND_CONDITIONS).optional(),
            description :  Joi.string().optional(),
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
    path: "/Admin/listOtherDetails",
    options: {
      description: "list Other Details Api",
      auth: { strategies: [Config.APP_CONSTANTS.SCOPE.ADMIN] },
      tags: ["api"],
      handler: (request, reply) => {
        return Controller.adminController.listOtherDetails(request.query)
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
          uniquekey :  Joi.string().optional()
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
