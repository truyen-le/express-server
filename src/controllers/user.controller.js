const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const Token = require("../models/token.model");

let JWT_SECRET = process.env.JWT_SECRET;
let bcryptSalt = process.env.BCRYPT_SALT;

const loginRequired = (req, res, next) => {
  if (req.user) {
    Token.findOne({ userId: req.user._id, token: req.token }, (err, token) => {
      if (err) {
        return res.status(401).json({ message: err });
      } else if (!token) {
        return res.status(401).json({ message: "Session expired. Please login again!" });
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};

const login = (req, res) => {
  User.findOne(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },
    (err, user) => {
      if (err) {
        return res.status(401).send({ message: err });
      }
      if (!user) {
        return res
          .status(401)
          .send({ message: "Authentication failed. User does not exist" });
      }
      if (!user.comparePassword(req.body.password, user.hashPassword)) {
        return res
          .status(401)
          .send({ message: "Authentication failed. Incorrect password" });
      }

      let token = Token({
        userId: user._id,
        token: jwt.sign(
          { username: user.username, email: user.email, _id: user.id },
          JWT_SECRET
        ),
      });

      token.save();

      user.hashPassword = undefined;
      return res.json({
        user: user,
        token: token.token,
      });
    }
  );
};

const register = async (req, res) => {
  let oldUser = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (oldUser) {
    return res
      .status(400)
      .send({ message: "Email or user already registered" });
  }

  let newUser = User(req.body);

  newUser.hashPassword = bcrypt.hashSync(req.body.password, Number(bcryptSalt));
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    user.hashPassword = undefined;
    return res.json(user);
  });
};

const getUsers = (req, res) => {
  User.find({}, { hashPassword: 0 }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    return res.json(user);
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    return res.json(user);
  });
};

const updateUserById = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    return res.json(user);
  });
};

const deleteUserById = (req, res) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    return res.json({ message: `Sucess delete user ${req.params.id}` });
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
