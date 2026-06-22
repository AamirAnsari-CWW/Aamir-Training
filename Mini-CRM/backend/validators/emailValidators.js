const { body } = require("express-validator");

// Validate the three fields required by the email form.
const sendEmailValidator = [
  body("to")
    .trim()
    .isEmail()
    .withMessage("A valid recipient email is required")
    .normalizeEmail(),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 150 })
    .withMessage("Subject cannot exceed 150 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 10000 })
    .withMessage("Message cannot exceed 10,000 characters"),
];

module.exports = { sendEmailValidator };
