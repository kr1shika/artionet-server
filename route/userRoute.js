const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, update, loginUser } = require("../controller/userController");
const userValidation = require("../validations/userValidation")

router.get("/", findAll)
router.post("/register", save)
router.post("/login", loginUser);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports = router;