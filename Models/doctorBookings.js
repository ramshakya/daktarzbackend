const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

var treatments = new Schema({
    treatmentId : {type :Schema.ObjectId,ref:'treatments',sparse:true,default:null},
    name : {type:String, default :""},
    price : {type:Number, default : 0},
  });

const doctorBookings = new Schema({
    userId : {type :Schema.ObjectId,ref:'users',sparse:true,default:null},
    hospitalId : {type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    doctorId : {type :Schema.ObjectId,ref:'doctors',sparse:true,default:null},
    bookingDay : {type: String, default: ""},
    bookingDate : {type: String, default: ""},
    startTime:{type: String, default: 0},
    endTime:{type: String, default: 0},
    totalPrice : {type:Number, default : 0},
    month : {type: String, default: ""},
    stars : {type:Number, default :0},
    comment : {type:String},
    status : {type: String,
        enum:[
            Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.PENDING,
            Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL,
            Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE,
            Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.APPROVE,
            Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED
        ],
    default:Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.PENDING },
    treatments : [treatments],
    prescription :  {type: String, default: ""},
    transactionId:{type: String, default: ""},
    isRead : {type : Boolean, default : false},
    description: [{type: String, default: ""}],
    createdAt:{type: String, default: +new Date()}
})

module.exports = mongoose.model('doctorBookings', doctorBookings);