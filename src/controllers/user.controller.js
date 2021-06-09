const User = require("../models/user.model");

const getUsers = (req, res) => {
  let limit;
  let skip;
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  if (req.query.page) {
    skip = (parseInt(req.query.page) - 1) * limit;
  }
  User.find(
    {},
    { hashPassword: 0 },
    { skip: skip, limit: limit },
    (err, users) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      return res.json(users);
    }
  );
};

const getUserById = (req, res) => {
  User.findById(req.params.id, { hashPassword: 0 }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    return res.json(user);
  });
};

module.exports = {
  getUsers,
  getUserById,
};
