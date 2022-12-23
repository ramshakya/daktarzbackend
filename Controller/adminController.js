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
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");

const adminLogin = async paylaodData => {
  try {
    let time = moment().format("x")
    let checkAdmin = await DAO.getData(
      Models.admins,
      {
        email: paylaodData.email
      },
      {},
      {
        lean: true
      }
    );

    if (!checkAdmin.length) {
      throw ERROR.INVALID_OBJECT_ID;
    }
    if (!(checkAdmin[0].password == paylaodData.password)) {
      throw ERROR.WRONG_PASSWORD;
    }
    checkAdmin = checkAdmin[0];

    if (checkAdmin._id) {
      let tokenData = {
        scope: Config.APP_CONSTANTS.SCOPE.ADMIN,
        _id: checkAdmin._id,
        time: time
      };
      let accessToken = await TokenManager.generateToken(
        tokenData,
        Config.APP_CONSTANTS.SCOPE.ADMIN
      );
      if (accessToken == null) {
        throw ERROR.DEFAULT;
      }
      let tokenResult = await DAO.findAndUpdate(
        Models.admins,
        { _id: checkAdmin._id },
        {
          accessToken: accessToken,
          time : time
        },
        {
          new: true
        }
      );
      return tokenResult;
    } else {
      throw ERROR.DB_ERROR;
    }
  } catch (err) {
    throw err;
  }
};

//Ambulance Add Edit 
const ambulanceLogin = async(paylaodData) => {
  try {

    
      let ambulanceLogin = await commonController.ambulanceProfile(paylaodData,paylaodData._id)
     
      return ambulanceLogin

  }
  catch(err) {
    throw err;
  }
}

//List Ambulance
const listAmbulance = async(payloadData) => {
  try {
    let models = Models.ambulance;
    //let listData = await commonController.listData(payloadData,null,models)
    let query = { isDeleted : false, profileUpdated : true };

    if(payloadData.name) {
      query = {
        fullName : { $regex: payloadData.name, $options: "i" },
        isDeleted : false, 
        profileUpdated : true
      }
    }

    if(payloadData._id) {
      query._id = payloadData._id
    }

    if(payloadData.phoneNo) {
      query.phoneNo = payloadData.phoneNo
    }


    let populate = [{
      path: "hospitalId",
      select: ""
    }];
    console.log("==================================================query",query)
    let listData = await DAO.populateData(models, query , {}, { lean: true }, populate );

    return listData;
 
  }
  catch (err) {
    throw err;
  }
}

//Verify Ambulance
const approveAmbulance = async(payloadData) => {
  try {
    let models = Models.ambulance;
    let approveAmbulance = await commonController.adminVerify(payloadData,models)

    return approveAmbulance
  }
  catch (err) {
    throw err;
  }
}

//Delete Ambulance
const deleteAmbulance = async(payloadData) => {
  try {
    let models = Models.ambulance;
    let deleteAmbulance = await commonController.deleteData(payloadData._id,models)
    return deleteAmbulance
  }
  catch (err) {
    throw err;
  }
}

//Add edit Hospital
const hospitalLogin = async(paylaodData) => {
  try {

  
    let hospitalLogin = await commonController.hospitalProfile(paylaodData,paylaodData._id)
 
    return hospitalLogin
  }
  catch(err) {
    throw err;
  }
}

//List Hospitals
const listHospital = async(payloadData) => {
  try {

    let query = { profileUpdated : true, isDeleted : false}

    if(payloadData.name) {
      query = {
        name : { $regex: payloadData.name, $options: "i" },
        isDeleted : false, 
        profileUpdated : true
      }
    }

    if(payloadData._id){
      query._id = payloadData._id
    }

    if(payloadData.phoneNo) {
      query.phoneNo = payloadData.phoneNo
    }


    let listData = await DAO.getData(Models.hospitals,query,{},{lean:true});

    return listData
  }
  catch (err) {
    throw err;
  }
}

//Verify Hospitals
const approveHospital = async(payloadData) => {
  
  try {
    let query = { _id: payloadData._id }
    let updateData = {}
    if (typeof payloadData.adminVerified !== "undefined" && payloadData.adminVerified !== null) {
      updateData.adminVerified = payloadData.adminVerified
    }
    let adminVerify = await DAO.findAndUpdate(Models.hospitals, query, updateData, { new: true })
    if(payloadData.adminVerified == true) {
      let sendMessage = await sendMessgae(adminVerify.name,adminVerify.phoneNo)
    }
    return adminVerify
  
  }
  catch (err) {
    throw err;
  }
}

//Delete Hospitals
const deleteHospital = async(payloadData) => {
  try {
    let models = Models.hospitals;
    let deleteHospital = await commonController.deleteData(payloadData._id,models)
    return deleteHospital
  }
  catch (err) {
    throw err;
  }
}


const doctorLogin = async(paylaodData) => {
  try {
    let doctorLogin = await commonController.doctorProfile(paylaodData,paylaodData._id)
    return doctorLogin
  }
  catch(err) {
    throw err;
  }
}

//List Doctors
const listDoctors = async(payloadData) => {
  try {
   // let models = Models.doctors;
    //let listData = await commonController.listDoctors(payloadData,null)

    let match = {
      $match: {
        _id: mongoose.Types.ObjectId(payloadData._id),
        isDeleted: false,
        profileUpdated: true
      }
    }

    let match2 = {
      $match: {
        isDeleted: false,
        profileUpdated: true

      }
    }

    let phoneNo = {
      $match: {
        phoneNo : payloadData.phoneNo,
        isDeleted: false,
        profileUpdated: true
      }
    }

    let name = {
      $match : {
        name: { $regex: payloadData.name, $options: "i" }
      }
    }

    let lookUp = {
      $lookup: {
        from: "hospitals",
        localField: "hospitalId",
        foreignField: "_id",
        as: "hospitalsData"
      }
    }
  
    let unwindHospitals = {
      $unwind: {
        "path": "$hospitalsData",
        "preserveNullAndEmptyArrays": true
      }
    }
  
    let group = {
      $group: {
        _id: "$_id",
        profilePicture: { "$first": "$profilePicture" },
        name: { "$first": "$name" },
        email : { "$first": "$email" },
        gender: { "$first": "$gender" },
        location: { "$first": "$location" },
        city : { "$first": "$city" },
        address: { "$first": "$address" },
        consultantFees: { "$first": "$consultantFees" },
        education: { "$first": "$education" },
        awards: { "$first": "$awards" },
        experience : { "$first": "$experience" },
        languages: { "$first": "$languages" },
        membership: { "$first": "$membership" },
        speciality: { "$first": "$speciality" },
        countryCode : { "$first": "$countryCode" },
        phoneNo: { "$first": "$phoneNo" },
        alternateNumber: { "$first": "$alternateNumber" },
        registrationNo: { "$first": "$registrationNo" },
        about: { "$first": "$about" },
        otp: { "$first": "$otp" },
        discount : { "$first": "$discount" },
        otpVerify: { "$first": "$otpVerify" },
        adminVerified: { "$first": "$adminVerified" },
        profileUpdated: { "$first": "$profileUpdated" },
        isDeleted: { "$first": "$isDeleted" },
        createdAt: { "$first": "$createdAt" },
        hospital: { "$first": "$hospitalsData" },
        doctorVerified : { "$first": "$doctorVerified" },
        regImage : { "$first": "$regImage" },
        services : { "$first": "$services" },
        uniqueKey : {"$first" : "$uniquekey"},

      }
    }


    let query = [match2, lookUp, unwindHospitals, group]

    if(payloadData._id) {
      console.log("=========================================case1")
      query = [match, lookUp, unwindHospitals, group]
    }

    if(payloadData.phoneNo) {
      console.log("=========================================case2")
      query = [phoneNo, lookUp, unwindHospitals, group]
    }

    if(payloadData.name) {
      console.log("=========================================case3")
      query = [match2, name, lookUp, unwindHospitals, group]
    }

    /*if(!(payloadData._id || payloadData.phoneNo || payloadData.name)) {
      console.log("=========================================case4")
      query = [match2, lookUp, unwindHospitals, group]
    }*/

    console.log("=========================================query",JSON.stringify(query))
    let getDoctors = await DAO.aggregateData(Models.doctors, query)
  
    for(let i =0; i<getDoctors.length;i++) {
      let query = {doctorId : getDoctors[i]._id, isDeleted :false}
      let getTreatments = await DAO.getData(Models.treatments,query,{},{lean:true})
      getDoctors[i].treatments = getTreatments
    }
  
  
  
    return getDoctors

  }
  catch (err) {
    throw err;
  }
}

//Verify Doctors
const approveDoctor = async(payloadData) => {
  try {

    let query = { _id: payloadData._id }
    let updateData = {}
    if (typeof payloadData.adminVerified !== "undefined" && payloadData.adminVerified !== null) {
      updateData.adminVerified = payloadData.adminVerified
    }
    let adminVerify = await DAO.findAndUpdate(Models.doctors, query, updateData, { new: true })
    if(payloadData.adminVerified == true) {
      let sendMessage = await sendMessgae(adminVerify.name,adminVerify.phoneNo)
    }
    return adminVerify
  }
  catch (err) {
    throw err;
  }
}

//Delete Doctors
const deleteDoctor = async(payloadData) => {
  try {
    let query = { _id: payloadData._id }
    let updateData = { isDeleted: true }
    let deleteData = await DAO.findAndUpdate(Models.doctors, query, updateData, { new: true })
    let query2 = {
      doctorId : payloadData._id
    }
    let deleteBlogs = await DAO.findAndUpdate(Models.blogs, query2, updateData, { new: true })
    return deleteData
  }
  catch (err) {
    throw err;
  }
}

//Add Edit Users
const userLogin = async(paylaodData) => {
  try {
    let userLogin = await commonController.userProfile(paylaodData,paylaodData._id)
    return userLogin
  }
  catch(err) {
    throw err;
  }
}

//List Users
const listUsers = async(payloadData) => {
  try {

    let models = Models.users;
    let listData = await commonController.listData(payloadData._id,null,models)
  
    return listData
  }
  catch (err) {
    throw err;
  }
}

//Approve Users
const approveUsers = async(payloadData) => {
  try {
    let models = Models.users;
    let approveLabs = await commonController.adminVerify(payloadData,models)
    return approveLabs
  }
  catch (err) {
    throw err;
  }
}

//Delete Users
const deleteUsers = async(payloadData) => {
  try {
    let models = Models.users;
    let deleteLabs = await commonController.deleteData(payloadData._id,models)
    return deleteLabs
  }
  catch (err) {
    throw err;
  }
}

//Add Edit Labs
const addEditLabs = async(payloadData)=> {
  try {

    let addEditLabs = await commonController.labsProfile(payloadData,payloadData._id)
  
    return addEditLabs
  }
  catch(err) {
    throw err;
  }
}

//List Labs
const listLabs = async(payloadData) => {
  try {
    //let listData = await commonController.listLabs(payloadData,null)
    //return listData

    let match = {
      $match: {
        isDeleted: false,
        profileUpdated: true
      }
    }

    let matchById = {
      $match: {
        _id : mongoose.Types.ObjectId(payloadData._id),
        isDeleted : false,
        profileUpdated: true
      }
    }

    let matchByPhoneNo = {
      $match: {
        phoneNo : payloadData.phoneNo,
        isDeleted: false,
        profileUpdated: true
      }
    }

    let regexByName = {
      $match : {
        name: { $regex: payloadData.name, $options: "i" }
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

    let query = [match, lookup, unwind, group]

    if(payloadData._id) {
      query = [matchById, lookup, unwind, group]
    }

    if(payloadData.phoneNo) {
      query = [matchByPhoneNo, lookup, unwind, group]
    }

    if(payloadData.name) {
      query = [match, regexByName, lookup, unwind, group]
    }

  
    let listLabs = await DAO.aggregateData(Models.labs, query);

    return listLabs;
  }
  catch (err) {
    throw err;
  }
}

//Approve Labs
const approveLabs = async(payloadData) => {
  try {
   
    let query = { _id: payloadData._id }
    let updateData = {}
    if (typeof payloadData.adminVerified !== "undefined" && payloadData.adminVerified !== null) {
      updateData.adminVerified = payloadData.adminVerified
    }
    let adminVerify = await DAO.findAndUpdate(Models.labs, query, updateData, { new: true })
    if(payloadData.adminVerified == true) {
      let sendMessage = await sendMessgae(adminVerify.name,adminVerify.phoneNo)
    }
    return adminVerify
  }
  catch (err) {
    throw err;
  }
}

//Delete Labs
const deleteLabs = async(payloadData) => {
  try {
    let models = Models.labs;
    let deleteLabs = await commonController.deleteData(payloadData._id,models)
    return deleteLabs
  }
  catch (err) {
    throw err;
  }
}

//Add Edit Pharmecy
const addEditPharmecy = async(payloadData)=> {
  try {
    let addEditPharmecy = await commonController.pharmecyProfile(payloadData,payloadData._id)

    return addEditPharmecy
  }
  catch(err) {
    throw err;
  }
}

//List Pharmecy
const listPharmecy = async(payloadData) => {
  try {
    let models = Models.pharmecy;
    //let listData = await commonController.listData(payloadData._id,null,models)

    let query = { isDeleted : false, profileUpdated : true };

    if(payloadData.name) {
      query = {
        name : { $regex: payloadData.name, $options: "i" },
        isDeleted : false, 
        profileUpdated : true
      }
    }

    if(payloadData._id) {
      query._id = payloadData._id
    }

    if(payloadData.phoneNo) {
      query.phoneNo = payloadData.phoneNo
    }



    let listData = await DAO.getData(models, query , {}, { lean: true } );

    return listData;


  
    //return listData
  }
  catch (err) {
    throw err;
  }
}

//Approve Pharmecy
const approvePharmecy = async(payloadData) => {
  try {
    
    let query = { _id: payloadData._id }
    let updateData = {}
    if (typeof payloadData.adminVerified !== "undefined" && payloadData.adminVerified !== null) {
      updateData.adminVerified = payloadData.adminVerified
    }
    let adminVerify = await DAO.findAndUpdate(Models.pharmecy, query, updateData, { new: true })
    if(payloadData.adminVerified == true) {
      let sendMessage = await sendMessgae(adminVerify.name,adminVerify.phoneNo)
    }
    return adminVerify
  }
  catch (err) {
    throw err;
  }
}

//Delete Pharmecy
const deletePharmecy = async(payloadData) => {
  try {
    let models = Models.pharmecy;
    let deleteLabs = await commonController.deleteData(payloadData._id,models)
    return deleteLabs
  }
  catch (err) {
    throw err;
  }
}

const addTreatments = async (payloadData) => {
  try {
 


    let saveData = {
      doctorId: payloadData.doctorId,
      name: payloadData.name,
      price: payloadData.price,
      description: payloadData.description

    }
    let createTreatments = await DAO.saveData(Models.treatments, saveData)
    return createTreatments
  

  }
  catch (err) {
    throw err;
  }
}

const addTests = async(payloadData) => {
  try {
    let addTests = await commonController.addLabTests(payloadData,null)
    return addTests
  }
  catch (err) {
    throw err;
  }
}

const ambulanceBooking = async(paylaodData) =>{

  try {
  
  let query = {}
  
  if(paylaodData._id) {
    query._id = paylaodData._id
  }

  if(paylaodData.bookingDate) {
    query.bookingDate = paylaodData.bookingDate
  }

  let populate =[
    {path :'ambulanceId',select : ''},
    {path :'hospitalId',select : ''},
    {path :'userId',select : ''}
  ];
  
  let ambulanceBooking = await DAO.populateData(Models.ambulanceBooking,query,{},{lean: true,sort:{_id:-1}},populate);
  
  return ambulanceBooking;

  }
  catch (err) {
    throw err;
  }
  

}

const listPharmecyBookings = async (paylaodData) => {
  try {

    let query = {}

    if(paylaodData._id) {
      query._id = paylaodData._id
    }

    if(paylaodData.bookingDate) {
      query.bookingDate = paylaodData.bookingDate
    }

    let populate = [
      {
        path : 'userId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      },
      {
        path : 'pharmecyId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      }
    ]

    let listPharmecyBookings = await DAO.populateData(Models.pharmecyBookings,query,{__v:0},{lean:true,sort:{_id:-1}},populate)
    return listPharmecyBookings

  }
  catch (err) {
    throw err;
  }
}

const listLabsBookings = async (paylaodData) => {
  try {

    let query = {}
    if(paylaodData._id) {
      query._id = paylaodData._id
    }

    if(paylaodData.bookingDate) {
      query.bookingDate = paylaodData.bookingDate
    }

    let populate = [
      {
        path : 'userId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      },
      {
        path : 'labId',
        select : '-accessToken -otp -otpVerify -isDeleted -__v'
      }
    ]

    let listLabsBookings = await DAO.populateData(Models.labsBookings,query,{__v:0},{lean:true,sort:{_id:-1}},populate)
    return listLabsBookings

  }
  catch (err) {
    throw err;
  }
}

const addContent = async(payloadData,userData) => {
  try {

    let content = await DAO.getData(Models.content,{type:payloadData.type},{},{lean:true})
    if(content.length) {
      let saveData = {
        type : payloadData.type,
        description : payloadData.description,
      }
      let update = await DAO.findAndUpdate(Models.content,{type:payloadData.type},saveData,{new:true})
      return update
     }
    else {
      let saveData = {
        type : payloadData.type,
        description : payloadData.description,
      }
      let saveDetails = await DAO.saveData(Models.content,saveData)
      return saveDetails
      }
  }
  catch (err) {
    throw err;
  }
}

const listContent = async(payloadData) => {
  try {

    let query = {isDeleted:false}
    if(payloadData.type) {
      query.type = payloadData.type
    }

    let listContent = await DAO.getData(Models.content,query,{},{lean:true})
    return listContent[0]

  }
  catch (err) {
    throw err;
  }
}

const listDoctorBookings = async (paylaodData) => {
  try {

    let query = {hospitalId:{$eq : null}}

    if(paylaodData._id) {
      query._id = paylaodData._id
    }

    if(paylaodData.bookingDate) {
      query.bookingDate = paylaodData.bookingDate
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

    let listDoctorBookings = await DAO.populateData(Models.doctorBookings,query,{__v:0},{lean:true,sort:{_id:-1}},populate)
    return listDoctorBookings

  }
  catch (err) {
    throw err;
  }
}

const verifyDoctorProfile = async(payloadData,userData) => {
  try {

    let query = {_id:payloadData._id}
    let updateData = {}
    if (typeof payloadData.doctorVerified !== "undefined" && payloadData.doctorVerified !== null) {
      updateData.doctorVerified = payloadData.doctorVerified
    }

    let verifyDoctorProfile = await DAO.findAndUpdate(Models.doctors,query,updateData,{new:true})
    return verifyDoctorProfile

  }
  catch (err) {
    throw err;
  }
}

const blockLabs = async(payloadData,userData) => {
  try {

    let query = {_id:payloadData._id}
    let updateData = {}
    if (typeof payloadData.isBlocked !== "undefined" && payloadData.isBlocked !== null) {
      updateData.isBlocked = payloadData.isBlocked
    }

    let blockLabs = await DAO.findAndUpdate(Models.labs,query,updateData,{new:true})
    return blockLabs

  }
  catch (err) {
    throw err;
  }
}

const approveBlogs = async(payloadData,userData) => {
  try {

    let query = {_id:payloadData._id}
    let updateData = {}
    if (typeof payloadData.adminVerified !== "undefined" && payloadData.adminVerified !== null) {
      updateData.adminVerified = payloadData.adminVerified
    }

    let approveBlogs = await DAO.findAndUpdate(Models.blogs,query,updateData,{new:true})
    return approveBlogs

  }
  catch (err) {
    throw err;
  }
}

const listBlog = async (payloadData, userData) => {
  try {
    let query = {
      isDeleted:false
    }
    if (payloadData._id) {
      query._id = payloadData._id;
    }

    let populate = [
      {
        path : 'doctorId',
        select : 'name'
      },
      {
        path : 'hospitalId',
        select : 'name'
      }
    ]

    let getData = await DAO.populateData(Models.blogs, query, {}, {lean: true},populate)
    return getData
  } catch (err) {
    throw err;

  }
}

const deleteBlog = async(payloadData) => {
  try {

    let query = { _id : payloadData.blogId }
    let update = { isDeleted : true }
    let deleteBlog = await DAO.findAndUpdate(Models.blogs,query,update,{new:true})
    return deleteBlog
    
  }
  catch (err) {
    throw err;
  }
}

const listHospitalBookings = async (paylaodData) => {
  try {

    let query = {}

    if(paylaodData._id) {
      query._id = paylaodData._id
    }

    if(paylaodData.bookingDate) {
      query.bookingDate = paylaodData.bookingDate
    }

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

    let listHospitalBookings = await DAO.populateData(Models.hospitalBookings,query,{__v:0},{lean:true,sort:{_id:-1}},populate)
    return listHospitalBookings

  }
  catch (err) {
    throw err;
  }
}

const sendMessgae = async(name,phoneNo) => {
  try {

    let message = "Hello " + name + " , Your profile has been approved by admin. Please login to your account to add the Timings and Treatments to complete the registration process."
    let sendMessage =  smsManager.sendSms(phoneNo,message)
  }
  catch(err) {
    throw err;
  }
}

const listMedicalTourism = async(payloadData) => {
  try {

    let query = {}

    if(payloadData._id) {
      query._id = payloadData._id
    }

    let getMedicalTourism = await DAO.getData(Models.medicalTourism, query, {}, {lean:true})
    return getMedicalTourism

  }
  catch (err) {
    throw err;
  }
}

const addOtherDetails = async(apiData) => {
  try {

    let saveApiData = {}

    if(apiData.type) {
      saveApiData.type = apiData.type;
      saveApiData.uniquekey = apiData.type;
    }
    if(apiData.description) {
      saveApiData.description = apiData.description
    }

    let saveDataInDb = await DAO.saveData(Models.otherDetails, saveApiData)
    return saveDataInDb

  }
  catch (err) {
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
  adminLogin : adminLogin,
  ambulanceLogin : ambulanceLogin,
  deleteAmbulance : deleteAmbulance,
  approveAmbulance : approveAmbulance,
  hospitalLogin : hospitalLogin,
  deleteHospital : deleteHospital,
  approveHospital: approveHospital,
  doctorLogin : doctorLogin,
  listAmbulance : listAmbulance,
  listHospital : listHospital,
  listDoctors : listDoctors,
  userLogin : userLogin,
  approveUsers : approveUsers,
  deleteUsers : deleteUsers,
  listUsers : listUsers,
  approveDoctor : approveDoctor,
  deleteDoctor : deleteDoctor,
  addEditLabs : addEditLabs,
  listLabs : listLabs,
  approveLabs : approveLabs,
  deleteLabs : deleteLabs,
  listPharmecy : listPharmecy,
  approvePharmecy : approvePharmecy,
  deletePharmecy : deletePharmecy,
  addEditPharmecy : addEditPharmecy,
  addTreatments : addTreatments,
  addTests : addTests,
  ambulanceBooking:ambulanceBooking,
  listPharmecyBookings : listPharmecyBookings,
  listLabsBookings : listLabsBookings,
  addContent : addContent,
  listContent : listContent,
  listDoctorBookings : listDoctorBookings,
  verifyDoctorProfile : verifyDoctorProfile,
  blockLabs : blockLabs,
  approveBlogs:approveBlogs,
  listBlog:listBlog,
  deleteBlog : deleteBlog,
  listHospitalBookings : listHospitalBookings,
  sendMessgae : sendMessgae,
  listMedicalTourism : listMedicalTourism,
  addOtherDetails : addOtherDetails,
  listOtherDetails : listOtherDetails
};
