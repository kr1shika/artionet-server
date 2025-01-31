// middleware/uploads.js
const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "artist_identity"); // Destination folder for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `IMG-${Date.now()}${path.extname(file.originalname)}`); // Unique filename
    },
});

// File filter to allow only image files
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
}).single("profilepic"); // Field name for the image

module.exports = upload;