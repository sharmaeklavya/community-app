const mongoose = require("mongoose");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter first name"],
  },
  lastName: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter last name"],
  },
  dateOfBirth: {
    type: Date,
    trim: true,
    required: [true, "Please enter a valid DOB"],
  },
  gender: {
    type: String,
    trim: true,
    enum: ["she", "he", "they"],
    required: [true, "Please select a gender"],
  },
  city: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter city name"],
  },
  state: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter state name"],
  },
  pinCode: {
    type: Number,
    trim: true,
    minLength: [6, "PinCode should not be less than 6 digits"],
    maxlength: [6, "PinCode should not be greater than 6 digits"],
    required: [true, "Please enter correct pin code"],
  },
  phoneNumber: {
    type: Number,
    trim: true,
    unique: [true, "User phone number already exists"],
    minLength: [10, "PinCode should not be less than 10 digits"],
    maxlength: [10, "PinCode should not be greater than 10 digits"],
    required: [true, "Please enter correct phone number"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, "User email already exists"],
    validate: [isEmail, "Please enter a valid email"],
    required: [true, "Please enter your email"],
  },
  password: {
    type: String,
    trim: true,
    minLength: [6, "Password should not be less than 6 characters"],
    required: [true, "Please enter a valid password"],
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  posts: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        trim: true,
      },
    },
  ],
  comments: [
    {
      commentId: {
        type: mongoose.Types.ObjectId,
        trim: true,
      },
    },
  ],
  refreshToken: {
    type: String,
    trim: true,
  },
  randomString: {
    type: String,
    trim: true,
  },
});

const UserCollection = mongoose.model("users", userSchema);

module.exports = UserCollection;
