//loginregister api for admins
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require("../model/admin");

const SECRET_KEY = "e4e62304e3bc88a53858dcf50b7a60e9662fc78015e27237eb93da4386df9449"

// register
const register = async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword, role })
    admin.save();
    res.status(201).send(admin);
};

// login
const login = async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(403).send('Invalid username or password');
    }

    const token = jwt.sign({ username: admin.username, role: admin.role },
        SECRET_KEY,
        { expiresIn: '1h' });
    res.json({ token });
};

module.exports = {
    login,
    register
}