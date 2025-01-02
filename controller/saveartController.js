const Saveart = require("../model/save_arts")

const findAll = async (req, res) => {
    try {
        const savearts = await Saveart.find().populate(["art_id", "buyer_id"]);
        res.status(200).json(savearts);
    } catch (e) {
        res.json(e);
    }
}

const Save = require("../models/saveModel");

const save = async (req, res) => {
    try {
        const { art_id, buyer_id } = req.body;
        if (!art_id || !buyer_id) {
            return res.status(400).json({ error: "art_id and buyer_id are required" });
        }
        const savearts = new Save({
            art_id,
            buyer_id,
            status: "liked",
        });

        await savearts.save();
        res.status(201).json(savearts);
    } catch (e) {
        res.status(500).json({ error: "Failed to save art", details: e.message });
    }
};

module.exports = { save };


module.exports = {
    findAll,
    save,
}
