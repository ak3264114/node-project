const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username :{
        type : String,
        require: true,
        unique : true
    },
    email :{
        type : String,
        require: true,
        unique : true
    },
    password : {
        type : String,
        require: true
    },
    status : String
})
const Userdb = mongoose.model('userdb', userSchema);

module.exports = Userdb;
