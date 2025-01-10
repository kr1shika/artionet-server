const express = require("express");
const router = express.Router();
const { findAll, save, fetchChat, respondToChat } = require("../controller/artEnquiryController");

router.get("/", findAll)
router.post("/", save)
router.get("/:art_id/:artistId/:buyer_id", fetchChat);
router.patch("/respond/:art_id/:artistId/:buyer_id", respondToChat);


module.exports = router;