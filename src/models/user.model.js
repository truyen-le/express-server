const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: "Enter a firstname",
  },
  lastName: {
    type: String,
    required: "Enter a lastname",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

const User = mongoose.model("user", UserSchema);

module.exports = { User };
