const router = require("express").Router();
const { register, login, logout } = require("../controller/users");
const { addcomment, deletecomment } = require("../controller/comments");
const { createpost, allposts, deletepost } = require("../controller/posts");
const { userAuth, refreshToken } = require("../model/authentication");

// user collection
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);
// router.post("/api/auth/updatePassword", updatepassword);
// router.post("/api/auth/resetPassword", resetpassword);

// post collection
router.post("/api/posts/createpost", userAuth, createpost);
router.post("/api/posts/deletepost", userAuth, deletepost);
router.get("/api/posts/allposts", allposts);

// comment collection
router.post("/api/posts/addcomment", userAuth, addcomment);
router.post("/api/posts/deletecomment", userAuth, deletecomment);

// refresh token
router.post("/api/auth/refreshtoken", refreshToken);

module.exports = router;
