const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({

});

const activityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = activityLog;