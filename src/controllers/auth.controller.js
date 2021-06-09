const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Auth = require("../models/auth.model");

let JWT_SECRET = process.env.JWT_SECRET;
let bcryptSalt = process.env.BCRYPT_SALT;

const loginRequired = (req, res, next) => {
  if (req.user) {
    Auth.findOne({ userId: req.user._id, token: req.token }, (err, auth) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      if (!auth) {
        return res
          .status(401)
          .json({ message: "Session expired. Please login again!" });
      }
      User.findById(auth.userId, (err, user) => {
        if (err) {
          return res.status(401).json({ message: err.message });
        }
        if (!user) {
          return res.status(401).json({ message: "Invalid access" });
        }
        next();
      });
    });
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};

const login = (req, res) => {
  let query = [];
  if (req.body.email) {
    query.push({ email: req.body.email });
  }
  if (req.body.username) {
    query.push({ username: req.body.username });
  }
  User.findOne({ $or: query }, (err, user) => {
    if (err) {
      return res.status(401).send({ message: err.message });
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

    let token = Auth({
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
  });
};

const register = async (req, res) => {
  let newUser = User(req.body);

  if (req.body.password) {
    newUser.hashPassword = bcrypt.hashSync(
      req.body.password,
      Number(bcryptSalt)
    );
  }

  newUser.save((err, user) => {
    if (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        return res
          .status(400)
          .send({ message: "username or email is already registered" });
      }
      return res.status(400).send({ message: err.message });
    }
    user.hashPassword = undefined;
    return res.json(user);
  });
};

module.exports = {
  loginRequired,
  login,
  register,
};
