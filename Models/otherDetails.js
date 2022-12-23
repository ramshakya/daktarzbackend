const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');


const otherDetails = new Schema({
    type : { type : String, 
    enum : [
        Config.APP_CONSTANTS.OTHER_DETAILS.ABOUT,
        Config.APP_CONSTANTS.OTHER_DETAILS.CONTACT_US,
        Config.APP_CONSTANTS.OTHER_DETAILS.PRIVACY_POLICY,
        Config.APP_CONSTANTS.OTHER_DETAILS.TERMS_AND_CONDITIONS
    ],
    default: null },
    description : { type : String, default : null },
    uniquekey : { type : String, default : null },
    createdAt : { type : Number, default : +new Date() }
})

module.exports = mongoose.model('otherDetails', otherDetails);