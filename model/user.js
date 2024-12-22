const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["artist", "buyer"],
        required: true,
        default: "buyer"
    }
})

const Buyer = mongoose.model("Users", userSchema);
module.exports = Buyer;