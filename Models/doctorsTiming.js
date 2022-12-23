const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const doctorsTiming = new Schema({
    doctorId : {type :Schema.ObjectId,ref:'doctors',sparse:true,default:null},
    hospitalId:{type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    day:{type: String, default: ""},
    showDay:{type: String, default: ""},
    disable:{type: Boolean, default: false},
    openTime:{type: Number, default: 0},
    closeTime:{type: Number, default: 0},
    startTime : {tpye:String, default : ""},
    endTime : {tpye:String, default : ""},
    openDate:{type: String, default: 0},
    closeTimeString:{type: String, default: 0},
    openTimeString:{type: String, default: 0},
    closeMeridian:{type: String, default: 0},
    openMeridian:{type: String, default: 0},
    
    closeDate:{type: Number, default: 0},
    createdAt:{type: String, default: +new Date()}

})

module.exports = mongoose.model('doctorsTiming', doctorsTiming);
