var express = require('express');

const {
  loginRequired,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  login,
  register,
} = require("../controllers/user.controller");
var router = express.Router();

/* GET users listing. */
router.get("/", loginRequired,getUsers);

router.get("/:id", loginRequired,getUserById);

router.put("/", loginRequired,updateUserById);

router.delete("/", loginRequired,deleteUserById);

router.post("/login",login);

router.post("/register",register);

module.exports = router;
