const { param, query } = require("express-validator");

// Check ids used in routes such as /api/customers/:id.
const mongoIdValidator = param("id")
  .isMongoId()
  .withMessage("A valid record id is required");

// Shared rules for customer and lead list queries.
const paginationValidators = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters"),
];

module.exports = { mongoIdValidator, paginationValidators };
