const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  hashPassword: {
    type: String,
    required: [true, "Password is required to register"],
  },
  firstName: {
    type: String,
    // required: "Enter a firstname",
  },
  lastName: {
    type: String,
    // required: "Enter a lastname",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required to register"],
    lowercase: true,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
  if (!password) {
    return false;
  }
  return bcrypt.compareSync(password, hashPassword);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
