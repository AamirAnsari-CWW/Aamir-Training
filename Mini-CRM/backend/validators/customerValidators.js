const { body, query } = require("express-validator");
const { paginationValidators } = require("./commonValidators");

// Reuse the same field rules for create and update requests.
const customerFields = (isUpdate = false) => {
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
    body("company")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Company cannot exceed 100 characters"),
    body("status")
      .optional()
      .isIn(["Active", "Inactive"])
      .withMessage("Status must be Active or Inactive"),
  ];

  // Update fields are optional because the user may change only one field.
  return isUpdate ? fields.map((validator) => validator.optional()) : fields;
};

const createCustomerValidator = customerFields();
const updateCustomerValidator = customerFields(true);

const customerListValidator = [
  ...paginationValidators,
  query("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

module.exports = {
  createCustomerValidator,
  updateCustomerValidator,
  customerListValidator,
};
