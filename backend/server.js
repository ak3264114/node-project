const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./server/database/conection')
const app = express();
const path = require('path')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());



dotenv.config({path : 'config.env'})
const PORT = process.env.PORT ||8080


connectDB();

// load routes 
app.use('/api', require('./server/routes/router'))
app.use('/api/post', require('./server/routes/postRouters'))
app.listen(PORT, ()=> {console.log(`listing on port  localhost:${PORT}`)})