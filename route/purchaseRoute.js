const express = require("express");
const router = express.Router();
const { getArtistOrders, getPurchaseStatus, updatePurchaseStatus, verifyOTPAndCompletePurchase, savePurchase } = require("../controller/purchaseController");

// router.get('/purchases', findAll);
router.post('/purchase', savePurchase);
router.post('/verify-otp', verifyOTPAndCompletePurchase);
router.put('/status', updatePurchaseStatus); // Update status
router.get('/status/:purchaseId', getPurchaseStatus);
router.get('/artist/:artistId', getArtistOrders);

module.exports = router;
