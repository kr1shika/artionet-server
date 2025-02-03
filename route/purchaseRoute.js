const express = require("express");
const router = express.Router();
const { verifyOTPAndCompletePurchase, findAll, savePurchase } = require("../controller/purchaseController");

router.get('/purchases', findAll);
router.post('/purchase', savePurchase);
router.post('/verify-otp', verifyOTPAndCompletePurchase);

module.exports = router;