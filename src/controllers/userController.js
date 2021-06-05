var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var { UserSchema } = require("../models/userModel");

const User = mongoose.model("User", UserSchema);

const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized user!" });
  }
};

const login = (req, res) => {
  User.findOne(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res
          .status(401)
          .send({ message: "Authentication failed. User does not exist" });
      }
      if (!user.comparePassword(req.body.password, user.hashPassword)) {
        res
          .status(401)
          .send({ message: "Authentication failed. Incorrect password" });
      }
      user.hashPassword = undefined;
      res.json({
        user: user,
        token: jwt.sign(
          { username: user.username, email: user.email, _id: user.id },
          "ichigorg"
        ),
      });
    }
  );
};

const register = (req, res) => {
  let newUser = User(req.body);
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newUser.save((err, user) => {
    if (err) {
      res.status(400).send({ message: err });
    }
    user.hashPassword = undefined;
    res.json(user);
  });
};

const getUsers = (req, res) => {
  User.find({}, { hashPassword: 0 }, (err, user) => {
    if (err) {
      res.status(400).send({ message: err });
    }
    res.json(user);
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(400).send({ message: err });
    }
    res.json(user);
  });
};

const updateUserById = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true }, (err, user) => {
    if (err) {
      res.status(400).send({ message: err });
    }
    res.json(user);
  });
};

const deleteUserById = (req, res) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      res.status(400).send({ message: err });
    }
    res.json({ message: `Sucess delete user ${req.params.id}` });
  });
};

module.exports = {
  loginRequired,
  login,
  register,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
