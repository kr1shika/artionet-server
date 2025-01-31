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
        default: "role"
    },
    desc: {
        type: String,
        required: false
    },
    profilepic: {
        type: String,
        required: false
    },
    artistname: {
        type: String,
        required: false
    },
})
const User = mongoose.model("Users", userSchema);
module.exports = User;