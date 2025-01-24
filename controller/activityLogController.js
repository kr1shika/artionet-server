const ActivityLog = require("../model/activityLog");

// Get all activity logs
const getActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Optional pagination

        const activityLogs = await ActivityLog.find()
            .sort({ timestamp: -1 }) // Sort by latest activity first
            .skip((page - 1) * limit) // Skip for pagination
            .limit(Number(limit)) // Limit the number of results
            .populate("userId", "name email"); // Populate user details

        if (!activityLogs.length) {
            return res.status(404).json({
                success: false,
                message: "No activity logs found.",
            });
        }

        res.status(200).json({
            success: true,
            total: activityLogs.length,
            data: activityLogs,
        });
    } catch (error) {
        console.error("Error fetching activity logs:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching activity logs.",
            error: error.message,
        });
    }
};

module.exports = {
    getActivityLogs,
};