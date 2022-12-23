const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const medicalTourism = new Schema({
    countryCode : { type : String, default : null },
    phoneNo : { type : Number, default : 0 },
    medicalRecords : { type : Array, default : null },
    subject : { type : String, default : null },
    description : { type : String, default : null }
})


module.exports = mongoose.model('medicalTourism', medicalTourism);
