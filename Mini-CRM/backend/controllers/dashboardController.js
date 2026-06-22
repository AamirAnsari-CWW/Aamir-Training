const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

const getDashboardStats = async (req, res) => {
  // Normal users see their own totals; admins see totals for the whole CRM.
  const ownerFilter =
    req.user.role === "admin" ? {} : { createdBy: req.user._id };

  // Group database records by status and count each group.
  const [customerStats, leadStats] = await Promise.all([
    Customer.aggregate([
      { $match: ownerFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: ownerFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  // Convert MongoDB's grouped arrays into simple dashboard numbers.
  const countByStatus = (stats, status) =>
    stats.find((item) => item._id === status)?.count || 0;
  const total = (stats) => stats.reduce((sum, item) => sum + item.count, 0);

  res.json({
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: {
      customers: {
        total: total(customerStats),
        active: countByStatus(customerStats, "Active"),
        inactive: countByStatus(customerStats, "Inactive"),
      },
      leads: {
        total: total(leadStats),
        new: countByStatus(leadStats, "New"),
        contacted: countByStatus(leadStats, "Contacted"),
        qualified: countByStatus(leadStats, "Qualified"),
        converted: countByStatus(leadStats, "Converted"),
      },
    },
  });
};

module.exports = { getDashboardStats };
