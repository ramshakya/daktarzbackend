const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const ambulanceBooking = new Schema({
    ambulanceId : {type :Schema.ObjectId,ref:'ambulance',sparse:true,default:null},
    hospitalId : {type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    userId : {type :Schema.ObjectId,ref:'users',sparse:true,default:null},
    status: {type: String,
      enum: ['PENDING','ASSIGN_DRIVER','START','REACHED','REACHED_HOSPITAL','COMPLETE','CANCELED']
    },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
      },
    address: { type: String, default: ""},
    bookingDate : {type:String, default : null},
    name : { type: String, default: ""},
    phoneNo: { type: Number, default: 0},
    createdAt : { type: String, default: +new Date() }
})


module.exports = mongoose.model('ambulanceBooking', ambulanceBooking);
