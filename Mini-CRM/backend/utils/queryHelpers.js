// Escape special characters before using user input in a regular expression.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Calculate which records MongoDB should skip for the requested page.
const getPagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || 10;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const getPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

// Search the supplied fields without treating user input as regex code.
const buildSearchFilter = (search, fields) => {
  if (!search || !search.trim()) {
    return {};
  }

  const safeSearch = escapeRegex(search.trim());
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: safeSearch, $options: "i" },
    })),
  };
};

// Keep only fields that the client is allowed to create or update.
const pickAllowedFields = (body, allowedFields) =>
  allowedFields.reduce((result, field) => {
    if (body[field] !== undefined) {
      result[field] = body[field];
    }
    return result;
  }, {});

module.exports = {
  getPagination,
  getPaginationMeta,
  buildSearchFilter,
  pickAllowedFields,
};
