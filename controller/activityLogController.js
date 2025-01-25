const ActivityLog = require("../model/activityLog");

const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("userId", "name") // Populate the userId field with the user's name
            .sort({ timestamp: -1 }); // Sort by latest logs first

        res.status(200).json({
            success: true,
            total: logs.length,
            data: logs,
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