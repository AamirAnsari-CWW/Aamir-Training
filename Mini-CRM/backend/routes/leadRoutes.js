const express = require("express");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");
const { mongoIdValidator } = require("../validators/commonValidators");
const {
  createLeadValidator,
  updateLeadValidator,
  leadListValidator,
} = require("../validators/leadValidators");

const router = express.Router();

// Every lead route below this line requires authentication.
router.use(protect);

// Routes for creating and listing leads.
router
  .route("/")
  .post(createLeadValidator, validateRequest, createLead)
  .get(leadListValidator, validateRequest, getLeads);

// Routes that work with one lead using its MongoDB id.
router
  .route("/:id")
  .get(mongoIdValidator, validateRequest, getLeadById)
  .put(mongoIdValidator, updateLeadValidator, validateRequest, updateLead)
  .delete(authorize("admin"), mongoIdValidator, validateRequest, deleteLead);

module.exports = router;
