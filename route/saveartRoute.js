const express = require("express");
const router = express.Router();
const { findAll, save, deleteSaveart, checkStatus } = require("../controller/saveartController");

router.get("/", findAll)
router.post("/", save)
router.delete("/", deleteSaveart);

router.get("/:artId/isLiked", checkStatus); // New endpoint to check status

module.exports = router;