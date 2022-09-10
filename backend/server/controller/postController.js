const Postdb = require("../model/postModel");


exports.createPost = async (req, res) => {
  try {
    if (!req.body.title || !req.body.url || !req.body.description) {
      return res.status(400).json({ return: "Failed", message: "field is missing" });
    }
    else {
      let newPost = new Postdb({
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        posted_by_username: req.user.username,
        like: req.body.like,
        comment: req.body.comment
      });
      await newPost.save();
      console.log(newPost)
      res.status(201).json({ "status": "Success", "message": "Posted Successfully" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message || "Error Occoured in  making post" })
  }

};

exports.readPost = async (req, res) => {
  try {
    const post = await Postdb.find();
    res.status(200).json(post);
  } catch (error) {
    console.log("err")
    res.status(500).json(error)
  }
}

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  if (req.user.username === Postdb.findById(id).posted_by_username) {
    return res.status(500).json({ "status": "failed", "message": error.message || "Unauthorized Owner" });
  }
  else {
    Postdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(400).json({ "status": "failed", message: `Cannot Update post with ${id} maybe post cannot found!` })
        }
        else {
          res.json(data)
        }
      })
      .catch(err => {
        res.status(500).json({ "status": "failed", message: "Error Occoured in Update user" })
      })
  }
}

exports.deletePost = async (req, res) => {
  const id = req.params.id;
  if (req.user.username === Postdb.findById(id).posted_by_username) {
    return res.status(500).json({ "status": "failed", "message": error.message || "Unauthorized Owner" });
  }
  else{
    Postdb.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).json({ message: `cannot delete Post with id ${id} maybe id is wrong` })
      } else {
        res.json({"status": "success", message: "Post Deleted succesfully!" })
      }
    })
    .catch(err => {
      res.status(500).json({"status": "failed", message: `Error occour in delete User with id = ${id}` })
    })
  }
}

exports.likeUnlike = async (req, res) => {
  try {
    const post = await Postdb.findById(req.params.id);
    if (!post) {
      return res.status(404).json({"statuse":"failed", message: "post not found" })
    }
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({"statuse":"success" ,message: "post unliked", post })
    }
    else {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).json({"statuse":"success" ,message: "post liked", post })
    }
  } catch (error) {
    res.status(500).json({"status": "failed", message: error.message || "Error occoured in like or unlike" })
  }
};

exports.postComment = async (req, res) => {
  try {
    if (req.body.comment) {
      const post = await Postdb.findById(req.params.id);
      if (!post) {
        return res.status(404).json({"statuse":"failed", message: "post not found" })
      }
      else {
        post.comments.push({ user: req.user._id, comment: req.body.comment })
        await post.save();
        return res.status(200).json({"statuse":"success" , message:"commented on post", post })
      }
    } else {
      res.status(406).json({"statuse":"failed", message: "comment is required" })
    }

  } catch (error) {
    res.status(500).json({"status": "failed", message: error.message || "Error occoured in making comment to a post" })
  }
}