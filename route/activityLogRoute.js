const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../controllers/activityLogController");

// Get all activity logs
router.get("/activity-logs", getActivityLogs);

module.exports = router;