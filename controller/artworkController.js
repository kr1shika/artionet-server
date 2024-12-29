const Artwork = require("../model/artwork")

const findArtworksByArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        console.log("Artist ID:", artistId);

        const artwork = await Artwork.find({ artistId: artistId }).populate('title').populate('artistId'); // Add populate if necessary

        console.log("Found Artwork:", artwork);

        if (!artwork.length) {
            return res.status(404).json({ message: "No artwork found for this artist." });
        }

        res.status(200).json(artwork);
    } catch (e) {
        res.status(500).json({ message: "An error occurred while fetching artworks.", error: e.message });
    }
};

const findAll = async (req, res) => {
    try {
        const artwork = await Artwork.find();
        res.status(200).json(artwork);
    } catch (e) {
        res.json(e);
    }
}

const save = async (req, res) => {
    try {
        const { title, dimensions, description, price, medium_used, artistId } = req.body;
        const artwork = new Artwork({
            title,
            dimensions, description,
            price, medium_used, images: req.file.originalname, artistId
        });
        await artwork.save();
        res.status(200).json(artwork);
    } catch (e) {
        res.json(e);
    }
}

const findById = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        res.status(200).json(artwork)
    } catch (e) {
        res.json(e)
    }
}

const deleteById = async (req, res) => {
    try {
        const artwork = await Artwork.findByIdAndDelete(req.params.id);
        res.status(200).json("Data deleted")
    } catch (e) {
        res.json(e)
    }
}

const update = async (req, res) => {
    try {
        const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json("Data updated")
    } catch (e) {
        res.json(e)
    }
}

module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update,
    findArtworksByArtist
}
