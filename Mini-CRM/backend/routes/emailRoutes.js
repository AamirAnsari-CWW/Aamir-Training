const express = require("express");

const { sendCustomerEmail } = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");
const { sendEmailValidator } = require("../validators/emailValidators");

const router = express.Router();

// Check login and form data before sending the email.
router.post(
  "/send",
  protect,
  sendEmailValidator,
  validateRequest,
  sendCustomerEmail
);

module.exports = router;
