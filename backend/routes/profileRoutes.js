const express = require("express");
const { getProfile, getSchedules, updateSchedules, updateProfile } = require("../controllers/profileController");
const router = express.Router();

router.get("/profile", getProfile);
router.get("/schedules", getSchedules);
router.put("/schedules", updateSchedules);
router.put("/profile", updateProfile);

module.exports = router;
