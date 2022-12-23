var SERVER = {
  APP_NAME: "daktarz",
  SECRET: "#FuneraleOkCfGKHJN<uHHSh",
  SALT: 11,
  JWT_SECRET_KEY_USER: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_ADMIN: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_AMBULANCE: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_HOSPITAL: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_DOCTOR: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_PHARMECY: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_LABS: "gff%$TGMJ^rztt",
  MAX_DISTANCE_RADIUS_TO_SEARCH: 10000,
  NOTIFICATION_KEY: "AAAAfgrOtIY:APA91bFKKkgD6GrO_pwnBYimcOw9FCSr6FegVZ2ZW5E2nhAlWdiP-Dhko96FAiyi5rp8VwB3fOvILDMGlPEc-K4lNT-q5ONBdmUTWC2nXI7gWmKum3swVb74qP0OgyhteE10WuMDdxfk"

};

var swaggerDefaultResponseMessages = [
  { code: 200, message: "OK" },
  { code: 400, message: "Bad Request" },
  { code: 401, message: "Unauthorized" },
  { code: 404, message: "Data Not Found" },
  { code: 500, message: "Internal Server Error" }
];

var SCOPE = {
  USER: "USER",
  ADMIN: "ADMIN",
  AMBULANCE: "AMBULANCE",
  HOSPITAL : "HOSPITAL",
  DOCTOR : "DOCTOR",
  PHARMECY : "PHARMECY",
  LABS : "LABS"
};

var MODELS = {
  users: "users",
  ambulance: "ambulance",
  hospitals : "hospitals",
  doctors : "doctors",
  pharmecy : "pharmecy",
  labs : "labs"
};

var TYPE = {
  BLOCKED: "BLOCKED",
  UNBLOCKED: "UNBLOCKED"
};

var DATABASE_CONSTANT = {
  DEVICE_TYPES: {
    IOS: "IOS",
    ANDROID: "ANDROID"
  }
};

var PHARMECY_STATUS = {
    PENDING: "PENDING",
    CANCEL : "CANCEL",
    COMPLETE : "COMPLETE",
    APPROVE : "APPROVE",
    SHIPPED : "SHIPPED",
    RATED : "RATED"
}

var LAB_STATUS = {
    PENDING: "PENDING",
    CANCEL : "CANCEL",
    COMPLETE : "COMPLETE",
    APPROVE : "APPROVE",
    SHIPPED : "SHIPPED",
    RATED : "RATED"
}

var REMINDER_TYPE = {
  URGENT : "URGENT",
  NORMAL:"NORMAL"
}

var DOCTOR_BOOKING_STATUS = {
    PENDING: "PENDING",
    CANCEL : "CANCEL",
    COMPLETE : "COMPLETE",
    APPROVE : "APPROVE",
    RATED : "RATED"
}

var DOCTOR_STATUS = {
  INDIVIDUAL : "INDIVIDUAL",
  HOSPITAL : "HOSPITAL",
  BOTH : "BOTH"
}

var CHAT_STATUS = {
  USER : "USER",
  DOCTOR : "DOCTOR",
  PENDING : "PENDING"
}

var BLOG_TYPE = {
  YOGA : "YOGA",
  HEALTH : "HEALTH"
}

var OTHER_DETAILS = {
  ABOUT : "ABOUT",
  CONTACT_US : "CONTACT_US",
  PRIVACY_POLICY : "PRIVACY_POLICY",
  TERMS_AND_CONDITIONS : "TERMS_AND_CONDITIONS"
}

/*var STATUS = {
    ACCEPT: "Accept",
    REJECT: "Reject",
    PENDING: "Pending",
    BUSY : "Artist Busy"
  };

var REQUEST_ACTION = {
    ACCEPT: "Accept",
    REJECT: "Reject",
    PENDING: "Pending"
  };



var CONNECTION_STATUS = {
    ACCEPT: "Accept",
    REJECT: "Reject",
    PENDING: "Pending",
    FOLLOW : "Following"
    
  };
*/
/*var NOTIFICATION_MESSAGE = {
    
  };*/

var NOTIFICATION_TYPE = {
  AMBULANCE: "AMBULANCE",

};

var MAX_DISTANCE = {
    RADIUS : 200000000
}

var GENDER = {
    MALE : "Male",
    FEMALE : "Female"
}

var DATABASE = {
    PROFILE_PIC_PREFIX : {
        ORIGINAL : 'profilePic_',
        THUMB : 'profileThumb_'
    },
    STATUS_TYPES: {
        PENDING: 3,
        ACCEPT: 2
    }

};

var AMBULANCESTATUS = {
    FREE : "FREE",
    BUSY : "BUSY",
    OFFDUTY: "OFFDUTY"
}

var CONTENT_TYPES = {
  CONTACT_US : "CONTACT_US",
  TERMS_CONDITIONS : "TERMS_CONDITIONS",
  PRIVACY_POLICY : "PRIVACY_POLICY",
  HELP : "HELP"
}

const ASSOCIATION = {
  HOSPITAL : "HOSPITAL",
  NGO : "NGO"
}

var LIMIT = {
  limit: 7
};

var APP_CONSTANTS = {
  SERVER: SERVER,
  swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
  SCOPE: SCOPE,
  MODELS: MODELS,
  DATABASE_CONSTANT: DATABASE_CONSTANT,
  TYPE: TYPE,
  PHARMECY_STATUS : PHARMECY_STATUS,
  LAB_STATUS : LAB_STATUS,
  REMINDER_TYPE : REMINDER_TYPE,
  DOCTOR_BOOKING_STATUS : DOCTOR_BOOKING_STATUS,
  /*STATUS: STATUS,
  REQUEST_ACTION : REQUEST_ACTION,
  NOTIFICATION_MESSAGE:NOTIFICATION_MESSAGE,
  CONNECTION_STATUS : CONNECTION_STATUS,
  PUSH_TYPE : PUSH_TYPE,*/
  MAX_DISTANCE : MAX_DISTANCE,
  CONTENT_TYPES : CONTENT_TYPES,
  ASSOCIATION : ASSOCIATION,
  GENDER : GENDER,
  DATABASE : DATABASE,
  DOCTOR_STATUS : DOCTOR_STATUS,
  AMBULANCESTATUS : AMBULANCESTATUS,
  NOTIFICATION_TYPE : NOTIFICATION_TYPE,
  LIMIT : LIMIT,
  CHAT_STATUS : CHAT_STATUS,
  BLOG_TYPE : BLOG_TYPE,
  OTHER_DETAILS : OTHER_DETAILS
};

module.exports = APP_CONSTANTS;
