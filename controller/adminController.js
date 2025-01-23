const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');

const SECRET_KEY = "e4e62304e3bc88a53858dcf50b7a60e9662fc78015e27237eb93da4386df9449";

// Register
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ status: "error", message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword, role });
        await admin.save();

        res.status(201).json({ status: "success", message: "Admin registered successfully", data: { username, role } });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ status: "error", message: "An error occurred during registration" });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: "error", message: "Username and password are required" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(403).json({ status: "error", message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ status: "success", token, role: admin.role, userId: admin._id, });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ status: "error", message: "An error occurred during login" });
    }
};

module.exports = {
    register,
    login
};
