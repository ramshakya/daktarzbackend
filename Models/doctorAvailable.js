const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const doctorAvailable = new Schema({
    hospitalId : {type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    doctorId : {type :Schema.ObjectId,ref:'doctors',sparse:true,default:null},
    day : {type : String, default : ""},
    startTime : {type : String, default : ""},
    endTime : {type : String, default : ""},
    createdAt : { type: String, default: +new Date() }
})


module.exports = mongoose.model('doctorAvailable', doctorAvailable);
