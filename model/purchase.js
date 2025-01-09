const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    art_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artworks"
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    otp: {
        type: String, // Store the generated OTP
        required: false
    },
    otp_expiration: {
        type: Date, // Store the expiration time of the OTP
        required: false
    }
});

const Purchase = mongoose.model("Purchases", purchaseSchema);
module.exports = Purchase;
