const Saveart = require("../model/save_arts");

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
        const { art_id, buyer_id } = req.body;
        if (!art_id || !buyer_id) {
            return res.status(400).json({ error: "art_id and buyer_id are required" });
        }

        // Check if the art is already liked by the user
        const existingSave = await Saveart.findOne({ art_id, buyer_id });

        if (existingSave) {
            // If already liked, return a response indicating so
            return res.status(400).json({ message: "Art already liked by this user" });
        }

        // Create a new Saveart instance if not already liked
        const savearts = new Saveart({
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

const deleteSaveart = async (req, res) => {
    try {
        const { art_id, buyer_id } = req.body;
        if (!art_id || !buyer_id) {
            return res.status(400).json({ error: "art_id and buyer_id are required" });
        }

        // Find the saved art by art_id and buyer_id
        const savedArt = await Saveart.findOne({ art_id, buyer_id });

        if (!savedArt) {
            return res.status(404).json({ message: "Saved art not found" });
        }

        // Delete the saved art record
        await Saveart.deleteOne({ art_id, buyer_id });

        res.status(200).json({ message: "Saved art removed successfully" });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete saved art", details: e.message });
    }
};

const checkStatus = async (req, res) => {
    try {
        const { artId } = req.params; // Fetch artId from route parameters
        const { buyer_id } = req.query; // Fetch buyer_id from query string

        if (!artId || !buyer_id) {
            return res.status(400).json({ error: "artId and buyer_id are required" });
        }

        // Check if the artwork is saved by the buyer
        const savedArt = await Saveart.findOne({ art_id: artId, buyer_id });

        // Return the like status
        const isLiked = !!savedArt && savedArt.status === "liked";
        return res.status(200).json({ isLiked });
    } catch (error) {
        res.status(500).json({ error: "Failed to check status", details: error.message });
    }
};

const findSavedArtsByUser = async (req, res) => {
    try {
        const { buyer_id } = req.params; // Fetch buyer_id from route parameters

        if (!buyer_id) {
            return res.status(400).json({ error: "buyer_id is required" });
        }

        // Find all saved artworks for the given buyer_id
        const savedArts = await Saveart.find({ buyer_id }).populate("art_id");

        if (!savedArts.length) {
            return res.status(404).json({ message: "No saved artworks found for this user" });
        }

        res.status(200).json(savedArts);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch saved artworks", details: e.message });
    }
};

module.exports = {
    findAll,
    save,
    deleteSaveart,
    checkStatus,
    findSavedArtsByUser
}
