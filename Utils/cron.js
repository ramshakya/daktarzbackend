const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  smsManager = require("../Libs/smsManager"),
  moment = require('moment'),
  CronJob = require('cron').CronJob,
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");
  randomstring = require("randomstring");
   


  const pushCron = new CronJob('*/10 * * * *', async () => {

    let currentTime = moment().tz("Asia/Kolkata").format("x")
    console.log("===================================currentTime",currentTime)

    let currentTimeInString = moment().tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm")
    console.log("===================================currentTimeInString",currentTimeInString)



    let query = {
      time : {$lte : currentTime},
      isDeleted:false,
      smsSent:false

    }

    let reminders = await DAO.getData(Models.reminder,query,{},{lean:true})
    console.log("==========================================reminders==>",reminders)

    for(let i =0; i<reminders.length; i++) {

      let time = moment(reminders[i].time, "x").tz("Asia/Kolkata").format("HH:mm")

      let message = "You have set a reminder for " + reminders[i].name + " at " + time
      let sendMessage =  smsManager.sendSms(reminders[i].userPhoneNo,message)

      let query2 = {_id : reminders[i]._id}

      let updateData = {
        smsSent : true
      }

      let updateReminders = await DAO.findAndUpdate(Models.reminder,query2,updateData,{new:true})
      console.log("==========================================updateReminders==>",updateReminders)

    }



    
});


module.exports = {
    pushCron : pushCron
}