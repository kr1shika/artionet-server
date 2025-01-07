// const mongoose = require("mongoose");

// const saveSchema = new mongoose.Schema({
//     art_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Artworks"
//     },
//     buyer_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Users"
//     },
//     status: {
//         type: String,
//         required: true
//     },
// })

// const Save = mongoose.model("Saves", saveSchema);
// module.exports = Save;



const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
    art_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artworks",  // Assuming you have an Artwork model
        required: true,
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",  // Assuming you have a User model
        required: true,
    },
    status: {
        type: String,
        enum: ["liked", "disliked"],
        default: "liked",
    },
});

// Add a compound unique index on art_id and buyer_id
saveSchema.index({ art_id: 1, buyer_id: 1 }, { unique: true });
const Save = mongoose.model("Saves", saveSchema);
module.exports = Save;

