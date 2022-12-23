const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const ambulance = new Schema({
    hospitalId : {type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    accessToken : { type : String, default : "" },
    profilePicture : { type : String, default : "" },
    fullName : { type : String, default : "" },
    email : { type : String, default : "" },
    countryCode : { type: String, default : 91},
    phoneNo : { type : Number, default : 0 },
    alternateNumber : { type : Number, default : 0 },
    documents : [{ type : String, default : "" }],
    ambulanceStatus : {type: String,
        enum:[
            Config.APP_CONSTANTS.AMBULANCESTATUS.FREE,
            Config.APP_CONSTANTS.AMBULANCESTATUS.BUSY,
            Config.APP_CONSTANTS.AMBULANCESTATUS.OFFDUTY,
        ],
    default:Config.APP_CONSTANTS.AMBULANCESTATUS.FREE },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
    },
    address: { type: String, default: "" },
    password : { type: String, default: "" },
    registrationNo : { type : String, default : "" },
    registrationImage : [{ type : String, default : "" }],
    drivingLicence : { type: String, default: "" },
    vehicleNo : { type: String, default: "" },
    type : { type: String, default: "" },
    association : { type: String, default: "" },
    review:{ type: Number, default: 0 },
    rating:{ type: Number, default: 0 },
    otp : { type : Number, required : true, default : 0},
    otpVerify : { type : Boolean, required : true, default : false},
    deviceId : { type: String, default: "" },
    adminVerified : { type : Boolean, default : false},
    profileUpdated : { type : Boolean, default : false},
    passwordSet : { type : Boolean, required : true, default : false},
    isDeleted : { type : Boolean, default : false},
    createdAt : { type: String, default: +new Date() }
})

ambulance.index({ location: "2dsphere" });
module.exports = mongoose.model('ambulance', ambulance);
