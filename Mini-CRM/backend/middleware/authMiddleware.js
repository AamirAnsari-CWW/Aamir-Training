const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

// Verify the JWT and attach the logged-in user to req.user.
const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, env.jwtSecret);

  // Confirm that the user still exists after the token was created.
  const user = await User.findById(decoded.id).select("-password").lean();

  if (!user) {
    throw new ApiError(401, "The user for this token no longer exists");
  }

  req.user = user;
  next();
};

// Allow a route only when the user has one of the required roles.
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(403, "You do not have permission to perform this action")
    );
  }

  next();
};

module.exports = { protect, authorize };
