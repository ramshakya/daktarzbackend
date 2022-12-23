/**
 * Created by Prince
 */
exports.ERROR = {


    DOCTOR_NOT_VERIFIED: {
        statusCode: 400,
        customMessage: {
            en : 'Doctor not verified . Please contact admin',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'DOCTOR_NOT_VERIFIED'
    },


    TIMING_ALREADY_EXISTS: {
        statusCode: 400,
        customMessage: {
            en : 'The timing you are tring to add is already exist. Please try another',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'TIMING_ALREADY_EXISTS'
    },


    TIMING_ERROR: {
        statusCode: 400,
        customMessage: {
            en : 'Start time is greater than close time',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'TIMING_ERROR'
    },
    
    NOT_FOUND: {
        statusCode: 400,
        customMessage: {
            en : 'Your Account Is temporary Blocked Please contact Admin',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'NOT_FOUND'
    },

    CURRENT_TIME: {
        statusCode: 400,
        customMessage: {
            en : 'current time is not between specific time',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'CURRENT_TIME'
    },

    DOCTOR_NOT_AVAILABLE: {
        statusCode: 400,
        customMessage: {
            en : 'Doctor not available at this moment. Please try after some time',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'DOCTOR_NOT_AVAILABLE'
    },

    LAB_CLOSED: {
        statusCode: 400,
        customMessage: {
            en : 'Lab Is Closed',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'LAB_CLOSED'
    },


    PHARMECY_CLOSED: {
        statusCode: 400,
        customMessage: {
            en : 'Pharmecy Is Closed',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'PHARMECY_CLOSED'
    },

    NO_HOSPITAL_FOUND: {
        statusCode: 400,
        customMessage: {
            en : 'No ambulance found',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'NO_HOSPITAL_FOUND'
    },

    PROFILE_NOT_UPDATED: {
        statusCode: 400,
        customMessage: {
            en : 'profile not updated',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'PROFILE_NOT_UPDATED'
    },

    USER_NOT_VERIFIED: {
        statusCode: 400,
        customMessage: {
            en : 'User Not Verified By Admin',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'USER_NOT_VERIFIED'
    },

    NO_AMBULANCE_FOUND: {
        statusCode: 400,
        customMessage: {
            en : 'No ambulance found',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'NO_AMBULANCE_FOUND'
    },

    DOCTOR_ALREADY_BOOKED: {
        statusCode: 400,
        customMessage: {
            en : 'Doctor already booked by someone',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'DOCTOR_ALREADY_BOOKED'
    },

    ERROR_INSERTING_TIME_SLOT: {
        statusCode: 400,
        customMessage: {
            en : 'This time slot cannot be inserted because it cause conflict to existing time slot',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ERROR_INSERTING_TIME_SLOT'
    },

    WRONG_ACCESS_TOKEN: {
        statusCode: 400,
        customMessage: {
            en : 'Wrong access token',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'WRONG_ACCESS_TOKEN'
    },

    ALREADY_REGISTERED_AS_HOSPITAL: {
        statusCode: 400,
        customMessage: {
            en : 'This Number Is Already Registered As Hospital',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ALREADY_REGISTERED_AS_HOSPITAL'
    },

    ALREADY_REGISTERED_AS_DOCTOR: {
        statusCode: 400,
        customMessage: {
            en : 'This Number Is Already Registered As Doctor',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ALREADY_REGISTERED_AS_DOCTOR'
    },

    ALREADY_REGISTERED_AS_AMBULANCE: {
        statusCode: 400,
        customMessage: {
            en : 'This Number Is Already Registered As Ambulance',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ALREADY_REGISTERED_AS_AMBULANCE'
    },

    ALREADY_REGISTERED_AS_LABS: {
        statusCode: 400,
        customMessage: {
            en : 'This Number Is Already Registered As Labs',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ALREADY_REGISTERED_AS_LABS'
    },

    ALREADY_REGISTERED_AS_PHARMECY: {
        statusCode: 400,
        customMessage: {
            en : 'This Number Is Already Registered As Pharmecy',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ALREADY_REGISTERED_AS_PHARMECY'
    },

    YOU_ALREADY_BOOKED_AN_AMBULANCE: {
        statusCode: 400,
        customMessage: {
            en : 'you had already booked an ambulance',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'YOU_ALREADY_BOOKED_AN_AMBULANCE'
    } ,

    
    INVALID_MOBILE_NUMBER: {
        statusCode: 400,
        customMessage: {
            en : 'Invalid Mobile Number',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'INVALID_MOBILE_NUMBER'
    } ,

    LIMIT_EXDEDDED: {
    statusCode: 400,
    customMessage: {
        en : 'You had already sent 3 requests in last two hours!!! Please try after some time',
     //   ar : 'كلمة المرور غير صحيحة.'
    },
    type: 'LIMIT_EXDEDDED'
} ,


    INVALID_REQUEST_ID: {
        statusCode: 400,
        customMessage: {
            en : 'Invalid Request Id',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'INVALID_REQUEST_ID'
    } ,
    DUTY_STATUS_CHANGE :{
        statusCode: 400,
        customMessage: {
            en : 'either in between in booking or invalid request',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'DUTY_STATUS_CHANGE'
    } ,

    OLD_PASSWORD_MISMATCH: {
        statusCode: 400,
        customMessage: {
            en : 'Old Password Mismatch',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'OLD_PASSWORD_MISMATCH'
    },

    INVALID_OBJECT_ID : {
        statusCode:400,
        customMessage : {
            en : 'Invalid Id provided.',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : 'INVALID_OBJECT_ID'
    },
    NAME_ALREADY_EXISTS : {
        statusCode:400,
        customMessage : {
            en : 'Name Already Exists Please Change Name',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : 'NAME_ALREADY_EXISTS'
    },

    WRONG_EMAIL_ADDRESS : {
        statusCode:400,
        customMessage : {
            en : 'The email you entered does not match any accounts.Please check your email.',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : 'WRONG_EMAIL_ADDRESS'
    },
    
    INVALID_USER_ID : {
        statusCode:400,
        customMessage : {
            en : 'Invalid UserId provided.',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : 'INVALID_USER_ID'
    },
    
    COLLECTION_EMPTY : {
        statusCode:400,
        customMessage : {
            en : 'Collection is Empty',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : 'COLLECTION_EMPTY'
    },
    INVALID_STORY_ID : {
        statusCode:400,
        customMessage : {
            en : 'Invalid Story Id provided.',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : 'INVALID_STORY_ID'
    },
    
    NO_DATA_FOUND : {
        statusCode:400,
        customMessage : {
            en : 'No Data Found',
          //  ar : 'قدمت رقم غير صالح.'
        },
        type : ' NO_DATA_FOUND'
    },

    INVALID_OPERATION : {
        statusCode:400,
        customMessage : {
            en : 'Invalid operation.',
        },
        type : 'INVALID_OPERATION'
    },
    DB_ERROR: {
        statusCode: 400,
        customMessage: {
            en : 'DB Error : ',
           // ar : 'DB خطأ:'
        },
        type: 'DB_ERROR'
    },
    ALREADY_CONNECTED: {
        statusCode: 400,
        customMessage: {
            en : 'Application already connected with hardware device',
            // ar : 'DB خطأ:'
        },
        type: 'ALREADY_CONNECTED'
    },

    APP_ERROR: {
        statusCode: 400,
        customMessage: {
            en : 'Application Error ',
         //   ar : 'خطأ في تطبيق'
        },
        type: 'APP_ERROR'
    },
    DUPLICATE: {
        statusCode: 400,
        customMessage: {
            en : 'Duplicate Entry',
          //  ar : 'إدخال مكرر'
        },
        type: 'DUPLICATE'
    },
    DEFAULT: {
        statusCode: 400,
        customMessage: {
            en : 'Something went wrong.',
         //   ar : 'هناك خطأ ما.'
        },
        type: 'DEFAULT'
    },
    UNAUTHORIZED: {
        statusCode:401,
        customMessage : {
            en : 'You are not authorized to perform this action',
           // ar : 'لا تملك الصلاحية لتنفيذ هذا الإجراء'
        },
        type : 'UNAUTHORIZED'
    },

    INVALID_CREDENTIALS : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! The Phone Number or Password is incorrect.',
          //  ar : 'وجه الفتاة! البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        },
        type: 'INVALID_CREDENTIALS'
    },
    INVALID_IMEI : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! The invaild imei number.',
            //  ar : 'وجه الفتاة! البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        },
        type: 'INVALID_IMEI'
    },
    WRONG_PASSWORD: {
        statusCode: 400,
        customMessage: {
            en : 'Password is Incorrect.',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'WRONG_PASSWORD'
    } ,
    WRONG_OTP: {
        statusCode: 400,
        customMessage: {
            en : 'OTP is Incorrect.',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'WRONG_OTP'
    } ,
    USER_BLOCKED: {
        statusCode: 401,
        customMessage: {
            en : 'User Is Blocked By Admin.',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'USER_BLOCKED'
    } ,

    ARTIST_BLOCKED: {
        statusCode: 401,
        customMessage: {
            en : 'Artist Is Blocked By Admin.',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'ARTIST_BLOCKED'
    } ,
    OTP_NOT_VERIFIED: {
        statusCode: 400,
        customMessage: {
            en : 'OTP Not Verified',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'OTP_NOT_VERIFIED'
    } ,
     
    WRONG_ACCESS_TOKEN: {
        statusCode: 400,
        customMessage: {
            en : 'Access Token is Incorrect',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'WRONG_ACCESS_TOKEN'
    } ,

    OLD_WRONG_PASSWORD: {
        statusCode: 400,
        customMessage: {
            en : 'Old Password is Incorrect.',
         //   ar : 'كلمة المرور غير صحيحة.'
        },
        type: 'OLD_WRONG_PASSWORD'
    } ,

    PHONE_NO_NOT_FOUND: {
        statusCode:400,
        customMessage : {
            en : 'Phone Number not found',
           // ar : 'لا تملك الصلاحية لتنفيذ هذا الإجراء'
        },
        type : 'PHONE_NO_NOT_FOUND'
    },
    EMAIL_ALREADY_EXIST: {
        statusCode:400,
        customMessage : {
            en : 'The email address provided has already been used. Please provide another email address',
           // ar : ''
        },
        type : 'EMAIL_ALREADY_EXIST'
    },
    EMAIL_OR_PASSWORD_ALREADY_EXIST: {
        statusCode:400,
        customMessage : {
            en : 'The email address or Mobile Number provided has already been used. Please provide another ',
            // ar : ''
        },
        type : 'EMAIL_OR_PASSWORD_ALREADY_EXIST'
    },

    MOBILE_ALREADY_EXIST: {
        statusCode:400,
        customMessage : {
            en : 'The Mobile Number provided has already been used. Please provide another ',
            // ar : ''
        },
        type : 'MOBILE_ALREADY_EXIST'
    },


    USER_NOT_FOUND: {
        statusCode: 404,
        customMessage: {
            en:  'Customer not found'
        },
        type : 'CUSTOMER_NOT_FOUND'
    },
    EMAIL_NOT_FOUND: {
        statusCode: 400,
        customMessage: {
            en:  'Email not found'
        },
        type : 'EMAIL_NOT_FOUND'
    },
    NOT_CONNECTED_DEVICE_FOUND: {
        statusCode: 400,
        customMessage: {
            en:  'not connected device found'
        },
        type : 'NOT_CONNECTED_DEVICE_FOUND'
    },

};
exports.SUCCESS = {
    DEFAULT: {
        statusCode: 200,
        customMessage: {
            en : 'Success',
           // ar : 'نجاح'
        },
        type: 'DEFAULT'
    },
    ADDED : {
        statusCode: 200,
        customMessage: {
            en : 'Added successfully.',
           // ar : 'اضيف بنجاح.'
        },
        type: 'ADDED'
    },
    FORGOT_PASSWORD: {
        statusCode: 200,
        customMessage: {
            en: "A reset password link is sent to your registered email address."
        },
        type: 'FORGOT_PASSWORD'
    },
    PASSWORD_RESET_SUCCESSFULL:{
        statusCode:200,
        customMessage:{
            en:"Your Password has been Successfully Changed"
        },
        type:'PASSWORD_RESET_SUCCESSFULL'
    },
    RESET_PASSWORD:{
        statusCode:200,
        customMessage:{
            en:"A reset password OTP has been sent to your registered Phone Number"
        },
        type: 'RESET_PASSWORD'
    }
};