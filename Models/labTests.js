const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const labTests = new Schema({
    labId : {type :Schema.ObjectId,ref:'labs',sparse:true,default:null},
    name : {type:String, default :""},
    description : {type:String, default :""},
    price : {type:Number, default : 0},
    isDeleted:{type:Boolean, default : false},
    createdAt : { type: String, default: +new Date() }
})

module.exports = mongoose.model('labTests', labTests);
