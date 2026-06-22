const express = require("express");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");
const { mongoIdValidator } = require("../validators/commonValidators");
const {
  createCustomerValidator,
  updateCustomerValidator,
  customerListValidator,
} = require("../validators/customerValidators");

const router = express.Router();

// Every customer route below this line requires authentication.
router.use(protect);

// Routes for creating and listing customers.
router
  .route("/")
  .post(createCustomerValidator, validateRequest, createCustomer)
  .get(customerListValidator, validateRequest, getCustomers);

// Routes that work with one customer using its MongoDB id.
router
  .route("/:id")
  .get(mongoIdValidator, validateRequest, getCustomerById)
  .put(
    mongoIdValidator,
    updateCustomerValidator,
    validateRequest,
    updateCustomer
  )
  .delete(
    // Only admins can delete customer records.
    authorize("admin"),
    mongoIdValidator,
    validateRequest,
    deleteCustomer
  );

module.exports = router;
