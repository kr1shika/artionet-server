const express = require("express");
const router = express.Router();
const { findAll, savePurchase } = require("../controller/purchaseController");

router.get("/", findAll)
router.post("/", savePurchase)

module.exports = router;