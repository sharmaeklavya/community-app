const jwt = require("jsonwebtoken");
const UserCollection = require("./userSchema");

// ******** jsonwebtoken authentication ******* //
// ******************************************** //

const signedJWT = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: "20s" });
};

// ******** refresh token ******* //
// ******************************************** //

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.SSID;
  console.log(refreshToken);
  if (refreshToken === null) return res.sendStatus(401);

  const userExists = await UserCollection.findOne({
    refreshToken: refreshToken,
  });

  if (!userExists) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = signedJWT({ email: user.email, _id: user._id });
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  });
};

// ******** user Authentication ******* //
// ******************************************** //

const userAuth = async (req, res, next) => {
  const authHeader = await req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];

  if (!refreshToken) res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    if (err) res.sendStatus(401);
    req.user = user;
  });
  next();
};

module.exports = { signedJWT, refreshToken, userAuth };
