const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, update, loginUser } = require("../controller/userController");
const userValidation = require("../validations/userValidation")
const multer = require("multer")

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'artist_identity'); // Directory for profile images
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames
    }
});

const upload = multer({ storage }).single("profilepic");

router.get("/", findAll)
router.post("/register", save)
router.post("/login", loginUser);
router.get("/:id", findById);
router.delete("/:id", deleteById);
// router.put("/:id", update);
router.put("/:id", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }
        update(req, res); // Call the controller function after handling the upload
    });
});

module.exports = router;