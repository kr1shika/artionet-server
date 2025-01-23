const express = require("express");
const router = express.Router();
const { getPendingArtworks, findAll, save, findById, deleteById, updateArtwork, findArtworksByArtist, findArtworksByCategoryAndSubcategory, approveArtwork } = require("../controller/artworkController");
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
router.get("/", findAll)

router.get("/find/:id", findById);
router.delete("/:id", deleteById);
router.put("/update/:id", upload.single('images'), updateArtwork);
// 6774ecf7be5c2eed553a24a1
router.get('/category/:category/subcategory/:subcategory', findArtworksByCategoryAndSubcategory);
router.get('/category/:category/subcategory/~', findArtworksByCategoryAndSubcategory);
router.patch("/approve/:id", approveArtwork);
router.get("/pending-artworks", getPendingArtworks);
module.exports = router;
router.get("/:artistId", findArtworksByArtist);







