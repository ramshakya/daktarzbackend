const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const treatments = new Schema({
    doctorId : {type :Schema.ObjectId,ref:'doctors',sparse:true,default:null},
    hospitalId : {type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    name : {type:String, default :""},
    description:{type:String, default :""},
    price : {type:Number, default : 0},
    discount : { type: Number, default: 0 },
    isDeleted : { type: Boolean, default: false },
    createdAt : { type: String, default: +new Date() }
})


module.exports = mongoose.model('treatments', treatments);
