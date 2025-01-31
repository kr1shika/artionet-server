const User = require("../model/user")
const asyncHandler = require("../middleware/async");

const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const findAll = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (e) {
        res.json(e);
    }
}

// controller/userController.js

const save = async (req, res) => {
    try {
        const { full_name, email, password, contact_no, desc, artistname, role, profilepic } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            full_name,
            email,
            password: hashedPassword,
            contact_no,
            desc,
            artistname,
            role,
            profilepic, // Add the profile picture filename from the request body
        });

        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "krishikakh@gmail.com",
                pass: "oysqizvoqqbnucnl",
            },
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
            html: htmlContent,
        });

        res.status(201).json({ user, info });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// login 
const jwt = require("jsonwebtoken");
const SECRET_KEY = "e4e62304e3bc88a53858dcf50b7a60e9662fc78015e27237eb93da4386df9449";

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;



        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).send("Invalid email or password");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            token,
            id: user._id,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profilepic) {
            user.profilepic = `artist_identity/${user.profilepic}`;
        }

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


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
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { full_name, email, contact_no, desc, artistname } = req.body;
        if (full_name) user.full_name = full_name;
        if (email) user.email = email;
        if (contact_no) user.contact_no = contact_no;
        if (desc) user.desc = desc;
        if (artistname) user.artistname = artistname;

        // Handle image upload
        if (req.file) {
            user.profilepic = req.file.filename;
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};
const findUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        const users = await User.find({ role });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controller/userController.js

// @desc    Upload profile picture
// @route   POST /api/users/uploadImage
// @access  Public
exports.uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
    }

    res.status(200).json({
        success: true,
        data: req.file.filename, // Return the filename of the uploaded image
    });
});
// module.exports = { update };


module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update,
    loginUser,
    findUsersByRole,
    uploadImage: exports.uploadImage, // Include the uploadImage function
};