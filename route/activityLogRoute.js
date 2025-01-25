const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../controller/activityLogController");

// Get all activity logs
router.get("/get", getActivityLogs);

module.exports = router;