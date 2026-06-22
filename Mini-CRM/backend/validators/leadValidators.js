const { body, query } = require("express-validator");
const { paginationValidators } = require("./commonValidators");

// Reuse the same field rules for create and update requests.
const leadFields = (isUpdate = false) => {
  const fields = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail(),
    body("phone")
      .trim()
      .matches(/^[0-9+().\-\s]{7,20}$/)
      .withMessage("A valid phone number is required"),
    body("company").optional().trim().isLength({ max: 100 }),
    body("source")
      .optional()
      .isIn(["Website", "LinkedIn", "Referral", "Facebook","Forms", "Other"])
      .withMessage("Invalid lead source"),
    body("status")
      .optional()
      .isIn(["New", "Contacted", "Qualified", "Converted"])
      .withMessage("Invalid lead status"),
    body("notes").optional().trim().isLength({ max: 2000 }),
  ];

  // Update fields are optional because the user may change only one field.
  return isUpdate ? fields.map((validator) => validator.optional()) : fields;
};

const createLeadValidator = leadFields();
const updateLeadValidator = leadFields(true);

const leadListValidator = [
  ...paginationValidators,
  query("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Converted"])
    .withMessage("Invalid lead status"),
  query("source")
    .optional()
    .isIn(["Website", "LinkedIn", "Referral", "Facebook","Forms", "Other"])
    .withMessage("Invalid lead source"),
];

module.exports = {
  createLeadValidator,
  updateLeadValidator,
  leadListValidator,
};
