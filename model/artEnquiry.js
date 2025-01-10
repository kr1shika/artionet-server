const mongoose = require("mongoose");
const enquirySchema = new mongoose.Schema(
    {
        art_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artworks",
            required: true,
        },
        buyer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        messages: [
            {
                sender_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Users",
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                },
                sentAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        buyerLastReadAt: {
            type: Date,
        },
        artistLastReadAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
module.exports = Enquiry;
