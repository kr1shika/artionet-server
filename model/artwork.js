// artwork.js
const mongoose = require("mongoose");
const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    medium_used: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    categories: {
        type: String,
        enum: ["Painting", "Sculpture", "Photography", "Digital Art", "Mixed Media"],
        required: true,
        default: "Art"
    },
    subcategories: {
        type: String,
        enum: ["Abstract", "Modern", "Contemporary", "Impressionism", "Realism", "Expressionism", "Surrealism"],
        required: false,
    },
    archive: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
    adminComment: {
        type: String,
        required: false
    },
    creators_note: {
        type: String,
        required: false
    },
    views: {
        type: Number,
        default: 0 // Default to 0 views
    }
});

const Artworks = mongoose.model("Artworks", artworkSchema);
module.exports = Artworks;
