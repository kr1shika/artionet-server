const express=require("express");
const router=express.Router();
const { findAll,save,findById,deleteById,update } = require("../controller/buyerController");
const buyerValidation =require("../validations/buyerValidation")

router.get("/", findAll)
router.post("/",buyerValidation,save)
router.get("/:id",findById);
router.delete("/:id",deleteById);
router.put("/:id",update);

module.exports=router;