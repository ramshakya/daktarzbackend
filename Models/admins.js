const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const admins = new Schema({
    accessToken: {type: String, default: ""},
    password: {type: String, default: ""},
    email: {type: String, default: ""},
    time : {type: String, default: null},
    createdAt:{type: String, default: +new Date()}
})

module.exports = mongoose.model('admins', admins);
