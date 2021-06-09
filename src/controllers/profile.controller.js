const bcrypt = require("bcrypt");

const User = require("../models/user.model");

let bcryptSalt = process.env.BCRYPT_SALT;

const getProfile = (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    user.hashPassword = undefined;
    return res.json(user);
  });
};

const updateProfile = (req, res) => {
  req.body.hashPassword = undefined;
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, omitUndefined: true },
    (err, user) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      user.hashPassword = undefined;
      return res.json(user);
    }
  );
};

const updatePassword = (req, res) => {
  if (!req.body.newPassword) {
    return res.status(400).send({ message: "New password is required" });
  }

    let hashPassword = bcrypt.hashSync(req.body.newPassword, Number(bcryptSalt));

  User.findByIdAndUpdate(
    req.user._id,
    {hashPassword:hashPassword},
    { new: true, omitUndefined: true },
    (err, user) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      user.hashPassword = undefined;
      return res.json(user);
    }
  );
};

const deleteProfile = (req, res) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    return res.json({ message: `Sucess delete user ${user._id}` });
  });
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
};
