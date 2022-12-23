const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Config = require("../Config");
const UniversalFunctions = require("../Utils/UniversalFunctions");


let  chats = new Schema({
    doctorId : {type :Schema.ObjectId,ref:'docotrs',sparse:true,default:null},
    userId : {type :Schema.ObjectId,ref:'users',sparse:true,default:null},
    bookingId : {type :Schema.ObjectId,ref:'doctorBookings',sparse:true,default:null},
    sentBy : {type: String,
        enum:[
            Config.APP_CONSTANTS.CHAT_STATUS.USER,
            Config.APP_CONSTANTS.CHAT_STATUS.DOCTOR
        ]
    }, 
    //senderPic : {type : String, default : ""}, 
    message : {type : String, default :null}, 
    sentAt : {type : String, default: +new Date()},
});

module.exports = mongoose.model('chats', chats);