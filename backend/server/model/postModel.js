const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title :{
        type : String,
        require: true,
    },
    url :{
        type : String,
        require: true,
    },
    description : {
        type : String,
    },
    posted_by_username :{
        type : String,
        require : true,
    },
    likes :[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ],
    comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          comment:{
            type: String,
            
          },
        },
      ],
    draft :{
        type : Boolean,
        default : false,
    }
})
const Postdb = mongoose.model('postdb', postSchema);

module.exports = Postdb;
