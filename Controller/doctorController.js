const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  moment = require('moment'),
  bcrypt = require("bcryptjs"),
  commonController = require("./commonController"),
  randomstring = require("randomstring"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");
  smsManager = require("../Libs/smsManager");



const doctorLogin = async (payloadData) => {
  try {
    let deletedata = await commonController.checkDatabase(payloadData)
    let generateOtp = await commonController.generateOtp()

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
      isDeleted:false,
      $or : [
        {profileUpdated : true},
        {adminVerified : true}
      ]
    }

    let checkHospital = await DAO.getData(Models.hospitals, query, {}, {
      lean: true
    })
    if (checkHospital.length) {
      throw ERROR.ALREADY_REGISTERED_AS_HOSPITAL;
    }
    let checkAmbulance = await DAO.getData(Models.ambulance, query, {}, {
      lean: true
    })
    if (checkAmbulance.length) {
      throw ERROR.ALREADY_REGISTERED_AS_AMBULANCE;
    }
    let checkLabs = await DAO.getData(Models.labs, query, {}, {
      lean: true
    })
    if (checkLabs.length) {
      throw ERROR.ALREADY_REGISTERED_AS_LABS;
    }
    let checkPharmecy = await DAO.getData(Models.pharmecy, query, {}, {
      lean: true
    })  
    if (checkPharmecy.length) {
      throw ERROR.ALREADY_REGISTERED_AS_PHARMECY;
    }
    
    let checkDoctor = await DAO.getData(Models.doctors, query, {}, {
      lean: true
    })

    if (checkDoctor.length == 0) {
      let saveData = {
        countryCode : payloadData.countryCode,
        phoneNo: payloadData.phoneNo,
        otp: generateOtp
      };
      let createDoctor = await DAO.saveData(Models.doctors, saveData);

      var message = commonController.otpMessage()
     // console.log("=================================================message",message)
      let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)

      if (createDoctor._id) {
        let tokenData = {
          scope: Config.APP_CONSTANTS.SCOPE.DOCTOR,
          _id: createDoctor._id,
          time: new Date().getTime()
        };

        let accessToken = await TokenManager.generateToken(tokenData, Config.APP_CONSTANTS.SCOPE.DOCTOR);
        if (accessToken == null) {
          throw ERROR.DEFAULT;
        }

        let tokenResult = await DAO.findAndUpdate(Models.doctors, {
          _id: createDoctor._id
        }, {
          accessToken: accessToken
        }, {
          new: true
        });

        let arr = []
        arr.push({
          otp: tokenResult.otp,
          passwordSet: tokenResult.passwordSet
        })

        return arr[0]

      } else {
        throw ERROR.DB_ERROR;
      }
    } 

    else {

      let query = {  
        countryCode : payloadData.countryCode,
        phoneNo: payloadData.phoneNo, 
        isDeleted:false
      };

      let getData = await DAO.getData(Models.doctors, query, {}, {lean:true})

      if(getData[0].passwordSet != true) {
         /* let updateData = {otp: generateOtp }
          if(payloadData.deviceId) {
            updateData.deviceId = payloadData.deviceId
          }
          var update = await DAO.findAndUpdate(Models.ambulance,query,updateData,{new:true})*/
          var message = commonController.otpMessage()
          let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
      }

      let tokenData = {
        scope: Config.APP_CONSTANTS.SCOPE.DOCTOR,
        _id: getData[0]._id,
        time: new Date().getTime()
      };

      let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.DOCTOR);

      if (accessToken == null) {
        throw ERROR.DEFAULT;
      }

      let updateData = {
        accessToken: accessToken,
        otp : generateOtp
      }

      let tokenResult = await DAO.findAndUpdate(Models.doctors,{ _id: getData[0]._id },updateData,{ new: true });
     // return tokenResult

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



const updateProfile = async (payloadData, userData) => {
  try {


    let updateProfile = await commonController.doctorProfile(payloadData, userData._id)

    return updateProfile

  } catch (err) {
    throw err;
  }
}

//VERIFY OTP
const otpVerify = async (payloadData, userData) => {
  try {
    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    };

    let otpVerify = await DAO.getData(Models.doctors, query, {}, {
      lean: true
    });

    if (otpVerify.length) {
      if (!(otpVerify[0].otp == payloadData.otp)) {
        throw ERROR.WRONG_OTP;
      }

      let setData = {
        otpVerify: true
      }
      let options = {
        new: true
      }
      let update = await DAO.findAndUpdate(Models.doctors, query, setData, {
        options
      });
      return update;
    } else {
      throw ERROR.NO_DATA_FOUND;
    }
  } catch (err) {
    throw err;
  }
};

//RESEND OTP
const otpResend = async (payloadData) => {
  try {
    let generateOtp =  commonController.generateOtp()
   // console.log("=======================================generateOtp",generateOtp)

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    };

    let getData = await DAO.getData(Models.doctors, query, {}, {
      lean: true
    })
    if (getData.length) {
      let query2 = { phoneNo: getData[0].phoneNo};
      let options = {new: true};
      let setData = {otp: generateOtp};
      let update = await DAO.findAndUpdate(Models.doctors, query2, setData, options);
      var message = commonController.otpMessage()
      let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
      return update.otp;
    }
     else {
      throw ERROR.NO_DATA_FOUND;
    }
  } catch (err) {
    throw err;
  }
};

const listDoctors = async (payloadData, userData) => {
  try {

    let listData = await commonController.listDoctors(payloadData, userData._id)

    return listData
    /*    let models = Models.doctors;
        let listData = await commonController.listData(payloadData._id,null,models)
        console.log("**********",listData)
        return listData*/

  } catch (err) {
    throw err;
  }
}

//List Hospitals
const listHospitals = async (payloadData) => {
  try {
    let models = Models.hospitals;
    let listData = await commonController.listData(payloadData._id, null, models)

    return listData
  } catch (err) {
    throw err;
  }
}

const addTreatments = async (payloadData, userData) => {
  try {
    if (payloadData._id) {
      let query = {_id: payloadData._id}
      let options = {new: true}
      let setData = {
        name: payloadData.name,
        price: payloadData.price,
        description: payloadData.description,
        hospitalId : null,
        isDeleted : false
      }
      if (payloadData.discount) {
        setData.discount = payloadData.discount
      }
      let updateTreatment = await DAO.findAndUpdate(Models.treatments, query, setData, options);
      return updateTreatment
    } 
    else {
      let setData = {
        name: payloadData.name,
        price: payloadData.price,
        description: payloadData.description,
        doctorId: userData._id,
        hospitalId : null,
        isDeleted : false
      }
      if (payloadData.discount) {
        setData.discount = payloadData.discount
      }
      let addTreatments = await DAO.saveData(Models.treatments, setData)
      return addTreatments
    }

  } catch (err) {
    throw err;
  }
}

const listTreatments = async (userData) => {
  try {
    let listTreatments = await DAO.getData(Models.treatments, {
      doctorId: userData._id, isDeleted : false}, {}, {
      lean: true
    });
    return listTreatments
  } catch (err) {
    throw err;
  }
}

const addEditBlog = async (payloadData, userData) => {
  try {

   /* let currentMillis = moment().format("x") 
    let unique = payloadData.title + "-" + currentMillis
    let key = unique.replace(/ /g, '')*/

    let currentMillis = moment().format("x");
    //generate random string
    let randomString = randomstring.generate({ length: 8, charset: 'alphanumeric'});
    if(payloadData.title) {
      unique = payloadData.title + "-" + currentMillis
    }
    if(!(payloadData.title)) {
      unique = randomString + "-" + currentMillis
    }
    // remove spaces from unique key
    let key = unique.replace(/ /g, '')

    if (payloadData._id) {

      let query = {_id: payloadData._id};

      let setData = {
        text: payloadData.text,
        doctorId: payloadData.doctorId,
        image: payloadData.image,
        title: payloadData.title,
        uniquekey : key
      };

      if(payloadData.type) {
        setData.type = payloadData.type
      }

      let options = {lean: true};

      let saveData = await DAO.findAndUpdate(Models.blogs, query, setData, options)

      return null;
    } else {

      let obj = {
        text: payloadData.text,
        doctorId: payloadData.doctorId,
        image: payloadData.image,
        title: payloadData.title,
        uniquekey : key
      }
      if(payloadData.type) {
        obj.type = payloadData.type
      }
      let saveData = await DAO.saveData(Models.blogs, obj)
      return null;

    }
  } catch (err) {
    throw err;
  }
}

const listBlog = async (payloadData, userData) => {
  try {

    let query = {
      doctorId: userData._id,
      isDeleted:false
    
    }
    if (payloadData._id) {
      query.uniquekey = payloadData._id;
    }

    console.log("=====================================query",query)
    let getData = await DAO.getData(Models.blogs, query, {}, {lean: true })
    console.log("=====================================getData",getData)
    return getData
  } catch (err) {
    throw err;

  }
}

const addTiming = async (payloadData, userData) => {

 // console.log("======================payloadData==========payloadData",payloadData)

//  let removeTiming = await DAO.remove(Models.doctorsTiming, {doctorId: userData._id})
  let addTiming
  let data = []
  let timing = payloadData.timing;

  for (let i = 0; i < timing.length; i++) {

    if(timing[i].openTime != null && timing[i].closeTime != null) {

      console.log("================================timing[i].openTime",timing[i].openTime)
      console.log("================================timing[i].closeTime",timing[i].closeTime)

      if(timing[i].openTime > timing[i].closeTime) {
          throw ERROR.TIMING_ERROR;
      }

       let query2 = {
        doctorId : userData._id, 
        hospitalId : {$ne : null},
        day : timing[i].day,
        $or : [

              {
                $and : [
                  {openTime : {$gte : parseInt(timing[i].openTime) } },
                  {openTime : {$lte : parseInt(timing[i].closeTime) } },
                  {closeTime : {$gte : parseInt(timing[i].openTime) } },
                  {closeTime : {$lte : parseInt(timing[i].closeTime) } }
                ]
              },

              {
                $and : [
                  {openTime : {$lte : parseInt(timing[i].openTime) } },
                  {openTime : {$lte : parseInt(timing[i].closeTime) } },
                  {closeTime : {$gte : parseInt(timing[i].openTime) } },
                  {closeTime : {$gte : parseInt(timing[i].closeTime) } }
                ]
              },


              {
                $and : [
                  {openTime : {$lte : parseInt(timing[i].openTime)} },
                  {openTime : {$lte : parseInt(timing[i].closeTime) } },
                  {closeTime : {$gte : parseInt(timing[i].openTime) } },
                  {closeTime : {$lte : parseInt(timing[i].closeTime) } }
                ]
              },


              {
                $and : [
                  {openTime : {$gte : parseInt(timing[i].openTime) } },
                  {openTime : {$lte : parseInt(timing[i].closeTime) } },
                  {closeTime : {$gte : parseInt(timing[i].openTime) } },
                  {closeTime : {$gte : parseInt(timing[i].closeTime) } }
                ]
              }
          ]
      
      }
    
      let getData = await DAO.getData(Models.doctorsTiming,query2,{},{lean:true})
      console.log("======================addTiming==========getData",getData)

      if(getData.length) {
        throw ERROR.TIMING_ALREADY_EXISTS
      }else {
        let query = {
          doctorId: userData._id,
          hospitalId : {$eq : null},
        }
        let removeTiming = await DAO.remove(Models.doctorsTiming, query)
      }


    }



    data.push({
      doctorId: mongoose.Types.ObjectId(userData._id),
      hospitalId: null,
      day: timing[i].day,
      showDay: timing[i].showDay,
      openTime: parseInt(timing[i].openTime),
      closeTime: parseInt(timing[i].closeTime),
      startTime: timing[i].startTime,
      endTime: timing[i].endTime,
      closeDate: timing[i].closeDate,
      openDate: timing[i].openDate,
      closeTimeString:timing[i].closeTimeString,
      openTimeString:timing[i].openTimeString,
      closeMeridian:timing[i].closeMeridian,
      openMeridian:timing[i].openMeridian,
      disable: timing[i].disable
    })

    for (let j = 0; j < timing.length; j++) {

      if (i !== j) {

        if (timing[i].day == timing[j].day) {

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

  addTiming = await DAO.insertMany(Models.doctorsTiming, data);
}


const accessTokenLogin = async (userData) => {
  try {
    let getDoctorData = await DAO.getData(Models.doctors, {
      _id: userData._id
    }, {}, {
      lean: true
    })

    return getDoctorData[0];

  } catch (err) {
    throw err;
  }
}


const listTiming = async (userData) => {
  try {
    let listTiming = await DAO.getData(Models.doctorsTiming, {
      hospitalId: null,
      doctorId: userData._id
    }, {}, {
      lean: true
    })

    return listTiming;

  } catch (err) {
    throw err;
  }
}


const listBookings = async (apiData, userData) => {
  try {

    let query = {
      doctorId: userData._id,
      hospitalId : null
    }

    if(apiData.date) {
      query.bookingDate = apiData.date
    }


    let options = {
      sort: {
        _id: -1
      }
    }

   /* let populate = [{
      path: "userId",
      select: "phoneNo",
      match : match
    }]


    if(apiData.phoneNo) {
      match.phoneNo = apiData.phoneNo
    }*/


    let listBookings = await DAO.getData(Models.doctorBookings, query, {}, options)

    let output = []

    for(let i = 0; i<listBookings.length; i++) {

      let query = { _id : listBookings[i].userId }

      if(apiData.phoneNo) {
        query.phoneNo = apiData.phoneNo
      }

      let usersData = await DAO.getData(Models.users,query,{},{lean:true})

      for(let j = 0; j<usersData.length; j++) {

        output.push({
          _id : listBookings[i]._id,
          userId : {
            "phoneNo" : usersData[j].phoneNo,
            "_id": usersData[j]._id
          },
          doctorId: listBookings[i].doctorId,
          hospitalId : listBookings[i].hospitalId,
          bookingDay : listBookings[i].bookingDay,
          bookingDate : listBookings[i].bookingDate,
          startTime : listBookings[i].startTime,
          endTime : listBookings[i].endTime,
          totalPrice : listBookings[i].totalPrice,
          month : listBookings[i].month,
          stars : listBookings[i].stars,
          comment : listBookings[i].comment,
          status : listBookings[i].status,
          treatments : listBookings[i].treatments,
          prescription : listBookings[i].prescription,
          transactionId : listBookings[i].transactionId,
          isRead : listBookings[i].isRead,
          description : listBookings[i].description,
          createdAt : listBookings[i].createdAt,

        })
      }
    }

    return output

  } catch (err) {
    throw err;
  }
}

const bookingStatusUpdate = async (payloadData, userData) => {
  try {

    let query = { _id: payloadData._id }

    let update = { status: payloadData.status }

    let updateStatus = await DAO.findAndUpdate(Models.doctorBookings, query, update, { new: true })
    
    let getUserPhoneNo = await DAO.getData(Models.users, {_id : updateStatus.userId },{},{lean:true})

    if(payloadData.status == Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.APPROVE) {
      var message = "Your appointment with " + userData.name + " has been confirmed for this time " + updateStatus.startTime +" and date " + updateStatus.bookingDate
      let sendMessage =  smsManager.sendSms(getUserPhoneNo[0].phoneNo,message)
    }
    return updateStatus

  } catch (err) {
    throw err;
  }
}

const setPassword = async (payloadData, userData) => {
  try {

    let setPassword = await DAO.findAndUpdate(Models.doctors, {
      _id: userData._id
    }, {
      password: payloadData.password,
      passwordSet: true
    }, {
      new: true
    });

    return setPassword

  } catch (err) {
    throw err;
  }
}

const passwordLogin = async (payloadData, userData) => {
  try {

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    }

    let passwordLogin = await DAO.getData(Models.doctors, query, {}, {
      lean: true
    })

    if (passwordLogin.length == 0) {
      throw ERROR.INVALID_CREDENTIALS
    }

    if (passwordLogin[0].password != payloadData.password) {
      throw ERROR.WRONG_PASSWORD
    }

    return passwordLogin[0]

  } catch (err) {
    throw err;
  }
}

const deleteBlog = async (payloadData, userData) => {
  try {

    let query = {
      doctorId: userData._id,
      _id: payloadData.blogId
    }

    let update = {}
    if (typeof payloadData.isDeleted !== "undefined" && payloadData.isDeleted !== null) {
      update.isDeleted = payloadData.isDeleted
    }

    let deleteBlog = await DAO.findAndUpdate(Models.blogs, query, update, {
      new: true
    })
    return deleteBlog


  } catch (err) {
    throw err;
  }
}

const listReview = async (payloadData, userData) => {
  try {

    let query = {
      _id: userData._id
    }
    let projection = {
      review: 1,
    }
    let populate = [{
      path: "review.userId",
      select: "profilePicture name"
    }

    ]

    let getData = await DAO.populateData(Models.doctors, query, projection, {
      lean: true
    }, populate)
    return getData

  } catch (err) {
    throw err;
  }
}

const addPrescription = async(paylaodData,userData) => {
  try {

    let query = {
      _id : paylaodData.bookingId
    }
    let update = {}
    if(paylaodData.description){
      update.description = paylaodData.description
    }

    if(paylaodData.prescription){
      update.prescription = paylaodData.prescription
    }

    let addPrescription = await DAO.findAndUpdate(Models.doctorBookings,query,update,{new:true})
    return addPrescription

  }
  catch (err) {
    throw err
  }
}

const sendMessage = async(payloadData,userData) => {
  try {

    let saveData = {
      doctorId : userData._id,
      userId : payloadData.userId,
      sentBy : Config.APP_CONSTANTS.CHAT_STATUS.DOCTOR,
      message : payloadData.message,
    //  senderPic : userData.profilePicture,
      sentAt : + new Date()
    }

    if(payloadData.bookingId) {
      saveData.bookingId = payloadData.bookingId
    }

    let saveMessageData = await DAO.saveData(Models.chats,saveData)
    let getData = await DAO.getData(Models.chats,{_id:saveMessageData._id},{},{lean:true})
    getData[0].doctorProfilePicture = userData.profilePicture
    return getData[0]

    

  }
  catch (err) {
    throw err;
  }
}

const listusers = async(payloadData,userData) => {
  try {

    let match = {
      $match : {
        doctorId : mongoose.Types.ObjectId(userData._id)
      }
    }

    let lookup = {
      $lookup : {
        from : "users",
        localField : "userId",
        foreignField : "_id",
        as : "userData"
      }
    }

    let unwind = {
      $unwind : {
        path : "$userData"
      }
    }

    let lookupChat = {
      $lookup : {
        from : "chats",
        localField : "userId",
        foreignField : "userId",
        as : "chatData"
      }
    }

    let project = {
      $project : {
        userId : 1,
        lookupChat : 1,
        userData : "$userData",
        isRead : 1,
        msgCount : {"$size" : "$chatData"}

      }
    }

    let group = {
      $group : {
        _id : "$userId",
        name : {"$first" : "$userData.name"},
        profilePicture : {"$first" : "$userData.profilePicture"},
        phoneNo : {"$first" : "$userData.phoneNo"},
        isRead : {"$first" : "$isRead"},
        msgCount : {"$first" : "$msgCount"}
      }
    }

    let query = [match, lookup, unwind, lookupChat, project, group]

    let listUsers = await DAO.aggregateData(Models.doctorBookings,query)
    return listUsers
  }
  catch (err) {
    throw err;
  }
}

const listMessages = async(paylaodData,userData) => {
  try {

    let listMessages
 
 

      let match = {
        $match : {
          doctorId : mongoose.Types.ObjectId(userData._id),
        //  userId : paylaodData.userId
          userId : mongoose.Types.ObjectId(paylaodData.userId)
        }
      }

      let lookup = {
        $lookup : {
          from : "users",
          localField : "userId",
          foreignField : "_id",
          as : "userData"
        }
      }

      let unwind = {
        $unwind : {
          path : "$userData"
        }
      }

      let lookupDoctor = {
        $lookup : {
          from : "doctors",
          localField : "doctorId",
          foreignField : "_id",
          as : "doctorData"
        }
      }

      let unwindDoctor = {
        $unwind : {
          path : "$doctorData"
        }
      }


      let group = {
        $group : {
          _id : "$_id",
          doctorId : {"$first" : "$doctorId"},
          doctorName : {"$first" : "$doctorData.name"},
          doctorProfilePicture : {"$first" : "$doctorData.profilePicture"},
          userId : {"$first" : "$userId"},
          userName : {"$first" : "$userData.name"},
          userPhoneNo : {"$first" : "$userData.phoneNo"},
          userProfilePicture : {"$first" : "$userData.profilePicture"},
          bookingId : {"$first" : "$bookingId"},
          message : {"$first" : "$message"},
          sentBy : {"$first" : "$sentBy"},
          sentAt : {"$first" : "$sentAt"},
        }
      }

     let sort = {
        $sort : {_id : 1}
      }

      let skip = {
        $skip :  20 * paylaodData.skip 
        
      }

      let limit = {
        $limit : 20
      }

      let query = [match,lookup,unwind,lookupDoctor,unwindDoctor,group,sort]
      listMessages = await DAO.aggregateData(Models.chats,query)


  return listMessages
   
    

  }
  catch (err) {
    throw err;
  }
}

const revenueGraph = async(payloadData,userData) => {
  try {

    let match = {
      $match : {
        hospitalId : null,
        doctorId : mongoose.Types.ObjectId(userData._id),
        $or : [
          {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE},
          {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED}
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

    let query = [match,group,sort]

    let getData = await DAO.aggregateData(Models.doctorBookings,query)
  
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

    let query2 = [match,group2,project]

    let getData2 = await DAO.aggregateData(Models.doctorBookings,query2)

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
        hospitalId : null,
        doctorId : mongoose.Types.ObjectId(userData._id),
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
    let getData = await DAO.aggregateData(Models.doctorBookings,query)
    let query2 = {
        hospitalId : null,
        doctorId : userData._id,
        $or : [
          {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE},
          {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED}
        ]
    }
    let getData2 = await DAO.count(Models.doctorBookings,query2,{},{lean:true})

    
    let data = [], obj
    for(let i =0; i<getData.length;i++) {
     obj = {
        month : getData[i].month,
        monthlyPatients : getData[i].monthlyPatients
      }
      data.push(obj)
    }

   // console.log("================================data",data)

    return {data, totalPatients : getData2}
    //return getData
   
  }
  catch(err) {
    throw err;
  }
}

const listUsersDetails = async(payloadData,userData) => {
  try {

    let bookings,prescription,medicalRecors

    let currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY")
    console.log("===============================================currentDate",currentDate)


    let match = {
      $match : {
        doctorId : mongoose.Types.ObjectId(userData._id),
        userId : mongoose.Types.ObjectId(payloadData.userId),
        status : {$ne : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL}
      }
    }

    let lookup = {
      $lookup : {
        from : "users",
        localField : "userId",
        foreignField : "_id",
        as : "userData"
      }
    }

    let unwind = {
        $unwind : {
          path : "$userData",
          preserveNullAndEmptyArrays: true
        }
    }

    let group = {
      $group : {
        _id : "$_id",
        userId : {"$first" : "$userId"},
        doctorId : {"$first" : "$doctorId"},
        bookingDate : {"$first" : "$bookingDate"},
        startTime : {"$first" : "$startTime"},
        endTime : {"$first" : "$endTime"},
        bookingDay : {"$first" : "$bookingDay"},
        totalPrice : {"$first" : "$totalPrice"},
        name : {"$first" : "$userData.name"},
        dob : {"$first" : "$userData.dob"},
        gender : {"$first" : "$userData.gender"},
        profilePicture : {"$first" : "$userData.profilePicture"},
        location : {"$first" : "$userData.location"},
        phoneNo : {"$first" : "$userData.phoneNo"},
        status : {"$first" : "$status"},
        treatments : {"$first" : "$treatments"},
        prescription :  {"$first" : "$prescription"},
        medicalRecors : {"$first" : "$userData.documents"},
        address : {"$first" : "$userData.address"},
        city : {"$first" : "$userData.city"},
        pincode : {"$first" : "$userData.pincode"},
        description : {"$first" : "$description"},
        createdAt : {"$first" : "$createdAt"},

      }
    }

    let query = [match, lookup, unwind, group]
    console.log("==================================query",query)
    bookings = await DAO.aggregateData(Models.doctorBookings,query)
    console.log("==================================bookings",bookings)

    let subtractHour, addHour

    for(let i =0; i<bookings.length; i++) {
      console.log("===============================================bookings",bookings)

      let currentHours = moment().tz("Asia/Kolkata").format("HH:mm") 
      console.log("===============================================currentHours",currentHours) 

      if(bookings[i].startTime == "00:00") {

           subtractHour = moment(bookings[i].startTime,"HH:mm").format("HH:mm")
           console.log("===============================================subtractHour",subtractHour)

           addHour = moment(bookings[i].startTime,"HH:mm").add(60,"minutes").format("HH:mm")
           console.log("===============================================addHour",addHour)

      }
      else {

          subtractHour = moment(bookings[i].startTime,"HH:mm").subtract(60,"minutes").format("HH:mm")
          console.log("===============================================subtractHour",subtractHour)

          addHour = moment(bookings[i].startTime,"HH:mm").add(60,"minutes").format("HH:mm")
          console.log("===============================================addHour",addHour)

      }

       //currentHours < subtractHour || subtractHour > addHour

      if(subtractHour < currentHours && addHour > currentHours) {
        return bookings
        
      }else {
        throw ERROR.CURRENT_TIME
        
      }



    }



   


    

  }
  catch (err) {
    throw err;
  }
}

const deleteTreatments = async(payloadData,userData) => {
  try {

    let query = {
      doctorId : userData._id,
      _id : payloadData._id
    }

    let updateData = {
      isDeleted : payloadData.isDeleted
    }

    let update = await DAO.findAndUpdate(Models.treatments,query,updateData,{new : true})
    return update


  }
  catch (err) {
    throw err;
  }
}



const forgotPassword = async(payloadData) =>{
  try{
    let tempPassword = randomstring.generate({
      length: 10
    });

    var message = "login with temporary password, please update password throw edit profile page, password is  : " + tempPassword
    
    let  numberVerify;
    let sendMessage;
    if(payloadData.type == 1){
      numberVerify = await DAO.getData(Models.doctors,{phoneNo:payloadData.phoneNo},{_id:1},{lean:true})
      if(numberVerify.length){
        sendMessage =  smsManager.sendSms(payloadData.phoneNo,message);
        await DAO.findAndUpdate(Models.doctors,{phoneNo:payloadData.phoneNo},{password:tempPassword},{lean:true})

        return null
      }else{
        throw ERROR.INVALID_MOBILE_NUMBER;
      }
    }else if(payloadData.type == 2){
      numberVerify = await DAO.getData(Models.pharmecy,{phoneNo:payloadData.phoneNo},{_id:1},{lean:true})
      if(numberVerify.length){
        sendMessage =  smsManager.sendSms(payloadData.phoneNo,message);
        await DAO.findAndUpdate(Models.pharmecy,{phoneNo:payloadData.phoneNo},{password:tempPassword},{lean:true})

        return null
      }else{
        throw ERROR.INVALID_MOBILE_NUMBER;
      }
    }else if(payloadData.type == 3){
      numberVerify = await DAO.getData(Models.labs,{phoneNo:payloadData.phoneNo},{_id:1},{lean:true})
      if(numberVerify.length){
        sendMessage =  smsManager.sendSms(payloadData.phoneNo,message);
        await DAO.findAndUpdate(Models.labs,{phoneNo:payloadData.phoneNo},{password:tempPassword},{lean:true})

        return null
      }else{
        throw ERROR.INVALID_MOBILE_NUMBER;
      }
    }else{
      numberVerify = await DAO.getData(Models.hospitals,{phoneNo:payloadData.phoneNo},{_id:1},{lean:true})
      if(numberVerify.length){
        sendMessage =  smsManager.sendSms(payloadData.phoneNo,message);
        await DAO.findAndUpdate(Models.hospitals,{phoneNo:payloadData.phoneNo},{password:tempPassword},{lean:true})

        return null
      }else{
        throw ERROR.INVALID_MOBILE_NUMBER;
      }
    }
  }catch(err){
    throw err;
  }
}

const readMessages = async(payloadData,userData) => {
  try {

    let query = {userId : payloadData.userId} 
    let updateStatus = {isRead : true}
    let readMessages = await DAO.update(Models.doctorBookings, query, updateStatus, {multi : true})
    return readMessages
  }
  catch (err) {
    throw err;
  }
}


module.exports = {
  doctorLogin: doctorLogin,
  updateProfile: updateProfile,
  otpVerify: otpVerify,
  otpResend: otpResend,
  listDoctors: listDoctors,
  listHospitals: listHospitals,
  addTreatments: addTreatments,
  listTreatments: listTreatments,
  addEditBlog: addEditBlog,
  listBlog: listBlog,
  addTiming: addTiming,
  accessTokenLogin: accessTokenLogin,
  listTiming: listTiming,
  listBookings: listBookings,
  bookingStatusUpdate: bookingStatusUpdate,
  setPassword: setPassword,
  passwordLogin: passwordLogin,
  deleteBlog: deleteBlog,
  listReview: listReview,
  sendMessage : sendMessage,
  listusers : listusers,
  listMessages : listMessages,
  addPrescription : addPrescription,
  revenueGraph : revenueGraph,
  patientGraph : patientGraph,
  listUsersDetails : listUsersDetails,
  deleteTreatments : deleteTreatments,
  forgotPassword:forgotPassword,
  readMessages : readMessages



};
