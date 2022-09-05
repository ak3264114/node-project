const express = require("express");
const route = express.Router()
const controller = require('../controller/controller')



// // api for  user
 
route.post('/signup', controller.register)
route.post('/login', controller.login)
route.post('/forgot-password', controller.forgotPasswordmail)
route.post('/verifypassword/:id/:token', controller.passwordreset)



module.exports = route