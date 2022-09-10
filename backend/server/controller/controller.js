var Userdb = require('../model/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: 'config.env' })


// create and save new user

exports.register = async (req, res) => {
    console.log(req.body)
    try {
        const { username, email, password, status } = req.body;
        if (!req.body || !username || !email || !password || !status) {
            return res.status(400).json({ return: "Failed", message: "field is missing" });
        }
        Userdb.findOne({ username: username }, async (err, result) => {
            if (result) {
                res.status(406).send({ "message": "username Already taken! Try another one" });
            } else {
                Userdb.findOne({ email: email }, async (err, result) => {
                    if (result) {
                        res.status(406).send({ "message": "email Already taken! Try another one" });
                    } else {
                        const salt = await bcrypt.genSalt(12)
                        const hashpass = await bcrypt.hash(password , salt)
                        let data = new Userdb({
                            username: req.body.username,
                            email: req.body.email,
                            password: hashpass,
                            status: req.body.status
                        });
                        await data.save();
                        const saved_user = await Userdb.findOne({email:email})
                        const token  = jwt.sign({userID : saved_user._id},
                        process.env.JWT_SECRET_KEY , {expiresIn : '10d'})
                        res.status(201).json({"status": "Success","message": "Registrain Successfully", "token":token });
                    }
                });
            };
        });
    } catch (error) {
        res.status(500).json({message: error.message || "Error Occoured in registiring user"})

    }
}



exports.login = async (req, res) => {
    try {
        const { username , password} = req.body;
        if (username !=" " & password !=""){
            const user = await Userdb.findOne({username : username})
            if ( user != null){
                ismatch  = await bcrypt.compare(password , user.password)
                if(ismatch && user.username == username){
                    const token  = jwt.sign({userID : user._id},
                    process.env.JWT_SECRET_KEY , {expiresIn : '10d'})
                    res.status(200).json({"status":"succes", "message": "user login successfully", "token":token})
                }
                else{
                    res.status(500).json({"message": "username or password is wrong"})
                }
            }else{
                res.status(404).json({"message": "user not found"})
            }
        }
        else{
            res.status(400).json({"message": "Data Cannot ne empty"})
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ "message": "An error occured in login a user" });
    }

};



exports.forgotPasswordmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
        const user = await Userdb.findOne({ email: email })
        if (user) {
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '10m' })
            const link = `http://127.0.0.1:3005/api/verifypassword/${user._id}/${token}`
            console.log(link)

            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Reset your Password",
                html: `<a href = ${link}>click here <a/>to reset your password `
            })
            res.status(200).json({ "status": "succes", "message": "Email sent to your mail id", "info": info })
        }
        else {
            res.status(400).json({ "message": "User does not exist with this email" })
        }
    }
    else {
        res.status(400).json({ "message": "email Cannot be empty" })
    }
};

exports.passwordreset = async (req ,res)=>{
    const {password , confirm_password} = req.body
    const{id , token} = req.params
    const user = await Userdb.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
        jwt.verify(token , new_secret)
        if(password && confirm_password){
            if(password !== confirm_password){
                res.status(400).json({"message":"new password and confirm password doesnot match"})
            }
            else{
                const salt = await bcrypt.genSalt(12)
                const hashpass = await bcrypt.hash(password , salt)
                await Userdb.findByIdAndUpdate(user._id , {$set:{ password : hashpass }})
                res.status(200).json({"message":"password reset successfully"})
            }
        }
        else{
            res.status(400).json({"message":"Password and Confirm Password Cannot be empty"})   
        }
    } catch (error) {
        res.status(500).json({"message": error.message ||"error Occoured in verifing user"})
    }
}


exports.changepassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
        if (password !== confirm_password) {
            res.status(400).json({ "message": "new password and confirm password doesnot match" })
        }
        else {
            const salt = await bcrypt.genSalt(12)
            const hashpass = await bcrypt.hash(password, salt)
            res.status(200).json({ "message": "password changed successfully" })
            await Userdb.findByIdAndUpdate(req.user._id, { $set: { password: hashpass } })
        }
    }
    else {
        res.status(400).json({ "message": "Password and Confirm Password Cannot be empty" })
    }
}

exports.loggeduser = (req, res) => {
    res.status(200).json(req.user.username)
}

