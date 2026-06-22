const Lead = require("../models/Lead");
const ApiError = require("../utils/ApiError");
const {
  getPagination,
  getPaginationMeta,
  buildSearchFilter,
  pickAllowedFields,
} = require("../utils/queryHelpers");

const allowedFields = [
  "name",
  "email",
  "phone",
  "company",
  "source",
  "status",
  "notes",
];

// Admins can access all leads; normal users access only their own.
const ownerFilter = (user) => (user.role === "admin" ? {} : { createdBy: user._id });

// Find a lead only when the current user is allowed to access it.
const findAccessibleLead = async (id, user) => {
  const lead = await Lead.findOne({ _id: id, ...ownerFilter(user) });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead;
};

const createLead = async (req, res) => {
  const lead = await Lead.create({
    // Ignore unexpected fields sent by the client.
    ...pickAllowedFields(req.body, allowedFields),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: { lead },
  });
};

const getLeads = async (req, res) => {
  // Build pagination and filters from URL query parameters.
  const { page, limit, skip } = getPagination(req.query);
  const filter = {
    ...ownerFilter(req.user),
    ...buildSearchFilter(req.query.search, ["name", "email", "company", "phone"]),
  };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.source) filter.source = req.query.source;

  // Fetch the page and total count together for better response time.
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({
    success: true,
    message: "Leads fetched successfully",
    data: { leads },
    meta: getPaginationMeta(total, page, limit),
  });
};

const getLeadById = async (req, res) => {
  const lead = await findAccessibleLead(req.params.id, req.user);

  res.json({
    success: true,
    message: "Lead fetched successfully",
    data: { lead },
  });
};

const updateLead = async (req, res) => {
  const lead = await findAccessibleLead(req.params.id, req.user);

  // Change only fields that leads are allowed to edit.
  Object.assign(lead, pickAllowedFields(req.body, allowedFields));
  await lead.save();

  res.json({
    success: true,
    message: "Lead updated successfully",
    data: { lead },
  });
};

const deleteLead = async (req, res) => {
  const lead = await findAccessibleLead(req.params.id, req.user);
  await lead.deleteOne();

  res.json({
    success: true,
    message: "Lead deleted successfully",
    data: { id: lead._id },
  });
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
