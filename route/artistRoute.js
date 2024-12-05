const express=require("express");
const router=express.Router();
const { findAll,save,findById,deleteById,update } = require("../controller/artistController");
const artistValidation =require("../validations/artistValidation")

router.get("/", findAll)
router.post("/",artistValidation,save)
router.get("/:id",findById);
router.delete("/:id",deleteById);
router.put("/:id",update);

module.exports=router;