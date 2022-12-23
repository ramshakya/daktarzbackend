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
  randomstring = require("randomstring");


const userLogin = async (payloadData) => {
    try {

    let generateOtp =  commonController.generateOtp()
   // console.log("=======================================generateOtp",generateOtp)

     let otpSet = 0;
     
     let query = {
        countryCode : payloadData.countryCode,
        phoneNo: payloadData.phoneNo,
      };
  
      var getData = await DAO.getData(Models.users, query, {}, { lean: true });


      if (getData.length == 0) {
        let saveData = {
          countryCode : payloadData.countryCode,
          phoneNo: payloadData.phoneNo,
          otp: generateOtp
        };
  
        let createUser = await DAO.saveData(Models.users, saveData);
        var message = commonController.otpMessage()
        let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
  
        if (createUser._id) {
          let tokenData = {
                scope: Config.APP_CONSTANTS.SCOPE.USER,
                _id: createUser._id,
                time: new Date().getTime()
          };

          let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.USER);
  
          if (accessToken == null) {
            throw ERROR.DEFAULT;
          }
  
          let tokenResult = await DAO.findAndUpdate(Models.users,{ _id: createUser._id },
            { accessToken: accessToken},
            { new: true }
          );
  
        } 
        else {
          throw ERROR.DB_ERROR;
        }
      } 
  
      else {
      
        let query = {
          countryCode : payloadData.countryCode,
          phoneNo: payloadData.phoneNo
        };
  
          let updateData = {otp: generateOtp }
  
          var update = await DAO.findAndUpdate(Models.users,query,updateData,{new:true})
  
         // console.log(".update.....",update);


          if(update.passwordSet == true){
            otpSet = 1;
          }else{
            var message = commonController.otpMessage()
            let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
          
          }
          
        
          let tokenData = {
                scope: Config.APP_CONSTANTS.SCOPE.USER,
                _id: update._id,
                time: new Date().getTime()
          };
  
          let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.USER);
  
        
  
          if (accessToken == null) {
            throw ERROR.DEFAULT;
          }

          let tokenProjection = {
            accessToken: accessToken
          }

          if(otpSet == 1){
            tokenProjection.passwordSet = true
          }
  
          let tokenResult = await DAO.findAndUpdate(Models.users,{ _id: update._id },
            tokenProjection,
            { new: true }
          );
  
        } 

        //adminController.jsconsole.log("...otpSet..otpSet...",otpSet);

          return {otp:otpSet}
      
    } catch (err) {
      throw err;
    }
  };


const updateProfile = async(payloadData,userData) => {
  try {

    let query = { _id: userData._id  }

    let updateData = { profileUpdated: true}

    if(payloadData.documents) {
        updateData.documents = payloadData.documents
      }

    if(payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      }
    }
    if(payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture
    }
    if(payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode
    }
    if(payloadData.password) {
      updateData.password = payloadData.password;
      updateData.passwordSet = true
    }
    
    if(payloadData.name) {
      updateData.name = payloadData.name
    }
    if(payloadData.address) {
      updateData.address = payloadData.address
    }
    if(payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo
    }
    if(payloadData.email) {
      updateData.email = payloadData.email
    }
    if(payloadData.houseNo) {
      updateData.houseNo = payloadData.houseNo
    }
    if(payloadData.city) {
      updateData.city = payloadData.city
    }
    if(payloadData.state) {
      updateData.state = payloadData.state
    }
    if(payloadData.country) {
      updateData.country = payloadData.country
    }
    if(payloadData.pincode) {
      updateData.pincode = payloadData.pincode
    }
    if(payloadData.about) {
      updateData.about = payloadData.about
    }
    if(payloadData.education) {
      updateData.education = payloadData.education
    }
    if(payloadData.languages) {
      updateData.languages = payloadData.languages
    }
    if(payloadData.gender) {
      updateData.gender = payloadData.gender
    }
    if(payloadData.dob) {
      updateData.dob = payloadData.dob
    }
    if(payloadData.bloodGroup) {
      updateData.bloodGroup = payloadData.bloodGroup
    }
    if(payloadData.timeZone) {
      updateData.timeZone = payloadData.timeZone
    }
    /*if(payloadData.documents) {
      updateData.documents = payloadData.documents
    }*/

    let update = await DAO.findAndUpdate(Models.users, query, updateData, { new: true })
    return update
  

  }
  catch (err) {
    throw err;
  }
}

//VERIFY OTP
const otpVerify = async (payloadData, userData) => {
  try {

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
    }

    let otpVerify = await DAO.getData(Models.users, query, {}, { lean: true });

    if (otpVerify.length) {
      if (!(otpVerify[0].otp == otp)) {
        throw ERROR.WRONG_OTP;
      }
  
      let setData = { otpVerify: true }
      let options = { new: true }
      let update = await DAO.findAndUpdate(Models.users, query, setData, options);
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
  //  console.log("=======================================generateOtp",generateOtp)

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo,
    };
    let getData = await DAO.getData(Models.users, query, {}, { lean: true })
    if (getData.length) {
      let query2 = { phoneNo: getData[0].phoneNo };
      let options = { new: true };
      let setData = { otp: generateOtp };
      let update = await DAO.findAndUpdate(Models.users, query2, setData, options);

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

const bookAmbulance = async(payloadData,userData) => {
  try {

      let bookAmbulance

      let query = {
         userId:userData._id,
         status : {$nin:['COMPLETE','CANCELED']}
      }
     
      let userBookings = await DAO.getData(Models.ambulanceBooking,query,{},{lean:true})
    //  console.log("====================================userBookings",userBookings)

      if(userBookings.length == 0) {

        let nearByDriver = await commonController.nearByAmbulance(payloadData.lng,payloadData.lat)
      //  console.log("====================================nearByDriver",nearByDriver)

       if(nearByDriver.length == 0) {
         throw ERROR.NO_AMBULANCE_FOUND;
        }

        let nearByHospital = await commonController.nearByHospital(payloadData.lng,payloadData.lat)
      // console.log("====================================nearByHospital",nearByHospital)
        let hospitalId;

        if(nearByHospital.length == 0) {
          throw ERROR.NO_HOSPITAL_FOUND;
        }

        else {
          hospitalId = nearByHospital[0]._id
        }

        if(nearByDriver.length) {
          let saveData = {
            userId : userData._id,
            "location.coordinates": [payloadData.lng, payloadData.lat],
            address : payloadData.address,
            phoneNo : payloadData.phoneNo,
            ambulanceId : nearByDriver[0]._id,
            hospitalId : hospitalId,
            status:"ASSIGN_DRIVER",
            bookingDate : moment().tz("Asia/Kolkata").format("DD-MM-YYYY") 
            }

            if(payloadData.name) {
              saveData.name = payloadData.name;
            }
            else {
              saveData.name = userData.name
            }

          let book = await DAO.saveData(Models.ambulanceBooking,saveData)
          //  console.log("====================================book",book)
          var message = "New booking assigned"
          let sendMessage =  smsManager.sendSms(nearByDriver[0].phoneNo,message)

          let saveNotifications = await DAO.saveData(Models.notifications, {
            message: "New Booking Received",
            notificationType: Config.APP_CONSTANTS.NOTIFICATION_TYPE.AMBULANCE,
            ambulanceId : nearByDriver[0]._id,
            timeStamp: +new Date()
            });
          
            var Data = {};
            Data.title = "New Booking";
            Data.message = "New Booking Received";
            Data.pushType = Config.APP_CONSTANTS.NOTIFICATION_TYPE.AMBULANCE;
  
          let sendNotifications = await NotificationsManager.sendNotification(Data,nearByDriver[0].deviceId);
       

          let query = {
              _id : nearByDriver[0]._id
          }
          let update = {ambulanceStatus :  Config.APP_CONSTANTS.AMBULANCESTATUS.BUSY}
          let updateAmbulance = await DAO.findAndUpdate(Models.ambulance,query,update,{new:true})
          let data = await getMapData(userData)
          bookAmbulance = data
      }
  
      else {
          let saveData = {
            userId : userData._id,
            "location.coordinates": [payloadData.lng, payloadData.lat],
            address : payloadData.address,
            phoneNo : payloadData.phoneNo,
            ambulanceId : null,
            hospitalId : nearByHospital[0]._id,
            status:"PENDING",
            bookingDate : moment().tz("Asia/Kolkata").format("DD-MM-YYYY") 
        }
        if(payloadData.name) {
          saveData.name = payloadData.name;
        }
        else {
          saveData.name = userData.name
        }
        let bookingData = await DAO.saveData(Models.ambulanceBooking,saveData)
       // console.log("======================bookingData",bookingData)
        let data = await getMapData(userData)
        bookAmbulance = data
       }
       return bookAmbulance
    }
    
    else {
      throw ERROR.YOU_ALREADY_BOOKED_AN_AMBULANCE;
    }

  }
  catch (err) {
    throw err;
  }
}


const getMapData = async(userData) =>{
  try{

   const match = {
        $match : {
          userId : mongoose.Types.ObjectId(userData._id),
          status : {$nin:['COMPLETE','CANCELED']}

        }
    }

    const lookup = {
        $lookup : {
          from : "users",
          localField : "userId",
          foreignField : "_id",
          as : "userData"
        }
    }

    const unwind = {
        $unwind : {
          path : "$userData",
          preserveNullAndEmptyArrays: true
        }
    }

    const ambulanceBooking = {
        $lookup : {
          from : "ambulances",
          localField : "ambulanceId",
          foreignField : "_id",
          as : "ambulanceData"
        }
    }

    const unwindAmbulance = {
        $unwind : {
          path : "$ambulanceData",
          preserveNullAndEmptyArrays: true
        }
    }

    const group = {
      $group : {
        _id : "$_id",
        status : {"$first" : "$status"},
        hospitalId : {"$first" : "$hospitalId"},
        ambulance_id : {"$first" : "$ambulanceData._id"},
        ambulanceName : {"$first" : "$ambulanceData.fullName"},
        ambulanceLocation : {"$first" : "$ambulanceData.location"},
        ambulancePhoneNo : {"$first": "$ambulanceData.phoneNo"},
        user_id : {"$first":"$userData._id"},
        userName : {"$first" :"$userData.name"},
        userPhoneNo : {"$first" :"$userData.phoneNo"},
        bookingLocation : {"$first" : "$location"},
        boookingAddress : {"$first" :"$address"}
      }
    }

    let aggregate = [match,lookup,unwind,ambulanceBooking,unwindAmbulance,group]
    let mapData = await DAO.aggregateData(Models.ambulanceBooking,aggregate,{lean:true})
   
    if(mapData.length) {
    let getHospitalData = await DAO.getData(Models.hospitals,{_id : mapData[0].hospitalId},{},{},{lean:true})

    if(mapData[0].status == 'START') {
      mapData[0].bookingLocation = mapData[0].bookingLocation;
      mapData[0].boookingAddress = mapData[0].boookingAddress;
    }

    if(mapData[0].status == 'REACHED' || mapData[0].status == 'REACHED_HOSPITAL') {
      mapData[0].bookingLocation = getHospitalData[0].location;
      mapData[0].boookingAddress = getHospitalData[0].address;
    }
    return mapData
  }

  else {
    return null
  }


  }catch(err){
    throw err;
  }
}

const listHospitals = async(payloadData) => {
  try {

    let query = {isDeleted: false,adminVerified : true}

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }


    let aggregate = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS * 1000,
          query : query,
          spherical: true
        }
    }

    let doctors = {
      $lookup : {
        from: "doctors",
        let : {hospitalId : "$_id"},
        pipeline: [
          {
            $match: {
                $expr: {
                    $and: [
                        { $in: ["$$hospitalId", "$hospitalId"] },
                        { $eq: ["$isDeleted", false] },
                        { $eq: ["$adminVerified", true] },
                    ]
                }
            }
         }
       ],
        as: "doctorsData",
      }
    }

    let treatments = {
      $lookup : {
        from : "treatments",
        let : {hospitalId : "$_id"},
        pipeline: [
         {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$$hospitalId", "$hospitalId"] },
                        { $eq: ["$isDeleted", false] }
                    ]
                }
            }
         }
       ],
        as : "treatmentsData"
      }
    }

    let project = {
      $project : {
          name : 1, coverPhoto:1, discount: 1, address:1, location:1, review:1,
          distance: 1, city : 1,
          treatments : "$treatmentsData",
          doctorsData : "$doctorsData",
          doctorsCount : {$size: "$doctorsData"},
      }
    }

    let group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        coverPhoto : {"$first" : "$coverPhoto"},
        discount : {"$first" : "$discount"},
        address : {"$first" : "$address"},
        location : {"$first" : "$location"},
        review : {"$first" : "$review"},
        distance : {"$first" : "$distance"},
        docProfilePic : {"$first" : "$doctorsData.profilePicture"},
        doctorsCount : {"$first" : "$doctorsCount"},
        treatments : {"$first" : "$treatments.name"},
        city :  {"$first" : "$city"}
      }
    }

   let regexMatchCity = {
      $redact : {
        $cond: {
          if: { $or:[
            { $eq : [ payloadData.city, null] },
            { $eq : [ payloadData.city, "$city"] },
            
          ] },
          then: "$$KEEP",
          else: "$$PRUNE"
        },
      }
   }

   let regexMatchName = {
    $redact : {
      $cond: {
        if: { $or:[
          { $eq : [ payloadData.name, null] },
          { $regexMatch : { input: "$name", regex: payloadData.name , options: "i" } }
        ] },
        then: "$$KEEP",
        else: "$$PRUNE"
      },
    }
   }

  let regexMatchTreatment = {
      $match : {
        "treatments.name" : { $regex: payloadData.treatment, $options: "i" } 
     }
   }
    
    let aggregateQuery = [aggregate, doctors,  treatments, project, regexMatchCity, regexMatchName, group]

    if(payloadData.treatment) {
      aggregateQuery = [aggregate, doctors,  treatments, project,regexMatchCity, regexMatchName, regexMatchTreatment, group]
    }



    console.log("=================================aggregateQuery",JSON.stringify(aggregateQuery))
    let listAllData = await DAO.aggregateData(Models.hospitals,aggregateQuery,{lean:true})

    return listAllData

  }
  catch(err) {
    throw err;
  }
}

const listHospitalDetails = async(payloadData) => {
  try {

      let query = {_id:payloadData._id, isDeleted :false, adminVerified:true}

      let projection = {
        accessToken : 0,
        hospitalId : 0,
        __v : 0
      }

      let projectTreatments = {
        _id : 1,
        name : 1,
        price : 1,
        discount : 1
      }

      let getData = await DAO.getData(Models.hospitals,query,projection,{lean:true})

      let listAmbulance = await DAO.getData(Models.ambulance,{hospitalId:payloadData._id, isDeleted :false, adminVerified:true},{},{lean:true})

      let listDoctors = await DAO.getData(Models.doctors,{hospitalId:payloadData._id, isDeleted :false, adminVerified:true},{},{lean:true})

      let listBlogs = await DAO.getData(Models.blogs,{ hospitalId:payloadData._id },{},{lean:true})

      let listTreatments = await DAO.getData(Models.treatments,{ hospitalId:payloadData._id , isDeleted:false},projectTreatments,{lean:true})

      let ambulance = [];
      let doctors = [];
      let blogs = [];
      let treatments = [];

      for(let i = 0; i<listDoctors.length; i++) {
        doctors.push({
          _id : listDoctors[i]._id,
          name : listDoctors[i].name,
          profilePicture : listDoctors[i].profilePicture,
          review : listDoctors[i].review,
          rating : listDoctors[i].rating,
          registrationNo : listDoctors[i].registrationNo,
          education : listDoctors[i].education,
          uniquekey : listDoctors[i].uniquekey,
        })
      }

      for(let j =0; j<listAmbulance.length;j++) {
        ambulance.push({
          _id : listAmbulance[j]._id,
          name : listAmbulance[j].name,
          profilePicture : listAmbulance[j].profilePicture,
          review : listAmbulance[j].review,
          rating : listAmbulance[j].rating,
          registrationNo : listAmbulance[j].registrationNo,
          phoneNo : listAmbulance[j].phoneNo,
          vehicleNo : listAmbulance[j].vehicleNo,

        })
      }

      for(let k =0; k<listBlogs.length;k++) {
      //  blogs.push(listBlogs[k].image)
        blogs.push({
          _id : listBlogs[k]._id,
          title : listBlogs[k].title,
          image : listBlogs[k].image,
          uniquekey : listBlogs[k].uniquekey
        })

      }

      /*for(let l =0; l<listTreatments.length;l++) {
        treatments.push(listTreatments[l].name)
      }*/

      let slotsData = []

      let slots = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00",
                   "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
                   "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
                   "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
                   "22:00", "22:30", "23:00", "23:30"
                  ]

    

     for(let i = 0; i<slots.length; i++) {

            let splitStartTime = slots[i].split(":")
            console.log("=============================splitStartTime",splitStartTime)
            if(splitStartTime[1] == 00) {
              let convert = moment( slots[i],"hh:mm").format("HH") 
              slotsData.push({
                time : convert + ":00",
                status : true
              })

              slotsData.push({
                time : convert + ":30",
                status : true
              })
            }
  
      }

      let currentTime = moment().tz("Asia/Kolkata").format("HH:mm")
      console.log("=====================================currentTime",currentTime)

      for(let j = 0; j<slotsData.length; j++) {
        console.log("==============================slotsData[j].time",slotsData[j].time)
        if(slotsData[j].time > currentTime) {
          slotsData[j].status = false
        }
      }


      
      
      getData[0].ambulance = ambulance
      getData[0].doctors = doctors
      getData[0].blogs = blogs
      getData[0].treatments = listTreatments
      getData[0].slots = slotsData
      return getData
  }
  catch (err) {
    throw err;
  }
}

const listDoctors = async(payloadData) => {
  try {

    let checkTimeZone = await timeZone(payloadData)
    let city = payloadData.city
    let name = payloadData.name
    let treatment = payloadData.treatment

    let query = {
      isDeleted: false,
      adminVerified : true,
      $or : [
        {status : Config.APP_CONSTANTS.DOCTOR_STATUS.INDIVIDUAL},
        {status : Config.APP_CONSTANTS.DOCTOR_STATUS.BOTH}
      ]
    }

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }


    const nearByDoctors = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
          query : query,
          spherical: true
        }
    }

    const treatments = {
          $lookup : {
            from : "treatments",
            localField : "_id",
            foreignField : "doctorId",
            as : "treatmentsData"
          }
        }

    let unwind2 = {
      $unwind: {
        "path": "$treatmentsData",
        "preserveNullAndEmptyArrays": true
      }
    }

    let matchData = {
      $match : {
        "treatmentsData.isDeleted" : false
      }
    }


    const group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        profilePicture : {"$first" : "$profilePicture"},
        education : {"$first" : "$education"},
        location : {"$first" : "$location"},
        address : {"$first" : "$address"},
        review : {"$first" : "$review"},
        averageRatings : {"$first" : "$averageRatings"},
        ratingsCount : {"$first" : "$ratingsCount"},
        experience : {"$first" : "$experience"},
        doctorVerified : {"$first" : "$doctorVerified"},
        discount : {"$first" : "$discount"},
        uniqueKey : {"$first" : "$uniquekey"},
        city : {"$first" : "$city"},
        treatments : {
          $push : "$treatmentsData.name"
          
        }
      }
    }

    let regexMatchCity = {
      $match : {
        city : { $regex: city, $options: "i" } 
     }
   }

  let regexMatchName = {
      $match : {
        name : { $regex: name, $options: "i" } 
     }
   }

    let regexMatchTreatment = {
      $match : {
        "treatmentsData.name" : { $regex: treatment, $options: "i" } 
     }
   }



    let aggregateQuery = [nearByDoctors, treatments, unwind2, matchData, group]

    if(payloadData.city) {
      aggregateQuery = [nearByDoctors, treatments, unwind2, matchData, regexMatchCity, group]
    }
    if(payloadData.name) {
      aggregateQuery = [nearByDoctors, treatments, unwind2, matchData, regexMatchName, group]
    }
    if(payloadData.treatment) {
      aggregateQuery = [nearByDoctors, treatments, unwind2, matchData, regexMatchTreatment, group]
    }


    let listAllData = await DAO.aggregateData(Models.doctors,aggregateQuery,{lean:true})
    
    return listAllData
  
  }
  catch(err) {
    throw err;
  }
}

const listDoctorsDetails = async(payloadData) => {
  try {

    let query = {uniquekey:payloadData._id, isDeleted :false, adminVerified:true}
    let day = moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("dddd") 
    
    let queryBookings, queryTiming, queryBlogs, queryTreatments
    let projection = {
          profilePicture : 1,
          name : 1,
          countryCode : 1,
          phoneNo : 1,
          education : 1, 
          ratingsCount : 1,
          averageRatings: 1,
          review: 1,
          starsCount_One : 1,
          starsCount_Two : 1,
          starsCount_Three : 1,
          starsCount_Four : 1,
          starsCount_Five : 1,
          registrationNo :  1,
          location: 1,
          address: 1,
          about : 1,
          awards : 1,
          membership : 1,
          languages : 1,
          experience :  1,    
          hospitalId : 1 ,
          speciality : 1,
          status : 1,
          discount : 1,
          services : 1
    }

    let populate = [
      {
        path : "review.userId",
        select : "profilePicture name"
      }

    ]

      let getData = await DAO.populateData(Models.doctors,query,projection,{lean:true},populate)
      console.log("========================================================getData",getData)

      let doctorId = getData[0]._id


      if(payloadData.hospitalId) {
        queryBookings = {
          hospitalId : payloadData.hospitalId,
          doctorId : doctorId, 
          //doctorId : payloadData._id, 
          status : {$ne : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL},
          bookingDate : moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("DD-MM-YYYY") 
        }

        queryTiming = {
          doctorId : doctorId, 
            //doctorId : payloadData._id,
            hospitalId : payloadData.hospitalId,
            day : day
        }
        queryTreatments = {
          hospitalId : payloadData.hospitalId,
          isDeleted : false
        }
        queryBlogs = {
          hospitalId : payloadData.hospitalId,
        }
      }

      else {
          queryBookings = {
            doctorId : doctorId, 
              //doctorId:payloadData._id, 
              status : {$ne : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL},
              bookingDate : moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("DD-MM-YYYY") 
          }
          queryTiming = {
            doctorId : doctorId, 
             // doctorId : payloadData._id,
              hospitalId : null,
              day : day
          }
          queryBlogs = {
            doctorId : doctorId, 
            //doctorId:payloadData._id
          }
          queryTreatments = {
            doctorId : doctorId, 
            //doctorId:payloadData._id,
            isDeleted : false
          }
      }


      let listTimings = await DAO.getData(Models.doctorsTiming,queryTiming,{},{lean:true})
      let listbookings = await DAO.getData(Models.doctorBookings,queryBookings,{},{lean:true})
      let listBlogs = await DAO.getData(Models.blogs,queryBlogs,{},{lean:true})
      let listTreatments = await DAO.getData(Models.treatments,queryTreatments,{},{lean:true})

      let slots = []
      let blogs = []
      let treatments = []
      let convertStartTime,newEndTime

      if(listTimings.length) {

      for(let i =0; i<listTimings.length; i++) {

        console.log("=========================listTimings[i].startTime",listTimings[i].startTime)

        if(listTimings[i].startTime != null || listTimings[i].endTime != null) {

        if(listTimings[i].endTime == "00:00") {
          console.log("===============================listTimings[i].endTime",listTimings[i].endTime)
          newEndTime = "24:00"
        }

        if(!(listTimings[i].endTime == "00:00")) {
          console.log("===============================listTimings[i].endTime",listTimings[i].endTime)
          newEndTime = listTimings[i].endTime
        }

        let splitStartTime = listTimings[i].startTime.split(":")
        console.log("=============================splitStartTime",splitStartTime)
        if(splitStartTime[1] == 00) {
          let convert = moment( listTimings[i].startTime,"hh:mm").format("HH") 
          slots.push({
            time : convert + ":00",
            status : false
          })
          slots.push({
            time : convert + ":30",
            status : false
          })
        }

        if(splitStartTime[1] != 00) {
          let convert = moment( listTimings[i].startTime,"hh:mm").format("hh:mm") 
          slots.push({
            time : convert,
            status : false
          })
        }

        convertStartTime = parseInt(splitStartTime[0]) + 1

       // let splitEndTime = listTimings[i].endTime.split(":")
       let splitEndTime = newEndTime.split(":")
       console.log("=============================splitEndTime",splitEndTime)
    
        for(let j = convertStartTime ; j< parseInt(splitEndTime[0]) ; j++) {
          let convert = moment(j,"HH").format("HH") 
              slots.push({
                time : convert + ":00",
                status : false
              })
              slots.push({
                time : convert + ":30",
                status : false
              })
        }
        if(splitEndTime[1] != 00) {
           slots.push({
             time : splitEndTime[0] + ":00",
             status : false
           })
        }
      }

    }

    console.log("================================slots",slots)

     for(let i = 0; i<slots.length; i++) {

      let currentHours = moment().tz("Asia/Kolkata").format("HH:mm") 
      let currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY")



        if(payloadData.bookingDate == currentDate && slots[i].time < currentHours ) {
            console.log("====================================",true)
            slots[i].status = true
        }

        for(let j = 0; j<listbookings.length;j++) {
          if(slots[i].time == listbookings[j].startTime) {
            slots[i].status = true
          }
        }
      }

      for(let k =0; k<listBlogs.length;k++) {
        blogs.push({
          _id : listBlogs[k]._id,
          title : listBlogs[k].title,
          image : listBlogs[k].image,
          uniquekey : listBlogs[k].uniquekey
        })
        

      }

      for(let l =0; l<listTreatments.length;l++) {
        treatments.push({
          _id :  listTreatments[l]._id,
          name : listTreatments[l].name,
          price : listTreatments[l].price,
          discount : listTreatments[l].discount,

        })
      }

      getData[0].timings = listTimings
      getData[0].blogs = blogs
      getData[0].treatments = treatments
      getData[0].slots = slots
      return getData
    
  }

  

  else {
      for(let k =0; k<listBlogs.length;k++) {
        blogs.push({
          _id : listBlogs[k]._id,
          title : listBlogs[k].title,
          image : listBlogs[k].image,
          uniquekey : listBlogs[k].uniquekey
        })
      }

      for(let l =0; l<listTreatments.length;l++) {
        treatments.push({
          _id :  listTreatments[l]._id,
          name : listTreatments[l].name,
          price : listTreatments[l].price,
          discount : listTreatments[l].discount,

        })
      }

      getData[0].timings = listTimings
      getData[0].blogs = blogs
      getData[0].treatments = treatments
      getData[0].slots = slots
      return getData
  }
}


  catch (err) {
    throw err;
  }
}

const listPharmecies = async(payloadData) => {
  try {

    let checkTimeZone = await timeZone(payloadData)
   // console.log("==========================================checkTimeZone",checkTimeZone)

    let queryTimings = {
      day : checkTimeZone[0].currentDay,
      $and : [
        {openTime : {$lte : checkTimeZone[0].totalMinutes }},
        {closeTime : {$gte : checkTimeZone[0].totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.pharmecyTiming,queryTimings,{},{lean:true})
    //console.log("================================================checkTimings",checkTimings)

    let pharmecyId = []
    if(checkTimings.length) {
      for(let i =0; i<checkTimings.length;i++) {
      //  console.log("=======checkTimings[i].pharmecyId",checkTimings[i].pharmecyId)
        pharmecyId.push(checkTimings[i].pharmecyId)
      }
    }
  //  console.log("======================================pharmecyId",pharmecyId)

      let query = {
        _id : {$in : pharmecyId},
        isDeleted: false,
        adminVerified : true
        }
        if(!(payloadData.lat)){
          payloadData.lat = 30.7190586
        }

        if(!(payloadData.lng)){
          payloadData.lng = 76.74870439999995
        }
        const nearBy = {
          $geoNear: {
              near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
              distanceField: "distance",
              maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS * 1000,
              query : query,
              spherical: true
            }
        }

        const group = {
          $group : {
            _id : "$_id",
            name : {"$first" : "$name"},
            profilePicture : {"$first" : "$profilePicture"},
            countryCode : { "$first": "$countryCode" },
            phoneNo : {"$first" : "$phoneNo"},
            location : {"$first" : "$location"},
            address : {"$first" : "$address"},
            discount : {"$first" : "$discount"},
            registrationNo : {"$first" : "$registrationNo"},
            review : {"$first" : "$review"},
            ratingsCount : {"$first" : "$ratingsCount"},
            averageRatings : {"$first" : "$averageRatings"},
            distance : {"$first" : "$distance"},
            city : {"$first" : "$city"},
            
          }
        }

        const skip = {
          $skip : Config.APP_CONSTANTS.LIMIT.limit * payloadData.skip  
        }

        const limit = {
          $limit : Config.APP_CONSTANTS.LIMIT.limit
        }

        let regexMatchCity = {
          $redact : {
            $cond: {
              if: { $or:[
                { $eq : [ payloadData.city, null] },
                { $eq : [ payloadData.city, "$city"] },
                
              ] },
              then: "$$KEEP",
              else: "$$PRUNE"
            },
          }
       }
    
       let regexMatchName = {
        $redact : {
          $cond: {
            if: { $or:[
              { $eq : [ payloadData.name, null] },
              { $regexMatch : { input: "$name", regex: payloadData.name , options: "i" } }
            ] },
            then: "$$KEEP",
            else: "$$PRUNE"
          },
        }
       }
    
 
      let aggregateQuery = [nearBy, regexMatchCity, regexMatchName, group, skip, limit]
    
    
      var listAllData = await DAO.aggregateData(Models.pharmecy,aggregateQuery,{lean:true}) 
      return listAllData
  
}
  catch(err) {
    throw err;
  }
}

const listPharmecyDetails = async(payloadData) => {
  try {
    let query = {
      _id : mongoose.Types.ObjectId(payloadData._id),
      isDeleted : false,
      adminVerified : true
    }

    let projection = {
      _id : 1,
      name : 1,
      profilePicture : 1,
      location : 1,
      address : 1,
      discount : 1,
      registrationNo : 1, 
      review : 1,
      ratingsCount : 1,
      averageRatings : 1,
      starsCount_One : 1,
      starsCount_Two : 1,
      starsCount_Three : 1,
      starsCount_Four : 1,
      starsCount_Five : 1,
      images : 1,
      about : 1,
    }

    let populate = [
      {
        path : "review.userId",
        select : "profilePicture name"
      }

    ]

    let detailPharmecy = await DAO.populateData(Models.pharmecy,query,projection,{lean:true},populate)

    let queryTimings = {
      pharmecyId : payloadData._id
    }
    if(payloadData.selectDate) {
      queryTimings.day = moment(payloadData.selectDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("dddd")
    }

    let pharmecyTiming = await DAO.getData(Models.pharmecyTiming,queryTimings,{},{lean:true})
    detailPharmecy[0].timings = pharmecyTiming

    return detailPharmecy

  }
  catch (err) {
    throw err;
  }
}

const listLabs = async(payloadData) => {
  try {

    let checkTimeZone = await timeZone(payloadData)
  //  console.log("==========================================checkTimeZone",checkTimeZone)

    let queryTimings = {
      day : checkTimeZone[0].currentDay,
      $and : [
        {openTime : {$lte : checkTimeZone[0].totalMinutes }},
        {closeTime : {$gte : checkTimeZone[0].totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.labsTimings,queryTimings,{},{lean:true})
   // console.log("================================================checkTimings",checkTimings)

    let labId = []
    if(checkTimings.length) {
    for(let i =0; i<checkTimings.length;i++) {
    
      labId.push(checkTimings[i].labId)
     }
    }
   // console.log("======================================labId",labId)

    let query = {
      _id : {$in : labId},
      isDeleted: false,
      adminVerified : true
    }

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }

    console.log("===========================================payloadData.lat",payloadData.lat)
    console.log("===========================================payloadData.lng",payloadData.lng)


    const aggregate = {
      $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(payloadData.lng),parseFloat(payloadData.lat)] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS * 1000,
          query : query,
          spherical: true
        }
    }

    

    const labtests = {
      $lookup : {
        from : "labtests",
        localField : "_id",
        foreignField : "labId",
        as : "labData"
      }
    }

    const unwindTests = {
        $unwind : {
          "path" : "$labData",
          "preserveNullAndEmptyArrays": true
        }
    }

    const matchTest = {
      $match : {
        "labData.isDeleted" : false
      }
    }
    
    const group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        profilePicture : {"$first" : "$profilePicture"},
        location : {"$first" : "$location"},
        address : {"$first" : "$address"},
        discount : {"$first" : "$discount"},
        registrationNo : {"$first" : "$registrationNo"},
        ratingsCount : {"$first" : "$ratingsCount"},
        averageRatings : { "$first" : "$averageRatings"},
        review : {"$first" : "$review"},
        distance : { "$first" : "$distance" },
        city : { "$first" : "$city" },
        startingPrice : {$min: "$labData.price"},
        testCount : {
          $push : "$labData"
        }
      }
    }

   const project = {
      $project : {
          name : 1, profilePicture:1, discount: 1, address:1, location:1, review:1, averageRatings:1, 
          registrationNo: 1,
          startingPrice : 1,
          ratingsCount : 1,
          city : 1,
          distance : "$distance",
          testCount : {$size : "$testCount"}
      }
    }

    let regexMatchCity = {
      $redact : {
        $cond: {
          if: { $or:[
            { $eq : [ payloadData.city, null] },
            { $eq : [ payloadData.city, "$city"] },
            
          ] },
          then: "$$KEEP",
          else: "$$PRUNE"
        },
      }
   }

    let regexMatchName = {
      $redact : {
        $cond: {
          if: { $or:[
            { $eq : [ payloadData.name, null] },
            { $regexMatch : { input: "$name", regex: payloadData.name , options: "i" } }
          ] },
          then: "$$KEEP",
          else: "$$PRUNE"
        },
      }
    }

    let regexMatchTests = {
        $match : {
          "labData.name" : { $regex: payloadData.tests, $options: "i" } 
      }
    }

    let aggregateQuery = [aggregate,labtests,unwindTests,matchTest,regexMatchCity, regexMatchName,  group,project]

    if(payloadData.tests) {
      aggregateQuery = [aggregate,labtests,unwindTests,matchTest,regexMatchCity, regexMatchName, regexMatchTests,  group,project]
    }
  
    let listAllData = await DAO.aggregateData(Models.labs,aggregateQuery,{lean:true})
   
    return listAllData

  }
  catch(err) {
    throw err;
  }
}


const listLabsDetails = async(payloadData) => {
  try {



    let query = {
      _id : mongoose.Types.ObjectId(payloadData._id),
      isDeleted : false,
      adminVerified : true
    }

    let projection = {
      _id : 1,
      name : 1,
      profilePicture : 1,
      location : 1,
      address : 1,
      discount : 1,
      registrationNo : 1, 
      review : 1,
      ratingsCount : 1,
      averageRatings : 1,
      starsCount_One : 1,
      starsCount_Two : 1,
      starsCount_Three : 1,
      starsCount_Four : 1,
      starsCount_Five : 1,
      images : 1,
      about : 1,
    }

    let populate = [
      {
        path : "review.userId",
        select : "profilePicture name"
      }

    ]

    let labDetails = await DAO.populateData(Models.labs,query,projection,{lean:true},populate)

    let queryTimings = {
      labId : payloadData._id,
    }
    if(payloadData.selectDate) {
      queryTimings.day = moment(payloadData.selectDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("dddd")
    }

    let labTimings = await DAO.getData(Models.labsTimings,queryTimings,{},{lean:true})
    labDetails[0].timings = labTimings

    let queryTests = {
      labId : payloadData._id,
      isDeleted:false
    }

    let labTests = await DAO.getData(Models.labTests,queryTests,{_id:1,name:1,description:1,price:1},{lean:true})
    labDetails[0].labTests = labTests

    return labDetails
  }
  catch (err) {
    throw err;
  }
}

const pharmecyBooking = async (payloadData,userData) => {
  try {

    let dateTime = moment().tz("Asia/Kolkata").add(1,"hour").format("x")

    let currentDay = moment().tz("Asia/Kolkata").format("dddd")
   // console.log("==========================================currentDay",currentDay)

    let hours = moment().tz("Asia/Kolkata").format("HH")
    //console.log("==========================================hours",hours)

    let minutes = moment().tz("Asia/Kolkata").format("mm")
   // console.log("==========================================minutes",minutes)

    let currentMinutes = hours * 60
    let totalMinutes = currentMinutes + parseInt(minutes)

  //  console.log("==========================================totalMinutes",totalMinutes)


    let queryTimings = {
      pharmecyId : payloadData.pharmecyId,
      day : currentDay,
      $and : [
        {openTime : {$lte : totalMinutes }},
        {closeTime : {$gte : totalMinutes }}
      ]
     }

    let checkTimings = await DAO.getData(Models.pharmecyTiming,queryTimings,{},{lean:true})
  //  console.log("================================================checkTimings",checkTimings)
    if(checkTimings.length == 0) {
      throw ERROR.PHARMECY_CLOSED
    }

  /*  console.log("===============================================payloadData",payloadData)
    let currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY")
    let bookingDate = moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("DD-MM-YYYY")
    console.log("===============================================currentDate",currentDate)
    console.log("===============================================bookingDate",bookingDate)*/

    let saveData = {
      userId : userData._id,
      pharmecyId : payloadData.pharmecyId,
      images : payloadData.images,
      dateTime : dateTime,
      "location.coordinates": [payloadData.lng, payloadData.lat],
      city : payloadData.city,
      address : payloadData.address,
      month : moment(dateTime,"x").format("MMMM"),
      bookingDate : moment(dateTime,"x").format("DD-MM-YYYY"),
      createdAt : +new Date()
    }

    let saveBookings = await DAO.saveData(Models.pharmecyBookings,saveData)

    let pharmecyPhoneNo = await DAO.getData(Models.pharmecy,{_id:payloadData.pharmecyId},{},{lean:true})

    let time = moment(saveBookings.dateTime,"x").tz("Asia/Kolkata").format("HH:mm")
    console.log("========================================time",time)
    

    var message = userData.phoneNo + " has ordered medicines at " + " at " + time + " and " + saveBookings.bookingDate;
    let sendMessage =  smsManager.sendSms(pharmecyPhoneNo[0].phoneNo,message)

    let sendMessageToUser = await messageToUser(userData.phoneNo, pharmecyPhoneNo[0].name, time, saveBookings.bookingDate)

    return saveBookings

  }
  catch (err) {
    throw err;
  }
}

const labBooking = async (payloadData,userData) => {
  try {

   
    let currentDay = moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("dddd")
   // console.log("==========================================currentDay",currentDay)

    let hours = moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("HH")
   // console.log("==========================================hours",hours)

    let minutes = moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("mm")
   // console.log("==========================================minutes",minutes)

    let currentMinutes = hours * 60
    let totalMinutes = currentMinutes + parseInt(minutes)

    //console.log("==========================================totalMinutes",totalMinutes)


    let queryTimings = {
      day : currentDay,
      $and : [
        {openTime : {$lte : totalMinutes }},
        {closeTime : {$gte : totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.labsTimings,queryTimings,{},{lean:true})
    if(checkTimings.length == 0) {
      throw ERROR.LAB_CLOSED
    }

   var calculatedPrice = 0;
   let saveData = {
      userId : userData._id,
    }

    let saveBookings = await DAO.saveData(Models.labsBookings,saveData)

    let getPhoneNo, time, date;

    let tests = payloadData.labTestId
    for(let i = 0;i<tests.length;i++) {
      var testId = tests[i].labTestId
      let query = { _id : testId }
      var getLabIds = await DAO.getData(Models.labTests,query,{},{lean:true})
  

      for(let j = 0; j<getLabIds.length;j++) {
        let totalPrice = tests[i].price * tests[i].quantity
        calculatedPrice += +totalPrice;
       // console.log("========================tests[i].price",tests[i].price)
        //console.log("========================calculatedPrice",calculatedPrice)
          let updateData = {
            $push : {
              labTests : {
                labId : getLabIds[j].labId,
                labTestId :  getLabIds[j]._id,
                name :  getLabIds[j].name,
                description :  getLabIds[j].description,
                price : tests[i].price,
                quantity :tests[i].quantity
              }
            },
            labId : getLabIds[0].labId,
            totalPrice : calculatedPrice,
            dateTime : payloadData.dateTime,
            month : moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("MMMM"),
            bookingDate : moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("DD-MM-YYYY"),
            "location.coordinates": [payloadData.lng, payloadData.lat],
            city : payloadData.city,
            address : payloadData.address,
            createdAt : +new Date()
          }

          if(payloadData.transactionId){
            updateData.transactionId = payloadData.transactionId
          }

          getPhoneNo = await DAO.getData(Models.labs,{_id:getLabIds[0].labId},{},{lean:true})
          let updateOrder = await DAO.findAndUpdate(Models.labsBookings,{_id : saveBookings._id},updateData,{new:true, lean:true})

          time = moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("HH:mm")
          date = moment(payloadData.dateTime,"x").tz("Asia/Kolkata").format("DD-MM-YYYY")


          let message = userData.phoneNo + " has booked an appointment with " + getPhoneNo[0].name + " at time " + time + " on date " + date
          let sendMessage =  smsManager.sendSms(getPhoneNo[0].phoneNo,message)
      }
    }

    let getLabBookings = await DAO.getData(Models.labsBookings,{_id:saveBookings._id},{},{lean:true})


    let sendMessageToUser = await messageToUser(userData.phoneNo, getPhoneNo[0].name, time, date)
    return getLabBookings

  }
  catch (err) {
    throw err;
  }
}


const home = async (payloadData) => {
  try {
    
    let listDoctors = await listHomeDoctors(payloadData)
    let listHospitals = await listHomeHospitals(payloadData)
    let listLabs = await listHomelabs(payloadData)
    let listPharmecy = await listHomePharmecy(payloadData) 
    let listDoctorBlogs = await listHomeDoctorBlogs()
    let listHospitalBlogs = await listHomeHospitalBlogs()

    return {listDoctors , listHospitals, listLabs, listPharmecy, listDoctorBlogs, listHospitalBlogs}

  }
  catch (err) {
    throw err;
  }
}

const listHomeDoctors = async (payloadData) => {
  try {

    // let checkTimeZone = await timeZone(payloadData)
    // let queryTimings = {
    //   day : checkTimeZone[0].currentDay,
    //   $and : [
    //     {openTime : {$lte : checkTimeZone[0].totalMinutes }},
    //     {closeTime : {$gte : checkTimeZone[0].totalMinutes }}
    //   ]
    //   }

    // let checkTimings = await DAO.getData(Models.doctorsTiming,queryTimings,{},{lean:true})
    // //console.log("================================================checkTimings",checkTimings)

    // let doctorId = []
    // if(checkTimings.length) {
    //   for(let i =0; i<checkTimings.length;i++) {
    //     doctorId.push(checkTimings[i].doctorId)
    //   }
    // }
    // //console.log("======================================doctorId",doctorId)
  
    let query = {
      //_id : {$in : doctorId},

      isDeleted: false,
      adminVerified : true,
      $or : [
        {status : Config.APP_CONSTANTS.DOCTOR_STATUS.INDIVIDUAL},
        {status : Config.APP_CONSTANTS.DOCTOR_STATUS.BOTH}
      ]
    }

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }

    const nearByDoctors = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
          query : query,
          spherical: true
        }
    }

    const treatments = {
          $lookup : {
            from : "treatments",
            localField : "_id",
            foreignField : "doctorId",
            as : "treatmentsData"
          }
        }

  let unwind2 = {
    $unwind: {
      "path": "$treatmentsData",
      "preserveNullAndEmptyArrays": true
    }
  }

  let matchData = {
    $match : {
      "treatmentsData.isDeleted" : false
    }
  }


    const group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        profilePicture : {"$first" : "$profilePicture"},
        education : {"$first" : "$education"},
        location : {"$first" : "$location"},
        address : {"$first" : "$address"},
        review : {"$first" : "$review"},
        averageRatings : {"$first" : "$averageRatings"},
        ratingsCount : {"$first" : "$ratingsCount"},
       // treatments : {"$first" : "$treatmentsData.name"},
        discount : {"$first" : "$discount"},
        treatments : {
          $push : "$treatmentsData.name"
          
        }
      }
    }

    const limit = {
      $limit : 5
    }
      
    let aggregateQuery = [nearByDoctors,treatments,unwind2,matchData,group,limit]
    let listDoctors = await DAO.aggregateData(Models.doctors,aggregateQuery,{lean:true})
    let doctorsCount = await DAO.count(Models.doctors,{isDeleted: false,adminVerified : true},{},{lean:true})
    return {listDoctors,doctorsCount}

  }
  catch (err) {
    throw err;
  }
}

const listHomeHospitals = async(payloadData) => {
  try {

    let query = {isDeleted: false,adminVerified : true}

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }


    let aggregate = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS * 1000,
          query : query,
          spherical: true
        }
    }

    let doctors = {
      $lookup : {
        from: "doctors",
        let : {hospitalId : "$_id"},
        pipeline: [
          {
            $match: {
                $expr: {
                    $and: [
                        { $in: ["$$hospitalId", "$hospitalId"] },
                        { $eq: ["$isDeleted", false] },
                        { $eq: ["$adminVerified", true] },
                    ]
                }
            }
         }
       ],
        as: "doctorsData",
      }
    }

    let treatments = {
      $lookup : {
        from : "treatments",
        let : {hospitalId : "$_id"},
        pipeline: [
         {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$$hospitalId", "$hospitalId"] },
                        { $eq: ["$isDeleted", false] }
                    ]
                }
            }
         }
       ],
        as : "treatmentsData"
      }
    }

    let project = {
      $project : {
          name : 1, coverPhoto:1, discount: 1, address:1, location:1, review:1,
          distance: 1,
          treatments : "$treatmentsData",
          doctorsData : "$doctorsData",
          doctorsCount : {$size: "$doctorsData"},
      }
    }

    let group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        coverPhoto : {"$first" : "$coverPhoto"},
        discount : {"$first" : "$discount"},
        address : {"$first" : "$address"},
        location : {"$first" : "$location"},
        review : {"$first" : "$review"},
        distance : {"$first" : "$distance"},
        docProfilePic : {"$first" : "$doctorsData.profilePicture"},
        doctorsCount : {"$first" : "$doctorsCount"},
        treatments : {"$first" : "$treatments.name"}
      }
    }
    
    let aggregateQuery = [aggregate, doctors,  treatments, project,  group]
    let listAllData = await DAO.aggregateData(Models.hospitals,aggregateQuery,{lean:true})
    let hospitalCount = await DAO.count(Models.hospitals,{isDeleted: false,adminVerified : true},{},{lean:true})
    return {listAllData,hospitalCount}

  }
  catch (err) {
    throw err;
  }
}

const listHomelabs = async(payloadData) => {
  try {

    let checkTimeZone = await timeZone(payloadData)
    //console.log("==========================================checkTimeZone",checkTimeZone)

    let queryTimings = {
      day : checkTimeZone[0].currentDay,
      $and : [
        {openTime : {$lte : checkTimeZone[0].totalMinutes }},
        {closeTime : {$gte : checkTimeZone[0].totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.labsTimings,queryTimings,{},{lean:true})
  //  console.log("================================================checkTimings",checkTimings)

    let labId = []
    if(checkTimings.length) {
    for(let i =0; i<checkTimings.length;i++) {
      //console.log("===================checkTimings[i].labId",checkTimings[i].labId)
      labId.push(checkTimings[i].labId)
     }
    }
    //console.log("======================================labId",labId)

    let query = {_id : {$in : labId}, isDeleted: false,adminVerified : true}

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }

    const aggregate = {
      $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(payloadData.lng),parseFloat(payloadData.lat)] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
          query : query,
          spherical: true
        }
    }

    const labtests = {
      $lookup : {
        from : "labtests",
        localField : "_id",
        foreignField : "labId",
        as : "labData"
      }
    }

    const unwindTests = {
        $unwind : {
          "path" : "$labData",
          "preserveNullAndEmptyArrays": true
        }
    }
    
    const group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        profilePicture : {"$first" : "$profilePicture"},
        location : {"$first" : "$location"},
        address : {"$first" : "$address"},
        discount : {"$first" : "$discount"},
        registrationNo : {"$first" : "$registrationNo"},
        review : {"$first" : "$review"},
        rating : {"$first" : "$rating"},
        startingPrice : {$min: "$labData.price"},
        testCount : {
          $push : "$labData"
        }
      }
    }

   const project = {
      $project : {
          name : 1, profilePicture:1, discount: 1, address:1, location:1, review:1, rating:1, 
          registrationNo: 1,
          startingPrice : 1,
          testCount : {$size : "$testCount"}
      }
    }

    const limit = {
      $limit : 5
    }

    let aggregateQuery = [aggregate,labtests,unwindTests,group,project,limit]

    let listAllData = await DAO.aggregateData(Models.labs,aggregateQuery,{lean:true})
    let labCount = await DAO.count(Models.labs,{_id : {$in : labId},isDeleted: false,adminVerified : true},{},{lean:true})
    return {listAllData,labCount}

  }
  catch (err) {
    throw err;
  }
}

const listHomePharmecy = async(payloadData) => {
  try {

    let checkTimeZone = await timeZone(payloadData)
   // console.log("==========================================checkTimeZone",checkTimeZone)

    let queryTimings = {
      day : checkTimeZone[0].currentDay,
      $and : [
        {openTime : {$lte : checkTimeZone[0].totalMinutes }},
        {closeTime : {$gte : checkTimeZone[0].totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.pharmecyTiming,queryTimings,{},{lean:true})
   // console.log("================================================checkTimings",checkTimings)

    let pharmecyId = []
    if(checkTimings.length) {
      for(let i =0; i<checkTimings.length;i++) {
       // console.log("=======checkTimings[i].pharmecyId",checkTimings[i].pharmecyId)
        pharmecyId.push(checkTimings[i].pharmecyId)
      }
    }
   // console.log("======================================pharmecyId",pharmecyId)
  
    let query = {_id : {$in : pharmecyId },isDeleted: false,adminVerified : true}

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }

 
    const nearBy = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
          query : query,
          spherical: true
        }
    }

    const group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        profilePicture : {"$first" : "$profilePicture"},
        location : {"$first" : "$location"},
        address : {"$first" : "$address"},
        discount : {"$first" : "$discount"},
        registrationNo : {"$first" : "$registrationNo"},
        review : {"$first" : "$review"},
        rating : {"$first" : "$rating"},
      }
    }

    const limit = {
      $limit : 5
    }
        
    let aggregateQuery = [nearBy,group,limit]
    let listAllData = await DAO.aggregateData(Models.pharmecy,aggregateQuery,{lean:true})
    let pharmecyCount = await DAO.count(Models.pharmecy,{_id : {$in : pharmecyId },isDeleted: false,adminVerified : true},{},{lean:true})
    return {listAllData,pharmecyCount}

  }
  catch (err) {
    throw err;
  }
}

const listHomeDoctorBlogs = async() => {
  try {

    const match = {
      $match : {
        doctorId : {$ne:null},
        isDeleted:false,
        adminVerified:true,
        type :  Config.APP_CONSTANTS.BLOG_TYPE.HEALTH

      }
    }

    const group = {
      $group : {
        _id : "$_id",
        doctorId : {"$first" : "$doctorId"},
        hospitalId : {"$first" : "$hospitalId"},
        text: {"$first" : "$text"},
        image: {"$first" : "$image"},
        title: {"$first" : "$title"},
        uniquekey : {"$first" : "$uniquekey"},
      }
    }

    const limit = {
      $limit : 4
    }

    let aggregateQuery = [match,group,limit]
    let listAllData = await DAO.aggregateData(Models.blogs,aggregateQuery,{lean:true})
    return listAllData

  }
  catch (err) {
    throw err;
  }
}

const listHomeHospitalBlogs = async() => {
  try {

    const match = {
      $match : {
        hospitalId : {$ne:null},
        isDeleted:false,
        adminVerified:true,
        type :  Config.APP_CONSTANTS.BLOG_TYPE.HEALTH
      }
    }

    const group = {
      $group : {
        _id : "$_id",
        doctorId : {"$first" : "$doctorId"},
        hospitalId : {"$first" : "$hospitalId"},
        text: {"$first" : "$text"},
        image: {"$first" : "$image"},
        title: {"$first" : "$title"},
        uniquekey : {"$first" : "$uniquekey"},
      }
    }

    const limit = {
      $limit : 4
    }

    let aggregateQuery = [match,group,limit]
    let listAllData = await DAO.aggregateData(Models.blogs,aggregateQuery,{lean:true})
    return listAllData


  }
  catch (err) {
    throw err;
  }
}

const listBlogs = async(payloadData) => {
  try {

    let query = {
      isDeleted:false,
      adminVerified:true,
    }

    if(payloadData.type == null) {
      query.type = Config.APP_CONSTANTS.BLOG_TYPE.HEALTH
    }else {
      query.type = payloadData.type
    }

    let projection = {
      __v : 0
    }

    let populate = [
      {
        path : 'doctorId',
        select : ''
      },
      {
        path : 'hospitalId',
        select : ''
      }
    ]

    let blogs = await DAO.populateData(Models.blogs,query,projection,{lean:true},populate)
    return blogs

  }
  catch (err) {
    throw err;
  }
}

const listSingleBolg = async(payloadData) => {
  try {

    let query = { uniquekey : payloadData._id }
    let projection = {
      __v : 0
    }
    let populate = [
      {
        path : 'doctorId',
        select : ''
      },
      {
        path : 'hospitalId',
        select : ''
      }
    ]

    let listSingleBolg = await DAO.populateData(Models.blogs,query,projection,{lean:true},populate)
    return listSingleBolg

  }
  catch (err) {
    throw err;
  }
}

const listAmbulance = async(payloadData) => {
  try {

    let query = {isDeleted: false,adminVerified : true}
    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }
    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }

    const aggregate = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
          query : query,
          spherical: true
        }
    }
    
    let aggregateQuery = [aggregate]
    let listAmbulance = await DAO.aggregateData(Models.ambulance,aggregateQuery,{lean:true})
    return listAmbulance
  }
  catch (err) {
    throw err;
  }
}

const cancelBooking = async(payloadData,userData) => {
  try {

    let query = {_id:payloadData._id}
    let update = {status : 'CANCELED'}

    let cancelBooking = await DAO.findAndUpdate(Models.ambulanceBooking,query,update,{new:true})

    let queryAmbulance = {_id:cancelBooking.ambulanceId}
    let updateAmbulance = {ambulanceStatus :  Config.APP_CONSTANTS.AMBULANCESTATUS.FREE}

    let ambulance = await DAO.findAndUpdate(Models.ambulance,queryAmbulance,updateAmbulance,{new:true} )

    var message = "Booking Canceled"
    let sendMessage =  smsManager.sendSms(ambulance.phoneNo,message)

    let saveNotifications = await DAO.saveData(Models.notifications, {
      message: "Booking Canceled",
      notificationType: Config.APP_CONSTANTS.NOTIFICATION_TYPE.AMBULANCE,
      ambulanceId : ambulance._id,
      timeStamp: +new Date()
      });
    
      var Data = {};
      Data.title = "Booking Canceled";
      Data.message = "Booking Canceled By User";
      Data.pushType = Config.APP_CONSTANTS.NOTIFICATION_TYPE.AMBULANCE;

    let sendNotifications = await NotificationsManager.sendNotification(Data,ambulance.deviceId);
  

    return cancelBooking
  
  }
  catch (err) {
    throw err;
  }
}

const addEditReminder = async(payloadData,userData) => {
  try {
    if(payloadData._id) {
      let query = {_id : payloadData._id, isDeleted:false}
      let saveData = {
        name : payloadData.name,
        type : payloadData.type,
        date : payloadData.date,
        time : payloadData.time
      }
    let options = {new:true}
    let editReminder = await DAO.findAndUpdate(Models.reminder,query,saveData,options)
    return editReminder
    
  }

    else {


     /* let time = moment(payloadData.time,"hh:mm A").format("DD-MM-YYYY hh:mm")
      console.log("==============================time",time)*/

    let saveData = {
        userId : userData._id,
        name : payloadData.name,
        type : payloadData.type,
        date : payloadData.date,
        time : payloadData.time,
        userPhoneNo : userData.phoneNo,
        smsSent : false,
       
    }
    let saveReminder = await DAO.saveData(Models.reminder,saveData)
    return saveReminder
    }
  }
  catch (err) {
    throw err;
  }
}

const deleteReminder = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData._id}
    let updateData = {isDeleted : true}
    let deleteReminder = await DAO.findAndUpdate(Models.reminder,query,updateData,{new:true})
    return deleteReminder

  }
  catch (err) {
    throw err;
  }
}

const listReminder = async(userData) => {
  try {

    let query = {userId : userData._id,isDeleted:false}
    let populate = [
      {
        path : "userId",
        select : ""
      }
    ]
    let options = {lean : true}
    let listReminder = await DAO.populateData(Models.reminder,query,{},options,populate)
    return listReminder

  }
  catch (err) {
    throw err;
  }
}

const userprofile = async(userData) => {
  try {

 
    let query = {_id:userData._id}
    let userProfile = await DAO.getData(Models.users,query,{__v:0},{lean:true})
    let reminder = await DAO.getData(Models.reminder,{userId:userData._id},{},{lean:true})
    userProfile[0].reminder = reminder
    return userProfile[0]

  }
  catch (err) {
    throw err;
  }
}

const bookDoctor = async(payloadData,userData) => {
  try {

    let getDoctorId = await DAO.getData(Models.doctors,{uniquekey : payloadData.doctorId},{},{lean:true})
    console.log("=======================================getDoctorId",getDoctorId[0]._id)

    let doctorId = getDoctorId[0]._id

    let currentDay = moment(payloadData.startTime,"HH:mm").format("dddd")
  //  console.log("==========================================currentDay",currentDay)

    let hours = moment(payloadData.startTime,"HH:mm").format("HH")
   // console.log("==========================================hours",hours)

    let minutes = moment(payloadData.startTime,"HH:mm").format("mm")
   // console.log("==========================================minutes",minutes)

    let currentMinutes = hours * 60
    let totalMinutes = currentMinutes + parseInt(minutes)

   // console.log("==========================================totalMinutes",totalMinutes)

    let currentHours = moment().format("HH")
  //  console.log("==========================================currentHours",currentHours)


    let queryTimings = {
      doctorId : doctorId,
      day : currentDay,
      $and : [
        {openTime : {$lte : totalMinutes }},
        {closeTime : {$gte : totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.doctorsTiming,queryTimings,{},{lean:true})
    console.log("==========================================checkTimings",checkTimings)
    if(checkTimings.length == 0) {
      throw ERROR.DOCTOR_NOT_AVAILABLE
    }

   let endTime
   var bookingDay = moment(payloadData.bookingDate,"DD-MM-YYYY").format("dddd")

   let startTime = payloadData.startTime.split(":")

   if( startTime[1] == 00) {
    endTime = moment(payloadData.startTime, "hh:mm").add(30, 'minutes').format("HH:mm")
    console.log("===============================================================endTime",endTime)
   }

   if( startTime[1] != 00) {
    endTime = moment(payloadData.startTime, "hh:mm").add(30, 'minutes').format("HH:mm")
    console.log("===============================================================endTime",endTime)
   }

  let treatments = payloadData.treatments
  let totalPrice = 0;
  let updateDoctor

  let query = {
      userId : userData._id,
      doctorId : doctorId,
      bookingDate : payloadData.bookingDate,
      startTime : payloadData.startTime,
      status : {$ne : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL}
   }

   let getData = await DAO.getData(Models.doctorBookings,query,{},{},{lean:true})

   if(getData.length) {
    throw ERROR.DOCTOR_ALREADY_BOOKED;
   }

   else {
    let saveData = {
      userId : userData._id,
      doctorId : doctorId,
      bookingDate : payloadData.bookingDate,
      bookingDay : bookingDay,
      startTime : payloadData.startTime,
      endTime : endTime,
     // treatments : payloadData.treatments
    }

    if(payloadData.transactionId){
      saveData.transactionId = payloadData.transactionId
    }
    let bookDoctor = await DAO.saveData(Models.doctorBookings,saveData,{new:true})

     for(let i = 0; i<treatments.length; i++ ) {
        totalPrice += treatments[i].price

        let query = {_id:bookDoctor._id}

        let update = {
          $push : {
            treatments : {
              treatmentId : treatments[i].treatmentId,
              name : treatments[i].name,
              price : treatments[i].price,
            }
          },
          totalPrice : totalPrice,
          month : moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("MMMM")
        }

        updateDoctor = await DAO.findAndUpdate(Models.doctorBookings,query,update,{new:true})


     }

   //  console.log("==================================totalPrice",totalPrice)

    let getDoctor = await DAO.getData(Models.doctors,{_id:doctorId},{},{lean:true})
     
    //Message to Doctor
   // var message = "New Booking ,slot is" + payloadData.startTime + " to" + endTime
    var message = userData.phoneNo + " has booked an appointment with " + getDoctor[0].name + " at time " + payloadData.startTime + " on date " + payloadData.bookingDate
    let sendMessage =  smsManager.sendSms(getDoctor[0].phoneNo,message)

    //Message to user
    let sendMessageToUser = await messageToUser(userData.phoneNo, getDoctor[0].name, payloadData.startTime, payloadData.bookingDate)

    return updateDoctor
    }

  }
  catch (err) {
    throw err;
  }
}

const userHistory = async(payloadData,userData) => {
  try {

    let query = {userId : userData._id}

    if(payloadData.date) {
      query.bookingDate = payloadData.date
    }

    let queryDoctors = {
      userId : userData._id,
      hospitalId : null
    }

    if(payloadData.date) {
      queryDoctors.bookingDate = payloadData.date
    }

    let queryHospitals = {
      userId : userData._id
    }


    if(payloadData.date) {
      queryHospitals.bookingDate = payloadData.date
    }
    
    let populate = [
      {
        path : "doctorId",
        select : "-accessToken"
      }
    ]

    let populateLab = [
      {
        path : "labId",
        select : "-accessToken"
      }
    ]

    let populatePharmecy = [
      {
        path : "pharmecyId",
        select : "-accessToken"
      }
    ]

    let populateAmbulance = [
      {
        path : "ambulanceId",
        select : "-accessToken"
      }
    ]

    let populateHospital = [
      {
        path : "hospitalId",
        select : "-accessToken"
      }
    ]


    let options = {
      sort : {_id : -1}
    }

    /*let options2 = {
      sort : {_id : -1}
    }

    let options3 = {
      sort : {_id : -1}
    }*/

    let doctorBookings = await DAO.populateData(Models.doctorBookings,queryDoctors,{},options,populate)

    let labBookings = await DAO.populateData(Models.labsBookings,query,{},options,populateLab)

    let pharmecyBookings = await DAO.populateData(Models.pharmecyBookings,query,{},options,populatePharmecy)

    let ambulanceBookings = await DAO.populateData(Models.ambulanceBooking,query,{},options,populateAmbulance)

    let hospitalBookings = await DAO.populateData(Models.hospitalBookings,queryHospitals,{},options,populateHospital)

    return {
      doctorBookings,
      labBookings,
      pharmecyBookings,
      ambulanceBookings,
      hospitalBookings
    }
  }
  catch (err) {
    throw err;
  }
}

const listDoctorBookings = async(payloadData,userData) => {
  try {

    let query = {
      userId : userData._id,
      hospitalId : null
    }

    
    let populate = [
      {
        path : 'userId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      },
      {
        path : 'doctorId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      },
    ]
    let getBookings = await DAO.populateData(Models.doctorBookings,query,{__v:0},{lean:true},populate)
    return getBookings
  }
  catch(err) {
    throw err;
  }
}

const thisWeek = async() => {
  try {

    let currentDay = moment().format("dddd")
   // console.log("===============================>currentDay",currentDay)

    let currentDate = moment().format("DD-MM-YYYY")
   // console.log("===============================>currentDate",currentDate)

    let week_start_date = moment().startOf('Week').format("DD-MM-YYYY")
  //  console.log("===============================>week_start_date",week_start_date)
 
    let week_end_date = moment().endOf('Week').format("DD-MM-YYYY")
   // console.log("===============================>week_end_date",week_end_date)

    let end = moment(week_end_date,"DD-MM-YYYY").format('DD')
   // console.log("===============================>end",end)

    let current = moment(currentDate,"DD-MM-YYYY").format('DD')
  //  console.log("===============================>current",current)

    let difference = end - current
   // console.log("===============================>difference",difference)

    let days = []
    days.push(currentDay)
    for(let i = 1 ; i<=difference; i++) {
      let nextDay = moment(currentDay,"dddd").add(i,'day').format("dddd")
   //   console.log("===============================>nextDay",nextDay)
      days.push(nextDay)
    }
   // console.log("==================>days",days)
    return days
  }
  catch (err) {
    throw err
  }
}

const next_week = async() => {
  try {

    let week_start_day = moment().add(1, 'weeks').startOf('Week').format("dddd")

    let next_week_start_date = moment().add(1, 'weeks').startOf('Week').format("DD-MM-YYYY")
   // console.log("===============================>next_week_start_date",next_week_start_date)

    let next_week_end_date = moment().add(1, 'weeks').endOf('Week').format("DD-MM-YYYY")
   // console.log("===============================>next_week_end_date",next_week_end_date)
   
     let end = moment(next_week_end_date,"DD-MM-YYYY").format('DD')
    // console.log("===============================>end",end)
 
     let start = moment(next_week_start_date,"DD-MM-YYYY").format('DD')
   //  console.log("===============================>current",current)
 
     let difference = end - start
    // console.log("===============================>difference",difference)
 
     let days = []
     days.push(week_start_day)
     for(let i = 1 ; i<=difference; i++) {
       let nextDay = moment(week_start_day,"dddd").add(i,'day').format("dddd")
    //   console.log("===============================>nextDay",nextDay)
       days.push(nextDay)
     }
    // console.log("==================>days",days)
     return days

  }
  catch(err) {
    throw err;
  }
}

const next_month = async() => {
  try {

    let next_month_start_day = moment().add(1, 'months').startOf('month').format("dddd")

    let next_month_start_date = moment().add(1, 'months').startOf('month').format("DD-MM-YYYY")
  //  console.log("===============================>next_month_start_date",next_month_start_date)

    let next_month_end_date = moment().add(1, 'months').endOf('month').format("DD-MM-YYYY")
 //   console.log("===============================>next_month_end_date",next_month_end_date)
   
     let end = moment(next_month_end_date,"DD-MM-YYYY").format('DD')
    // console.log("===============================>end",end)
 
     let start = moment(next_month_start_date,"DD-MM-YYYY").format('DD')
   //  console.log("===============================>current",current)
 
     let difference = end - start
    // console.log("===============================>difference",difference)
 
     let days = []
     days.push(next_month_start_day)
     for(let i = 1 ; i<=difference; i++) {
       let nextDay = moment(next_month_start_day,"dddd").add(i,'day').format("dddd")
    //   console.log("===============================>nextDay",nextDay)
       days.push(nextDay)
     }
    // console.log("==================>days",days)
     return days

  }
  catch (err) {
    throw err;
  }
}


const filter = async(payloadData) => {
  try {
    console.log("====================================filter payloadData",payloadData)
    let currentDay = moment().format("dddd")
//    console.log("===============================>currentDay",currentDay)

    let this_week_days = await thisWeek()
  //  console.log("===================>this_week_days",this_week_days)

    let next_week_days = await next_week()
  //  console.log("===================>next_week_days",next_week_days)

    let next_month_days = await next_month()
    //console.log("===================>next_month",next_month_days)


    let query = {
      startTime : {$ne : null},
      endTime : {$ne : null}
    }

    if(payloadData.timing == 'Morning') {

     query = {
      $or : [ 
        {
          $and : [
            {openTime : {$gte :480}},
            {closeTime : {$lte :720}}
          ]
        },
        {
          $and : [
            {openTime : {$lte : 480}},
            {closeTime : {$lte : 720}},
            {closeTime : {$gte : 480}}
          ]
        },
        {
          $and : [
            {openTime : {$gte : 480}},
            {closeTime : {$gte : 720}},
            {openTime : {$lte : 720}}
          ]
        },
        {
          $and : [
            {openTime : {$lte : 480}} ,
            {closeTime : {$gte : 720}} ,
            {closeTime : {$gte :480}}
           
          ]
        },
      ]
     } 
    
    }

    if(payloadData.timing == 'Afternoon') {


     query = {
      $or : [ 
        {
          $and : [
            {openTime : {$gte :720}},
            {closeTime : {$lte :960}}
          ]
        },
        {
          $and : [
            {openTime : {$lte : 720}},
            {closeTime : {$lte : 960}},
            {closeTime : {$gte : 720}}
          ]
        },
        {
          $and : [
            {openTime : {$gte : 720}},
            {closeTime : {$gte : 960}},
            {openTime : {$lte : 960}}
          ]
        },
        {
          $and : [
            {openTime : {$lte : 720}} ,
            {closeTime : {$gte : 960}} ,
            {closeTime : {$gte :720}}
           
          ]
        },
      ]
     } 

    }

    if(payloadData.timing == 'Evening') {

      query = {
        $or : [ 
          {
            $and : [
              {openTime : {$gte :960}},
              {closeTime : {$lte :1320}}
            ]
          },
          {
            $and : [
              {openTime : {$lte : 960}},
              {closeTime : {$lte : 1320}},
              {closeTime : {$gte : 960}}
            ]
          },
          {
            $and : [
              {openTime : {$gte : 960}},
              {closeTime : {$gte : 1320}},
              {openTime : {$lte : 1320}}
            ]
          },
          {
            $and : [
              {openTime : {$lte : 960}} ,
              {closeTime : {$gte : 1320}} ,
              {closeTime : {$gte :960}}
             
            ]
          },
        ]
       } 
      
     
    }

    if(payloadData.availability == 'Today') {
      query.day = currentDay
    }

    if(payloadData.availability == 'This_week') {
      query.day = this_week_days
    }

    if(payloadData.availability == 'Next_Week') {
      query.day = next_week_days
    }

    if(payloadData.availability == 'Next_Month') {
      query.day = next_month_days
    }

    if(payloadData.consultation == 'Monday') {
      query.day = 'Monday'
    }

    if(payloadData.consultation == 'Tuesday') {
      query.day = 'Tuesday'
    }

    if(payloadData.consultation == 'Wednesday') {
      query.day = 'Wednesday'
    }

    if(payloadData.consultation == 'Thursday') {
      query.day = 'Thursday'
    }

    if(payloadData.consultation == 'Friday') {
      query.day = 'Friday'
    }

    if(payloadData.consultation == 'Saturday') {
      query.day = 'Saturday'
    }

    if(payloadData.consultation == 'Sunday') {
      query.day = 'Sunday'
    }

    let populate = [
      {
        path: "doctorId",
        select : "",
      }
    ]

    let timings = await DAO.populateData(Models.doctorsTiming,query,{},{lean:true,sort:{date:1}},populate)
  
    let outputData = []
    let treatmentsName = []

    for(let i =0; i<timings.length;i++) {
      if(timings[i].doctorId != null) {
        outputData.push(timings[i].doctorId._id)
      }
    }

    let unique = [...new Set(outputData)];

    let queryDoc = {
      _id : {$in : unique},
      isDeleted: false,
      adminVerified : true,
      $or : [
        {status : Config.APP_CONSTANTS.DOCTOR_STATUS.INDIVIDUAL},
        {status : Config.APP_CONSTANTS.DOCTOR_STATUS.BOTH}
      ]
    }

    let project = {
        _id : 1, 
        name : 1,
        profilePicture : 1,
        education : 1,
        location : 1,
        address : 1,
        review : 1,
        rating : 1,
        experience : 1, 
        doctorVerified : 1,
    }

    let doctors = await DAO.getData(Models.doctors,queryDoc,project,{lean:true})
    let doctorIds = []
    for(let j = 0; j<doctors.length; j++) {
      doctorIds.push(doctors[j]._id)
    }

    let radious = 0
    if(payloadData.radious) {
      radious = payloadData.radious
    }
    else {
      radious = 10000000000
    }

    if(!(payloadData.lat)){
      payloadData.lat = 30.7190586
    }

    if(!(payloadData.lng)){
      payloadData.lng = 76.74870439999995
    }

    let language, lowerCase

    if(payloadData.languages) {

      language = payloadData.languages
      lowerCase = language.toLowerCase()

    }


    let nearByDoctors = {
      $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng,payloadData.lat] },
          distanceField: "distance",
          maxDistance: radious * 1000,
          query : {
            _id : { $in : doctorIds } 
          },
          spherical: true
        }
    }


    let languages = {
      $redact : {
        $cond: {
          if: { $or:[
            { $eq : [ payloadData.languages, null] },
            { $in : [ lowerCase,"$languages"] }
          ] },
          then: "$$KEEP",
          else: "$$PRUNE"
        },
        }
    }

    let gender = {
      $redact : {
        $cond: {
          if: { $or:[
            { $eq : [ payloadData.gender, null] },
            { $eq : [ "$gender",  payloadData.gender] }
          ] },
          then: "$$KEEP",
          else: "$$PRUNE"
        },
        }
    }

    let treatments = {
      $lookup : {
        from : "treatments",
        localField : "_id",
        foreignField : "doctorId",
        as : "treatmentsData"
      }
    }

  let unwind2 = {
    $unwind: {
      "path": "$treatmentsData",
      "preserveNullAndEmptyArrays": true
    }
  }

  let matchData = {
    $match : {
      "treatmentsData.isDeleted" : false
    }
  }


  let group = {
      $group : {
        _id : "$_id",
        name : {"$first" : "$name"},
        profilePicture : {"$first" : "$profilePicture"},
        education : {"$first" : "$education"},
        location : {"$first" : "$location"},
        address : {"$first" : "$address"},
        review : {"$first" : "$review"},
        averageRatings : {"$first" : "$averageRatings"},
        ratingsCount : {"$first" : "$ratingsCount"},
        experience : {"$first" : "$experience"},
        doctorVerified : {"$first" : "$doctorVerified"},
        discount : {"$first" : "$discount"},
        city : {"$first" : "$city"},
        treatments : {
          $push : "$treatmentsData.name"
          
        }
      }
    }

    let sort = {
      $sort : {averageRatings : -1}
    }


    let regexMatchCity = {
      $redact : {
        $cond: {
          if: { $or:[
            { $eq : [ payloadData.city, null] },
            { $eq : [ payloadData.city, "$city"] },
            
          ] },
          then: "$$KEEP",
          else: "$$PRUNE"
        },
      }
   }

   let regexMatchName = {
    $redact : {
      $cond: {
        if: { $or:[
          { $eq : [ payloadData.name, null] },
          { $regexMatch : { input: "$name", regex: payloadData.name , options: "i" } }
        ] },
        then: "$$KEEP",
        else: "$$PRUNE"
      },
    }
   }

  let regexMatchTreatment = {
      $match : {
        "treatmentsData.name" : { $regex: payloadData.treatment, $options: "i" }
     }
   }
    
   let queryDoctor = [nearByDoctors, languages, gender, treatments, unwind2, matchData, regexMatchCity, regexMatchName, group]

   if(payloadData.sortBy == 'Ratings') {
     queryDoctor = [nearByDoctors, languages, gender, treatments, unwind2, matchData, regexMatchCity, regexMatchName, group, sort]
   }

    if(payloadData.treatment) {
      queryDoctor = [nearByDoctors, languages, gender, treatments, unwind2, matchData, regexMatchCity, regexMatchName,regexMatchTreatment, group]
     
    }

    if(payloadData.sortBy == 'Ratings' && payloadData.treatment) {
      queryDoctor = [nearByDoctors, languages, gender, treatments, unwind2, matchData, regexMatchCity, regexMatchName,regexMatchTreatment, group, sort]
    }







 
    console.log("=====================================================queryDoctor",JSON.stringify(queryDoctor))
    let doctorData = await DAO.aggregateData(Models.doctors,queryDoctor)
  


    return doctorData

    
  }
  catch (err) {
    throw err;
  }
}

const listCities = async(payloadData) => {
  try {

    let getData, collection

    if(payloadData.type == "HOSPITAL") {
      collection = Models.hospitals
    }
    if(payloadData.type == "DOCTOR") {
      collection = Models.doctors
    }
    if(payloadData.type == "PHARMACY") {
      collection = Models.pharmecy
    }
    if(payloadData.type == "LABS") {
      collection = Models.labs
    }

    getData = await DAO.getData(collection,{},{},{lean:true})
 
    let cities = []

    for (i = 0; i < getData.length; i++) {
      cities.push(getData[i].city);
    }
   
    let unique = [...new Set(cities)];

    let result = unique.filter(
      (element) => {
        return element != ""
      });

    return result

  }
  catch (err) {
    throw err;
  }
}

const addReview = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.doctorId}

    let setData = {}

    if (payloadData.stars >= 1 && payloadData.stars < 2) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_One: 1
        }
      }
    }

    if (payloadData.stars >= 2 && payloadData.stars < 3) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Two: 1
        }
      }
    }

    if (payloadData.stars >= 3 && payloadData.stars < 4) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Three: 1
        }
      }
    }

    if (payloadData.stars >= 4 && payloadData.stars < 5) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Four: 1
        }
      }
    }

    if (payloadData.stars == 5) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Five: 1
        }
      }
    }
      let queryBookings = {
      _id : payloadData.bookingId,
      userId  :userData._id
    }
    let saveratings = {
      stars: payloadData.stars,
      comment: payloadData.comment,
      status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED
    }
   
    let addBookingReview = await DAO.findAndUpdate(Models.doctorBookings,queryBookings,saveratings,{new:true})
    let addReview = await DAO.findAndUpdate(Models.doctors,query,setData,{new:true})
    let getRatings = await DAO.getData(Models.doctors,{_id:payloadData.doctorId},{},{lean:true})

    let totalRatings = getRatings[0].ratingsCount
 //   console.log("==========================>totalRatings",totalRatings)
    let stars = 0, averageRatings = 0
    let ratingsLength = getRatings[0].review
    for(let i = 0; i<ratingsLength.length; i++) {
   //   console.log("==========================>stars",ratingsLength[i].stars)
      stars += ratingsLength[i].stars
    }
  //  console.log("==========================>Totalstars",stars)
    averageRatings = stars/totalRatings
  //  console.log("==========================>averageRatings",averageRatings)

    let updateRatings = await DAO.findAndUpdate(Models.doctors,{_id:payloadData.doctorId},{averageRatings:averageRatings},{new:true})
    return addReview

  }
  catch (err) {
    throw err;
  }
}

const addLabReview = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.labId}

    let setData = {}

    if (payloadData.stars >= 1 && payloadData.stars < 2) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_One: 1
        }
      }
    }

    if (payloadData.stars >= 2 && payloadData.stars < 3) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Two: 1
        }
      }
    }

    if (payloadData.stars >= 3 && payloadData.stars < 4) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Three: 1
        }
      }
    }

    if (payloadData.stars >= 4 && payloadData.stars < 5) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Four: 1
        }
      }
    }

    if (payloadData.stars == 5) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Five: 1
        }
      }
    }

    let queryBookings = {
      _id : payloadData.bookingId,
      userId  :userData._id
    }
    let saveratings = {
      stars: payloadData.stars,
      comment: payloadData.comment,
      status : Config.APP_CONSTANTS.LAB_STATUS.RATED
    }
   
    let addBookingReview = await DAO.findAndUpdate(Models.labsBookings,queryBookings,saveratings,{new:true})
    let addReview = await DAO.findAndUpdate(Models.labs,query,setData,{new:true})
    let getRatings = await DAO.getData(Models.labs,{_id:payloadData.labId},{},{lean:true})

    let totalRatings = getRatings[0].ratingsCount
 //   console.log("==========================>totalRatings",totalRatings)
    let stars = 0, averageRatings = 0
    let ratingsLength = getRatings[0].review
    for(let i = 0; i<ratingsLength.length; i++) {
   //   console.log("==========================>stars",ratingsLength[i].stars)
      stars += ratingsLength[i].stars
    }
  //  console.log("==========================>Totalstars",stars)
    averageRatings = stars/totalRatings
   // console.log("==========================>averageRatings",averageRatings)

    let updateRatings = await DAO.findAndUpdate(Models.labs,{_id:payloadData.labId},{averageRatings:averageRatings},{new:true})
    return addReview

  }
  catch (err) {
    throw err;
  }
}

const addPharmecyReview = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.pharmecyId}

    let setData = {}

    if(payloadData.stars >=1 && payloadData.stars < 2) {
      setData = {
          $push : {
            "review" : {
                userId : userData._id,
                stars : payloadData.stars,
                comment : payloadData.comment,
              }
          },
          $inc:{ 
            ratingsCount : 1,
            starsCount_One : 1
          }
        }
      }

      if(payloadData.stars >=2 && payloadData.stars < 3) {
        setData = {
            $push : {
              "review" : {
                  userId : userData._id,
                  stars : payloadData.stars,
                  comment : payloadData.comment,
                }
            },
            $inc:{ 
              ratingsCount : 1,
              starsCount_Two : 1
            }
          }
        }

      if(payloadData.stars >=3 && payloadData.stars < 4) {
        setData = {
            $push : {
              "review" : {
                  userId : userData._id,
                  stars : payloadData.stars,
                  comment : payloadData.comment,
                }
            },
            $inc:{ 
              ratingsCount : 1,
              starsCount_Three : 1
            }
          }
        }

      if(payloadData.stars >=4 && payloadData.stars < 5) {
        setData = {
            $push : {
              "review" : {
                  userId : userData._id,
                  stars : payloadData.stars,
                  comment : payloadData.comment,
                }
            },
            $inc:{ 
              ratingsCount : 1,
              starsCount_Four : 1
            }
          }
        }
        
      if(payloadData.stars == 5) {
          setData = {
              $push : {
                "review" : {
                    userId : userData._id,
                    stars : payloadData.stars,
                    comment : payloadData.comment,
                  }
              },
              $inc:{ 
                ratingsCount : 1,
                starsCount_Five : 1
              }
            }
          }
     let queryBookings = {
      _id : payloadData.bookingId,
      userId  :userData._id
    }
    let saveratings = {
      stars: payloadData.stars,
      comment: payloadData.comment,
      status :  Config.APP_CONSTANTS.PHARMECY_STATUS.RATED
    }
   
    let addBookingReview = await DAO.findAndUpdate(Models.pharmecyBookings,queryBookings,saveratings,{new:true})
  
    let addReview = await DAO.findAndUpdate(Models.pharmecy,query,setData,{new:true})
    let getRatings = await DAO.getData(Models.pharmecy,{_id:payloadData.pharmecyId},{},{lean:true})

    let totalRatings = getRatings[0].ratingsCount
  
    let stars = 0, averageRatings = 0
    let ratingsLength = getRatings[0].review
    for(let i = 0; i<ratingsLength.length; i++) {
    
      stars += ratingsLength[i].stars
    }

    averageRatings = stars/totalRatings
   

    let updateRatings = await DAO.findAndUpdate(Models.pharmecy,{_id:payloadData.pharmecyId},{averageRatings:averageRatings},{new:true})
    return addReview

  }
  catch (err) {
    throw err;
  }
}

const timeZone = async(payloadData) => {
  try {

    let currentHours,currentDay,currentMinutes,minutes,totalMinutes = 0
    let timings = []

    if(payloadData.timeZone) {
      currentDay = moment().tz(payloadData.timeZone).format("dddd")
      currentHours = moment().tz(payloadData.timeZone).format("HH")
      minutes = moment().tz(payloadData.timeZone).format("mm")
      currentMinutes = currentHours * 60
      totalMinutes = currentMinutes + parseInt(minutes)
     /* console.log("==================================>timeZone",payloadData.timeZone)
      console.log("==================================>currentDay",currentDay)
      console.log("==================================>currentHours",currentHours)
      console.log("==================================>currentMinutes",minutes)
      console.log("==================================>totalMinutes",totalMinutes)*/
    }

    else {
      currentDay = moment().tz("Asia/Kolkata").format("dddd")
      currentHours = moment().tz("Asia/Kolkata").format("HH")
      minutes = moment().tz("Asia/Kolkata").format("mm")
      currentMinutes = currentHours * 60
      totalMinutes = currentMinutes + parseInt(minutes)
     /* console.log("==================================>timeZone","Asia/Kolkata")
      console.log("==================================>currentDay",currentDay)
      console.log("==================================>currentHours",currentHours)
      console.log("==================================>currentMinutes",minutes)
      console.log("==================================>totalMinutes",totalMinutes)*/
    }

    timings.push({
      currentDay : currentDay,
      totalMinutes : totalMinutes
    })

    return timings

  }
  catch (err) {
    throw err;
  }
}

const sendMessage = async(payloadData,userData) => {
  try {

    let saveData = {
      userId : userData._id,
      doctorId : payloadData.doctorId,
      sentBy : Config.APP_CONSTANTS.CHAT_STATUS.USER,
      message : payloadData.message,
      //senderPic : userData.profilePicture,
      sentAt : + new Date()
    }

    if(payloadData.bookingId) {
      saveData.bookingId = payloadData.bookingId
    }

    let saveMessageData = await DAO.saveData(Models.chats,saveData)

    let getData = await DAO.getData(Models.chats,{_id:saveMessageData._id},{},{lean:true})

    getData[0].userProfilePicture = userData.profilePicture
    return getData[0]

  }
  catch (err) {
    throw err;
  }
}

const listMessages = async(paylaodData,userData) => {
  try {

 
  
    let match = {
      $match : {
        doctorId : mongoose.Types.ObjectId(paylaodData.doctorId),
        userId : mongoose.Types.ObjectId(userData._id)
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
        userProfilePicture : {"$first" : "$userData.profilePicture"},
        bookingId : {"$first" : "$bookingId"},
        message : {"$first" : "$message"},
        sentBy : {"$first" : "$sentBy"},
        sentAt : {"$first" : "$sentAt"},
        averageRatings : {"$first" : "$doctorData.averageRatings"},
        review : {"$first" : "$doctorData.review"},
        education : {"$first" : "$doctorData.education"},
        speciality : {"$first" : "$doctorData.speciality"}
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
    //console.log("===============================query",query)
    let listMessages = await DAO.aggregateData(Models.chats,query)
    //console.log("===============================listMessages",listMessages)

    let getDoctor  = await DAO.getData(Models.doctors,{_id:paylaodData.doctorId},{},{lean:true})
    
    return {message:listMessages,doctor:getDoctor}
    

  }
  catch (err) {
    throw err;
  }
}

const listHospitalCities = async(paylaodData,userData) => {
  try {
    let getData = await DAO.getData(Models.hospitals,{},{},{lean:true})
    let cities = []
    for (i = 0; i < getData.length; i++) {
      cities.push(getData[i].city);
    }
   
    let unique = [...new Set(cities)];

    return unique
  }
  catch (err) {
    throw err;
  }
}

const listPharmecyCities = async(paylaodData,userData) => {
  try {
    let getData = await DAO.getData(Models.pharmecy,{},{},{lean:true})
    let cities = []
    for (i = 0; i < getData.length; i++) {
      cities.push(getData[i].city);
    }
   
    let unique = [...new Set(cities)];

    return unique
  }
  catch (err) {
    throw err;
  }
}

const listLabsCities = async(paylaodData,userData) => {
  try {
    let getData = await DAO.getData(Models.labs,{},{},{lean:true})
    let cities = []
    for (i = 0; i < getData.length; i++) {
      cities.push(getData[i].city);
    }
   
    let unique = [...new Set(cities)];

    return unique
  }
  catch (err) {
    throw err;
  }
}

const searchDoctors = async (queryData) => {
  try {
    let search = queryData.search;
    let regex = {
      $or : [

        {name: { $regex: search, $options: "i" }},
        {city: { $regex: search, $options: "i" }}

      ],
      adminVerified : true,
      isDeleted: false
    };
    /*let populate = [
      {
        path: "subCategoryId",
        select: "name",
        populate: {
          path: "categoryId",
          select: "name"
        }
      }
    ];*/
    let searchDoctors = await DAO.getData(Models.doctors,regex,{},{ lean: true });
    return searchDoctors;
  } 
  catch (err) {
    throw err;
  }
};

const searchHospital = async (queryData) => {
  try {
    let search = queryData.search;
   let lookup = {
    $lookup : {
      from : "hospitals",
      localField : "hospitalId",
      foreignField : "_id",
      as : "hospitalsData"
    }
   }

  let unwind = {
      $unwind : {
        path : "$hospitalsData",
        preserveNullAndEmptyArrays: true
      }
    }

  let regexMatch = {
      $match : {
      $or : [
        {"hospitalsData.city": { $regex: search, $options: "i" }},
        {name: { $regex: search, $options: "i" }}
      ],
      "hospitalsData.isDeleted" : false,
      "hospitalsData.adminVerified" : true
      }
  }

  let group = {
    $group : {
      _id : "$_id",
      name : {"$first" : "$hospitalsData.name" },
      location: {"$first" : "$hospitalsData.location" },
      city : {"$first" : "$hospitalsData.city" },
      address: {"$first" : "$hospitalsData.address" },
      email : {"$first" : "$hospitalsData.email" },        
      awards : {"$first" : "$hospitalsData.awards" },       
      membership : {"$first" : "$hospitalsData.membership" },     
      phoneNo : {"$first" : "$hospitalsData.phoneNo" },
      password : {"$first" : "$hospitalsData.password" },
      alternateNumber : {"$first" : "$hospitalsData.alternateNumber" },
      coverPhoto : {"$first" : "$hospitalsData.coverPhoto" },
      images : {"$first" : "$hospitalsData.images" },
      review : {"$first" : "$hospitalsData.review" },
      rating: {"$first" : "$hospitalsData.rating" },
      discount : {"$first" : "$hospitalsData.discount" },
      description : {"$first" : "$hospitalsData.description" },
      registrationNo : {"$first" : "$hospitalsData.registrationNo" },
      regImage : {"$first" : "$hospitalsData.regImage" },    
      fees : {"$first" : "$hospitalsData.fees" },
      website : {"$first" : "$hospitalsData.website" },
      speciality : {"$first" : "$hospitalsData.speciality" },
      treatments : {
        $push : {
          doctorId : "$doctorId",
          hospitalId : "$hospitalId",
          name : "$name",
          description: "$description",
          price : "$price",
          discount : "$discount",
          createdAt : "$createdAt" 
        }
      }

    }
  }

  let query = [lookup, unwind, regexMatch, group]
  let searchHospital = await DAO.aggregateData(Models.treatments,query)

  return searchHospital





  } 
  catch (err) {
    throw err;
  }
};

const searchPharmecy = async (queryData) => {
  try {
    let search = queryData.search;
    let regex = {
      $or : [

        {name: { $regex: search, $options: "i" }},
        {city: { $regex: search, $options: "i" }}

      ],
      adminVerified : true,
      isDeleted: false
    };

    let searchPharmecy = await DAO.getData(Models.pharmecy,regex,{},{ lean: true });
    return searchPharmecy;
  } 
  catch (err) {
    throw err;
  }
};

const searchLabs = async (queryData) => {
  try {
    let search = queryData.search;
    let regex = {
      $or : [

        {name: { $regex: search, $options: "i" }},
        {city: { $regex: search, $options: "i" }}

      ],      
      adminVerified : true,
      isDeleted: false
    };

    let searchLabs = await DAO.getData(Models.labs,regex,{},{ lean: true });
    return searchLabs;
  } 
  catch (err) {
    throw err;
  }
};

const pharmecyDistance = async(payloadData) => {
  try {

    let distance = 0;
    let convetFormat = 0;
    let query = { 
      _id :  mongoose.Types.ObjectId(payloadData.pharmecyId),
      adminVerified : true
    }

    let aggregate = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng, payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS * 1000,
          query: query,
          spherical: true
        }
      },
    ]
  
    let pharmecyDistance = await DAO.aggregateData(Models.pharmecy, aggregate)
    convetFormat = pharmecyDistance[0].distance / 1000
    return {distance : convetFormat}

  }
  catch (err) {
    throw err;
  }
}

const labDistance = async(payloadData) => {
  try {

    let distance = 0;
    let convetFormat = 0;
    let query = { 
      _id :  mongoose.Types.ObjectId(payloadData.labId),
      adminVerified : true
    }

    let aggregate = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [payloadData.lng, payloadData.lat] },
          distanceField: "distance",
          maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS * 1000,
          query: query,
          spherical: true
        }
      },
    ]
  
    let labDistance = await DAO.aggregateData(Models.labs, aggregate)
    convetFormat = labDistance[0].distance / 1000
    return {distance : convetFormat}

  }
  catch (err) {
    throw err;
  }
}

const pharmecyTimingStatus = async(paylaodData) => {
  try {

    let timingStatus;

    let time = paylaodData.time
    let currentDay = moment(time,"x").tz("Asia/Kolkata").format("dddd")
    let currentHours = moment(time,"x").tz("Asia/Kolkata").format("HH")
    let minutes = moment(time,"x").tz("Asia/Kolkata").format("mm")
    let currentMinutes = currentHours * 60
    let totalMinutes = currentMinutes + parseInt(minutes)

   /* console.log("==================================>currentDay",currentDay)
    console.log("==================================>currentHours",currentHours)
    console.log("==================================>currentMinutes",currentMinutes)
    console.log("==================================>minutes",minutes)
    console.log("==================================>totalMinutes",totalMinutes)*/

    let query = {
          pharmecyId : paylaodData.pharmecyId,
          day : {$in:[currentDay]},
          $and : [
            {openTime : {$lte : totalMinutes }},
            {closeTime : {$gte : totalMinutes }},
          ],
          
      }
    
   let checkTimings = await DAO.getData(Models.pharmecyTiming,query,{},{lean:true})

   if(checkTimings.length) {
    timingStatus = true
   }

   else {
    timingStatus = false
   }

   return {timingStatus : timingStatus}

  }
  catch (err) {
    throw err;
  }
}


const labTimingStatus = async(paylaodData) => {
  try {

    let timingStatus;

    let time = paylaodData.time
    let currentDay = moment(time,"x").tz("Asia/Kolkata").format("dddd")
    let currentHours = moment(time,"x").tz("Asia/Kolkata").format("HH")
    let minutes = moment(time,"x").tz("Asia/Kolkata").format("mm")
    let currentMinutes = currentHours * 60
    let totalMinutes = currentMinutes + parseInt(minutes)

   /* console.log("==================================>currentDay",currentDay)
    console.log("==================================>currentHours",currentHours)
    console.log("==================================>currentMinutes",currentMinutes)
    console.log("==================================>minutes",minutes)
    console.log("==================================>totalMinutes",totalMinutes)*/

    let query = {
          labId : paylaodData.labId,
          day : {$in:[currentDay]},
          $and : [
            {openTime : {$lte : totalMinutes }},
            {closeTime : {$gte : totalMinutes }},
          ],
          
      }
    
   let checkTimings = await DAO.getData(Models.labsTimings,query,{},{lean:true})

   if(checkTimings.length) {
    timingStatus = true
   }

   else {
    timingStatus = false
   }

   return {timingStatus : timingStatus}
    
  }
  catch (err) {
    throw err;
  }
}

const bookHospitalDoctor = async(payloadData,userData) => {
  try {

    let currentDay = moment(payloadData.startTime,"HH:mm").format("dddd")
    let hours = moment(payloadData.startTime,"HH:mm").format("HH")
    let minutes = moment(payloadData.startTime,"HH:mm").format("mm")
    let currentMinutes = hours * 60
    let totalMinutes = currentMinutes + parseInt(minutes)
     console.log("====================================================totalMinutes",totalMinutes)
    let currentHours = moment().format("HH")

    let queryTimings = {
      hospitalId : payloadData.hospitalId,
      doctorId : payloadData.doctorId,
      day : currentDay,
      $and : [
        {openTime : {$lte : totalMinutes }},
        {closeTime : {$gte : totalMinutes }}
      ]
      }

    let checkTimings = await DAO.getData(Models.doctorsTiming,queryTimings,{},{lean:true})
    console.log("====================================================checkTimings",checkTimings)
    if(checkTimings.length == 0) {
      throw ERROR.DOCTOR_NOT_AVAILABLE
    }

   let endTime
   var bookingDay = moment(payloadData.bookingDate,"DD-MM-YYYY").format("dddd")

   let startTime = payloadData.startTime.split(":")

   if( startTime[1] == 00) {
    endTime = moment(payloadData.startTime, "hh:mm").add(30, 'minutes').format("HH:mm")
   }

   if( startTime[1] != 00) {
    endTime = moment(payloadData.startTime, "hh:mm").add(30, 'minutes').format("HH:mm")
   }

  let treatments = payloadData.treatments
  let totalPrice = 0;
  let updateHospital

  let query = {
      userId : userData._id,
      hospitalId : payloadData.hospitalId,
      doctorId : payloadData.doctorId,
      bookingDate : payloadData.bookingDate,
      startTime : payloadData.startTime,
      status : {$ne : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL}
   }

   let getData = await DAO.getData(Models.doctorBookings,query,{},{},{lean:true})

   if(getData.length) {
    throw ERROR.DOCTOR_ALREADY_BOOKED;
   }

   else {
    let saveData = {
      userId : userData._id,
      hospitalId : payloadData.hospitalId,
     // doctorId : payloadData.doctorId,
      bookingDate : payloadData.bookingDate,
      bookingDay : bookingDay,
      startTime : payloadData.startTime,
      endTime : endTime,
    }

    if(payloadData.transactionId) {
      saveData.transactionId = payloadData.transactionId
    }
    let bookHospital = await DAO.saveData(Models.doctorBookings,saveData,{new:true})

     for(let i = 0; i<treatments.length; i++ ) {
        totalPrice += treatments[i].price

        let query = {_id:bookHospital._id}

        let update = {
          $push : {
            treatments : {
              treatmentId : treatments[i].treatmentId,
              name : treatments[i].name,
              price : treatments[i].price,
            }
          },
          totalPrice : totalPrice,
          month : moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("MMMM")
        }
        updateHospital = await DAO.findAndUpdate(Models.doctorBookings,query,update,{new:true})
     }


    let getDoctor = await DAO.getData(Models.doctors,{hospitalId : {$in : payloadData.hospitalId},_id:payloadData.doctorId},{},{lean:true})
 
    var message = "New Booking ,slot is" + payloadData.startTime + " to" + endTime
    let sendMessage =  smsManager.sendSms(getDoctor[0].phoneNo,message)

    return updateHospital
    }

  }
  catch (err) {
    throw err;
  }
}


const addHospitalReview = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.hospitalId}

    let setData = {}

    if (payloadData.stars >= 1 && payloadData.stars < 2) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_One: 1
        }
      }
    }

    if (payloadData.stars >= 2 && payloadData.stars < 3) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Two: 1
        }
      }
    }

    if (payloadData.stars >= 3 && payloadData.stars < 4) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Three: 1
        }
      }
    }

    if (payloadData.stars >= 4 && payloadData.stars < 5) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Four: 1
        }
      }
    }

    if (payloadData.stars == 5) {
      setData = {
        $push: {
          "review": {
            userId: userData._id,
            stars: payloadData.stars,
            comment: payloadData.comment,
          }
        },
        $inc: {
          ratingsCount: 1,
          starsCount_Five: 1
        }
      }
    }
      let queryBookings = {
      _id : payloadData.bookingId,
      userId  :userData._id
    }
    let saveratings = {
      stars: payloadData.stars,
      comment: payloadData.comment,
      status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED
    }
   
    let addBookingReview = await DAO.findAndUpdate(Models.hospitalBookings,queryBookings,saveratings,{new:true})
    
    let addReview = await DAO.findAndUpdate(Models.hospitals,query,setData,{new:true})
    let getRatings = await DAO.getData(Models.hospitals,query,{},{lean:true})

    let totalRatings = getRatings[0].ratingsCount
    let stars = 0, averageRatings = 0
    let ratingsLength = getRatings[0].review
    for(let i = 0; i<ratingsLength.length; i++) {
      stars += ratingsLength[i].stars
    }
    averageRatings = stars/totalRatings

    let updateRatings = await DAO.findAndUpdate(Models.hospitals,query,{averageRatings:averageRatings},{new:true})
    return addReview

  }
  catch (err) {
    throw err;
  }
}


const listHospiatlBookings = async(payloadData,userData) => {
  try {

    
    let populate = [
      {
        path : 'userId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      },
      {
        path : 'hospitalId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      },
    ]
    let getBookings = await DAO.populateData(Models.hospitalBookings,{userId:userData._id},{__v:0},{lean:true},populate)
    return getBookings
  }
  catch(err) {
    throw err;
  }
}


const checkPasswordStatus = async(payloadData) =>{
  try{
    let password= false;

    let checkPasswordStatus = await DAO.getData(Models.users,{phoneNo:payloadData.phoneNo},{passwordSet:1},{lean:true})
    

    if(checkPasswordStatus.length && checkPasswordStatus[0].passwordSet == true){
      password = true;
    }

    
   // console.log("......password......",password);
    return password;


  }catch(err){
    throw err;
  }
}


const loginWithPassword = async(payloadData) =>{
  try {
  
      let query = {
        phoneNo: payloadData.phoneNo,
        password:payloadData.password
      };
  
      var getData  = await DAO.getData(Models.users, query, {}, { lean: true });

      if(getData.length){
        createUser = getData[0];
      } else{
        throw ERROR.WRONG_PASSWORD;
      }
      
      let tokenData = {
        scope: Config.APP_CONSTANTS.SCOPE.USER,
        _id: createUser._id,
        time: new Date().getTime()
      };
      
      let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.USER);
      
      if (accessToken == null) {
        throw ERROR.DEFAULT;
      }
      
      let tokenResult = await DAO.findAndUpdate(Models.users,{ _id: createUser._id },
        { accessToken: accessToken},{ new: true });

        return {data:tokenResult};
      } catch (err) {
        throw err;
      }
}


const forgotPassword = async(payloadData) =>{
  try{

    let checkNumber = await DAO.getData(Models.users,{phoneNo:payloadData.phoneNo},{_id:1},{lean:true})

    if(!(checkNumber.length)){
      throw ERROR.INVALID_MOBILE_NUMBER;
    }

    let tempPassword = randomstring.generate({
      length: 10
    });

    var message = "login with temporary password, password is  : " + tempPassword
    
   // console.log(".....password .......",message);

    let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message);
    
  //  console.log(".....sendMessage .......",sendMessage);
    
    let update = await DAO.findAndUpdate(Models.users, {phoneNo:payloadData.phoneNo}, {password:tempPassword}, { new: true })

    return {response:null};

  }catch(err){
    throw err;
  }
}

const accessTokenLogin = async(userData) => {
  try {

    let query = {
      _id : userData._id,
      isDeleted : false
    }

    let accessTokenLogin = await DAO.getData(Models.users,query,{},{lean:true})
    return accessTokenLogin[0]

  }
  catch (err) {
    throw err;
  }
}

const deleteLabReports = async(payloadData,userData) => {
  try {

    let query = {userId : userData._id }

    let updateData = {
        $pull : {
          reports : {
            image : payloadData.reports
          } 
        }
    }

    let uploadReports = await DAO.findAndUpdate(Models.labsBookings,query,updateData,{new:true})
    console.log("====================================uploadReports",uploadReports)

    let queryUser = {_id : userData._id }

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


const bookHospital = async(payloadData, userData) => {
  try {

  let totalPrice = 0;
  let saveData = {
      userId : userData._id,
      hospitalId : payloadData.hospitalId,
      bookingDate :payloadData.bookingDate,
      time : payloadData.startTime,
    }

    if(payloadData.transactionId){
      saveData.transactionId = payloadData.transactionId
    }
    let bookHospital = await DAO.saveData(Models.hospitalBookings,saveData,{new:true})

    let treatments = payloadData.treatments

     for(let i = 0; i<treatments.length; i++ ) {
        totalPrice += treatments[i].price
        let query = { _id : bookHospital._id }
        let update = {
          $push : {
            treatments : {
              treatmentId : treatments[i].treatmentId,
              name : treatments[i].name,
              price : treatments[i].price
            }
          },
          totalPrice : totalPrice,
          month : moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("MMMM")
        }
        updateDoctor = await DAO.findAndUpdate(Models.hospitalBookings,query,update,{new:true})
     }

     let getHospital = await DAO.getData(Models.hospitals,{_id:payloadData.hospitalId},{},{lean:true})

    //Message to Hospital
    var message = userData.phoneNo + " has booked an appointment with " + getHospital[0].name + " at time " + payloadData.startTime + " on date " + payloadData.bookingDate
    let sendMessage =  smsManager.sendSms(getHospital[0].phoneNo,message)

     let sendMessageToUser = await messageToUser(userData.phoneNo, getHospital[0].name, payloadData.startTime, payloadData.bookingDate)


  /*  let getDoctor = await DAO.getData(Models.doctors,{_id:doctorId},{},{lean:true})
 
    var message = "New Booking ,slot is" + payloadData.startTime + " to" + endTime
    let sendMessage =  smsManager.sendSms(getDoctor[0].phoneNo,message)*/

    return updateDoctor

  }
  catch(err) {
    throw err;
  }
}

const messageToUser = async(userPhoneNo, partnerName, time, date) => {
  try {

    let message = "Your Appointment is booked with " + partnerName + " at " + " Time " + time + " on Date " + date
    let sendMessage =  smsManager.sendSms(userPhoneNo,message)

  }
  catch (err) {
    throw err;
  }
}

const apply4medicalTourism = async(apiData) => {
  try {

    let saveApiData = {}

    if(apiData.countryCode) {
      saveApiData.countryCode = apiData.countryCode
    }
    if(apiData.phoneNo) {
      saveApiData.phoneNo = apiData.phoneNo
    }
    if(apiData.medicalRecords) {
      saveApiData.medicalRecords = apiData.medicalRecords
    }
    if(apiData.subject) {
      saveApiData.subject = apiData.subject
    }
    if(apiData.description) {
      saveApiData.description = apiData.description
    }

    let saveDataInDb = await DAO.saveData(Models.medicalTourism, saveApiData)
    return saveDataInDb

  }
  catch(err) {
    throw err;
  }
}

const listOtherDetails = async(payloadData) => {
  try {

    let query = {}

    if(payloadData.uniquekey) {
      query.uniquekey = payloadData.uniquekey
    }

    let getData = await DAO.getData(Models.otherDetails, query, {}, {lean:true})
    return getData

  }
  catch(err) {
    throw err;
  }
}


module.exports = {
    userLogin : userLogin,
    updateProfile : updateProfile,
    otpVerify : otpVerify,
    otpResend : otpResend,
    bookAmbulance : bookAmbulance,
    listHospitals : listHospitals,
    getMapData:getMapData,
    listHospitalDetails : listHospitalDetails,
    listDoctors : listDoctors,
    listDoctorsDetails : listDoctorsDetails,
    listPharmecies : listPharmecies,
    listPharmecyDetails : listPharmecyDetails,
    listLabs:listLabs,
    listLabsDetails : listLabsDetails,
    pharmecyBooking : pharmecyBooking,
    labBooking : labBooking,
    home : home,
    listHomeDoctors : listHomeDoctors,
    listHomeHospitals : listHomeHospitals,
    listHomelabs : listHomelabs,
    listHomePharmecy : listHomePharmecy,
    listHomeDoctorBlogs : listHomeDoctorBlogs,
    listHomeHospitalBlogs : listHomeHospitalBlogs,
    listBlogs : listBlogs,
    listSingleBolg : listSingleBolg,
    listAmbulance : listAmbulance,
    cancelBooking : cancelBooking,
    addEditReminder : addEditReminder,
    deleteReminder : deleteReminder,
    listReminder : listReminder,
    userprofile : userprofile,
    bookDoctor : bookDoctor,
    userHistory : userHistory,
    listDoctorBookings : listDoctorBookings,
    filter : filter,
    thisWeek : thisWeek,
    next_week : next_week,
    next_month : next_month,
    listCities : listCities,
    addReview : addReview,
    addLabReview : addLabReview,
    addPharmecyReview : addPharmecyReview,
    timeZone : timeZone,
    sendMessage : sendMessage,
    listMessages : listMessages,
    listHospitalCities : listHospitalCities,
    listPharmecyCities : listPharmecyCities,
    listLabsCities : listLabsCities,
    searchDoctors : searchDoctors,
    searchHospital : searchHospital,
    searchPharmecy : searchPharmecy,
    searchLabs : searchLabs,
    pharmecyDistance : pharmecyDistance,
    labDistance: labDistance,
    pharmecyTimingStatus : pharmecyTimingStatus,
    labTimingStatus : labTimingStatus,
    bookHospitalDoctor : bookHospitalDoctor,
    addHospitalReview : addHospitalReview,
    listHospiatlBookings : listHospiatlBookings,
    checkPasswordStatus:checkPasswordStatus,
    loginWithPassword:loginWithPassword,
    forgotPassword:forgotPassword,
    accessTokenLogin : accessTokenLogin,
    deleteLabReports : deleteLabReports,
    bookHospital : bookHospital,
    apply4medicalTourism : apply4medicalTourism,
    listOtherDetails : listOtherDetails
    
  
};

