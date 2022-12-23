const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  moment = require('moment'),
  randomstring = require("randomstring"),
  commonController = require("./commonController"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");


const hospitalLogin = async (payloadData) => {
    try {
      let deletedata = await commonController.checkDatabase(payloadData)
      let generateOtp = await commonController.generateOtp()
     // console.log("=======================================generateOtp",generateOtp)

        let query = { 
          countryCode : payloadData.countryCode,
          phoneNo : payloadData.phoneNo,
          isDeleted:false,
          $or : [
            {profileUpdated : true},
            {adminVerified : true}
          ]
        }

        let checkDoctor = await DAO.getData(Models.doctors, query, {}, {lean:true})
        if(checkDoctor.length) {
          throw ERROR.ALREADY_REGISTERED_AS_DOCTOR;
        }
        let checkAmbulance = await DAO.getData(Models.ambulance, query, {}, {lean:true})
        if(checkAmbulance.length) {
          throw ERROR.ALREADY_REGISTERED_AS_AMBULANCE;
        }
        let checkLabs = await DAO.getData(Models.labs, query, {}, {lean:true})
        if(checkLabs.length) {
          throw ERROR.ALREADY_REGISTERED_AS_LABS;
        }
        let checkPharmecy = await DAO.getData(Models.pharmecy, query, {}, {lean:true})
        if(checkPharmecy.length) {
          throw ERROR.ALREADY_REGISTERED_AS_PHARMECY;
        }

        let checkHospital = await DAO.getData(Models.hospitals, query, {}, {lean:true})

      if (checkHospital.length == 0) {
        let saveData = {
          countryCode : payloadData.countryCode,
          phoneNo: payloadData.phoneNo,
          otp: generateOtp
        };
  
        let createHospital = await DAO.saveData(Models.hospitals, saveData);
        var message = commonController.otpMessage()
        let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
  
        if (createHospital._id) {
          let tokenData = {
                scope: Config.APP_CONSTANTS.SCOPE.HOSPITAL,
                _id: createHospital._id,
                time: new Date().getTime()
          };
     
  
          let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.HOSPITAL);

          if (accessToken == null) {
            throw ERROR.DEFAULT;
          }
  
          let tokenResult = await DAO.findAndUpdate(Models.hospitals,{ _id: createHospital._id },
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

        let getData = await DAO.getData(Models.hospitals, query, {}, {lean:true})
  
        if(getData[0].passwordSet != true) {
            var message = commonController.otpMessage()
            let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
        }
  
        let tokenData = {
          scope: Config.APP_CONSTANTS.SCOPE.HOSPITAL,
          _id: getData[0]._id,
          time: new Date().getTime()
        };
  
        let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.HOSPITAL);
  
        if (accessToken == null) {
          throw ERROR.DEFAULT;
        }
  
        let updateData = {
          accessToken: accessToken,
          otp : generateOtp
        }
  
        let tokenResult = await DAO.findAndUpdate(Models.hospitals,{ _id: getData[0]._id },updateData,{ new: true });
  
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

    let updateProfile = await commonController.hospitalProfile(payloadData,userData._id)
  
    return updateProfile

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
      isDeleted : false
    };

    let otpVerify = await DAO.getData(Models.hospitals, query, {}, { lean: true });
    
    if(otpVerify.length) {
      if (!(otpVerify[0].otp == payloadData.otp)) {
        throw ERROR.WRONG_OTP;
      }
  
      let setData = { otpVerify: true }
      let options = { new : true }
      let update = await DAO.findAndUpdate(Models.hospitals, query, setData, {options});
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
      isDeleted : false
    };

    let getData = await DAO.getData(Models.hospitals,query,{},{lean:true})
    if(getData.length) {
      let query2 = { phoneNo:getData[0].phoneNo };
      let options = { new: true };
      let setData = { otp: generateOtp };
      let update = await DAO.findAndUpdate(Models.hospitals, query2, setData, options);
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


const listHospital = async (payloadData, userData) => {
  try {
    let models = Models.hospitals;
    let listData = await commonController.listData(null, userData._id, models)
  
    return listData
  } catch (err) {
    throw err;
  }
}


const accessTokenLogin = async(userData) =>{
  try{
    let accessTokenLogin = await DAO.getData(Models.hospitals,{_id:userData._id},{},{lean:true})
    return accessTokenLogin[0];  

  }catch(err){
    throw err;
  }
}

const serachDoctor = async(payloadData,userData) =>{
  try{
    let query = {
      countryCode : payloadData.countryCode,
      phoneNo : payloadData.phoneNo
    }

    let getData = await DAO.getData(Models.doctors,query,{},{lean:true})

    if(getData.length) {
      if(getData[0].adminVerified != true) {
        throw ERROR.DOCTOR_NOT_VERIFIED
      
      }
      let updateData  = { otp: 1234 }
      let updateDoctor = await DAO.findAndUpdate(Models.doctors,query,updateData,{new:true});
      return null
    }


  }
  catch(err){
    throw err;
  }
}

const doctorOtpVerify = async(payloadData,userData) => {
  try {
    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo
    };

    let otpVerify = await DAO.getData(Models.doctors, query, {}, { lean: true });
    
    if(otpVerify.length) {
      if (!(otpVerify[0].otp == payloadData.otp)) {
        throw ERROR.WRONG_OTP;
      }
  
      let setData = { otpVerify: true }
      let options = { new : true }
      let update = await DAO.findAndUpdate(Models.doctors, query, setData, options);
    //  console.log("====================================================update",update.otpVerify)
      return update;
    }

    else {
      throw ERROR.NO_DATA_FOUND;
    }
  }
  catch (err) {
    throw err;
  }
}

const doctorOtpResend = async (payloadData,userData) => {
  try {
  
    let query = {
      countryCode : payloadData.countryCode,
      phoneNo: payloadData.phoneNo
    };

    let getData = await DAO.getData(Models.doctors,query,{},{lean:true})
    if(getData.length) {
      let query2 = { phoneNo:getData[0].phoneNo };
      let options = { new: true };
      let setData = { otp: 1234 };
      let update = await DAO.findAndUpdate(Models.doctors, query2, setData, options);
      return null
  }
  else {
    throw ERROR.NO_DATA_FOUND;
  } 
}
  catch (err) {
    throw err;
  }
};



const serachAmbulance = async(payloadData,userData) =>{
  try{
    let query = {
      countryCode : payloadData.countryCode,
      phoneNo:payloadData.phoneNo
    }
    let getAmbulance = await DAO.getData(Models.ambulance,query,{},{lean:true});
    return getAmbulance[0];
  }catch(err){
    throw err;
  }
}


const addDoctor = async(payloadData,userData) =>{
  try{

  //  let check = await commonController.checkData(payloadData.phoneNo)

    let updateDoctor, addDoctorTiming, doctorId, hospitalId;
    

    if(payloadData.doctorId){
      let check = await commonController.checkData2(payloadData,payloadData.doctorId);
      updateDoctor = await editHospitalDoctor(payloadData,userData)

    /*  doctorId = payloadData.doctorId
      hospitalId = userData._id


      if(payloadData.timing) {
        addDoctorTiming = await addTiming(doctorId,hospitalId,timing)
      }*/

    }

    else{
      let deletedata = await commonController.checkDatabase(payloadData)
      let check = await commonController.checkData(payloadData)
      updateDoctor = await addHospitalDoctor(payloadData,userData)

     /* doctorId = updateDoctor._id
      hospitalId = userData._id


      if(payloadData.timing) {
        addDoctorTiming = await addTiming(doctorId,hospitalId,timing)
      }*/
      
    }


    return updateDoctor;
  }
  catch(err)
  {
    throw err;
  }
}

const addDoctorTiming = async(payloadData,userData) => {
  try {

     let doctorId = payloadData.doctorId
     let hospitalId = userData._id
     let timing = payloadData.timing; 

     let  addDoctorTiming = await addTiming(doctorId,hospitalId,timing)
      
  }
  catch (err) {
    throw err;
  }
}


const addTiming = async(doctorId,hospitalId,timing) => {
  try {


   /* let query = {doctorId : doctorId, hospitalId : hospitalId}

    let query2 = {doctorId : doctorId, hospitalId : null}

    let getData = await DAO.getData(Models.doctorsTiming,query2,{lean:true})
    console.log("================================getData",getData)

    let removeTiming = await DAO.remove(Models.doctorsTiming,query)*/

    let addTiming
    let  data = []
     
    for(let i = 0; i< timing.length;i++) {

      if(timing[i].openTime != null && timing[i].closeTime != null) {

        console.log("================================timing[i].openTime",timing[i].openTime)
        console.log("================================timing[i].closeTime",timing[i].closeTime)
  
        if(timing[i].openTime > timing[i].closeTime) {
            throw ERROR.TIMING_ERROR;
        }
  
         let query2 = {
          doctorId : doctorId, 
          hospitalId : {$eq : null},
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
            doctorId: doctorId,
            hospitalId : {$ne : null},
          }
          let removeTiming = await DAO.remove(Models.doctorsTiming, query)
        }
  
  
      }

      data.push({
        doctorId : mongoose.Types.ObjectId(doctorId),
        hospitalId : hospitalId,
        day : timing[i].day,
        showDay : timing[i].showDay,
        openTime : parseInt(timing[i].openTime),
        closeTime : parseInt(timing[i].closeTime),
        startTime : timing[i].startTime,
        endTime : timing[i].endTime,
        closeDate : timing[i].closeDate,
        openDate : timing[i].openDate,
        closeTimeString:timing[i].closeTimeString,
        openTimeString:timing[i].openTimeString,
        closeMeridian:timing[i].closeMeridian,
        openMeridian:timing[i].openMeridian,
        disable : timing[i].disable
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
  addTiming = await DAO.insertMany(Models.doctorsTiming,data);

  }
  catch (err) {
    throw err
  }
}


const addAmbulance = async(payloadData,userData) =>{
  try{
    let updateAmbulance
    if(payloadData.ambulanceId){
      let check = await checkData2(payloadData,payloadData.ambulanceId);
      updateAmbulance = await DAO.findAndUpdate(Models.ambulance,{_id:payloadData.ambulanceId},{
        hospitalId:userData._id,
        profilePicture:payloadData.profilePicture,
        fullName:payloadData.fullName,
        drivingLicence:payloadData.drivingLicence,
        countryCode : payloadData.countryCode,
        phoneNo:payloadData.phoneNo,
        profileUpdated:true,
        adminVerified : true,
        registrationNo:payloadData.registrationNo,
        vehicleNo : payloadData.vehicleNo,
        password : payloadData.password,
        type : payloadData.type,
        association : payloadData.association
      },{new:true});
    }
    else{
      let deletedata = await commonController.checkDatabase(payloadData)
      let check = await commonController.checkData(payloadData)
      updateAmbulance = await DAO.saveData(Models.ambulance,{
        hospitalId:userData._id,
        profilePicture:payloadData.profilePicture,
        fullName:payloadData.fullName,
        drivingLicence:payloadData.drivingLicence,
        countryCode : payloadData.countryCode,
        phoneNo:payloadData.phoneNo,
        profileUpdated:true,
        adminVerified : true,
        registrationNo:payloadData.registrationNo,
        vehicleNo : payloadData.vehicleNo,
        password : payloadData.password,
        type : payloadData.type,
        association : payloadData.association
      });
    }
    return updateAmbulance;
  }catch(err){
    throw err;
  }
}

const listDoctorAmbulance = async(userData) =>{
  try{

    let query = {
      hospitalId:userData._id,
      isDeleted : false,
      adminVerified : true
    }

    let ambulance = await DAO.getData(Models.ambulance,query,{},{lean: true});  
    
    let match = {
      $match : {
        hospitalId : mongoose.Types.ObjectId(userData._id),
        isDeleted : false,
        adminVerified : true
      }
    }

    let addFields = {
      $addFields: {
       hospitalId : userData._id
      }
    }

    let treatments = {
        $lookup : {
          from : "treatments",
          localField : "hospitalId",
          foreignField : "hospitalId",
          as : "treatmentsData"
        }
     }

    let unwind = {
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
        hospitalId :  {"$first" : "$hospitalId"},
        profilePicture : {"$first" : "$profilePicture"},
        name : {"$first" : "$name"},
        gender : {"$first" : "$gender"},
        location : {"$first" : "$location"},
        city : {"$first" : "$city"},
        address : {"$first" : "$address"}, 
        discount : {"$first" : "$discount"},
        consultantFees : {"$first" : "$consultantFees"},
        education : {"$first" : "$education"},
        awards : {"$first" : "$awards"},
        languages : {"$first" : "$languages"},
        membership : {"$first" : "$membership"},
        experience : {"$first" : "$experience"},
        password : {"$first" : "$password"},
        speciality : {"$first" : "$speciality"},
        countryCode : { "$first": "$countryCode" },
        phoneNo : {"$first" : "$phoneNo"},
        alternateNumber : {"$first" : "$alternateNumber"},
        registrationNo : {"$first" : "$registrationNo"},
        about : {"$first" : "$about"},
        status : {"$first" : "$status"},
        review : {"$first" : "$review"},
        ratingsCount : {"$first" : "$ratingsCount"},
        averageRatings : {"$first" : "$averageRatings"},
        starsCount_One : {"$first" : "$starsCount_One"},
        starsCount_Two : {"$first" : "$starsCount_Two"},
        starsCount_Three : {"$first" : "$starsCount_Three"},
        starsCount_Four : {"$first" : "$starsCount_Four"},
        starsCount_Five : {"$first" : "$starsCount_Five"},
        uniqueKey : {"$first" : "$uniquekey"},
        treatments : {
          $push : "$treatmentsData.name"
        }
      }
    }

    let aggregateQuery = [match,addFields,treatments,unwind,matchData,group]
    console.log("==============================================aggregateQuery",aggregateQuery)
    let listDoctor = await DAO.aggregateData(Models.doctors,aggregateQuery,{lean:true})

    return {ambulance:ambulance,listDoctor:listDoctor};
    
  }catch(err){
    throw err; 
  }
}

const addTreatments = async (payloadData,userData) => {
  try {

    let addTreatments

    if(payloadData._id){
      let query = { _id : payloadData._id }

      let setData = {

        name : payloadData.name,
        price : payloadData.price,
        description:payloadData.description,
        isDeleted : false

      }

      if (payloadData.discount) {
        setData.discount = payloadData.discount
      }
      let options = { new:true}

      console.log("===========================================query",query)
      let updateTreatment = await DAO.findAndUpdate(Models.treatments,query,setData,options);
      console.log("===========================================updateTreatment",updateTreatment)
      addTreatments = updateTreatment
    }
    else{
      
      let setData = {
        hospitalId :userData._id,
        name : payloadData.name,
        price : payloadData.price,
        description:payloadData.description,
        isDeleted : false
      }

      if (payloadData.discount) {
        setData.discount = payloadData.discount
      }

      let saveData = await DAO.saveData(Models.treatments,setData)
      addTreatments = saveData
    }

    return addTreatments
  }
  catch (err) {
    throw err;
  }
}

const listTreatments = async(payloadData,userData) =>{
  try{
    let listTreatments = await DAO.getData(Models.treatments,{hospitalId:userData._id,isDeleted:false},{},{lean:true});
    return listTreatments
  }catch(err){
    throw err;
  }
}

const addEditBlog = async(payloadData,userData) =>{
  try{

    /*let currentMillis = moment().format("x") 
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



    if(payloadData._id){
      let query = {_id:payloadData._id};

      let setData = {
        text:payloadData.text,
        image:payloadData.image,
        title:payloadData.title,
        uniquekey : key
      };

      if(payloadData.type) {
        setData.type = payloadData.type
      }
    
      let options = {new:true};
      let saveData = await DAO.findAndUpdate(Models.blogs,query,setData,options)
      
      return saveData;
    }else{

      let obj = {
        text:payloadData.text,
        hospitalId:userData._id,
        image:payloadData.image,
        title:payloadData.title,
        uniquekey : key
      }
      if(payloadData.type) {
        obj.type = payloadData.type
      }
      let saveData = await DAO.saveData(Models.blogs,obj)
      return saveData;
    
    }
  }catch(err){
    throw err;
  }
}

const listBlog = async (payloadData,userData) =>{
  try{
    let query = {
      hospitalId : userData._id,
     // doctorId : null,
      isDeleted : false,
     
    }

    if(payloadData._id) {
      query.uniquekey = payloadData._id
    }


    let getData = await DAO.getData(Models.blogs,query,{},{lean:true})
    return getData
  }catch(err){
    throw err;

  }
}

const setPassword = async(payloadData,userData) => {
  try {

    let setPassword = await DAO.findAndUpdate(Models.hospitals,
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

    let passwordLogin = await DAO.getData(Models.hospitals,query,{},{lean:true})

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

const deleteBlog = async(payloadData,userData) => {
  try {

    let query = {
      hospitalId : userData._id,
      _id : payloadData.blogId
    }

    let update = {}
    if(typeof payloadData.isDeleted !== "undefined" && payloadData.isDeleted !== null) {
      update.isDeleted = payloadData.isDeleted
    }

    let deleteBlog = await DAO.findAndUpdate(Models.blogs,query,update,{new:true})
    return deleteBlog
    

  }
  catch (err) {
    throw err;
  }
}

const listDoctorsDetails = async(payloadData) => {
  try {

    let query = {_id:payloadData._id, isDeleted :false, adminVerified:true}
    let day = moment(payloadData.bookingDate,"DD-MM-YYYY").tz("Asia/Kolkata").format("dddd") 
 
    let queryBookings, queryTiming, queryBlogs, queryTreatments
    let projection = {}
    let getData = await DAO.getData(Models.doctors,query,projection,{lean:true})



    if(getData.length) {

      let doctorId = getData[0]._id

      queryBookings = {
        hospitalId : payloadData.hospitalId,
        doctorId : doctorId,
       // doctorId : payloadData._id, 
        status : {$ne : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.CANCEL}
         
      }

      queryTiming = {
        doctorId : doctorId,
         // doctorId : payloadData._id,
          hospitalId : payloadData.hospitalId,
      }
      queryTreatments = {
        hospitalId : payloadData.hospitalId,
        isDeleted : false
      }
      queryBlogs = {
        hospitalId : payloadData.hospitalId,
      }

      let listTimings = await DAO.getData(Models.doctorsTiming,queryTiming,{},{lean:true})
      let listbookings = await DAO.getData(Models.doctorBookings,queryBookings,{},{lean:true})
      let listBlogs = await DAO.getData(Models.blogs,queryBlogs,{},{lean:true})
      let listTreatments = await DAO.getData(Models.treatments,queryTreatments,{},{lean:true})

      let slots = []
      let blogs = []
      let treatments = []


      for(let k =0; k<listBlogs.length;k++) {
        blogs.push({
          _id : listBlogs[k]._id,
          image : listBlogs[k].image
        })
       /* blogs.push({
          _id : listBlogs[k]._id,
          title : listBlogs[k].title,
          image : listBlogs[k].image,
          uniquekey : listBlogs[k].uniquekey
        })*/
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
      return getData

    }else {
      return []
    }




  }
  catch (err) {
    throw err;
  }
}


const listBookings = async (payloadData,userData) => {
  try {

    let query = {hospitalId: userData._id}

    if(payloadData.date) {
      query.bookingDate = payloadData.date
    }

    let options = {
      sort: {
        _id: -1
      }
    }

    /*let populate = [{
      path: "userId",
      select: ""
    }]*/

    let listBookings = await DAO.getData(Models.hospitalBookings, query, {}, options)

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
            "_id": usersData[j]._id
          },
          hospitalId : listBookings[i].hospitalId,
          bookingDate : listBookings[i].bookingDate,
          month : listBookings[i].month,
          time : listBookings[i].time,
          totalPrice : listBookings[i].totalPrice,
          stars : listBookings[i].stars,
          comment : listBookings[i].comment,
          status : listBookings[i].status,
          treatments : listBookings[i].treatments,
          prescription : listBookings[i].prescription,
          transactionId : listBookings[i].transactionId,
          description : listBookings[i].description,
          createdAt : listBookings[i].createdAt
        })
      }
    }

    return output

  } catch (err) {
    throw err;
  }
}

const revenueGraph = async(payloadData,userData) => {
  try {

    let match = {
      $match : {
        hospitalId : mongoose.Types.ObjectId(userData._id),
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

    let getData = await DAO.aggregateData(Models.hospitalBookings,query)
  
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

    let getData2 = await DAO.aggregateData(Models.hospitalBookings,query2)

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
        hospitalId :  mongoose.Types.ObjectId(userData._id),
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
    let getData = await DAO.aggregateData(Models.hospitalBookings,query)
    let query2 = {
      hospitalId : userData._id,
      $or : [
        {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.COMPLETE},
        {status : Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.RATED}
      ]
  }
    let getData2 = await DAO.count(Models.hospitalBookings,query2,{},{lean:true})

    
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


const bookingStatusUpdate = async (payloadData, userData) => {
  try {

    let query = { _id: payloadData._id }

    let update = { status : payloadData.status }

    let updateStatus = await DAO.findAndUpdate(Models.hospitalBookings, query, update, { new: true })

    let getUserPhoneNo = await DAO.getData(Models.users, {_id : updateStatus.userId },{},{lean:true})

    if(payloadData.status == Config.APP_CONSTANTS.DOCTOR_BOOKING_STATUS.APPROVE) {
      var message = "Your appointment at " + userData.name + " has been confirmed for this time "+ updateStatus.time +" and date " + updateStatus.bookingDate
      let sendMessage =  smsManager.sendSms(getUserPhoneNo[0].phoneNo,message)
    }
    return updateStatus

  } catch (err) {
    throw err;
  }
}

const addHospitalDoctor = async(payloadData,userData) => {
  try {

    let saveData = {
        hospitalId:userData._id,
        profileUpdated : true,
        adminVerified : true,
        status : Config.APP_CONSTANTS.DOCTOR_STATUS.HOSPITAL
    }

    if (payloadData.lng && payloadData.lat) {
      saveData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      }
    }
    if (payloadData.profilePicture) {
      saveData.profilePicture = payloadData.profilePicture
    }
    if (payloadData.name) {
      saveData.name = payloadData.name
    }
    if (payloadData.address) {
      saveData.address = payloadData.address
    }
    if (payloadData.gender) {
      saveData.gender = payloadData.gender
    }
    if (payloadData.consultantFees) {
      saveData.consultantFees = payloadData.consultantFees
    }
    if (payloadData.education) {
      saveData.education = payloadData.education
    }
    if (payloadData.awards) {
      saveData.awards = payloadData.awards
    }
    if (payloadData.languages) {
      saveData.languages = payloadData.languages
    }
    if (payloadData.membership) {
      saveData.membership = payloadData.membership
    }
    if (payloadData.speciality) {
      saveData.speciality = payloadData.speciality
    }
    if (payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }
    if (payloadData.phoneNo) {
      saveData.phoneNo = payloadData.phoneNo
    }
    if (payloadData.registrationNo) {
      saveData.registrationNo = payloadData.registrationNo
    }
    if (payloadData.about) {
      saveData.about = payloadData.about
    }
    if (payloadData.alternateNumber) {
      saveData.alternateNumber = payloadData.alternateNumber
    }
    if (payloadData.experience) {
      saveData.experience = payloadData.experience
    }
    if(typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      saveData.discount = payloadData.discount
    }
    if (payloadData.city) {
      saveData.city = payloadData.city;
    }
    if (payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }
    if (payloadData.email) {
      saveData.email = payloadData.email;
    }
    if (payloadData.regImage) {
      saveData.regImage = payloadData.regImage;
    }
    if(payloadData.services) {
      saveData.services = payloadData.services;
    }
    console.log("===========================================saveData",saveData)
    let addHospitalDoctor = await DAO.saveData(Models.doctors,saveData)
    return addHospitalDoctor
  }
  catch (err) {
    throw err;
  }
}

const editHospitalDoctor = async(payloadData,userData) => {
  try {

    let query = {_id : payloadData.doctorId, isDeleted : false}
    let updateData = {
        $addToSet : {hospitalId:userData._id},
        profileUpdated : true,
        status : Config.APP_CONSTANTS.DOCTOR_STATUS.BOTH
    }
    if (payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      }
    }
    if (payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture
    }
    if (payloadData.name) {
      updateData.name = payloadData.name
    }
    if (payloadData.address) {
      updateData.address = payloadData.address
    }
    if (payloadData.gender) {
      updateData.gender = payloadData.gender
    }
    if (payloadData.consultantFees) {
      updateData.consultantFees = payloadData.consultantFees
    }
    if (payloadData.education) {
      updateData.education = payloadData.education
    }
    if (payloadData.awards) {
      updateData.awards = payloadData.awards
    }
    if (payloadData.languages) {
      updateData.languages = payloadData.languages
    }
    if (payloadData.membership) {
      updateData.membership = payloadData.membership
    }
    if (payloadData.speciality) {
      updateData.speciality = payloadData.speciality
    }
    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }
    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo
    }
    if (payloadData.registrationNo) {
      updateData.registrationNo = payloadData.registrationNo
    }
    if (payloadData.about) {
      updateData.about = payloadData.about
    }
    if (payloadData.alternateNumber) {
      updateData.alternateNumber = payloadData.alternateNumber
    }
    if (payloadData.experience) {
      updateData.experience = payloadData.experience
    }
    if(typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      updateData.discount = payloadData.discount
    }
    if (payloadData.city) {
      updateData.city = payloadData.city;
    }
    if (payloadData.email) {
      updateData.email = payloadData.email;
    }
    if (payloadData.regImage) {
      updateData.regImage = payloadData.regImage;
    }
    if(payloadData.services) {
      updateData.services = payloadData.services;
    }
  

    let update = await DAO.findAndUpdate(Models.doctors, query, updateData, { new: true })
    return update
  }
  catch (err) {
    throw err;
  }
}

const deleteTreatments = async(payloadData,userData) => {
  try {

    let query = {
      hospitalId : userData._id,
      _id : payloadData._id
    }

    let updateData = {}
    if(typeof payloadData.isDeleted !== "undefined" && payloadData.isDeleted !== null) {
      updateData.isDeleted = payloadData.isDeleted
    }

    let update = await DAO.findAndUpdate(Models.treatments,query,updateData,{new : true})
    return update


  }
  catch (err) {
    throw err;
  }
}

const listReview = async (userData) => {
  try {

    let query = { _id: userData._id }
    let projection = { review: 1 }
    let populate = [{
      path: "review.userId",
      select: "profilePicture name"
     }]

    let getData = await DAO.populateData(Models.hospitals, query, projection, { lean: true}, populate)
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

    let addPrescription = await DAO.findAndUpdate(Models.hospitalBookings,query,update,{new:true})
    return addPrescription

  }
  catch (err) {
    throw err
  }
}



module.exports = {
    hospitalLogin : hospitalLogin,
    updateProfile : updateProfile,
    otpVerify : otpVerify,
    otpResend : otpResend,
    listHospital : listHospital,
    accessTokenLogin:accessTokenLogin,
    serachDoctor:serachDoctor,
    serachAmbulance:serachAmbulance,
    addDoctor:addDoctor,
    addAmbulance:addAmbulance,
    listDoctorAmbulance:listDoctorAmbulance,
    addTreatments : addTreatments,
    listTreatments : listTreatments,
    addEditBlog : addEditBlog,
    listBlog : listBlog,
    setPassword : setPassword,
    passwordLogin : passwordLogin,
    deleteBlog : deleteBlog,
    listDoctorsDetails : listDoctorsDetails,
    doctorOtpVerify : doctorOtpVerify,
    doctorOtpResend : doctorOtpResend,
    listBookings : listBookings,
    revenueGraph : revenueGraph,
    patientGraph : patientGraph,
    bookingStatusUpdate : bookingStatusUpdate,
    editHospitalDoctor : editHospitalDoctor,
    addTiming : addTiming,
    addDoctorTiming : addDoctorTiming,
    deleteTreatments : deleteTreatments,
    listReview : listReview,
    addPrescription : addPrescription


};
