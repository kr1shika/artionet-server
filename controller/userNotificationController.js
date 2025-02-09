const Notification = require("../model/userNotification");

const express = require("express");
const router = express.Router();
const userNotification = require("../model/userNotification");

// Delete a notification
router.delete("/notifications/:notificationId", async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Soft delete the notification by setting `deleted` to true
        const notification = await userNotification.findByIdAndUpdate(
            notificationId,
            { deleted: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        res.status(200).json({ message: "Notification deleted successfully.", notification });
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        res.status(500).json({
            message: "An error occurred while deleting the notification.",
            error: error.message,
        });
    }
});

module.exports = router;

const getNotificationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({ userId: userId, deleted: false }).sort({ createdAt: -1 });

        if (!notifications.length) {
            return res.status(404).json({ message: "No notifications found for this user." });
        }

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({
            message: "An error occurred while fetching notifications.",
            error: error.message,
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read.", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error.message);
        res.status(500).json({
            message: "An error occurred while marking the notification as read.",
            error: error.message,
        });
    }
};

module.exports = {
    getNotificationsByUser,
    markNotificationAsRead
};