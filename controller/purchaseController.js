const Purchase = require("../model/purchase");
const User = require("../model/user");
const Artwork = require("../model/artwork");
const userNotification = require("../model/userNotification");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'krishikakh@gmail.com',
        pass: 'oysqizvoqqbnucnl'
    }
});

// Generate OTP
const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex'); // Generates a 6-character OTP
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'OTP for Purchase Verification',
        text: `Your OTP for purchase verification is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};
// Save Purchase
const savePurchase = async (req, res) => {
    try {
        const { art_id, buyer_id, address, phone_number } = req.body;
        if (!art_id || !buyer_id || !address || !phone_number) {
            return res.status(400).json({ error: "art_id, buyer_id, address, and phone_number are required" });
        }

        // Generate OTP
        const otp = generateOTP();
        const otp_expiration = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes

        // Save purchase with OTP
        const purchase = new Purchase({
            art_id,
            buyer_id,
            address,
            phone_number,
            otp,
            otp_expiration,
            status: 'Order Confirmed' // Default status
        });

        await purchase.save();

        // Send OTP to user's email
        const user = await User.findById(buyer_id);
        if (user) {
            await sendOTPEmail(user.email, otp);
        }

        res.status(201).json({ message: "OTP sent to your email", purchaseId: purchase._id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Verify OTP and Complete Purchase
const verifyOTPAndCompletePurchase = async (req, res) => {
    try {
        const { purchaseId, otp } = req.body;
        if (!purchaseId || !otp) {
            return res.status(400).json({ error: "purchaseId and OTP are required" });
        }

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }

        // Check if OTP is valid and not expired
        if (purchase.otp !== otp || purchase.otp_expiration < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Update purchase status to 'Order Confirmed'
        purchase.status = 'Order Confirmed';
        await purchase.save();

        // Send confirmation email to user
        const user = await User.findById(purchase.buyer_id);
        if (user) {
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: user.email,
                subject: 'Purchase Confirmation',
                text: `Your purchase has been confirmed. Order ID: ${purchase._id}`
            };
            await transporter.sendMail(mailOptions);
        }

        // Notify the artist
        const artwork = await Artwork.findById(purchase.art_id);
        if (artwork) {
            const artistNotification = new userNotification({
                userId: artwork.artistId, // Assuming artwork has an artistId field
                title: 'New Purchase',
                message: `Your artwork "${artwork.title}" has been purchased by ${user.name}.`
            });
            await artistNotification.save();
        }

        res.status(200).json({ message: "Purchase completed successfully", purchase });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const updatePurchaseStatus = async (req, res) => {
    try {
        const { purchaseId, status } = req.body;
        if (!purchaseId || !status) {
            return res.status(400).json({ error: "purchaseId and status are required" });
        }

        // Validate status
        const validStatuses = ["Order Confirmed", "Order Processing", "Shipped", "Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const purchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { status },
            { new: true } // Return the updated document
        );

        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }

        res.status(200).json({ message: "Purchase status updated successfully", purchase });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getPurchaseStatus = async (req, res) => {
    try {
        const { purchaseId } = req.params;
        if (!purchaseId) {
            return res.status(400).json({ error: "purchaseId is required" });
        }

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }

        res.status(200).json({ status: purchase.status });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getArtistOrders = async (req, res) => {
    try {
        const { artistId } = req.params;
        const artworks = await Artwork.find({ artistId: artistId });

        const artworkIds = artworks.map(artwork => artwork._id);

        const purchases = await Purchase.find({ art_id: { $in: artworkIds } }).populate('buyer_id').populate('art_id');
        res.status(200).json(purchases);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    savePurchase,
    verifyOTPAndCompletePurchase,
    updatePurchaseStatus,
    getPurchaseStatus,
    getArtistOrders
};