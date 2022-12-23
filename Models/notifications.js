const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Config = require("../Config");
const UniversalFunctions = require("../Utils/UniversalFunctions");

const notifications = new Schema({
  message: { type: String, default: "" },
  ambulanceId: { type: Schema.ObjectId, ref: "ambulance", sparse: true },
  notificationType: {type: String,
    enum: [ 
      Config.APP_CONSTANTS.NOTIFICATION_TYPE.AMBULANCE,
    ]
  },
  timeStamp: { type: String, default: new Date() }
});

module.exports = mongoose.model("notifications", notifications);