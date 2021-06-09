var express = require("express");

const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile.controller");

const { loginRequired } = require("../controllers/auth.controller");

var router = express.Router();

/* GET users listing. */
router.get("/", loginRequired, getProfile);

router.put("/", loginRequired, updateProfile);

router.delete("/", loginRequired, deleteProfile);

module.exports = router;
