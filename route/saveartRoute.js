const express=require("express");
const router=express.Router();
const { findAll,save,findById,deleteById,update } = require("../controller/saveartController");

router.get("/", findAll)
router.post("/",save)

module.exports=router;