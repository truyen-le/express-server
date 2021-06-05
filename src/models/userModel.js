var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
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
    lowercase: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = { UserSchema };
