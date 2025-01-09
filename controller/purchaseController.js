const Purchase = require("../model/purchase")

const findAll = async (req, res) => {
    try {
        const purchase = await Purchase.find().populate(["art_id", "buyer_id"]);
        res.status(200).json(purchase);
    } catch (e) {
        res.json(e);
    }
}

const savePurchase = async (req, res) => {
    try {
        const { art_id, buyer_id } = req.body;
        if (!art_id || !buyer_id) {
            return res.status(400).json({ error: "art_id and buyer_id are required" });
        }

        const purchase = new Saveart({
            art_id,
            buyer_id,
            address,
        });

        await purchase.save();
        res.status(201).json(purchase)
    } catch (e) {
        res.json(e)
    }
}

module.exports = {
    findAll,
    savePurchase,
}
