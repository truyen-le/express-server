var express = require('express');

const {
  getUsers,
  getUserById,
} = require("../controllers/user.controller");

const { loginRequired } = require("../controllers/auth.controller");

var router = express.Router();

/* GET users listing. */
router.get("/", loginRequired,getUsers);

router.get("/:id", loginRequired, getUserById);



module.exports = router;
