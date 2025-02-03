const Artwork = require("../model/artwork");
const Notification = require("../model/userNotification");
const Save = require("../model/save_arts"); // Import the Save model
const ActivityLog = require("../model/activityLog");

const getPopularCategories = async (req, res) => {
    try {
        const categories = await Artwork.aggregate([
            { $group: { _id: "$categories", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching popular categories", error: error.message });
    }
};
const findArtworksByCategoryAndSubcategory = async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        const filter = { status: "approved" };

        if (category && category !== "all") {
            filter.categories = category;
        }

        if (subcategory && subcategory !== "~") {
            filter.subcategories = subcategory;
        }

        const artworks = await Artwork.find(filter).populate("artistId");
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
        const { archive, status } = req.query;

        const filter = { artistId: artistId };

        if (archive === "private") {
            filter.archive = "private";
        } else if (archive === "public") {
            filter.archive = "public";
        }

        if (status) {
            filter.status = status; 
        }

        const artwork = await Artwork.find(filter).populate("artistId");

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
};

const save = async (req, res) => {
    try {
        const { title, dimensions, price, medium_used, artistId, categories, creators_note } = req.body; // Add creators_note
        const filePath = req.file ? `artwork_space/${req.file.originalname}` : null;

        if (!filePath) {
            return res.status(400).json({ message: "Image file is required." });
        }

        if (!title || !dimensions || !price || !medium_used || !artistId || !categories) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const artwork = new Artwork({
            title,
            dimensions,

            price,
            medium_used,
            images: filePath,
            artistId,
            categories,
            status: "pending",
            archive: "public",
            creators_note,
        });

        await artwork.save();

        const activityLog = new ActivityLog({
            userId: artistId,
            userType: "artist",
            action: "posted_artwork",
            details: `Artist posted a new artwork titled "${title}" and is waiting for approval.`,
        });
        await activityLog.save();

        const notification = new Notification({
            userId: artistId,
            title: "Artwork Submission", // Add a title
            message: `Your artwork titled "${title}" has been submitted and is pending approval.`, // Include the artwork title in the message
        });
        await notification.save();

        res.status(201).json({
            message: "Artwork saved successfully and is pending approval.",
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

const approveArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body; // "approved" or "declined"

        if (!["approved", "declined"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value. Allowed values: 'approved', 'declined'." });
        }

        const artwork = await Artwork.findById(id);
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found." });
        }
        // Update artwork status and admin comment (if declined)
        artwork.status = status;
        if (status === "declined" && adminComment) {
            artwork.adminComment = adminComment;
        } else {
            artwork.adminComment = null; // Clear admin comment if approved
        }

        await artwork.save();

        // Create a notification for the user
        const notificationMessage = status === "approved"
            ? `Your artwork "${artwork.title}" has been approved.`
            : `Your artwork "${artwork.title}" has been declined. Reason: ${adminComment}`;

        const notification = new Notification({
            userId: artwork.artistId,
            title: "Artwork Status Update", // Add a title
            message: notificationMessage
        });
        await notification.save();

        res.status(200).json({
            message: `Artwork ${status} successfully.`,
            artwork,
        });
    } catch (error) {
        console.error("Error updating artwork status:", error.message);
        res.status(500).json({
            message: "An error occurred while updating the artwork status.",
            error: error.message,
        });
    }
};

const findById = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        const saveCount = await Save.countDocuments({ art_id: artwork._id });

        res.status(200).json({ ...artwork.toObject(), saveCount });
    } catch (e) {
        res.status(500).json({ message: "An error occurred while fetching the artwork.", error: e.message });
    }
};

const deleteById = async (req, res) => {
    try {
        const artwork = await Artwork.findByIdAndDelete(req.params.id);
        if (!artwork) return res.status(404).json({ message: "Artwork not found" });
        res.status(200).json({ message: "Artwork deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateArtwork = async (req, res) => {
    try {
        const { id } = req.params;

        const artwork = await Artwork.findById(id);
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        const {
            title,
            dimensions,
            creators_note,
            price,
            medium_used,
            categories,
            subcategories,
        } = req.body;

        if (title) artwork.title = title;
        if (dimensions) artwork.dimensions = dimensions;
        if (price) artwork.price = price;
        if (medium_used) artwork.medium_used = medium_used;
        if (categories) artwork.categories = categories;
        if (subcategories) artwork.subcategories = subcategories;
        if (creators_note) artwork.creators_note = creators_note;

        if (req.file) {
            const filePath = `artwork_space/${req.file.originalname}`;
            artwork.images = filePath;
        }

        await artwork.save();

        res.status(200).json({
            message: "Artwork updated successfully.",
            artwork,
        });
    } catch (error) {
        console.error("Error updating artwork:", error.message);
        res.status(500).json({
            message: "An error occurred while updating the artwork.",
            error: error.message,
        });
    }
};

const getPendingArtworks = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Optional pagination

        const pendingArtworks = await Artwork.find({ status: "pending" })
            .populate("artistId") // Populate artist details if needed
            .skip((page - 1) * limit) // Skip for pagination
            .limit(Number(limit)); // Limit the number of results
        if (!pendingArtworks.length) {
            return res.status(404).json({
                success: false,
                message: "No pending artworks found.",
            });
        }
        res.status(200).json({
            success: true,
            total: pendingArtworks.length,
            data: pendingArtworks,
        });
    } catch (error) {
        console.error("Error fetching pending artworks:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching pending artworks.",
            error: error.message,
        });
    }
};

const archiveArtwork = async (req, res) => {
    try {
        const { id } = req.params;

        const artwork = await Artwork.findById(id);
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found." });
        }

        artwork.archive = "private";
        await artwork.save();

        res.status(200).json({
            message: "Artwork archived successfully.",
            artwork,
        });
    } catch (error) {
        console.error("Error archiving artwork:", error.message);
        res.status(500).json({
            message: "An error occurred while archiving the artwork.",
            error: error.message,
        });
    }
};

const unarchiveArtwork = async (req, res) => {
    try {
        const { id } = req.params;

        const artwork = await Artwork.findById(id);
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found." });
        }

        artwork.archive = "public";
        await artwork.save();

        res.status(200).json({
            message: "Artwork unarchived successfully.",
            artwork,
        });
    } catch (error) {
        console.error("Error unarchiving artwork:", error.message);
        res.status(500).json({
            message: "An error occurred while unarchiving the artwork.",
            error: error.message,
        });
    }
};

const incrementViews = async (req, res) => {
    try {
        const { id } = req.params;
        const artwork = await Artwork.findById(id);

        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        // Increment views
        artwork.views += 1;
        await artwork.save();

        res.status(200).json({ message: "Views incremented", views: artwork.views });
    } catch (error) {
        res.status(500).json({ message: "Error incrementing views", error: error.message });
    }
};



module.exports = {
    archiveArtwork,
    unarchiveArtwork,
    approveArtwork,
    findAll,
    incrementViews,
    save,
    findById,
    deleteById,
    updateArtwork,
    findArtworksByArtist,
    findArtworksByCategoryAndSubcategory,
    getPendingArtworks,
    getPopularCategories
};