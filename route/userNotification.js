const express = require("express");
const router = express.Router();
const { getNotificationsByUser, markNotificationAsRead } = require("../controller/userNotificationController");

router.get("/notifications/:userId", getNotificationsByUser);
router.put("/notifications/:notificationId/read", markNotificationAsRead);
module.exports = router;
