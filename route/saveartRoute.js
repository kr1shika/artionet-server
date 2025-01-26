const express = require("express");
const router = express.Router();
const { findAll, save, deleteSaveart, checkStatus, findSavedArtsByUser, getSavedCount } = require("../controller/saveartController");

router.get("/", findAll)
router.post("/", save)
router.delete("/", deleteSaveart);

router.get("/:artId/isLiked", checkStatus); // New endpoint to check status
router.get("/fetchcollection/:buyer_id", findSavedArtsByUser);
router.get("/saved-count/:art_id", getSavedCount);

module.exports = router;