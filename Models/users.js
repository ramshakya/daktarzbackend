const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const users = new Schema({
    accessToken : { type : String, default : "" },
    profilePicture : { type: String, default : "https://previews.123rf.com/images/tuktukdesign/tuktukdesign1605/tuktukdesign160500002/57495136-user-icon-laptop-computer-device-worker-icon-in-illustration-.jpg"},
    name : { type: String, default : "user"},
    email : { type: String, default : ""},
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
      },
    address: { type: String, default: "" },
    houseNo : { type: String, default : ""},
    city : { type: String, default : ""},
    password:{ type: String, default : ""},
    passwordSet:{ type: Boolean, default : false},
    state : { type: String, default : ""},
    country : { type: String, default : ""},
    pincode : { type: Number, default : 0},
    countryCode : { type: String, default : ""},
    phoneNo : { type : Number, default : 0 },
    about : { type: String, default : ""},
    education : { type: Array, default: null },
    languages : { type: Array, default: null },
    gender : {type: String,
      enum:[
          Config.APP_CONSTANTS.GENDER.MALE,
          Config.APP_CONSTANTS.GENDER.FEMALE
        ],
    default:Config.APP_CONSTANTS.GENDER.MALE },
    dob : { type: String, default : ""},
    bloodGroup : { type: String, default : ""},
    timeZone : { type: String, default : ""},
    documents : [
        {
            image : {type : String, default : null},
            type : {type : String, default : "pdf"},
            title : {type : String, default : null},
        }

    ],

    otp : { type : Number, required : true, default : 0},
    otpVerify : { type : Boolean, required : true, default : false},
    adminVerified : { type : Boolean, default : false},
    profileUpdated : { type : Boolean, default : false},
    isDeleted : { type : Boolean, default : false},
    createdAt : { type: String, default: +new Date() }
})


module.exports = mongoose.model('users', users);
