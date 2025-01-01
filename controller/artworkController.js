const Artwork = require("../model/artwork")

const findArtworksByCategoryAndSubcategory = async (req, res) => {
    try {
        const { category, subcategory } = req.params;

        console.log("Category:", category);
        console.log("Subcategory:", subcategory);
        const filter = {};

        if (category && category !== "all") {
            filter.categories = category;
        }

        if (subcategory && subcategory !== "~") {
            filter.subcategories = subcategory;
        }

        const artworks = await Artwork.find(filter).populate('artistId');

        if (!artworks.length) {
            return res.status(404).json({ message: "No artworks found matching the given category and subcategory." });
        }
        res.status(200).json(artworks);
    } catch (e) {
        res.status(500).json({ message: "An error occurred while fetching artworks.", error: e.message });
    }
};

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

        // Constructing the full file path for the image
        const filePath = req.file ? `artwork_space/${req.file.originalname}` : null;

        if (!filePath) {
            return res.status(400).json({ message: "Image file is required." });
        }

        if (!title || !dimensions || !description || !price || !medium_used || !artistId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const artwork = new Artwork({
            title,
            dimensions,
            description,
            price,
            medium_used,
            images: filePath,
            artistId,
        });

        await artwork.save();

        res.status(201).json({
            message: "Artwork saved successfully.",
            artwork,
        });
    } catch (error) {
        console.error("Error saving artwork:", error.message);
        res.status(500).json({
            message: "An error occurred while saving the artwork.",
            error: error.message,
        });
    }
};


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
    findArtworksByArtist,
    findArtworksByCategoryAndSubcategory,

}
