//CREATED BY ABHISHEK DHADWAL
const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  smsManager = require("../Libs/smsManager"),
  moment = require('moment'),
  otp = 1234,
  commonController = require("./commonController"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");




const pharmecyLogin = async (payloadData) => {
  try {
    let deletedata = await commonController.checkDatabase(payloadData)
    let generateOtp = await commonController.generateOtp()
    console.log("=======================================generateOtp",generateOtp)

    let query = { 
      countryCode : payloadData.countryCode,
      phoneNo : payloadData.phoneNo, 
      isDeleted : false,
      $or : [
        {profileUpdated : true},
        {adminVerified : true}
      ]
    }
    let checkPharmecy = await DAO.getData(Models.pharmecy, query, {}, {lean:true})
    
    let checkLabs = await DAO.getData(Models.labs, query, {}, {lean:true})
    if(checkLabs.length) {
      throw ERROR.ALREADY_REGISTERED_AS_LABS;
    }
    let checkHospital = await DAO.getData(Models.hospitals, query, {}, {lean:true})
    if(checkHospital.length) {
      throw ERROR.ALREADY_REGISTERED_AS_HOSPITAL;
    }
    let checkDoctor = await DAO.getData(Models.doctors, query, {}, {lean:true})
    if(checkDoctor.length) {
      throw ERROR.ALREADY_REGISTERED_AS_DOCTOR;
    }
    let checkAmbulance = await DAO.getData(Models.ambulance, query, {}, {lean:true})
    if(checkAmbulance.length) {
      throw ERROR.ALREADY_REGISTERED_AS_AMBULANCE;
    }

    console.log("==============================================query",query)
    console.log("==============================================checkPharmecy",checkPharmecy)

    if (checkPharmecy.length == 0) {
      let saveData = {
        countryCode : payloadData.countryCode,
        phoneNo: payloadData.phoneNo,
        otp: generateOtp
      };

      let createPharmecy = await DAO.saveData(Models.pharmecy, saveData);
      var message = commonController.otpMessage()
      let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)

      if (createPharmecy._id) {
        let tokenData = {
              scope: Config.APP_CONSTANTS.SCOPE.PHARMECY,
              _id: createPharmecy._id,
              time: new Date().getTime()
        };
     

        let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.PHARMECY);

      

        if (accessToken == null) {
          throw ERROR.DEFAULT;
        }

        let tokenResult = await DAO.findAndUpdate(Models.pharmecy,{ _id: createPharmecy._id },
          { accessToken: accessToken},
          { new: true }
        );

        let arr = []
        arr.push({
          otp : tokenResult.otp,
          passwordSet : tokenResult.passwordSet
        })

        return arr[0]

      } 
      else {
        throw ERROR.DB_ERROR;
      }
    } 

    else {

      let query = {  
        countryCode : payloadData.countryCode,
        phoneNo: payloadData.phoneNo, 
        isDeleted:false
      };

      let getData = await DAO.getData(Models.pharmecy, query, {}, {lean:true})

      if(getData[0].passwordSet != true) {
          var message = commonController.otpMessage()
          let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
      }

      let tokenData = {
        scope: Config.APP_CONSTANTS.SCOPE.PHARMECY,
        _id: getData[0]._id,
        time: new Date().getTime()
      };

      let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.PHARMECY);

      if (accessToken == null) {
        throw ERROR.DEFAULT;
      }

      let updateData = {
        accessToken: accessToken,
        otp : generateOtp
      }

      let tokenResult = await DAO.findAndUpdate(Models.pharmecy,{ _id: getData[0]._id },updateData,{ new: true });

      let arr = []
      arr.push({
        otp: tokenResult.otp,
        passwordSet: tokenResult.passwordSet
      })

      return arr[0]
     } 
     
    
  } catch (err) {
    throw err;
  }
};

const updateProfile = async(payloadData,userData) => {
  try {
    console.log("=======payloadData=======payloadData=========================payloadData=>",payloadData)
    let updateProfile = await commonController.pharmecyProfile(payloadData,userData._id)
 
    return updateProfile

  }
  catch (err) {
    throw err;
  }
}


const otpVerify = async (payloadData, userData) => {
  try {
    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    };

    let otpVerify = await DAO.getData(Models.pharmecy, query, {}, { lean: true });
    
    if(otpVerify.length) {
      if (!(otpVerify[0].otp == payloadData.otp)) {
        throw ERROR.WRONG_OTP;
      }
  
      let setData = { otpVerify: true }
      let options = { new : true }
      let update = await DAO.findAndUpdate(Models.pharmecy, query, setData, {options});
      return update;
    }

    else {
      throw ERROR.NO_DATA_FOUND;
    }
  }
   catch (err) {
    throw err;
  }
};


//RESEND OTP
const otpResend = async (payloadData) => {
  try {

    let generateOtp =  commonController.generateOtp()
    console.log("=======================================generateOtp",generateOtp)

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    };

    let getData = await DAO.getData(Models.pharmecy,query,{},{lean:true})
    if(getData.length) {
      let query2 = { phoneNo:getData[0].phoneNo };
      let options = { new: true };
      let setData = { otp: generateOtp };
      let update = await DAO.findAndUpdate(Models.pharmecy, query2, setData, options);
      var message = commonController.otpMessage()
      let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
      return update.otp;
    }
    else {
      throw ERROR.NO_DATA_FOUND;
    }

}
  catch (err) {
    throw err;
  }
};


const listPharmecy = async(payloadData,userData) => {
  try {

    let models = Models.pharmecy;
    let listData = await commonController.listData(null,userData._id,models)
    return listData

  }
  catch (err) {
    throw err;
  }
}

//List Hospitals
const listHospitals = async(payloadData) => {
  try {
    let models = Models.hospitals;
    let listData = await commonController.listData(payloadData._id,null,models)
   
    return listData
  }
  catch (err) {
    throw err;
  }
}

const accessTokenLogin = async(userData) =>{
  try{
    let getPharmacyData = await DAO.getData(Models.pharmecy,{_id:userData._id},{},{lean:true})
    return getPharmacyData[0]
  }catch(err){
    throw err;
  }
}


/*const pharmecyTiming = async (payloadData,userData) => {

  let removeTiming = await DAO.remove(Models.pharmecyTiming,{pharmecyId:userData._id})

  let data = [];

  let timing = payloadData.timing;
   // [{"pharmecyId" : "5dad65e5eaed8479cb99462c","openTime":"9:00","closeTime":"20:00","openDate":"21/10/2019","closeDate":"27/10/2019"}]
  for(let i = 0; i< timing.length;i++){
    data.push({
      pharmecyId:userData._id,
      showDay:timing[i].showDay,
      openTime:timing[i].openTime,
      closeTime:timing[i].closeTime,
      closeDate:timing[i].closeDate,
      openDate:timing[i].openDate,
      disable:timing[i].disable
    })
  }

  let addTiming = await DAO.insertMany(Models.pharmecyTiming,data);
  return null;
}*/

const pharmecyTiming = async(payloadData,userData) => {
  try {
    console.log("===========================================payloadData",payloadData)
    let removeTiming = await DAO.remove(Models.pharmecyTiming,{pharmecyId:userData._id})
    let  data = []
    let timing = payloadData.timing; 
    for(let i = 0; i< timing.length;i++) {

    console.log("================================timing[i].openTime",timing[i].openTime)
    console.log("================================timing[i].closeTime",timing[i].closeTime)

    if(timing[i].openTime > timing[i].closeTime) {

      throw ERROR.TIMING_ERROR;

    }

      data.push({
          pharmecyId:userData._id,
          day:timing[i].day,
          showDay:timing[i].showDay,
          openTime:parseInt(timing[i].openTime),
          closeTime:parseInt(timing[i].closeTime),
          startTime : timing[i].startTime,
          endTime :  timing[i].endTime,
          closeDate: timing[i].closeDate,
          openDate : timing[i].openDate,
          disable : timing[i].disable,
          closeTimeString : timing[i].closeTimeString,
          openTimeString : timing[i].openTimeString,
          closeMeridian : timing[i].closeMeridian,
          openMeridian : timing[i].openMeridian,
        })   
        for(let j = 0; j<timing.length; j++) {
          console.log("======================timing[i]",timing[i])
          console.log("======================timing[j]",timing[j])
         if( i !== j) {
          if(timing[i].day == timing[j].day) {

            if( ( timing[j].openTime >= timing[i].openTime &&
                timing[j].openTime <= timing[i].closeTime &&
                timing[j].closeTime >= timing[i].openTime &&
                timing[j].closeTime <= timing[i].closeTime ) ||

              ( timing[j].openTime <= timing[i].openTime &&
                timing[j].openTime <= timing[i].closeTime &&
                timing[j].closeTime >= timing[i].openTime &&
                timing[j].closeTime >= timing[i].closeTime ) ||

              ( timing[j].openTime <= timing[i].openTime &&
                timing[j].openTime <= timing[i].closeTime &&
                timing[j].closeTime >= timing[i].openTime &&
                timing[j].closeTime <= timing[i].closeTime ) ||

              ( timing[j].openTime >= timing[i].openTime &&
                timing[j].openTime <= timing[i].closeTime &&
                timing[j].closeTime >= timing[i].openTime &&
                timing[j].closeTime >= timing[i].closeTime ) 
           ) 
          {
            throw ERROR.ERROR_INSERTING_TIME_SLOT;
          }


        }
      }
    }
  }
 
  let addTiming = await DAO.insertMany(Models.pharmecyTiming,data);
  }

  
  catch (err) {
    throw err;
  }
}



const listPharmecyTiming = async(userData) =>{
  let timing  = await DAO.getData(Models.pharmecyTiming,{pharmecyId:userData._id},{},{lean:true})
  return timing;
}

const listBookings = async(payloadData,userData) => {
  try {

    let query = {
      pharmecyId : userData._id
    }

    /*if(payloadData.status == Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING) {
      query.status = {$in : [Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING,
                             Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE,
                             Config.APP_CONSTANTS.PHARMECY_STATUS.SHIPPED]}
    }

    if(payloadData.status == Config.APP_CONSTANTS.PHARMECY_STATUS.COMPLETE) {
      query.status = {$in : [Config.APP_CONSTANTS.PHARMECY_STATUS.COMPLETE,
                             Config.APP_CONSTANTS.LAB_STATUS.RATED]}
    }


    if(payloadData.startDate && payloadData.endDate) {
      query.createdAt = { $gte : payloadData.startDate , $lt:payloadData.endDate }
    }*/

    if(payloadData.date) {
      query.bookingDate = payloadData.date
    }

    let options = {
        lean: true,
        sort : {_id : -1}
    }

   /* let populate = [
      {
        path : "userId",
        select : 'phoneNo location address houseNo city state country pincode'
      }
    ]*/
    
    let listBookings = await DAO.getData(Models.pharmecyBookings,query,{},options)
    let output = []

    for(let i = 0; i<listBookings.length; i++) {

      let query = { _id : listBookings[i].userId }

      if(payloadData.phoneNo) {
        query.phoneNo = payloadData.phoneNo
      }

      let usersData = await DAO.getData(Models.users,query,{},{lean:true})

      for(let j = 0; j<usersData.length; j++) {

        output.push({
          _id : listBookings[i]._id,
          userId : {
            "phoneNo" : usersData[j].phoneNo,
            "location" : usersData[j].location,
            "address" : usersData[j].address,
            "houseNo" : usersData[j].houseNo,
            "city" : usersData[j].city,
            "state" : usersData[j].state,
            "country" : usersData[j].country,
            "pincode" : usersData[j].pincode,
            "_id": usersData[j]._id
          },
          pharmecyId : listBookings[i].pharmecyId,
          images : listBookings[i].images,
          stars : listBookings[i].stars,
          comment : listBookings[i].comment,
          bookingDate : listBookings[i].bookingDate,
          dateTime : listBookings[i].dateTime,
          month : listBookings[i].month,
          trackingLink : listBookings[i].trackingLink,
          status : listBookings[i].status,
          location : listBookings[i].location,
          address : listBookings[i].address,
          city : listBookings[i].city,
          createdAt : listBookings[i].createdAt,
        })
      }
    }

    return output


  }
  catch (err) {
    throw err;
  }
}

const bookingStatusUpdate = async(payloadData,userData) => {
  try {

    let message, sendMessage
    let query = {_id : payloadData._id}

    let update = {status : payloadData.status}

    let updateStatus = await DAO.findAndUpdate(Models.pharmecyBookings,query,update,{new:true})
    let userDetails = await DAO.getData(Models.users,{_id:updateStatus.userId},{},{lean:true})
    //console.log("==============================updateStatus",updateStatus)

    let pickupDateTime = moment(updateStatus.dateTime,"x").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
    //console.log("==============================pickupDateTime",pickupDateTime)

    let deliveryDateTime = moment(updateStatus.dateTime,"x").tz("Asia/Kolkata").add(30,"minutes").format("YYYY-MM-DD HH:mm:ss")
   // console.log("==============================deliveryDateTime",deliveryDateTime)

    if(payloadData.status == Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE) {
      let time = moment(updateStatus.dateTime,"x").tz("Asia/Kolkata").format("HH:mm")
      message = "Your order is confirmed by " + userData.name + " for time "+ time +" and date " + updateStatus.bookingDate
      sendMessage =  smsManager.sendSms(userDetails[0].phoneNo,message)

    let data = {
        "api_key" : "50606582f6405d1f544e767b565625431be2c6fe28db7e3d591802",
        "order_id" : payloadData._id,
        "team_id" : "",
        "auto_assignment" : 0,
        "job_description" : "pharmecy Delivery",
        "job_pickup_phone" : userData.phoneNo,
        "job_pickup_name" :  userData.name,
        "job_pickup_email" : userData.email,
        "job_pickup_address" : userData.address,
        "job_pickup_latitude" : userData.location[1],
        "job_pickup_longitude" : userData.location[0],
        "job_pickup_datetime" : pickupDateTime,
        "customer_email" : userDetails[0].email,
        "customer_username": userDetails[0].name,
        "customer_phone" : userDetails[0].phoneNo,
        "customer_address" : updateStatus.address,
        "latitude" : updateStatus.location[1],
        "longitude" : updateStatus.location[0],
        "job_delivery_datetime" : deliveryDateTime,
        "has_pickup" : 1,
        "has_delivery" : 1,
        "layout_type" : 0,
        "tracking_link" : 1,
        "timezone" : "+530",
        "custom_field_template" : "Template_1",
        "meta_data": [
          { "label": "Price",  "data": "100"    },   
          {  "label": "Quantity","data": "100" }  
        ],  
        "pickup_custom_field_template": "Template_2",  
        "pickup_meta_data": [{ "label": "Price","data": "100"},{"label":"Quantity","data": "100"}],
        "fleet_id": "",
        "p_ref_images":  updateStatus.images,
        "ref_images": updateStatus.images, 
        "notify": 1,  
        "tags": "", 
        "geofence": 0,  
        "ride_type": 0
    }
    
    let bodyData = JSON.stringify(data)
   

    var request = require('request');
    request({
      method: 'POST',
      url: 'https://api.tookanapp.com/v2/create_task',
      headers: {
        'Content-Type': 'application/json'
      },
      body : bodyData
    }, async (error, response, body) => {
      console.log('Status:', response.statusCode);
      console.log('Headers:', JSON.stringify(response.headers));
      console.log('Response:', body);
      let obj = JSON.parse(body)
      let pickup_tracking_link = obj.data.pickup_tracking_link

      console.log('====================================pickup_tracking_link',pickup_tracking_link);

     let updateBookingStatus = await DAO.findAndUpdate(Models.pharmecyBookings,query,{trackingLink : pickup_tracking_link },{new:true})
     console.log('====================================updateBookingStatus',updateBookingStatus);
     
    });
  }

    return updateStatus
    
  }
  catch (err) {
    throw err;
  }
}

const setPassword = async(payloadData,userData) => {
  try {

    let setPassword = await DAO.findAndUpdate(Models.pharmecy,
      {
        _id : userData._id
      },
      { password : payloadData.password,
        passwordSet : true 
      },
      { new : true } );

      return setPassword

  }
  catch (err) {
    throw err;
  }
}

const passwordLogin = async(payloadData,userData) => {
  try {

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo : payloadData.phoneNo,
      isDeleted : false
    }

    let passwordLogin = await DAO.getData(Models.pharmecy,query,{},{lean:true})

    if(passwordLogin.length == 0) {
      throw ERROR.INVALID_CREDENTIALS
    }

    if(passwordLogin[0].password != payloadData.password ) {
      throw ERROR.WRONG_PASSWORD
    }

    return passwordLogin[0]

  }
  catch (err) {
    throw err;
  }
}

const listReview = async(payloadData,userData) => {
  try {

    let query = {_id : userData._id}
    let projection = {
      review: 1,
    }
    let populate = [
      {
        path : "review.userId",
        select : "profilePicture name"
      }

    ]

    let getData = await DAO.populateData(Models.pharmecy,query,projection,{lean:true},populate)
    return getData

  }
  catch (err) {
    throw err;
  }
}


const patientGraph = async(payloadData,userData) => {
  try {

    let match = {
      $match : {
        pharmecyId : mongoose.Types.ObjectId(userData._id),
        $or : [
          {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE},
          {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED}
        ]
      }
    }

    let group = {
      $group : {
        _id : {
          month : "$month",
         // userId : "$userId"
        },
        data : {
          $push : {
            userId : "$userId"
          }
        }
      }
    }

    let project = {
      $project : {
        _id : 0,
        month : "$_id.month",
        monthlyPatients : {$size : "$data"}
      }
    }

    let sort = {
      $sort : {month : -1}
    }
    let query = [match,group,project,sort]
    let getData = await DAO.aggregateData(Models.pharmecyBookings,query)
    let query2 = {
      labId : userData._id,
      $or : [
        {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE},
        {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED}
      ]
  }
    let getData2 = await DAO.count(Models.pharmecyBookings,query2,{},{lean:true})

    
    let data = [], obj
    for(let i =0; i<getData.length;i++) {
     obj = {
        month : getData[i].month,
        monthlyPatients : getData[i].monthlyPatients
      }

      data.push(obj)

    }
    return {data, totalPatients : getData2}

   
  }
  catch(err) {
    throw err;
  }
}

module.exports = {
    pharmecyLogin : pharmecyLogin,
    updateProfile : updateProfile,
    otpVerify : otpVerify,
    otpResend : otpResend,
    listPharmecy : listPharmecy,
    listHospitals : listHospitals,
    accessTokenLogin:accessTokenLogin,
    pharmecyTiming:pharmecyTiming,
    listPharmecyTiming:listPharmecyTiming,
    listBookings : listBookings,
    bookingStatusUpdate : bookingStatusUpdate,
    setPassword : setPassword,
    passwordLogin : passwordLogin,
    listReview : listReview,
    patientGraph : patientGraph
};


   