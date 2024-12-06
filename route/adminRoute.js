const express=require("express");
const router=express.Router();
const { findAll,save,findById,deleteById,update } = require("../controller/adminController");
const adminValidation =require("../validations/adminValidation")

router.get("/", findAll)
router.post("/",adminValidation,save)
router.get("/:id",findById);

module.exports=router;