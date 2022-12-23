const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  commonController = require("./commonController"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");
  randomstring = require("randomstring");


const ambulanceLogin = async (payloadData) => {
    try {
      let deletedata = await commonController.checkDatabase(payloadData)
      let generateOtp = await commonController.generateOtp()
     // console.log("=======================================generateOtp",generateOtp)

      if(payloadData.type == 1) {
        let query = { phoneNo : payloadData.phoneNo,isDeleted:false}
        let checkAmbulance = await DAO.getData(Models.ambulance, query, {}, {lean:true})
        if(checkAmbulance.length == 0) {
          throw ERROR.NO_DATA_FOUND;
          }
       }

      let query = { 
        phoneNo : payloadData.phoneNo,
        isDeleted:false,
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
      let checkLabs = await DAO.getData(Models.labs, query, {}, {lean:true})
      if(checkLabs.length) {
        throw ERROR.ALREADY_REGISTERED_AS_LABS;
      }
      let checkPharmecy = await DAO.getData(Models.pharmecy, query, {}, {lean:true})
      if(checkPharmecy.length) {
        throw ERROR.ALREADY_REGISTERED_AS_PHARMECY;
      }

      let checkAmbulance = await DAO.getData(Models.ambulance, query, {}, {lean:true})

      if (checkAmbulance.length == 0) {
        let saveData = {
          phoneNo: payloadData.phoneNo,
          otp: generateOtp
        };

        if(payloadData.deviceId) {
          saveData.deviceId = payloadData.deviceId
        }
  
        let createAmbulance = await DAO.saveData(Models.ambulance, saveData);

        var message = commonController.otpMessage()
        let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message)
  
        if (createAmbulance._id) {
          let tokenData = {
                scope: Config.APP_CONSTANTS.SCOPE.AMBULANCE,
                _id: createAmbulance._id,
                time: new Date().getTime()
          };
         
          let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.AMBULANCE);
  
          if (accessToken == null) {
            throw ERROR.DEFAULT;
          }
  
          let tokenResult = await DAO.findAndUpdate(Models.ambulance,{ _id: createAmbulance._id },
            { accessToken: accessToken},
            { new: true }
          );  
          return tokenResult
  
        } 
        else {
          throw ERROR.DB_ERROR;
        }
      } 
  
      else {

          let query = {  phoneNo: payloadData.phoneNo, isDeleted:false};

          let getData = await DAO.getData(Models.ambulance, query, {}, {lean:true})

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
            scope: Config.APP_CONSTANTS.SCOPE.AMBULANCE,
            _id: getData[0]._id,
            time: new Date().getTime()
          };

          let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.AMBULANCE);

          if (accessToken == null) {
            throw ERROR.DEFAULT;
          }

          let updateData = {
            accessToken: accessToken,
            otp : generateOtp
          }

          let tokenResult = await DAO.findAndUpdate(Models.ambulance,{ _id: getData[0]._id },updateData,{ new: true });
          return tokenResult


        } 
   
    } catch (err) {
      throw err;
    }
  };


const updateProfile = async(payloadData,userData) => {
  try {

    let updateProfile = await commonController.ambulanceProfile(payloadData,userData._id)
  
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
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    };

    let otpVerify = await DAO.getData(Models.ambulance, query, {}, { lean: true });
    if(otpVerify.length) {
      if (!(otpVerify[0].otp == payloadData.otp)) {
        throw ERROR.WRONG_OTP;
      }
  
      let setData = { otpVerify: true }
      let options = { new : true }
      let update = await DAO.findAndUpdate(Models.ambulance, query, setData, {options});
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
   // console.log("=======================================generateOtp",generateOtp)

    let query = {
      phoneNo: payloadData.phoneNo,
      isDeleted : false
    };

    let getData = await DAO.getData(Models.ambulance,query,{},{lean:true})
    if(getData.length) {
      let query2 = { phoneNo:getData[0].phoneNo };
      let options = { new: true };
      let setData = { otp: generateOtp };
      let update = await DAO.findAndUpdate(Models.ambulance, query2, setData, options);
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


/*const listAmbulance = async(payloadData,userData) => {
  try {

    let listData = await commonController.listAmbulance(userData._id)
    console.log("**********",listData)
    return listData

  }
  catch (err) {
    throw err;
  }
}*/

const listAmbulance = async (payloadData,userData) => {
  try {
    let models = Models.ambulance;
    let listData = await commonController.listData(null, userData._id, models)
    
    return listData
  } catch (err) {
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

const dutyStatus = async(payloadData,userData) =>{
  try{

    let getStatus = await DAO.getData(Models.ambulance,{_id:userData._id},{},{lean:true})

    if(getStatus.length && getStatus[0].ambulanceStatus != "BUSY"){
      let updateStatus = await DAO.findAndUpdate(Models.ambulance,{_id:userData._id},{ambulanceStatus:payloadData.status},{lean:true})
    }else{
      throw ERROR.DUTY_STATUS_CHANGE;
    }

    return payloadData;
    
  }catch(err){
    throw err;
  }
}


const getBookings = async(userData) =>{
  try{
  
    let populate =[
      {path :'hospitalId',select : ''}
    ];
    let queryAmbulance = {
      ambulanceId:userData._id,
      status:{ $nin:["COMPLETE","CANCELED"] } 
    }
 
    let ambulanceBooking = await DAO.populateData(Models.ambulanceBooking,queryAmbulance,{},{lean: true},populate);
 
   
    if(ambulanceBooking.length) {
    let getHospitalData = await DAO.getData(Models.hospitals,{_id : ambulanceBooking[0].hospitalId},{},{},{lean:true})

    if(ambulanceBooking[0].status == 'START') {
      ambulanceBooking[0].location = ambulanceBooking[0].location;
      ambulanceBooking[0].address = ambulanceBooking[0].address;
    }

    if(ambulanceBooking[0].status == 'REACHED' || ambulanceBooking[0].status == 'REACHED_HOSPITAL') {
      ambulanceBooking[0].location = getHospitalData[0].location;
      ambulanceBooking[0].address = getHospitalData[0].address;
    }

    return ambulanceBooking[0];
    /*if(ambulanceBooking[0].status == 'COMPLETE') {
      ambulanceBooking[0].location = getHospitalData[0].location;
      ambulanceBooking[0].address = getHospitalData[0].address;
    }*/
  }
  else {
    return null
  }

  }catch(err){
    throw err;
  }
}

const updateLocation = async(payloadData,userData) =>{
  try{
   
    let updateLocation = await DAO.findAndUpdate(Models.ambulance,{
      _id:userData._id
    },{
      'location.coordinates' :[payloadData.lng,payloadData.lat] 
    },{lean:true});

    return null;

  }catch(err){
    throw err;
  }
}

const statusUpdate = async(payloadData,userData) =>{
  try{
  
    let data = {};

    let updateStatus = await DAO.findAndUpdate(Models.ambulanceBooking,{
      _id:payloadData.bookingId
    },{
      status:payloadData.status
    },{lean:true})

    if(payloadData.status == 'COMPLETE') {
      let freeAmbulance = await DAO.findAndUpdate(Models.ambulance,{_id:userData._id},{ambulanceStatus:Config.APP_CONSTANTS.AMBULANCESTATUS.FREE},{new:true})
    }

    if(payloadData.status == 'REACHED' || payloadData.status == 'REACHED_HOSPITAL'){

      let populate =[
        {path :'hospitalId',select : ''}
      ];
  
      let ambulanceBooking = await DAO.populateData(Models.ambulanceBooking,{_id:payloadData.bookingId},{},{lean: true},populate);
  
      data.location = ambulanceBooking[0].hospitalId.location;
      data.address = ambulanceBooking[0].hospitalId.address;
      data.name = ambulanceBooking[0].hospitalId.name;
      data.phoneNo = ambulanceBooking[0].hospitalId.phoneNo;
    }
    else{
      let ambulanceBooking = await DAO.getData(Models.ambulanceBooking,{_id:payloadData.bookingId},{},{lean: true});

      data.address = ambulanceBooking[0].address;
      data.location = ambulanceBooking[0].location;
      data.name = ambulanceBooking[0].name;
      data.phoneNo = ambulanceBooking[0].phoneNo
    }

    data._id = payloadData.bookingId


    return data;
  }catch(err){
    throw err;
  }
}

const accessTokenLogin = async(userData) =>{
  try{
    let data = await DAO.getData(Models.ambulance,{_id:userData._id},{},{lean:true})
    return data[0];
  }catch(err){
    throw err;
  }
}

const passwordLogin = async(payloadData,userData) => {
  try {

    let query = {
      phoneNo : payloadData.phoneNo,
      isDeleted : false
    }
    let passwordLogin = await DAO.getData(Models.ambulance,query,{},{lean:true})

    if(passwordLogin.length == 0) {
      throw ERROR.INVALID_CREDENTIALS
    }

    if(passwordLogin[0].password != payloadData.password ) {
      throw ERROR.WRONG_PASSWORD
    }

   /* let tokenData = {
      scope: Config.APP_CONSTANTS.SCOPE.AMBULANCE,
      _id: passwordLogin[0]._id,
      time: new Date().getTime()
    };


    let accessToken = await TokenManager.generateToken(tokenData,Config.APP_CONSTANTS.SCOPE.AMBULANCE);
    if (accessToken == null) {
      throw ERROR.DEFAULT;
    }

    let tokenResult = await DAO.findAndUpdate(Models.ambulance,{ _id: passwordLogin[0]._id },
      { accessToken: accessToken},
      { new: true }
    );*/

    let update = {}
    if(payloadData.deviceId) {
      update.deviceId = payloadData.deviceId
    }

    let updateDeviceId = await DAO.findAndUpdate(Models.ambulance,query,update,{new:true})


    return updateDeviceId

  }
  catch (err) {
    throw err;
  }
}


let changePassword = async(payloadData,userData) => {
  try {

    let query = {
      _id : userData._id
    }

    let getAmbulance = await DAO.getData(Models.ambulance,query,{},{lean:true})

    if(getAmbulance[0].password != payloadData.password) {
      throw ERROR.OLD_PASSWORD_MISMATCH
    }

    else {
      let update = {
        password : payloadData.newPassword
      } 

      let changePassword = await DAO.findAndUpdate(Models.ambulance,query,update,{new:true})
      return changePassword
    }

  }
  catch(err) {
    throw err;
  }
}

const setPassword = async(payloadData,userData) => {
  try {

    let setPassword = await DAO.findAndUpdate(Models.ambulance,
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

const logout = async(userData) => {
  try {

    let query = {_id : userData._id}
    let update = {accessToken : null, deviceId : null}
    let logout = await DAO.findAndUpdate(Models.ambulance,query,update,{new:true})
    return null

  }
  catch (err) {
    throw err;
  }
}

const forgotPassword = async(payloadData) =>{
  try{

    let checkNumber = await DAO.getData(Models.ambulance,{phoneNo:payloadData.phoneNo},{_id:1},{lean:true})

    if(!(checkNumber.length)){
      throw ERROR.INVALID_MOBILE_NUMBER;
    }

    let tempPassword = randomstring.generate({
      length: 10
    });

    var message = "login with temporary password, password is  : " + tempPassword
    
   // console.log(".....password .......",message);

    let sendMessage =  smsManager.sendSms(payloadData.phoneNo,message);
    
   // console.log(".....sendMessage .......",sendMessage);
    
    let update = await DAO.findAndUpdate(Models.ambulance, {phoneNo:payloadData.phoneNo}, {password:tempPassword}, { new: true })

    return {response:null};

  }catch(err){
    throw err;
  }
}


module.exports = {
    ambulanceLogin : ambulanceLogin,
    updateProfile : updateProfile,
    otpVerify : otpVerify,
    otpResend : otpResend,
    listAmbulance : listAmbulance,
    listHospitals : listHospitals,
    dutyStatus:dutyStatus,
    getBookings:getBookings,
    updateLocation:updateLocation,
    statusUpdate:statusUpdate,
    accessTokenLogin:accessTokenLogin,
    passwordLogin : passwordLogin,
    changePassword : changePassword,
    setPassword : setPassword,
    logout : logout,
    forgotPassword : forgotPassword
};
