const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, update } = require("../controller/artworkController");
const multer = require("multer")
const { authenticateToken, authorizeRole } = require("../security/Auth");

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'artwork_space');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })
router.post("/", upload.single('images'), save)

router.get("/", authenticateToken, authorizeRole("Admin"), findAll)

router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports = router;
