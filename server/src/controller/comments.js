const { ObjectId } = require("mongodb");
const CommentCollection = require("../model/commentSchema");
const PostCollection = require("../model/postSchema");
const UserCollection = require("../model/userSchema");
// ******** Handling Schema errors ************ //
// ******************************************** //

const handleErrors = (err) => {
  const errors = {
    userId: "",
    postId: "",
    commentDesc: "",
  };
  if (err.code === 11000) {
    errors.commentDesc = "Comment already exists.";
    return errors;
  }
  if (err.message.includes("comments validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// ******** add a new comment to database ************ //
// ******************************************** //

module.exports.addcomment = async (req, res) => {
  try {
    const user = req.user;

    // submitting new meal to the database
    const commentAdded = await CommentCollection.create({
      userId: user._id,
      postId: req.body.postId,
      commentDesc: req.body.commentDesc,
    });

    // if above opertion is successful send a green signal
    if (commentAdded) {
      await UserCollection.updateOne(
        { _id: ObjectId(user._id) },
        {
          $push: {
            comments: {
              $each: [{ _id: commentAdded._id }],
              $position: 0,
            },
          },
        }
      );

      await PostCollection.updateOne(
        { _id: ObjectId(req.body.postId) },
        {
          $push: {
            comments: {
              $each: [{ _id: commentAdded._id }],
              $position: 0,
            },
          },
        }
      );

      res.status(200).json("Comment added successfully");
    } else {
      res.status(400).json("Comment could not be added");
    }

    // if any errors, log them
  } catch (err) {
    const errors = handleErrors(err);
    console.error(errors);
    res.status(500).json(errors);
  }
};

// ******** delete a new comment to database ************ //
// ******************************************** //

module.exports.deletecomment = async (req, res) => {
  // try {
  //   const user = req.user;
  //   // submitting new meal to the database
  //   const commentAdded = await CommentCollection.create({
  //     userId: user._id,
  //     postId: req.body.postId,
  //     commentDesc: req.body.commentDesc,
  //   });
  //   // if above opertion is successful send a green signal
  //   if (commentAdded) {
  //     await UserCollection.updateOne(
  //       { _id: ObjectId(user._id) },
  //       {
  //         $push: {
  //           comments: {
  //             $each: [{ _id: commentAdded._id }],
  //             $position: 0,
  //           },
  //         },
  //       }
  //     );
  //     await PostCollection.updateOne(
  //       { _id: ObjectId(req.body.postId) },
  //       {
  //         $push: {
  //           comments: {
  //             $each: [{ _id: commentAdded._id }],
  //             $position: 0,
  //           },
  //         },
  //       }
  //     );
  //     res.status(200).json("Comment added successfully");
  //   } else {
  //     res.status(400).json("Comment could not be added");
  //   }
  //   // if any errors, log them
  // } catch (err) {
  //   const errors = handleErrors(err);
  //   console.error(errors);
  //   res.status(500).json(errors);
  // }
};
