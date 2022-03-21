const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signedJWT } = require("../model/authentication");
const UserCollection = require("../model/userSchema");

// ******** Handling Schema errors ************ //
// ******************************************** //

const handleErrors = (err) => {
  const errors = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
    email: "",
  };
  if (err.code === 11000) {
    errors.email = "User email already exists.";
    errors.phoneNumber = "Phone number already exists.";
    return errors;
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// ******** User Registration ***************** //
// ******************************************** //

module.exports.register = async (req, res) => {
  try {
    // destructing registration form fields
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      city,
      state,
      pinCode,
      phoneNumber,
      email,
      password,
    } = req.body;

    //Check if user already register with this email
    const userExists = await UserCollection.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });

    if (userExists)
      return res.status(409).json("User email/ phone number already exists.");

    // hashing user password
    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 11) : "";

    // submitting new user to the database
    const userCreated = await UserCollection.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      city,
      state,
      pinCode,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    // if above opertion is successful sends a green signal
    if (userCreated) {
      res.status(200).json("User registered successfully.");
    } else {
      res.status(400).json("Internal Server Error. Please try again.");
    }

    // if any errors, log them
  } catch (err) {
    const errors = handleErrors(err);
    console.error(errors);
    res.status(500).json(errors);
  }
};

// ******** User Login ************************ //
// ******************************************** //

module.exports.login = async (req, res) => {
  try {
    // checking if user exists in the database
    const userExists = await UserCollection.findOne({
      email: req.body.email,
    });

    if (userExists) {
      // checking if the given password matches with the user password
      const isPassValid = await bcrypt.compare(
        req.body.password,
        userExists.password
      );
      // proceeding further and creating a jwt token
      if (isPassValid) {
        const user = {
          _id: userExists._id,
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          email: userExists.email,
        };
        const accessToken = signedJWT(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, {
          expiresIn: "1h",
        });
        // saving refresh token in the database
        await UserCollection.updateOne(
          { email: req.body.email },
          { $set: { refreshToken: refreshToken } }
        );
        // setting up a cookie in the browser
        res.cookie("__SSID", refreshToken, {
          httpOnly: true,
          path: "/api/auth/refreshtoken",
          sameSite: "Strict",
          secure: true,
          expires: new Date(Date.now() + 3600000),
        });
        // sending Access and Refresh Tokens
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
        // else user has entered a wrong password
      } else {
        res.status(401).json("Invalid password. Please try again.");
      }
    } else {
      res.status(401).json("User email doesn't exist. Please register first.");
    }
    // if any errors, log them
  } catch (err) {
    const errors = handleErrors(err);
    console.error(errors);
    res.status(500).json(errors);
  }
};

// ******** User logout ***************** //
// ******************************************** //

module.exports.logout = async (req, res) => {
  try {
    // deleting refreshtoken from the database
    const tokenDeleted = await UserCollection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $unset: { refreshToken: 1 } }
    );
    if (tokenDeleted) {
      // clearing cookies from the browser
      res.clearCookie("SSID");
      // success message
      res.status(200).json({ message: "Logged out successfully." });
    }
    // if any errors, log them
  } catch (err) {
    const errors = handleErrors(err);
    console.error(errors);
    res.status(500).json(errors);
  }
};
