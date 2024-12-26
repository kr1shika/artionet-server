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

})

const Purchase = mongoose.model("Purchases", purchaseSchema);
module.exports = Purchase;