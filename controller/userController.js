const User = require("../model/user")
const nodemailer = require("nodemailer")

const findAll = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (e) {
        res.json(e);
    }
}

const save = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "krishikakh@gmail.com",
                pass: "oysqizvoqqbnucnl"
            }
        });

        let subject = "";
        let htmlContent = "";

        if (user.role === "artist") {
            subject = "Artist Registration Successful";
            htmlContent = `
                <h1>Welcome to Artionet, Artist!</h1>
                <p>We are excited to have you on board as a creative force. Showcase your art and connect with buyers!</p>
                <p>Your User ID: ${user.id}</p>
            `;
        } else if (user.role === "buyer") {
            subject = "Buyer Registration Successful";
            htmlContent = `
                <h1>Welcome to Artionet, Buyer!</h1>
                <p>We are thrilled to have you with us. Explore unique art pieces from talented artists!</p>
                <p>Your User ID: ${user.id}</p>
            `;
        }

        const info = await transporter.sendMail({
            from: "krishikakh@gmail.com",
            to: user.email,
            subject: subject,
            html: htmlContent
        });

        // Respond with success
        res.status(201).json({ user, info });
    } catch (e) {
        // Handle errors
        res.status(500).json({ error: e.message });
    }
};


const findById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    } catch (e) {
        res.json(e)
    }
}

const deleteById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Data deleted")
    } catch (e) {
        res.json(e)
    }
}

const update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    update
}
