var express = require('express');

const {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");
const { loginRequired } = require("../controllers/auth.controller");

var router = express.Router();

/* GET users listing. */
router.get("/", loginRequired,getUsers);

router.get("/:id", loginRequired,getUserById);

router.put("/", loginRequired,updateUserById);

router.delete("/", loginRequired,deleteUserById);



module.exports = router;
