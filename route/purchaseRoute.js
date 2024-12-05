const express=require("express");
const router=express.Router();
const { findAll,save,findById,deleteById,update } = require("../controller/purchaseController");

router.get("/", findAll)
router.post("/",save)

module.exports=router;