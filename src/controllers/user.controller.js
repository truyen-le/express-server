const User = require("../models/user.model");

const getUsers = (req, res) => {
  User.find({}, { hashPassword: 0 }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    return res.json(user);
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    return res.json(user);
  });
};

const updateUserById = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    return res.json(user);
  });
};

const deleteUserById = (req, res) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    return res.json({ message: `Sucess delete user ${req.params.id}` });
  });
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
