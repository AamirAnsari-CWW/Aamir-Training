const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Collect errors created by validator files and stop invalid requests.
const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

module.exports = validateRequest;
