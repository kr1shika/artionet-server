const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
    art_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artworks"
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    // statement: enquiry question
    statment: {
        type: String,
        required: true
    },
})

const Save = mongoose.model("Enquiries", enquirySchema);
module.exports = Save;