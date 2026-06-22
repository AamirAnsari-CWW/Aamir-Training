const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");
const { authLimiter } = require("../middleware/securityMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidators");

const router = express.Router();

// Validation runs before the controller so invalid data never reaches the database.
router.post(
  "/register",
  authLimiter,
  registerValidator,
  validateRequest,
  registerUser
);
router.post("/login", authLimiter, loginValidator, validateRequest, loginUser);

// A valid JWT is required to view the logged-in user's profile.
router.get("/profile", protect, getProfile);

module.exports = router;
