const User = require("../models/user.model");

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
  User.findByIdAndUpdate(req.user._id, req.body, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    user.hashPassword = undefined;
    return res.json(user);
  });
};

const deleteProfile = (req, res) => {
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (!user.comparePassword(req.body.password, user.hashPassword)) {
      return res
        .status(401)
        .send({ message: "Authentication failed. Incorrect password" });
    }
    return res.json({ message: `Sucess delete user ${user._id}` });
  });
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
