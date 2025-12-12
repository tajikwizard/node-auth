const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET routes to render pages
router.get("/login", (req, res) => {
    res.render("login");   
});

router.get("/register", (req, res) => {
    res.render("register");  
});



// POST routes
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);

module.exports = router;
