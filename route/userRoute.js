// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { save_web, uploadImage, findAll, save, findById, deleteById, update, loginUser, findUsersByRole } = require("../controller/userController");
const upload = require("../middleware/uploads"); // Import the upload middleware

// Image upload route
router.post("/uploadImage", upload, uploadImage);

// Other routes
router.get("/", findAll);
router.post("/register", save_web);

router.post("/register_mobile", save);
router.post("/login", loginUser);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.get("/", findUsersByRole);
router.put("/:id", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }
        update(req, res);
    });
});
module.exports = router;