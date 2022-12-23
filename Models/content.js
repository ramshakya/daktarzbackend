const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');


const content = new Schema({
    type :{ type:String,enum:[
        Config.APP_CONSTANTS.CONTENT_TYPES.HELP,
        Config.APP_CONSTANTS.CONTENT_TYPES.CONTACT_US,
        Config.APP_CONSTANTS.CONTENT_TYPES.PRIVACY_POLICY,
        Config.APP_CONSTANTS.CONTENT_TYPES.TERMS_CONDITIONS,
    ],
    default: null},
    description : { type: String ,default: null },
    isDeleted : { type: Boolean, default:false },
    createdAt:{ type: Number, default:+new Date() }

})

module.exports = mongoose.model('content', content);