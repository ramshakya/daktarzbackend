//CREATED BY ABHISHEK DHADWAL
const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  UploadMultipart = require("../Libs/UploadMultipart"),
  commonController = require("./commonController"),
  aws = require('../Config/awsS3Config'),
  AWS = require("aws-sdk"),
  fs = require('fs'),
  moment = require('moment'),
  randomstring = require("randomstring"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");


const ambulanceProfile = async (payloadData, userId) => {
  if (userId) {

    let check = await checkData2(payloadData,userId);
    let updatequery = { _id: userId, isDeleted: false };
    let updateData = { profileUpdated: true };

    if (payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture;
    }
    if (payloadData.registrationImage) {
      updateData.registrationImage = payloadData.registrationImage;
    }
    if (payloadData.documents) {
      updateData.documents = payloadData.documents;
    }
    if (payloadData.fullName) {
      updateData.fullName = payloadData.fullName;
    }
    if (payloadData.email) {
      updateData.email = payloadData.email;
    }
    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo;
    }
    if (payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }
    if (payloadData.address) {
      updateData.address = payloadData.address;
    }
    if (payloadData.registrationNo) {
      updateData.registrationNo = payloadData.registrationNo;
    }
    if (payloadData.drivingLicence) {
      updateData.drivingLicence = payloadData.drivingLicence;
    }
    if (payloadData.vehicleNo) {
      updateData.vehicleNo = payloadData.vehicleNo;
    }
    if (payloadData.alternateNumber) {
      updateData.alternateNumber = payloadData.alternateNumber;
    }
    if (payloadData.type) {
      updateData.type = payloadData.type;
    }
    if (payloadData.hospitalId) {
      updateData.hospitalId = payloadData.hospitalId;
    }
    if (payloadData.profileUpdated) {
      updateData.profileUpdated = payloadData.profileUpdated;
    }
    if (payloadData.association) {
      updateData.association = payloadData.association;
    }
    if (payloadData.password) {
      updateData.password = payloadData.password;
      updateData.passwordSet = true;
    }
    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }
    let update = await DAO.findAndUpdate(Models.ambulance,updatequery,updateData, {new: true});

    return update;
  } else {
    let deletedata = await checkDatabase(payloadData)
    let check = await checkData(payloadData);

    let saveData = {
      phoneNo: payloadData.phoneNo,
      adminVerified: true,
      profileUpdated: true,
      
    };
    if (payloadData.profilePicture) {
      saveData.profilePicture = payloadData.profilePicture;
    }
    if (payloadData.fullName) {
      saveData.fullName = payloadData.fullName;
    }
    if (payloadData.email) {
      saveData.email = payloadData.email;
    }
    if (payloadData.documents) {
      saveData.documents = payloadData.documents;
    }
    if (payloadData.lng && payloadData.lat) {
      saveData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }
    if (payloadData.address) {
      saveData.address = payloadData.address;
    }
    if (payloadData.registrationNo) {
      saveData.registrationNo = payloadData.registrationNo;
    }
    if (payloadData.drivingLicence) {
      saveData.drivingLicence = payloadData.drivingLicence;
    }
    if (payloadData.vehicleNo) {
      saveData.vehicleNo = payloadData.vehicleNo;
    }
    if (payloadData.profileUpdated) {
      saveData.profileUpdated = payloadData.profileUpdated;
    }
    if (payloadData.alternateNumber) {
      saveData.alternateNumber = payloadData.alternateNumber;
    }
    if (payloadData.type) {
      saveData.type = payloadData.type;
    }
    if (payloadData.hospitalId) {
      saveData.hospitalId = payloadData.hospitalId;
    }

    if (payloadData.association) {
      saveData.association = payloadData.association;
    }
    if (payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }
    let saveAmbulance = await DAO.saveData(Models.ambulance, saveData);

    return saveAmbulance;
  }
};

const hospitalProfile = async (payloadData, userId) => {
  if (userId) {
    let check = await checkData2(payloadData,userId);
    let updatequery = {
      _id: userId
    };

    let unsetData = {
      $unset: {
        images: true
      }
    };

    let unset = await DAO.update(Models.hospitals, updatequery, unsetData, {
      new: true
    });


    let updateData = {
      profileUpdated: true,
    };

    if(payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }

    if(!(payloadData.lng && payloadData.lat)) {
      updateData.location = {
        type: "Point",
        coordinates: [76.779, 30.7411]
      };
    }

    if(payloadData.images) {
      updateData.images = payloadData.images;
    }
    if(typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      updateData.discount = payloadData.discount;
    }
    if (payloadData.name) {
      updateData.name = payloadData.name;
    }
    if (payloadData.address) {
      updateData.address = payloadData.address;
    }
    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo;
    }
    if (payloadData.coverPhoto) {
      updateData.coverPhoto = payloadData.coverPhoto;
    }
    if (payloadData.alternateNumber) {
      updateData.alternateNumber = payloadData.alternateNumber;
    }
    if (payloadData.registrationNo) {
      updateData.registrationNo = payloadData.registrationNo;
    }
    if (payloadData.fees) {
      updateData.fees = payloadData.fees;
    }
    if (payloadData.website) {
      updateData.website = payloadData.website;
    }
    if (payloadData.email) {
      updateData.email = payloadData.email;
    }
    if (payloadData.awards) {
      updateData.awards = payloadData.awards;
    }
    if (payloadData.membership) {
      updateData.membership = payloadData.membership;
    }
    if (payloadData.regImage) {
      updateData.regImage = payloadData.regImage;
    }
    if (payloadData.description) {
      updateData.description = payloadData.description;
    }
    if (payloadData.password) {
      updateData.password = payloadData.password;
      updateData.passwordSet = true;
    }
    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }
    if(payloadData.speciality) {
      updateData.speciality = payloadData.speciality;
    }
    if (payloadData.services) {
      updateData.services = payloadData.services;
    }
    if (payloadData.city) {
        updateData.city = payloadData.city;
    }
 
    let update = await DAO.findAndUpdate(Models.hospitals, updatequery, updateData, { new: true });
    return update;

  } 
  else {
    let deletedata = await checkDatabase(payloadData)
    let check = await checkData(payloadData);

    let saveData = {
      phoneNo: payloadData.phoneNo,
      adminVerified: true,
      profileUpdated: true,
    };

    if(payloadData.lng && payloadData.lat) {
      saveData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }
    if(payloadData.name) {
      saveData.name = payloadData.name;
    }
    if(payloadData.speciality) {
      saveData.speciality = payloadData.speciality;
    }
    if(payloadData.city) {
      saveData.city = payloadData.city;
    }
    if(payloadData.images) {
      saveData.images = payloadData.images;
    }
    if(typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      saveData.discount = payloadData.discount;
    }
    if(payloadData.address) {
      saveData.address = payloadData.address;
    }
    if(payloadData.coverPhoto) {
      saveData.coverPhoto = payloadData.coverPhoto;
    }
    if(payloadData.alternateNumber) {
      saveData.alternateNumber = payloadData.alternateNumber;
    }
    if(payloadData.registrationNo) {
      saveData.registrationNo = payloadData.registrationNo;
    }
    if(payloadData.fees) {
      saveData.fees = payloadData.fees;
    }
    if(payloadData.profileUpdated) {
      saveData.profileUpdated = payloadData.profileUpdated;
    }

    if(payloadData.email) {
      saveData.email = payloadData.email;
    }

    if(payloadData.awards) {
      saveData.awards = payloadData.awards;
    }

    if(payloadData.membership) {
      saveData.membership = payloadData.membership;
    }

    if(payloadData.regImage) {
      saveData.regImage = payloadData.regImage;
    }

    if(payloadData.description) {
      saveData.description = payloadData.description;
    }

    if(payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }

    if(payloadData.services) {
      saveData.services = payloadData.services;
    }

    let savehospitals = await DAO.saveData(Models.hospitals, saveData);
    return savehospitals;
  }
};

const doctorProfile = async (payloadData, userId) => {

  let language, lowerCase, output = [], unique;

  let currentMillis = moment().format("x");

  //generate random string
  let randomString = randomstring.generate({ length: 8, charset: 'alphanumeric'});

  if(payloadData.name && payloadData.registrationNo) {
    unique = payloadData.name + "-" + payloadData.registrationNo + "-" + currentMillis
  }
  if(!(payloadData.name && payloadData.registrationNo)) {
    unique = randomString + "-" + currentMillis
  }

  // remove spaces from unique key
  let key = unique.replace(/ /g, '')

  if(payloadData.languages) {
    language = payloadData.languages

    for(let i=0; i<language.length; i++) {
      lowerCase = language[i].toLowerCase()
      output.push(lowerCase)
    }
  }

  if (userId) {
    
    let check = await checkData2(payloadData,userId);

    let updatequery = {_id: userId};

    let updateData = {
      profileUpdated: true,
      uniquekey : key
    };

    if (payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }
    if (payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture;
    }
    if (payloadData.name) {
      updateData.name = payloadData.name;
    }
    if (payloadData.address) {
      updateData.address = payloadData.address;
    }
    if (payloadData.gender) {
      updateData.gender = payloadData.gender;
    }
    if (payloadData.consultantFees) {
      updateData.consultantFees = payloadData.consultantFees;
    }
    if (payloadData.education) {
      updateData.education = payloadData.education;
    }
    if (payloadData.awards) {
      updateData.awards = payloadData.awards;
    }
    if (payloadData.languages) {
      updateData.languages = output;
    }
    if (payloadData.membership) {
      updateData.membership = payloadData.membership;
    }
    if (payloadData.speciality) {
      updateData.speciality = payloadData.speciality;
    }
    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo;
    }

    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }
    
    if (payloadData.registrationNo) {
      updateData.registrationNo = payloadData.registrationNo;
    }
    if (payloadData.about) {
      updateData.about = payloadData.about;
    }
    if (payloadData.alternateNumber) {
      updateData.alternateNumber = payloadData.alternateNumber;
    }
    if (payloadData.experience) {
      updateData.experience = payloadData.experience;
    }
    if (
      typeof payloadData.discount !== "undefined" &&
      payloadData.discount !== null
    ) {
      updateData.discount = payloadData.discount;
    }
    if (payloadData.password) {
      updateData.password = payloadData.password;
      updateData.passwordSet = true;
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

    let update = await DAO.findAndUpdate(Models.doctors, updatequery,updateData, {new: true});

    return update;
  } 
  else {
    let deleteData = await checkDatabase(payloadData)
    let check = await checkData(payloadData);
    

    let saveData = {
      phoneNo: payloadData.phoneNo,
      adminVerified: true,
      profileUpdated : true,
      uniquekey : key
    };

    if (payloadData.lng && payloadData.lat) {
      saveData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }

    if (payloadData.hospitalId) {
      saveData.hospitalId = payloadData.hospitalId;
    }

    if (payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }

    if (payloadData.profilePicture) {
      saveData.profilePicture = payloadData.profilePicture;
    }

    if (payloadData.address) {
      saveData.address = payloadData.address;
    }

    if (payloadData.alternateNumber) {
      saveData.alternateNumber = payloadData.alternateNumber;
    }

    if (payloadData.experience) {
      saveData.experience = payloadData.experience;
    }

    if (payloadData.consultantFees) {
      saveData.consultantFees = payloadData.consultantFees;
    }

    if (typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      saveData.discount = payloadData.discount;
    }

    if (payloadData.name) {
      saveData.name = payloadData.name;
    }

    if (payloadData.gender) {
      saveData.gender = payloadData.gender;
    }

    if (payloadData.education) {
      saveData.education = payloadData.education;
    }

    if (payloadData.awards) {
      saveData.awards = payloadData.awards;
    }

    if (payloadData.awards) {
      saveData.awards = payloadData.awards;
    }

    if (payloadData.languages) {
      saveData.languages = output;
    }

    if (payloadData.membership) {
      saveData.membership = payloadData.membership;
    }

    if (payloadData.speciality) {
      saveData.speciality = payloadData.speciality;
    }

    if (payloadData.registrationNo) {
      saveData.registrationNo = payloadData.registrationNo;
    }

    if (payloadData.about) {
      saveData.about = payloadData.about;
    }

    if (payloadData.city) {
      saveData.city = payloadData.city;
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


    let createDoctor = await DAO.saveData(Models.doctors, saveData);

    return createDoctor;
  }
};

const imageUpload = async payloadData => {
  try {
    return new Promise(function (resolve, reject) {
      UploadMultipart.uploadFilesOnS3(payloadData.file, (err, imageUpload) => {
        if (err) reject(err);
        else {
          resolve(imageUpload);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const userProfile = async (payloadData, userId) => {
  if (userId) {
    let query = {
      _id: userId
    };

    let updateData = {
      profileUpdated: true
    };

    if (payloadData.documents) {
      updateData.documents = payloadData.documents;
    }

    if (payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }
    if (payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture;
    }
    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }
    if (payloadData.name) {
      updateData.name = payloadData.name;
    }
    if (payloadData.address) {
      updateData.address = payloadData.address;
    }
    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo;
    }
    if (payloadData.email) {
      updateData.email = payloadData.email;
    }
    if (payloadData.houseNo) {
      updateData.houseNo = payloadData.houseNo;
    }
    if (payloadData.city) {
      updateData.city = payloadData.city;
    }
    if (payloadData.state) {
      updateData.state = payloadData.state;
    }
    if (payloadData.country) {
      updateData.country = payloadData.country;
    }
    if (payloadData.pincode) {
      updateData.pincode = payloadData.pincode;
    }
    if (payloadData.about) {
      updateData.about = payloadData.about;
    }
    if (payloadData.education) {
      updateData.education = payloadData.education;
    }
    if (payloadData.languages) {
      updateData.languages = payloadData.languages;
    }
    if (payloadData.gender) {
      updateData.gender = payloadData.gender;
    }
    if (payloadData.dob) {
      updateData.dob = payloadData.dob;
    }
    if (payloadData.bloodGroup) {
      updateData.bloodGroup = payloadData.bloodGroup;
    }
    if (payloadData.timeZone) {
      updateData.timeZone = payloadData.timeZone;
    }

    let update = await DAO.findAndUpdate(Models.users, query, updateData, {new: true});
    return update;
  } else {
    let query = {
      phoneNo: payloadData.phoneNo,

    };
    let checkUser = await DAO.getData(Models.users, query, {}, {
      lean: true
    });

    if (checkUser.length) {
      throw ERROR.MOBILE_ALREADY_EXIST;
    } else {
      let saveData = {
        phoneNo: payloadData.phoneNo,
        adminVerified: true,
        profileUpdated: true,
      };

      if (payloadData.name) {
        saveData.name = payloadData.name;
      }
      if (payloadData.documents) {
        saveData.documents = payloadData.documents;
      }
      if (payloadData.countryCode) {
        saveData.countryCode = payloadData.countryCode;
      }
      if (payloadData.profilePicture) {
        saveData.profilePicture = payloadData.profilePicture;
      }
      if (payloadData.lng && payloadData.lat) {
        saveData.location = {
          type: "Point",
          coordinates: [payloadData.lng, payloadData.lat]
        };
      }
      if (payloadData.address) {
        saveData.address = payloadData.address;
      }
      if (payloadData.email) {
        saveData.email = payloadData.email;
      }
      if (payloadData.houseNo) {
        saveData.houseNo = payloadData.houseNo;
      }
      if (payloadData.city) {
        saveData.city = payloadData.city;
      }
      if (payloadData.state) {
        saveData.state = payloadData.state;
      }
      if (payloadData.country) {
        saveData.country = payloadData.country;
      }
      if (payloadData.pincode) {
        saveData.pincode = payloadData.pincode;
      }
      if (payloadData.about) {
        saveData.about = payloadData.about;
      }
      if (payloadData.education) {
        saveData.education = payloadData.education;
      }
      if (payloadData.languages) {
        saveData.languages = payloadData.languages;
      }
      if (payloadData.gender) {
        saveData.gender = payloadData.gender;
      }
      if (payloadData.dob) {
        saveData.dob = payloadData.dob;
      }
      if (payloadData.bloodGroup) {
        saveData.bloodGroup = payloadData.bloodGroup;
      }
      if (payloadData.timeZone) {
        saveData.timeZone = payloadData.timeZone;
      }

      let saveUsers = await DAO.saveData(Models.users, saveData);
      return saveUsers;
    }
  }
};

const labsProfile = async (payloadData, userId) => {

  if (userId) {
    let check = await checkData2(payloadData,userId);
    let updatequery = {  _id: userId, isDeleted: false };

    let unsetData = {
      $unset: {
        images: true
      }
    };

    let unset = await DAO.update(Models.labs, updatequery, unsetData, {new: true});

    let updateData = {
      profileUpdated: true,
    };

    if(payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }

    if (payloadData.images) {
      updateData.images = payloadData.images;
    }

    if (payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture;
    }

    if (payloadData.name) {
      updateData.name = payloadData.name;
    }

    if (payloadData.address) {
      updateData.address = payloadData.address;
    }

    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo;
    }

    if (payloadData.about) {
      updateData.about = payloadData.about;
    }

    if (typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      updateData.discount = payloadData.discount;
    }

    if (payloadData.registrationNo) {
      updateData.registrationNo = payloadData.registrationNo;
    }

    if (payloadData.alternateNumber) {
      updateData.alternateNumber = payloadData.alternateNumber;
    }

    if (payloadData.profileUpdated) {
      updateData.profileUpdated = payloadData.profileUpdated;
    }

    if (payloadData.email) {
      updateData.email = payloadData.email;
    }

    if (payloadData.awards) {
      updateData.awards = payloadData.awards;
    }

    if (payloadData.membership) {
      updateData.membership = payloadData.membership;
    }

    if (payloadData.regImage) {
      updateData.regImage = payloadData.regImage;
    }

    if (payloadData.password) {
      updateData.password = payloadData.password;
      updateData.passwordSet = true;
    }

    if (payloadData.city) {
      updateData.city = payloadData.city;
    }

    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }




    
    
    let update = await DAO.findAndUpdate(Models.labs, updatequery, updateData, {new: true});
    return update;
  } 

  else {
    let deletedata = await checkDatabase(payloadData)
    let check = await checkData(payloadData);

    let updateData = {
      profileUpdated: true,
    };

    let saveData = {
      phoneNo: payloadData.phoneNo,
      adminVerified: true,
      profileUpdated: true,
    };

    if(payloadData.lng && payloadData.lat) {
      saveData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }

    if (payloadData.name) {
      updateData.name = payloadData.name;
    }

    if (payloadData.city) {
      updateData.city = payloadData.city;
    }

    if (payloadData.profilePicture) {
      saveData.profilePicture = payloadData.profilePicture;
    }

    if (payloadData.address) {
      saveData.address = payloadData.address;
    }

    if (payloadData.images) {
      saveData.images = payloadData.images;
    }

    if (typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      saveData.discount = payloadData.discount;
    }

    if (payloadData.about) {
      saveData.about = payloadData.about;
    }

    if (payloadData.profileUpdated) {
      saveData.profileUpdated = payloadData.profileUpdated;
    }

    if (payloadData.registrationNo) {
      saveData.registrationNo = payloadData.registrationNo;
    }

    if (payloadData.alternateNumber) {
      saveData.alternateNumber = payloadData.alternateNumber;
    }

    if (payloadData.email) {
      saveData.email = payloadData.email;
    }

    if (payloadData.awards) {
      saveData.awards = payloadData.awards;
    }

    if (payloadData.membership) {
      saveData.membership = payloadData.membership;
    }

    if (payloadData.regImage) {
      saveData.regImage = payloadData.regImage;
    }

    if (payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }




    let savelabs = await DAO.saveData(Models.labs, saveData);
    return savelabs;
  }
};

const pharmecyProfile = async (payloadData, userId) => {
  if (userId) {
    let check = await checkData2(payloadData,userId);
    let query = { phoneNo: payloadData.phoneNo, isDeleted: false };
    let updatequery = { _id: userId };

    let unsetData = {
      $unset: {
        images: true
      }
    };

    let unset = await DAO.update(Models.pharmecy, updatequery, unsetData, {
      new: true
    });


    let updateData = {
      profileUpdated: true,
    };

    if(payloadData.lng && payloadData.lat) {
      updateData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }

    if (payloadData.images) {
      updateData.images = payloadData.images;
    }

    if ( typeof payloadData.discount !== "undefined" && payloadData.discount !== null ) {
      updateData.discount = payloadData.discount;
    }

    if (payloadData.profilePicture) {
      updateData.profilePicture = payloadData.profilePicture;
    }

    if (payloadData.name) {
      updateData.name = payloadData.name;
    }

    if (payloadData.address) {
      updateData.address = payloadData.address;
    }

    if (payloadData.phoneNo) {
      updateData.phoneNo = payloadData.phoneNo;
    }

    if (payloadData.about) {
      updateData.about = payloadData.about;
    }

    if (payloadData.registrationNo) {
      updateData.registrationNo = payloadData.registrationNo;
    }

    if (payloadData.alternateNumber) {
      updateData.alternateNumber = payloadData.alternateNumber;
    }

    if (payloadData.profileUpdated) {
      updateData.profileUpdated = payloadData.profileUpdated;
    }

    if (payloadData.email) {
      updateData.email = payloadData.email;
    }

    if (payloadData.awards) {
      updateData.awards = payloadData.awards;
    }

    if (payloadData.membership) {
      updateData.membership = payloadData.membership;
    }

    if (payloadData.regImage) {
      updateData.regImage = payloadData.regImage;
    }

    if (payloadData.password) {
      updateData.password = payloadData.password;
      updateData.passwordSet = true;
    }

    if (payloadData.city) {
        updateData.city = payloadData.city;
    }

    if (payloadData.countryCode) {
      updateData.countryCode = payloadData.countryCode;
    }

  
    let update = await DAO.findAndUpdate(Models.pharmecy,updatequery,updateData, {new: true});
    return update;
  } else {
    let deletedata = await checkDatabase(payloadData)
    let check = await checkData(payloadData);
    let saveData = {
      phoneNo: payloadData.phoneNo,
      adminVerified: true,
      profileUpdated: true,
    };

    if(payloadData.lng && payloadData.lat) {
      saveData.location = {
        type: "Point",
        coordinates: [payloadData.lng, payloadData.lat]
      };
    }

    if (payloadData.city) {
      saveData.city = payloadData.city;
    }

    if (payloadData.name) {
      saveData.name = payloadData.name;
    }

    if (payloadData.profilePicture) {
      saveData.profilePicture = payloadData.profilePicture;
    }

    if (payloadData.address) {
      saveData.address = payloadData.address;
    }

    if (typeof payloadData.discount !== "undefined" && payloadData.discount !== null) {
      saveData.discount = saveData.discount;
    }

    if (payloadData.images) {
      saveData.images = payloadData.images;
    }

    if (payloadData.about) {
      saveData.about = payloadData.about;
    }

    if (payloadData.registrationNo) {
      saveData.registrationNo = payloadData.registrationNo;
    }

    if (payloadData.alternateNumber) {
      saveData.alternateNumber = payloadData.alternateNumber;
    }

    if (payloadData.profileUpdated) {
      saveData.profileUpdated = payloadData.profileUpdated;
    }

    if (payloadData.email) {
      saveData.email = payloadData.email;
    }

    if (payloadData.awards) {
      saveData.awards = payloadData.awards;
    }

    if (payloadData.membership) {
      saveData.membership = payloadData.membership;
    }

    if (payloadData.regImage) {
      saveData.regImage = payloadData.regImage;
    }

    if (payloadData.countryCode) {
      saveData.countryCode = payloadData.countryCode;
    }

    let savepharmecy = await DAO.saveData(Models.pharmecy, saveData);
    return savepharmecy;
  }
};

const generateToken = async (tokenData, models) => {
  let accessToken = await TokenManager.generateToken(
    tokenData,
    tokenData.scope
  );
  if (accessToken == null) {
    throw ERROR.DEFAULT;
  }

  let query = {
    _id: tokenData._id
  };

  let update = {
    accessToken: accessToken
  };

  let tokenResult = await DAO.findAndUpdate(models, query, update, {
    new: true
  });
  return tokenResult;
};

const login = async (payloadData, models, scope) => {
  let query = {
    phoneNo: payloadData.phoneNo
  };
  let checkLogin = await DAO.getData(models, query, {}, {
    lean: true
  });

  if (checkLogin.length == 0) {
    let saveData = {
      phoneNo: payloadData.phoneNo,
      otp: 1234
    };

    let create = await DAO.saveData(models, saveData);

    if (create._id) {
      let tokenData = {
        scope: scope,
        _id: create._id,
        time: new Date().getTime()
      };
      let createToken = await generateToken(tokenData, models);
      //console.log("=================createToken",createToken)
      return createToken;
    } else {
      throw ERROR.DB_ERROR;
    }
  } else {
    let query = {
      phoneNo: payloadData.phoneNo
    };
    let updateData = {
      otp: 1234
    };
    var update = await DAO.findAndUpdate(models, query, updateData, {
      new: true
    });
    // console.log("**********************",update._id)

    let tokenData = {
      scope: scope,
      _id: update._id,
      time: new Date().getTime()
    };

    let createToken = await generateToken(tokenData, models);
    //console.log("=================createToken",createToken)
    return createToken;
  }
};

const adminVerify = async (payloadData, models) => {
  try {
    let query = {
      _id: payloadData._id
    };
    let updateData = {};
    if (
      typeof payloadData.adminVerified !== "undefined" &&
      payloadData.adminVerified !== null
    ) {
      updateData.adminVerified = payloadData.adminVerified;
    }
    let adminVerify = await DAO.findAndUpdate(models, query, updateData, {
      new: true
    });
    return adminVerify;
  } catch (err) {
    throw err;
  }
};

const deleteData = async (_id, models) => {
  let query = {
    _id: _id
  };
  let updateData = {
    isDeleted: true
  };
  let deleteData = await DAO.findAndUpdate(models, query, updateData, {
    new: true
  });
  return deleteData;
};

const listData = async (_id, userId, models) => {

  if (_id) {

    let query = { _id : _id, isDeleted : false, profileUpdated : true };

    let populate = [{
      path: "hospitalId",
      select: ""
    }];

    let listData = await DAO.populateData(models, query , {}, { lean: true }, populate );

    return listData;

  } 

  else if (userId) {

    let query = { _id : userId, isDeleted : false, profileUpdated : true };

    let populate = [{
      path: "hospitalId",
      select: ""
    }];

    let listData = await DAO.populateData(models, query, {}, { lean: true }, populate );

    return listData;
  } 
  
  else {

    let query = { profileUpdated : true, isDeleted : false };

    let populate = [{
      path: "hospitalId",
      select: ""
    }];

    let listData = await DAO.populateData(models, query , {} , { lean: true }, populate );
    return listData;

  }
};

const otpVerify = async (phoneNo, otp, models) => {
  let query = {
    phoneNo: phoneNo,
    isDeleted: false
  };

  let otpVerify = await DAO.getData(models, query, {}, {
    lean: true
  });

  if (otpVerify.length) {
    if (!(otpVerify[0].otp == otp)) {
      throw ERROR.WRONG_OTP;
    }

    let setData = {
      otpVerify: true
    };
    let options = {
      new: true
    };
    let update = await DAO.findAndUpdate(models, query, setData, options);
    return update;
  } else {
    throw ERROR.NO_DATA_FOUND;
  }
};

const otpResend = async (phoneNo, models) => {
  let query = {
    phoneNo: phoneNo,
    isDeleted: false
  };
  let getData = await DAO.getData(models, query, {}, {
    lean: true
  });
  if (getData.length) {
    let query2 = {
      phoneNo: getData[0].phoneNo
    };
    let options = {
      new: true
    };
    let setData = {
      otp: 1234
    };
    let update = await DAO.findAndUpdate(models, query2, setData, options);

    return update.otp;
  } else {
    throw ERROR.NO_DATA_FOUND;
  }
};

const nearByAmbulance = async (lng, lat) => {
  let aggregate = [{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [lng, lat]
      },
      distanceField: "distance",
      maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
      query: {
        adminVerified: true,
        ambulanceStatus: Config.APP_CONSTANTS.AMBULANCESTATUS.FREE,
        isDeleted : false
      },
      spherical: true
    }
  }];
  let nearByAmbulance = await DAO.aggregateData(Models.ambulance, aggregate);
  return nearByAmbulance;
};

const nearByHospital = async (lng, lat) => {
  let aggregate = [{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [lng, lat]
      },
      distanceField: "distance",
      maxDistance: Config.APP_CONSTANTS.MAX_DISTANCE.RADIUS,
      query: {
        adminVerified: true,
        isDeleted : false
      },
      spherical: true
    }
  }];
  let nearByHospital = await DAO.aggregateData(Models.hospitals, aggregate);
  return nearByHospital;
};



const listDoctors = async (payloadData, userId) => {
  let match = {};
  let lookUp = {};
  let unwindHospitals = {};
  let lookup2 = {};
  if (payloadData._id) {
    match = {
      $match: {
        _id: mongoose.Types.ObjectId(payloadData._id),
        isDeleted: false,
        profileUpdated: true
      }
    };
  } else {
    match = {
      $match: {
        isDeleted: false,
        profileUpdated: true
      }
    };
  }

  lookUp = {
    $lookup: {
      from: "hospitals",
      localField: "hospitalId",
      foreignField: "_id",
      as: "hospitalsData"
    }
  };

  unwindHospitals = {
    $unwind: {
      path: "$hospitalsData",
      preserveNullAndEmptyArrays: true
    }
  };

  lookup2 = {
    $lookup: {
      from: "treatments",
      localField: "_id",
      foreignField: "doctorId",
      as: "treatmentsData"
    }
  };

  let unwind2 = {
    $unwind: {
      path: "$treatmentsData",
      preserveNullAndEmptyArrays: true
    }
  };

  let matchData = {
    $match: {
      "treatmentsData.isDeleted": false
    }
  };

  let group = {
    $group: {
      _id: "$_id",
      profilePicture: {$first: "$profilePicture"},
      name: { $first: "$name"},
      gender: {$first: "$gender"},
      location: {$first: "$location"},
      address: {$first: "$address"},
      consultantFees: { $first: "$consultantFees"},
      education: {$first: "$education"},
      awards: {$first: "$awards"},
      languages: {$first: "$languages"},
      membership: {$first: "$membership"},
      speciality: {$first: "$speciality"},
      countryCode : { "$first": "$countryCode" },
      phoneNo: {$first: "$phoneNo"},
      alternateNumber: {$first: "$alternateNumber"},
      registrationNo: { $first: "$registrationNo"},
      about: {$first: "$about"},
      otp: {$first: "$otp"},
      otpVerify: {$first: "$otpVerify"},
      adminVerified: {$first: "$adminVerified"},
      profileUpdated: {$first: "$profileUpdated"},
      isDeleted: {$first: "$isDeleted"},
      createdAt: { $first: "$createdAt" },
      hospital: {$first: "$hospitalsData"},
      doctorVerified: {$first: "$doctorVerified"},
      treatments: {$push: "$treatmentsData"}
    }
  };

  let query = [
    match,
    lookUp,
    unwindHospitals,
    lookup2,
    unwind2,
    matchData,
    group
  ];
  let getDoctors = await DAO.aggregateData(Models.doctors, query);

  /* for(let i =0; i<getDoctors.length;i++) {
    let query = {doctorId : getDoctors[i]._id, isDeleted :false}
    let getTreatments = await DAO.getData(Models.treatments,query,{},{lean:true})
    getDoctors[i].treatments = getTreatments
  }*/

  return getDoctors;
};

const addLabTests = async (payloadData, userId) => {
  if (payloadData.labId) {
    let saveData = {
      labId: payloadData.labId,
      name: payloadData.name,
      description: payloadData.description,
      price: payloadData.price
    };
    let createLabTests = await DAO.saveData(Models.labTests, saveData);
    return createLabTests;
  } else {
    let saveData = {
      labId: userId,
      name: payloadData.name,
      description: payloadData.description,
      price: payloadData.price
    };
    let createLabTests = await DAO.saveData(Models.labTests, saveData);
    return createLabTests;
  }
};

const listLabs = async (payloadData, userId) => {
  let aggregate = [
    {
      $match: {
        isDeleted: false,
        profileUpdated: true
      }
    },
    {
      $lookup: {
        from: "labtests",
        localField: "_id",
        foreignField: "labId",
        as: "labTestsData"
      }
    },
    {
      $unwind: {
        path: "$labTestsData",
        preserveNullAndEmptyArrays: true
      }
    },
    {
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
        labTestsData: {$push: "$$ROOT"}
      }
    }
  ];
  let listLabs = await DAO.aggregateData(Models.labs, aggregate);
  return listLabs;
};

const checkData = async (payloadData) => {
  try {
    let query = {
     // countryCode : countryCode,
      phoneNo : payloadData.phoneNo,
      isDeleted : false,
      $or : [
        {profileUpdated : true},
        {adminVerified : true}
      ]
    };

    let checkHospital = await DAO.getData(Models.hospitals,query, {}, {lean: true});
    if (checkHospital.length) {
      throw ERROR.ALREADY_REGISTERED_AS_HOSPITAL;
    }
    console.log("=========================================query",query)
    let checkDoctor = await DAO.getData(Models.doctors,query, {}, {lean: true});
    console.log("=========================================checkDoctor",checkDoctor)
    if (checkDoctor.length) {
      throw ERROR.ALREADY_REGISTERED_AS_DOCTOR;
    }

    let checkLabs = await DAO.getData(Models.labs, query, {}, {lean: true});
    if (checkLabs.length) {
      throw ERROR.ALREADY_REGISTERED_AS_LABS;
    }

    let checkPharmecy = await DAO.getData(Models.pharmecy,query, {}, {lean: true});
    if (checkPharmecy.length) {
      throw ERROR.ALREADY_REGISTERED_AS_PHARMECY;
    }

    let checkAmbulance = await DAO.getData(Models.ambulance,query, {}, {lean: true});

    if (checkAmbulance.length) {
      throw ERROR.ALREADY_REGISTERED_AS_AMBULANCE;
    }
  } catch (err) {
    throw err;
  }
};



const generateOtp = () => {

  let otp = randomstring.generate({
      length: 4,
      charset: '123456789'
    });

    let otp2 =1234

    return otp2

}

const otpMessage = () => {
  let otp = generateOtp()
  let message = " otp is : " + otp
  return message
}

const pdfUpload = async(payloadData) => {
  try {


    let currentTime = moment().format("x")

    var s3 = new AWS.S3();
    const filePath = payloadData.file.path;
    const bucketName = 'digitalmenulist';
    const key = currentTime +'.pdf';

      const uploadFile = (filePath, bucketName, key) => {
              fs.readFile(filePath, (err, data) => {
                if (err) console.error(err);
                let fileData = fs.readFileSync(filePath)
                var params = {
                  Bucket: bucketName,
                  Key: key,
                  Body: fileData
                };
  
                s3.upload(params, (err, data) => {
                  if (err) console.error("Upload Error");
                  console.log('Upload Completed',data);
            
                });
              });
          };

  
      uploadFile(filePath, bucketName, key);

     let url = aws.s3BucketCredentials.s3URL + key;

     return url



  }
  catch(err) {
    throw err;
  }
}

const checkDatabase = async(payloadData) => {
  try {

    let query = {
      countryCode : payloadData.countryCode,
      phoneNo : payloadData.phoneNo,
      isDeleted : false,
      profileUpdated : false
      /*$or : [
        {profileUpdated : false},
        //{adminVerified : false}
      ]*/

    }

    let checkHospital = await DAO.getData(Models.hospitals, query, {}, {lean:true})
    if(checkHospital.length) {
      let condition = {_id : checkHospital[0]._id}
      let removeHospital = await DAO.remove(Models.hospitals, condition)
      console.log("==========================================removeHospital",removeHospital)
    }

    let checkDoctor = await DAO.getData(Models.doctors, query, {}, {lean:true})
    if(checkDoctor.length) {
      let condition = {_id : checkDoctor[0]._id}
      let removeDoctor = await DAO.remove(Models.doctors, condition)
      console.log("==========================================removeDoctor",removeDoctor)
    }

    let checkAmbulance = await DAO.getData(Models.ambulance, query, {}, {lean:true})
    if(checkAmbulance.length) {
      let condition = {_id : checkAmbulance[0]._id}
      let removeAmbulance = await DAO.remove(Models.ambulance, condition)
      console.log("==========================================removeAmbulance",removeAmbulance)
    }

    let checkPharmecy = await DAO.getData(Models.pharmecy, query, {}, {lean:true})
    if(checkPharmecy.length) {
      let condition = {_id : checkPharmecy[0]._id}
      let removePharmecy = await DAO.remove(Models.pharmecy, condition)
      console.log("==========================================removePharmecy",removePharmecy)
    }

  
    let checkLabs = await DAO.getData(Models.labs, query, {}, {lean:true})
    if(checkLabs.length) {
      let condition = {_id : checkLabs[0]._id}
      let removeLabs = await DAO.remove(Models.labs, condition)
      console.log("==========================================removeLabs",removeLabs)
    }

    
  }
  catch(err) {
    throw err;
  }
}


const checkData2 = async (payloadData,userId) => {
  try {
    let query = {
      _id : {$ne : userId},
      phoneNo : payloadData.phoneNo,
      isDeleted : false,
      $or : [
        {profileUpdated : true},
        {adminVerified : true}
      ]
    };

    let checkHospital = await DAO.getData(Models.hospitals,query, {}, {lean: true});
    if (checkHospital.length) {
      throw ERROR.ALREADY_REGISTERED_AS_HOSPITAL;
    }
    
    let checkDoctor = await DAO.getData(Models.doctors,query, {}, {lean: true});

    if (checkDoctor.length) {
      throw ERROR.ALREADY_REGISTERED_AS_DOCTOR; 
    }

    let checkLabs = await DAO.getData(Models.labs, query, {}, {lean: true});
    if (checkLabs.length) {
      throw ERROR.ALREADY_REGISTERED_AS_LABS;
    }

    let checkPharmecy = await DAO.getData(Models.pharmecy,query, {}, {lean: true});
    if (checkPharmecy.length) {
      throw ERROR.ALREADY_REGISTERED_AS_PHARMECY;
      
    }

    let checkAmbulance = await DAO.getData(Models.ambulance,query, {}, {lean: true});

    if (checkAmbulance.length) {
      throw ERROR.ALREADY_REGISTERED_AS_AMBULANCE;
      
    }
  } catch (err) {
    throw err;
  }
};


module.exports = {
  ambulanceProfile: ambulanceProfile,
  hospitalProfile: hospitalProfile,
  doctorProfile: doctorProfile,
  imageUpload: imageUpload,
  listDoctors: listDoctors,
  userProfile: userProfile,
  generateToken: generateToken,
  login: login,
  otpVerify: otpVerify,
  otpResend: otpResend,
  listData: listData,
  labsProfile: labsProfile,
  adminVerify: adminVerify,
  deleteData: deleteData,
  pharmecyProfile: pharmecyProfile,
  nearByAmbulance: nearByAmbulance,
  addLabTests: addLabTests,
  listLabs: listLabs,
  nearByHospital: nearByHospital,
  checkData: checkData,
  generateOtp : generateOtp,
  otpMessage : otpMessage,
  pdfUpload : pdfUpload,
  checkDatabase : checkDatabase,
  checkData2 : checkData2
};