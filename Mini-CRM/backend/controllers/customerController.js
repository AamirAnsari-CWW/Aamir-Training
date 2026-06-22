const Customer = require("../models/Customer");
const ApiError = require("../utils/ApiError");
const {
  getPagination,
  getPaginationMeta,
  buildSearchFilter,
  pickAllowedFields,
} = require("../utils/queryHelpers");

const allowedFields = ["name", "email", "phone", "company", "status"];

// Admins can access all customers; normal users access only their own.
const ownerFilter = (user) => (user.role === "admin" ? {} : { createdBy: user._id });

// Find a customer only when the current user is allowed to access it.
const findAccessibleCustomer = async (id, user) => {
  const customer = await Customer.findOne({ _id: id, ...ownerFilter(user) });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return customer;
};

const createCustomer = async (req, res) => {
  const customer = await Customer.create({
    // Ignore unexpected fields such as createdBy or role.
    ...pickAllowedFields(req.body, allowedFields),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: { customer },
  });
};

const getCustomers = async (req, res) => {
  // Convert page and limit query values into values MongoDB can use.
  const { page, limit, skip } = getPagination(req.query);

  // Combine ownership rules with optional text search and status filtering.
  const filter = {
    ...ownerFilter(req.user),
    ...buildSearchFilter(req.query.search, ["name", "email", "company", "phone"]),
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [customers, total] = await Promise.all([
    // Fetch the requested page and count all matching records at the same time.
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  res.json({
    success: true,
    message: "Customers fetched successfully",
    data: { customers },
    meta: getPaginationMeta(total, page, limit),
  });
};

const getCustomerById = async (req, res) => {
  const customer = await findAccessibleCustomer(req.params.id, req.user);

  res.json({
    success: true,
    message: "Customer fetched successfully",
    data: { customer },
  });
};

const updateCustomer = async (req, res) => {
  const customer = await findAccessibleCustomer(req.params.id, req.user);

  // Change only fields that customers are allowed to edit.
  Object.assign(customer, pickAllowedFields(req.body, allowedFields));
  await customer.save();

  res.json({
    success: true,
    message: "Customer updated successfully",
    data: { customer },
  });
};

const deleteCustomer = async (req, res) => {
  const customer = await findAccessibleCustomer(req.params.id, req.user);
  await customer.deleteOne();

  res.json({
    success: true,
    message: "Customer deleted successfully",
    data: { id: customer._id },
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
