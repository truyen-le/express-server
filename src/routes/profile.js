var express = require("express");

const {
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
} = require("../controllers/profile.controller");

const { loginRequired, passwordRequired } = require("../controllers/auth.controller");

var router = express.Router();

/* GET users listing. */
router.get("/", loginRequired, getProfile);

router.put("/", loginRequired, updateProfile);

router.put("/update-password", loginRequired, passwordRequired, updatePassword);

router.delete("/", loginRequired, passwordRequired, deleteProfile);

module.exports = router;
