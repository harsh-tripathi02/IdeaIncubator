const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")

// Register & Login
router.post("/register", userController.register)
router.post("/login", userController.login)

// Add logout route
router.post("/logout", userController.logout)

// Get current user
router.get("/me", auth, userController.getMe)

module.exports = router
