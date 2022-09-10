const express = require("express");
const route = express.Router()
const controller = require('../controller/controller');
const { checkuserauth } = require("../middlewares/auth-middleware");

// middleware 
route.use('/change-password' , checkuserauth)
route.use('/loggeduser' , checkuserauth)

// auth api

route.post('/signup', controller.register)
route.post('/login', controller.login)
route.post('/forgot-password', controller.forgotPasswordmail)
route.post('/verifypassword/:id/:token', controller.passwordreset)

// protacted route 
route.get('/loggeduser', controller.loggeduser)
route.post('/change-password', controller.changepassword)



module.exports = route