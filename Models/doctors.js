const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

var review = new Schema({
    userId : {type :Schema.ObjectId,ref:'users',sparse:true},
    stars : {type:Number, default :0},
    comment : {type:String},
    createdAt : { type: String, default: +new Date()}
  });

const doctors = new Schema({
    hospitalId : [{type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null}],
    accessToken : { type : String, default : "" },
    profilePicture : { type : String, default : "" },
    name : { type : String, default : "" },
    doctorId:{ type : String, default : "" },
    gender : {type: String,
      enum:[
          Config.APP_CONSTANTS.GENDER.MALE,
          Config.APP_CONSTANTS.GENDER.FEMALE
        ],
    default:Config.APP_CONSTANTS.GENDER.MALE },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
      },
    city : { type: String, default: "" },
    email : { type: String, default: "" },
    address: { type: String, default: "" },
    discount : { type: Number, default: 0 },
    consultantFees : { type : Number, default : 0 },
    education : { type: Array, default: null },
    awards : { type: Array, default: null },
    languages : { type: Array, default: null },
    membership : { type: Array, default: null },
    experience : { type : Number, default : 0 },
    password : { type: String, default: null },
    speciality : { type: Array, default: null },
    countryCode : { type: String, default : 91},
    phoneNo : { type : Number, default : 0 },
    alternateNumber : { type : Number, default : 0 },
    registrationNo : { type : String, default : 0 },
    regImage : { type : String, default : null },
    about : { type: String, default: "" },
    status : {type: String,
      enum:[
          Config.APP_CONSTANTS.DOCTOR_STATUS.INDIVIDUAL,
          Config.APP_CONSTANTS.DOCTOR_STATUS.HOSPITAL,
          Config.APP_CONSTANTS.DOCTOR_STATUS.BOTH
        ],
    default:Config.APP_CONSTANTS.DOCTOR_STATUS.INDIVIDUAL },
    review : [review],
    ratingsCount : { type : Number,  default : 0},
    averageRatings : { type : Number,  default : 0},
    starsCount_One : { type : Number,  default : 0},
    starsCount_Two : { type : Number,  default : 0},
    starsCount_Three : { type : Number,  default : 0},
    starsCount_Four : { type : Number,  default : 0},
    starsCount_Five : { type : Number, default : 0},
    services : { type : Array, default : [] },
    uniquekey : { type: String, default: null },

    otp : { type : Number, required : true, default : 0},
    otpVerify : { type : Boolean, required : true, default : false},
    passwordSet : { type : Boolean, required : true, default : false},
    adminVerified : { type : Boolean, default : false},
    profileUpdated : { type : Boolean, default : false},
    doctorVerified : { type : Boolean, default : false},
    isDeleted : { type : Boolean, default : false},
    createdAt : { type: String, default: +new Date() }
})

doctors.index({ location: "2dsphere" });
module.exports = mongoose.model('doctors', doctors);
