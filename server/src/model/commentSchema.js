const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    trim: true,
    required: true,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    trim: true,
    required: true,
  },
  commentDesc: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const CommentCollection = mongoose.model("comments", commentSchema);

module.exports = CommentCollection;
