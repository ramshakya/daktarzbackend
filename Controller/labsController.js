//CREATED BY ABHISHEK DHADWAL
const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  commonController = require("./commonController"),
  smsManager = require("../Libs/smsManager"),
  moment = require('moment'),
  otp = 1234,
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");


const labsLogin = async (payloadData) => {
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
    let checkPharmecy = await DAO.getData(Models.pharmecy, query, {}, {lean:true})
    if(checkPharmecy.length) {
      throw ERROR.ALREADY_REGISTERED_AS_PHARMECY;
    }
   
    let checkLabs = await DAO.getData(Models.labs, query, {}, {lean:true})
    console.log("===================================checkLabs",checkLabs)

    if (checkLabs.length == 0) {
      let saveData = {
        countryCode : payloadData.countryCode,
        phoneNo: payloadData.phoneNo,
        otp: generateOtp
      };

      let createLabs = await DAO.saveData(Models.labs, saveData);
      var message = commonController.otpMessage()
      let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)

      if (createLabs._id) {
        let tokenData = {
              scope: Config.APP_CONSTANTS.SCOPE.LABS,
              _id: createLabs._id,
              time: new Date().getTime()
        };
    

        let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.LABS);

      

        if (accessToken == null) {
          throw ERROR.DEFAULT;
        }

        let tokenResult = await DAO.findAndUpdate(Models.labs,{ _id: createLabs._id },
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

      let getData = await DAO.getData(Models.labs, query, {}, {lean:true})

      if(getData[0].passwordSet != true) {
          var message = commonController.otpMessage()
          let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
      }

      let tokenData = {
        scope: Config.APP_CONSTANTS.SCOPE.LABS,
        _id: getData[0]._id,
        time: new Date().getTime()
      };

      let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.LABS);

      if (accessToken == null) {
        throw ERROR.DEFAULT;
      }

      let updateData = {
        accessToken: accessToken,
        otp : generateOtp
      }

      let tokenResult = await DAO.findAndUpdate(Models.labs,{ _id: getData[0]._id },updateData,{ new: true });

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
    let updateProfile = await commonController.labsProfile(payloadData,userData._id)
  
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

    let otpVerify = await DAO.getData(Models.labs, query, {}, { lean: true });
    
    if(otpVerify.length) {
      if (!(otpVerify[0].otp == payloadData.otp)) {
        throw ERROR.WRONG_OTP;
      }
  
      let setData = { otpVerify: true }
      let options = { new : true }
      let update = await DAO.findAndUpdate(Models.labs, query, setData, {options});
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

    let getData = await DAO.getData(Models.labs,query,{},{lean:true})
    if(getData.length) {
      let query2 = { phoneNo:getData[0].phoneNo };
      let options = { new: true };
      let setData = { otp: generateOtp };
      let update = await DAO.findAndUpdate(Models.labs, query2, setData, options);
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


const listLabs = async(payloadData,userData) => {
  try {

   /* let listData = await commonController.listLabs(payloadData,userData._id)
  
    return listData*/

    let match = {
      $match: {
        isDeleted: false,
        profileUpdated: true
      }
    }

    let lookup = {
      $lookup: {
        from: "labtests",
        localField: "_id",
        foreignField: "labId",
        as: "labTestsData"
      }
    }

    let unwind = {
      $unwind: {
        path: "$labTestsData",
        preserveNullAndEmptyArrays: true
      }
    }

    let group = {
      $group: {
        _id: "$_id",
        location: { $first: "$location" },
        accessToken: { $first: "$accessToken" },
        profilePicture: {$first: "$profilePicture"},
        name: {$first: "$name"},
        labId: {$first: "$labId"},
        address: {$first: "$address"},
        city: {$first: "$city"},
        email: {$first: "$email"},
        awards: {$first: "$awards"},
        membership: {$first: "$membership"},
        phoneNo: {$first: "$phoneNo"},
        discount: {$first: "$discount"},
        password: {$first: "$password"},
        alternateNumber: {$first: "$alternateNumber"},
        about: {$first: "$about"},
        ratingsCount: {$first: "$ratingsCount"},
        averageRatings: {$first: "$averageRatings"},
        starsCount_One: {$first: "$starsCount_One"},
        starsCount_Two: {$first: "$starsCount_Two"},
        starsCount_Three: {$first: "$starsCount_Three"},
        starsCount_Four: {$first: "$starsCount_Four"},
        starsCount_Five: {$first: "$starsCount_Five"},
        images: {$first: "$images"},
        registrationNo: {$first: "$registrationNo"},
        regImage: {$first: "$regImage"},
        otp: {$first: "$otp"},
        otpVerify: {$first: "$otpVerify"},
        adminVerified: {$first: "$adminVerified"},
        profileUpdated: {$first: "$profileUpdated"},
        passwordSet: {$first: "$passwordSet"},
        isDeleted: {$first: "$isDeleted"},
        isBlocked: {$first: "$isBlocked"},
        createdAt: {$first: "$createdAt"},
        review: {$first: "$review"},
        labTestsData: {
          $push: {
            "_id":  "$labTestsData._id",
            "labId": "$labTestsData.labId",
            "name": "$labTestsData.name",
            "description": "$labTestsData.description",
            "price":"$labTestsData.price",
            "isDeleted": "$labTestsData.isDeleted",
            "createdAt": "$labTestsData.createdAt",
          }
      }
      }
    }

    let aggregate = [match, lookup, unwind, group]

    let listLabs = await DAO.aggregateData(Models.labs, aggregate);
    return listLabs;

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
  
    return listDatadaktarzbackend
  }
  catch (err) {
    throw err;
  }
}

const addTests = async(payloadData,userData) => {
  try {

    if(payloadData._id){
      let query = {_id:payloadData._id};
      let options = {lean:true};
      let setData = {
        name:payloadData.name,
        description:payloadData.description,
        price:payloadData.price
      }

      let updateTest = await DAO.findAndUpdate(Models.labTests,query,setData,options);
      return null

    }else{
      let addTests = await commonController.addLabTests(payloadData,userData._id)
      return null
    }
    
  }
  catch (err) {
    throw err;
  }

}


const listLabTests = async(userData) =>{
  try{
    let getData = await DAO.getData(Models.labTests,{labId:userData._id,isDeleted:false},{},{lean:true})
    return getData;
  }catch(err){
    throw err;
  }
}

const deleteTest = async(payloadData,userData) =>{
  try{
    let deleteTest = await DAO.findAndUpdate(Models.labTests,{_id:payloadData._id},{isDeleted:true},{lean:true})
  }catch(err){
    throw err
  }
}


const accessTokenLogin = async (userData) =>{
  try{
    let listOrder = await DAO.getData(Models.labs,{_id:userData._id},{
    },{lean:true});
    return listOrder[0]
  }catch(err){
    throw err;
  }
}

const addEditTiming = async(payloadData,userData) =>{
  try{

    let removeTiming = await DAO.remove(Models.labsTimings,{labId:userData._id})
      let addTiming
      let  data = []
      let timing = payloadData.timing; 
      for(let i = 0; i< timing.length;i++) {

        console.log("================================timing[i].openTime",timing[i].openTime)
        console.log("================================timing[i].closeTime",timing[i].closeTime)

        if(timing[i].openTime > timing[i].closeTime) {

          throw ERROR.TIMING_ERROR;

        }

        data.push({
            labId:userData._id,
            day:timing[i].day,
            showDay:timing[i].showDay,
            openTime:parseInt(timing[i].openTime),
            closeTime:parseInt(timing[i].closeTime),
            startTime : timing[i].startTime,
            endTime :  timing[i].endTime,
            closeDate:timing[i].closeDate,
            openDate:timing[i].openDate,
            disable:timing[i].disable,
            closeTimeString:timing[i].closeTimeString,
            openTimeString:timing[i].openTimeString,
            closeMeridian:timing[i].closeMeridian,
            openMeridian:timing[i].openMeridian,
          })

        for(let j = 0; j<timing.length; j++) {
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
    
    addTiming = await DAO.insertMany(Models.labsTimings,data);

  }catch(err){
    throw err;
  }
}


const listTiming = async(userData) =>{
  try{
    let timing  = await DAO.getData(Models.labsTimings,{labId:userData._id},{},{lean:true})
    return timing;
  }catch(err){
    throw err;
  }
}

const listBookings = async(payloadData,userData) => {
  try {

    let query = { labId : userData._id }
   /* if(payloadData.status == Config.APP_CONSTANTS.PHARMECY_STATUS.PENDING) {
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

    let populate = [
      {
        path : "userId",
        select : 'phoneNo location address houseNo city state country pincode'
      }
    ]
    let listBookings = await DAO.getData(Models.labsBookings,query,{},options)
   
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
          labId : listBookings[i].labId,
          labTests : listBookings[i].labTests,
          totalPrice : listBookings[i].totalPrice,
          dateTime : listBookings[i].dateTime,
          month : listBookings[i].month,
          bookingDate : listBookings[i].bookingDate,
          stars : listBookings[i].stars,
          comment : listBookings[i].comment,
          status : listBookings[i].status,
          transactionId : listBookings[i].transactionId,
          trackingLink : listBookings[i].trackingLink,
          description : listBookings[i].description,
          location : listBookings[i].location,
          reports : listBookings[i].reports,
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

    let query = {
      _id : payloadData._id
    }

    let update = {
      status : payloadData.status
    }

    let updateStatus = await DAO.findAndUpdate(Models.labsBookings,query,update,{new:true})
    let userDetails = await DAO.getData(Models.users,{_id:updateStatus.userId},{},{lean:true})

    let pickupDateTime = moment(updateStatus.dateTime,"x").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
    console.log("==============================pickupDateTime",pickupDateTime)

    let deliveryDateTime = moment(updateStatus.dateTime,"x").tz("Asia/Kolkata").add(30,"minutes").format("YYYY-MM-DD HH:mm:ss")
    console.log("==============================deliveryDateTime",deliveryDateTime)

    if(payloadData.status ==  Config.APP_CONSTANTS.LAB_STATUS.CANCEL) {
      message = "Booking Canceled"
      sendMessage = smsManager.sendSms(userDetails[0].phoneNo,message)
    }


    if(payloadData.status == Config.APP_CONSTANTS.PHARMECY_STATUS.APPROVE) {

      let time = moment(updateStatus.dateTime,"x").tz("Asia/Kolkata").format("HH:mm")
      message = "Your appointment at " + userData.name + " has been confirmed for this time "+ time +" and date " + updateStatus.bookingDate
      sendMessage =  smsManager.sendSms(userDetails[0].phoneNo,message)


    
    let data = {
        "api_key" : "50606582f6405d1f544e767b565625431be2c6fe28db7e3d591802",
        "order_id" : payloadData._id,
        "team_id" : "",
        "auto_assignment" : 0,
        "job_description" : "Lab Delivery",
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
        "customer_address" : userDetails[0].address,
        "latitude" : userDetails[0].location[1],
        "longitude" : userDetails[0].location[0],
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
        "p_ref_images": [
          "http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png",
          "http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png"  
        ],  
        "ref_images": [
          "http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png", 
          "http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png"  
        ], 
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
     let updateBookingStatus = await DAO.findAndUpdate(Models.labsBookings,query,{trackingLink : pickup_tracking_link },{new:true})
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

    let setPassword = await DAO.findAndUpdate(Models.labs,
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
      isDeleted : false,
      isBlocked : false
    }

    let passwordLogin = await DAO.getData(Models.labs,query,{},{lean:true})

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

    let getData = await DAO.populateData(Models.labs,query,projection,{lean:true},populate)
    return getData

  }
  catch (err) {
    throw err;
  }
}

const revenueGraph = async(payloadData,userData) => {
  try {

    let match = {
      $match : {
        labId : mongoose.Types.ObjectId(userData._id),
        $or : [
          {status : Config.APP_CONSTANTS.LAB_STATUS.COMPLETE},
          {status : Config.APP_CONSTANTS.LAB_STATUS.RATED}
        ]
        
      }
    }

    let group = {
      $group : {
        _id : "$month",
        monthlyRevenue : {$sum:"$totalPrice"}, 
      }
    }

    let sort = {
      $sort : {_id:-1}
    }

    let group2 = {
      $group : {
        _id : "",
        totalRevenue : {$sum:"$totalPrice"}, 
      }
    }

    let project = {
      $project : {
        _id : 0,
        totalRevenue : "$totalRevenue"
      }
    }

    let query = [match,group,sort]
    let query2 = [match,group2,project]

    let getData = await DAO.aggregateData(Models.labsBookings,query)
    let getData2 = await DAO.aggregateData(Models.labsBookings,query2)

    let totalEarning = 0

    if(getData2.length) {
      totalEarning = getData2[0].totalRevenue
    }

    else {
      totalEarning = 0
    }

    
    let data = [], obj
    for(let i =0; i<getData.length;i++) {
     obj = {
        month : getData[i]._id,
        monthlyRevenue : getData[i].monthlyRevenue
      }

      data.push(obj)

    }
    return {data, totalRevenue : totalEarning}
  }
  catch(err) {
    throw err;
  }
}

const patientGraph = async(payloadData,userData) => {
  try {

    let match = {
      $match : {
        labId : mongoose.Types.ObjectId(userData._id),
        $or : [
          {status : Config.APP_CONSTANTS.LAB_STATUS.COMPLETE},
          {status : Config.APP_CONSTANTS.LAB_STATUS.RATED}
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
    let getData = await DAO.aggregateData(Models.labsBookings,query)
    let query2 = {
      labId : userData._id,
      $or : [
        {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE},
        {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED}
      ]
  }
    let getData2 = await DAO.count(Models.labsBookings,query2,{},{lean:true})

    
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


const uploadReports = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.bookingId}

    let updateData = {
        reports : payloadData.reports
    }

    let uploadReports = await DAO.findAndUpdate(Models.labsBookings,query,updateData,{new:true})
    console.log("====================================uploadReports",uploadReports)

    let reports = payloadData.reports
    console.log("==========================================reports",reports.length)

    let reportscount = reports.length - 1
    console.log("==========================================reportscount",reportscount)

    let reportdata = reports[reportscount]
    console.log("==========================================reportdata",reportdata)

    let queryUser = {_id : uploadReports.userId }

    let updateDocuments = {
      $push : {
        documents : reportdata
      }
          
    }

    let uploadReportsInUsers = await DAO.findAndUpdate(Models.users,queryUser,updateDocuments,{new:true})


    return uploadReports

  }
  catch (err) {
    throw err;
  }
}

const inesrtLabTests = async(payloadData,userData) => {
  try {
    let insertData,saveData = []
    let tests = payloadData.tests
    for(let i =0; i<tests.length;i++) {
      saveData.push({
        labId : userData._id,
        name : tests[i].name,
        description : tests[i].description,
        price : tests[i].price,
        isDeleted : false,
        createdAt : +new Date()
      })
    }
    insertData = await DAO.insertMany(Models.labTests,saveData,{multi:true})
    return insertData

  }
  catch (err) {
    throw err;
  }
}

const writeDescription = async(paylaodData,userData) => {
  try {

    let query = {_id : paylaodData.bookingId}

    let update = {
      description : paylaodData.description
    }

    let writeDescription = await DAO.findAndUpdate(Models.labsBookings,query,update,{new:true})
    return writeDescription

  }
  catch (err) {
    throw err
  }
}

const deleteReports = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.bookingId}

    let updateData = {
        $pull : {
          reports : {
            image : payloadData.reports
          } 
        }
    }
    let uploadReports = await DAO.findAndUpdate(Models.labsBookings,query,updateData,{new:true})
    console.log("====================================uploadReports",uploadReports)

    let queryUser = {_id : uploadReports.userId }

    let updateDocuments = {
        $pull : {
            documents : {
              image : payloadData.reports
            }
          }
    }

    let uploadReportsInUsers = await DAO.findAndUpdate(Models.users,queryUser,updateDocuments,{new:true})


    return uploadReports

  }
  catch (err) {
    throw err;
  }
}


module.exports = {
    labsLogin : labsLogin,
    updateProfile : updateProfile,
    otpVerify : otpVerify,
    otpResend : otpResend,
    listLabs : listLabs,
    listHospitals : listHospitals,
    addTests : addTests,
    listLabTests:listLabTests,
    deleteTest:deleteTest,
    accessTokenLogin:accessTokenLogin,
    addEditTiming:addEditTiming,
    listTiming:listTiming,
    listBookings : listBookings,
    bookingStatusUpdate : bookingStatusUpdate,
    setPassword : setPassword,
    passwordLogin : passwordLogin,
    listReview : listReview,
    revenueGraph : revenueGraph,
    patientGraph : patientGraph,
    uploadReports : uploadReports,
    inesrtLabTests : inesrtLabTests,
    writeDescription : writeDescription,
    deleteReports : deleteReports

  
};
