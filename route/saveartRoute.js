const express = require("express");
const router = express.Router();
const { findAll, save, deleteSaveart } = require("../controller/saveartController");

router.get("/", findAll)
router.post("/", save)
router.delete("/", deleteSaveart);


module.exports = router;