const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const blogs = new Schema({
    doctorId : {type :Schema.ObjectId,ref:'doctors',sparse:true,default:null},
    hospitalId : {type :Schema.ObjectId,ref:'hospitals',sparse:true,default:null},
    text : {type: String, default: ""},
    image : {type: String, default: ""},
    title : {type: String, default: ""},
    type : {type: String,
        enum:[
            Config.APP_CONSTANTS.BLOG_TYPE.YOGA,
            Config.APP_CONSTANTS.BLOG_TYPE.HEALTH
        ],
    default:Config.APP_CONSTANTS.BLOG_TYPE.HEALTH },
    uniquekey : { type: String, default: null },
    adminVerified : {type:Boolean,default:false},
    isDeleted : {type:Boolean, default: false},
    createdAt : {type: String, default: +new Date()}
})

module.exports = mongoose.model('blogs', blogs);
