const ArtEnquiry = require("../model/artEnquiry")

const findAll = async (req, res) => {
    try {
        const enquiry = await ArtEnquiry.find();
        res.status(200).json(enquiry);
    } catch (e) {
        res.json(e);
    }
}

const save = async (req, res) => {
    try {
        const enquiry = new ArtEnquiry(req.body);
        await enquiry.save();
        res.status(201).json(enquiry)
    } catch (e) {
        res.json(e)
    }
}

module.exports = {
    findAll,
    save,

}