const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const reminder = new Schema({
    userId : {type :Schema.ObjectId,ref:'users',sparse:true,default:null},
    userPhoneNo : { type: Number, default : 0},
    name : { type: String, default : ""},
    type : {type: String,
      enum:[
          Config.APP_CONSTANTS.REMINDER_TYPE.URGENT,
          Config.APP_CONSTANTS.REMINDER_TYPE.NORMAL
        ]},
    date : { type: String, default : ""},
    time : { type: Number, default : 0},
    reminderDate : { type: Number, default : 0},
    isDeleted : { type : Boolean, default : false},
    smsSent : { type : Boolean, default : false},
    createdAt : { type: String, default: +new Date() }
})


module.exports = mongoose.model('reminder', reminder);
