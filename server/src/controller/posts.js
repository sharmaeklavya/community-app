const { ObjectId } = require("mongodb");
const UserCollection = require("../model/userSchema");
const PostCollection = require("../model/postSchema");
const CommentCollection = require("../model/commentSchema");
// ******** Handling Schema errors ************ //
// ******************************************** //

const handleErrors = (err) => {
  const errors = {
    userId: "",
    postTitle: "",
    postDesc: "",
  };
  if (err.code === 11000) {
    errors.postTitle = "Post title already exists";
    return errors;
  }
  if (err.message.includes("posts validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// ******** create a new post ***************** //
// ******************************************** //

module.exports.createpost = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.sendStatus(401);

    // destructing form fields
    const { postTitle, postDesc } = req.body;

    const newPost = {
      userId: ObjectId(user._id),
      postTitle,
      postDesc,
    };

    const postCreated = await PostCollection.create(newPost);

    if (!postCreated) return res.sendStatus(400);

    const postIdUpdate = await UserCollection.updateOne(
      { _id: ObjectId(user._id) },
      {
        $push: {
          posts: {
            $each: [{ _id: postCreated._id }],
            $position: 0,
          },
        },
      }
    );

    if (!postIdUpdate) res.sendStatus(400);
    else res.status(200).json(postCreated);

    // if any errors, log them
  } catch (err) {
    const errors = handleErrors(err);
    console.error(errors);
    res.status(500).json(errors);
  }
};

// ***************** ALl posts ***************** //
// ******************************************** //

module.exports.allposts = async (req, res) => {
  try {
    const posts = await PostCollection.find({});

    if (posts.length > 0) {
      const allPosts = await Promise.all(
        posts.map(async (post) => {
          const user = await UserCollection.find(
            { _id: post.userId },
            { firstName: 1, lastName: 1, _id: 0 }
          );

          const [{ firstName, lastName }] = user;

          const comments = await CommentCollection.find({
            postId: post._id,
          });

          const allComments = await Promise.all(
            comments.map(async (comment) => {
              const user = await UserCollection.find(
                { _id: ObjectId(comment.userId) },
                { firstName: 1, lastName: 1, _id: 0 }
              );

              const [{ firstName, lastName }] = user;

              return {
                userId: comment.userId,
                postId: comment.postId,
                commentDesc: comment.commentDesc,
                commentCreatedBy: firstName + " " + lastName,
                commentCreatedOn: comment.createdOn,
              };
            })
          );

          return {
            _id: post._id,
            userId: post.userId,
            postTitle: post.postTitle,
            postDesc: post.postDesc,
            postCreatedBy: firstName + " " + lastName,
            postCreatedOn: post.createdOn,
            comments: allComments,
          };
        })
      );

      res.status(200).json(allPosts);
    } else res.status(404).json("No posts found");

    // if any errors, log them
  } catch (err) {
    const errors = handleErrors(err);
    console.error(errors);
    res.status(500).json(err.message);
  }
};

// ******** delete a post ***************** //
// ******************************************** //

module.exports.deletepost = async (req, res) => {
  try {
    const user = req.user;
    const { _id } = req.body;

    if (!user) return res.status(401).json("Unauthorized access");

    const userExists = await UserCollection.updateOne(
      { _id: ObjectId(user._id) },
      { $pull: { posts: { _id: _id } } }
    );

    if (!userExists) return res.status(400).json("Couldn't be deleted");

    const deletePost = await PostCollection.deleteOne({ _id });

    if (!deletePost) res.sendStatus(400);
    else res.status(200).json(deletePost);

    // if any errors, log them
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};
