const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

var labTests = new Schema({
    labId : {type :Schema.ObjectId,ref:'labs',sparse:true,default:null},
    labTestId : {type :Schema.ObjectId,ref:'labTests',sparse:true,default:null},
    name : {type:String, default :""},
    description : {type:String, default :""},
    price : {type:Number, default : 0},
    quantity : {type:Number, default: 0},
  });

const labsBookings = new Schema({
    userId : {type :Schema.ObjectId,ref:'users',sparse:true,default:null},
    labId : {type :Schema.ObjectId,ref:'labs',sparse:true,default:null},
    labTests : [labTests],
    totalPrice : {type:Number, default: 0},
    dateTime : {type : Number, default :0},
    month : { type: String, default: "" },
    bookingDate : {type:String, default : null},
    stars : {type:Number, default :0},
    trackingLink : { type: String, default: "" },
    description : { type: String, default: "" },
    comment : {type:String},
    status : {type: String,
        enum:[
            Config.APP_CONSTANTS.LAB_STATUS.PENDING,
            Config.APP_CONSTANTS.LAB_STATUS.CANCEL,
            Config.APP_CONSTANTS.LAB_STATUS.COMPLETE,
            Config.APP_CONSTANTS.LAB_STATUS.APPROVE,
            Config.APP_CONSTANTS.LAB_STATUS.SHIPPED,
            Config.APP_CONSTANTS.LAB_STATUS.RATED,
        ],
    default:Config.APP_CONSTANTS.LAB_STATUS.PENDING },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, -1] }
    },
    reports : [ 
        {
            image : {type : String, default : null},
            type : {type : String, default : "pdf"},
            title : {type : String, default : null},
        }
    ],
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    transactionId:{ type: String, default: "" },
    createdAt:{type: String, default: +new Date()}
})

module.exports = mongoose.model('labsBookings', labsBookings);
