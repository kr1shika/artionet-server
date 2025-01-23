const ArtEnquiry = require("../model/artEnquiry");

const findAll = async (req, res) => {
    try {
        const enquiry = await ArtEnquiry.find();
        res.status(200).json(enquiry);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const save = async (req, res) => {
    try {
        const { art_id, buyer_id, messages } = req.body;

        // Validate required fields
        if (!art_id || !buyer_id || !messages || !messages.length) {
            return res.status(400).json({
                error: "art_id, buyer_id, and at least one message are required.",
            });
        }

        const isValidMessage = messages.every(
            (msg) => msg.sender_id && msg.message
        );
        if (!isValidMessage) {
            return res.status(400).json({
                error: "Each message must have sender_id and message fields.",
            });
        }

        // Create and save the new enquiry
        const enquiry = new ArtEnquiry(req.body);
        await enquiry.save();

        res.status(201).json(enquiry);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const fetchChat = async (req, res) => {
    try {
        const { art_id, artistId, buyer_id } = req.params;

        if (!art_id || !artistId || !buyer_id) {
            return res.status(400).json({
                error: "art_id, artistId, and buyer_id are required to fetch the chat.",
            });
        }

        const enquiry = await ArtEnquiry.findOne({
            art_id,
            buyer_id,
        })
            .populate({
                path: "art_id",
                select: "title description artistId",
                populate: { path: "artistId", select: "_id email" },
            })
            .populate("buyer_id", "name email");

        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found." });
        }

        // Extract the _id of the artist from the populated artistId
        const artistObjectId = enquiry.art_id.artistId._id.toString();

        if (artistObjectId !== artistId) {
            console.log("Artist ID Mismatch:", {
                expected: artistId,
                actual: artistObjectId,
            });
            return res.status(403).json({ error: "Unauthorized access to this chat." });
        }

        res.status(200).json(enquiry);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


const respondToChat = async (req, res) => {
    try {
        const { art_id, artistId, buyer_id } = req.params;
        const { messages } = req.body;

        if (!art_id || !artistId || !buyer_id || !messages || !messages.length) {
            return res.status(400).json({
                error: "art_id, artistId, buyer_id, and at least one message are required.",
            });
        }

        const enquiry = await ArtEnquiry.findOne({
            art_id,
            buyer_id,
        }).populate("art_id", "artistId");

        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found." });
        }

        const artistObjectId = enquiry.art_id.artistId.toString(); // Access populated artistId
        if (artistObjectId !== artistId) {
            console.log("Artist ID Mismatch:", {
                expected: artistId,
                actual: artistObjectId,
            });
            return res.status(403).json({ error: "Unauthorized access to this chat." });
        }

        // Add messages to the enquiry
        enquiry.messages.push(...messages);
        await enquiry.save();

        res.status(200).json(enquiry);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


module.exports = {
    findAll,
    save, fetchChat, respondToChat
};
