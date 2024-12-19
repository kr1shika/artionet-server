const express=require("express");
const router=express.Router();


const { login,register } = require("../controller/adminController");
const { authenticateToken } = require("../security/Auth");


router.post("/login", login)
router.post("/register",authenticateToken,register)

module.exports=router;