/**
 * Created by Prince
 */

const Jwt = require('jsonwebtoken'),
    Config = require('../Config'),
    DAO = require('../DAOManager').queries,
    Models = require('../Models/'),
    UniversalFunctions = require('../Utils/UniversalFunctions'),
    _ = require('lodash')
ERROR = Config.responseMessages.ERROR;

var FCM = require('fcm-push');

var sendNotification = async (data,deviceToken) => {


    var fcm = new FCM(Config.APP_CONSTANTS.SERVER.NOTIFICATION_KEY);

    let message = {
        to: deviceToken,
        notification: {
        title:data.title,
        message : data.message,
        pushType : data.pushType,
        body: data.message,
        sound:"default",
        badge:0,
        },
        data:data,
        priority: 'high'
    };

   // console.log("sdffd ",message );

    fcm.send(message, function (err, result) {
    //    console.log("push android/ios..", err,result);
        return null;
    });
};

module.exports={
    sendNotification:sendNotification
};

