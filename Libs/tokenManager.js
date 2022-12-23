
const Jwt = require('jsonwebtoken'),
    Config = require('../Config'),
    DAO = require('../DAOManager').queries,
    Models = require('../Models/'),
    UniversalFunctions = require('../Utils/UniversalFunctions'),
    _ = require('lodash')
    ERROR = Config.responseMessages.ERROR;

var generateToken = function(tokenData,userType) {
    return new Promise((resolve, reject) => {
        try {
           let secretKey;
            switch(userType){
                case Config.APP_CONSTANTS.SCOPE.ADMIN:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_ADMIN;
                    break;
                case Config.APP_CONSTANTS.SCOPE.USER:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_USER;
                    break;
                case Config.APP_CONSTANTS.SCOPE.AMBULANCE:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_AMBULANCE;
                    break;
                case Config.APP_CONSTANTS.SCOPE.HOSPITAL:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_HOSPITAL;
                    break;
                case Config.APP_CONSTANTS.SCOPE.DOCTOR:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_DOCTOR;
                    break;
                case Config.APP_CONSTANTS.SCOPE.PHARMECY:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_PHARMECY;
                    break;
                case Config.APP_CONSTANTS.SCOPE.LABS:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_LABS;
                    break;
            }
            

         //   console.log("........tokenData...........",tokenData);
            let token = Jwt.sign(tokenData, secretKey);
         //    console.log("=======secretKey==========",token,secretKey)

            return resolve(token);
        } catch (err) {
            return reject(err);
        }
    });
};


var verifyToken = async function verifyToken(tokenData) {

    
   // console.log("============tokenData================",tokenData);
    var user;

        let query = {
            _id : tokenData._id,
            accessToken : {$ne:null},
            time : tokenData.time
        }

         if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.ADMIN){
            user = await DAO.getData(Models.admins,query,{__v : 0},{lean : true});
            //console.log("..+++++++++++++++++++.user..******************............",user);
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
         }
         
        else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.USER){
            user = await DAO.getData(Models.users,{_id: tokenData._id},{__v : 0},{lean : true});
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
            if(!(user[0].otpVerify==true))
            {
                throw UniversalFunctions.sendError('en', ERROR.OTP_NOT_VERIFIED);
            }
            
        }

        else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.AMBULANCE){
            user = await DAO.getData(Models.ambulance,{_id: tokenData._id},{__v : 0},{lean : true});
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
            if(!(user[0].otpVerify == true))
            {
                throw UniversalFunctions.sendError('en', ERROR.OTP_NOT_VERIFIED);
            }

            
       }

      else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.HOSPITAL){
            user = await DAO.getData(Models.hospitals,{_id: tokenData._id},{__v : 0},{lean : true});
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
            if(!(user[0].otpVerify == true))
            {
                throw UniversalFunctions.sendError('en', ERROR.OTP_NOT_VERIFIED);
            }

            
       }

      else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.DOCTOR){
            user = await DAO.getData(Models.doctors,{_id: tokenData._id},{__v : 0},{lean : true});
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
            if(!(user[0].otpVerify == true))
            {
                throw UniversalFunctions.sendError('en', ERROR.OTP_NOT_VERIFIED);
            }

            
       }

       else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.PHARMECY){
        user = await DAO.getData(Models.pharmecy,{_id: tokenData._id},{__v : 0},{lean : true});
        if(!(user.length)){
            throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
        }
        if(!(user[0].otpVerify == true))
        {
            throw UniversalFunctions.sendError('en', ERROR.OTP_NOT_VERIFIED);
        }

        
      }

    else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.LABS){
        user = await DAO.getData(Models.labs,{_id: tokenData._id},{__v : 0},{lean : true});
        if(!(user.length)){
            throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
        }
        if(!(user[0].otpVerify == true))
        {
            throw UniversalFunctions.sendError('en', ERROR.OTP_NOT_VERIFIED);
        }

        
    }


        console.log(JSON.stringify(user), JSON.stringify(tokenData));


        if(user.length === 0) throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
    
        else if(user && user[0] ) {
            user[0].scope =tokenData.scope;
            return {
                isValid: true,
                credentials: user[0]
            };
        }
       
};

module.exports={
    generateToken:generateToken,
    verifyToken:verifyToken,
};