const apiKey = "227030Aj4BIXWMMo45dbacc9f";
const senderId = "DAKTRZ";
const country = "91"
const route = "4";

// var msg91 = require("msg91")(apiKey,senderId,country,route);

// const sendSms =  (mobileNo,message) => {
//     msg91.send(mobileNo, message, function(err, response){
//         console.log(err);
//         console.log(response);
//     });
// }

var http = require("https");

var options = {
  "method": "POST",
  "hostname": "api.msg91.com",
  "port": null,
  "path": "/api/v2/sendsms",
  "headers": {
    "authkey": "$authentication_key",
    "content-type": "application/json"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ sender: 'SOCKET',
  route: '4',
  country: '91',
  sms: 
   [ { message: 'Message1', to: [ '98260XXXXX', '98261XXXXX' ] },
     { message: 'Message2', to: [ '98260XXXXX', '98261XXXXX' ] } ] }));
req.end();

 
module.exports={
    // sendSms : sendSms,

};

