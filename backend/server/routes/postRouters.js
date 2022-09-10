const express = require("express");
const route = express.Router()
const controller = require('../controller/postController');
const { checkuserauth } = require("../middlewares/auth-middleware");


route.use('/create-post' , checkuserauth)
route.use('/update-post' , checkuserauth)
route.use('/delete-post' , checkuserauth)
route.use('/like-unlike', checkuserauth)
route.use('/comment', checkuserauth)


// api for  post
 
// create
route.post('/create-post', controller.createPost)
// Update
route.put('/update-post/:id', controller.updatePost)
// delete
route.delete('/delete-post/:id', controller.deletePost)

// get
route.get('/all-post', controller.readPost)



// like
route.post('/like-unlike/:id', controller.likeUnlike)
//comment
route.post('/comment/:id', controller.postComment)




module.exports = route