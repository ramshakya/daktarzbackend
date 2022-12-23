
var admin = require('./adminRoutes');
var ambulance = require('./ambulanceRoutes');
var hospital = require('./hospitalRoutes');
var doctor = require('./doctorRoutes');
var upload = require('./uploadImagesRoutes');
var users = require('./userRoutes');
var pharmecy = require('./pharmecyRoutes');
var labs = require('./labsRoutes');
var all = [].concat(
    admin, 
    ambulance, 
    hospital, 
    doctor, 
    upload, 
    users, 
    pharmecy,
    labs
);
module.exports = all;

