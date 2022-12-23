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

const hospitals = new Schema({
    accessToken : { type : String, default : "" },
    name : { type: String, default : ""},
    hospitalId:  { type : String, default : "" },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
      },
    city : { type: String, default: "" },
    address: { type: String, default: "" },
    email : { type: String, default: "" },        // ADDED ON OCT 22 2018
    awards : { type: Array, default: null },       // ADDED ON OCT 22 2018
    membership : { type: Array, default: null },     // ADDED ON OCT 22 2018
    phoneNo : { type : Number, default : 0 },
    countryCode : { type: String, default : 91},
    password : { type: String, default: null },
    alternateNumber : { type : Number, default : 0 },
    coverPhoto : { type: String, default: "" },
    images : [{ type : String, default : "" }],
    
    review: [review],
    ratingsCount : { type : Number,  default : 0},
    averageRatings : { type : Number,  default : 0},
    starsCount_One : { type : Number,  default : 0},
    starsCount_Two : { type : Number,  default : 0},
    starsCount_Three : { type : Number,  default : 0},
    starsCount_Four : { type : Number,  default : 0},
    starsCount_Five : { type : Number, default : 0},

    discount : { type: Number, default: 0 },
    description : { type : String, default : "" },
    registrationNo : { type : String, default : "" },
    regImage : { type : String, default : "" },    // ADDED ON OCT 22 2018
    fees : { type : Number, default : 0 },
    website : { type : String, default : "" },
    speciality : { type: Array, default: null },
    services : { type : Array, default : [] },


    otp : { type : Number, required : true, default : 0},
    otpVerify : { type : Boolean, required : true, default : false},
    adminVerified : { type : Boolean, default : false},
    profileUpdated : { type : Boolean, default : false},
    passwordSet : { type : Boolean, required : true, default : false},
    isDeleted : { type : Boolean, default : false},
    createdAt : { type: String, default: +new Date() }
})

hospitals.index({ location: "2dsphere" });
module.exports = mongoose.model('hospitals', hospitals);
