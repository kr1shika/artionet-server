const Purchase = require("../model/purchase");
const User = require("../model/user");
const Artwork = require("../model/artwork");
const userNotification = require("../model/userNotification");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const findAll = async (req, res) => {
    try {
        const purchase = await Purchase.find().populate(["art_id", "buyer_id"]);
        res.status(200).json(purchase);
    } catch (e) {
        res.json(e);
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'krishikakh@gmail.com',
        pass: 'oysqizvoqqbnucnl'
    }
});

// Generate OTP
const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex');
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
// Temporary storage for purchase data
const tempPurchaseStore = {};
const savePurchase = async (req, res) => {
    try {
        const { art_id, buyer_id, address, phone_number } = req.body;
        if (!art_id || !buyer_id || !address || !phone_number) {
            return res.status(400).json({ error: "art_id, buyer_id, address, and phone_number are required" });
        }

        // Generate OTP
        const otp = generateOTP();
        const otp_expiration = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes

        const tempPurchaseId = crypto.randomBytes(16).toString('hex');
        tempPurchaseStore[tempPurchaseId] = {
            art_id,
            buyer_id,
            address,
            phone_number,
            otp,
            otp_expiration,
            status: 'pending'
        };

        // Send OTP to user's email
        const user = await User.findById(buyer_id);
        if (user) {
            await sendOTPEmail(user.email, otp);
        }

        res.status(201).json({ message: "OTP sent to your email", tempPurchaseId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const verifyOTPAndCompletePurchase = async (req, res) => {
    try {
        const { tempPurchaseId, otp } = req.body;
        if (!tempPurchaseId || !otp) {
            return res.status(400).json({ error: "tempPurchaseId and OTP are required" });
        }

        // Retrieve temporary purchase data
        const tempPurchase = tempPurchaseStore[tempPurchaseId];
        if (!tempPurchase) {
            return res.status(404).json({ error: "Temporary purchase not found" });
        }

        // Check if OTP is valid and not expired
        if (tempPurchase.otp !== otp || tempPurchase.otp_expiration < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Save the purchase in the database
        const purchase = new Purchase({
            art_id: tempPurchase.art_id,
            buyer_id: tempPurchase.buyer_id,
            address: tempPurchase.address,
            phone_number: tempPurchase.phone_number,
            status: 'completed'
        });
        await purchase.save();

        delete tempPurchaseStore[tempPurchaseId];

        const user = await User.findById(purchase.buyer_id);
        const artwork = await Artwork.findById(purchase.art_id);

        if (!user || !artwork) {
            return res.status(404).json({ error: "User or Artwork not found" });
        }

        const emailContent = `
            Dear ${user.name},

            Your order (Order ID: ${purchase._id}) has been placed successfully!

            Order Summary:
            - Artwork: ${artwork.title}
            - Price: Rs. ${artwork.price}
            - Quantity: 1
            - Subtotal: Rs. ${artwork.price}

            Delivery Address:
            - Name: ${user.name}
            - Address: ${purchase.address}
            - Phone: ${purchase.phone_number}

            Thank you for your purchase! If you have any questions, feel free to contact us.

            Best regards,
            Your Art Store Team
        `;

        const mailOptions = {
            from: 'krishikakh@gmail.com',
            to: user.email,
            subject: 'Purchase Confirmation',
            text: emailContent
        };
        await transporter.sendMail(mailOptions);

        if (artwork.artistId) {
            const artistNotification = new userNotification({
                userId: artwork.artistId,
                title: 'New Purchase',
                message: `Your artwork "${artwork.title}" has been purchased by ${user.full_name}.`
            });
            await artistNotification.save();
        }

        res.status(200).json({ message: "Purchase completed successfully", purchase });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    findAll,
    savePurchase,
    verifyOTPAndCompletePurchase
};