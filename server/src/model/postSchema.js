const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  postTitle: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  postDesc: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  comments: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        trim: true,
      },
    },
  ],
});

const PostCollection = mongoose.model("posts", postSchema);

module.exports = PostCollection;
