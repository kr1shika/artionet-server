const Saveart = require("../model/save_arts")

const findAll = async (req, res) => {
    try {
        const savearts = await Saveart.find().populate(["art_id", "buyer_id"]);
        res.status(200).json(savearts);
    } catch (e) {
        res.json(e);
    }
}

const save = async (req, res) => {
    try {
        const savearts = new Saveart(req.body);
        await savearts.save();
        res.status(201).json(savearts)
    } catch (e) {
        res.json(e)
    }
}

module.exports = {
    findAll,
    save,
}
