const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const pharmecyBookings = new Schema({
    userId : {type :Schema.ObjectId,ref:'users',sparse:true,default:null},
    pharmecyId : {type :Schema.ObjectId,ref:'pharmecy',sparse:true,default:null},
    images : [{type:String, default:""}],
    stars : {type:Number, default :0},
    comment : {type:String},
    bookingDate : {type:String, default : null},
    dateTime : {type : Number, default :0},
    month : {type:String, default:""},
    trackingLink : { type: String, default: "" },
    status : {type: String,
        enum:[
            Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING,
            Config.APP_CONSTANTS.PHARMECY_STATUS.CANCEL,
            Config.APP_CONSTANTS.PHARMECY_STATUS.COMPLETE,
            Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE,
            Config.APP_CONSTANTS.PHARMECY_STATUS.SHIPPED,
            Config.APP_CONSTANTS.PHARMECY_STATUS.RATED
        ],
    default:Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
      },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    createdAt:{type: String, default: +new Date()}

})


module.exports = mongoose.model('pharmecyBookings', pharmecyBookings);
