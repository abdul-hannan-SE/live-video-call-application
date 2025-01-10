const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
require("dotenv").config();
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "username must be unique"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email must be unique"],
    trim: true,
  },
  password: { type: String, required: true },
  avatar: {
    type: String, // imgbb url (imgbb a free image hosting website)
    required: true,
  },
  refreshToken: { type: String },
});

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});
// Custom error message middleware

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    const customMessage = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists. Please choose another.`;
    throw new ApiError(409, customMessage, "_", "_", false);
  } else {
    next(); // Pass other errors to the next middleware
  }
});

userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "1d",
  });
};
module.exports = mongoose.model("User", userSchema);
