const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

// Create a JWT that identifies the logged-in user.
const createToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

// Return user details without exposing the password.
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.exists({ email });

  if (userExists) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Never store a plain-text password in the database.
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      token: createToken(user._id),
      user: publicUser(user),
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Password is hidden by the model, so select it only while checking login.
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token: createToken(user._id),
      user: publicUser(user),
    },
  });
};

const getProfile = async (req, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully",
    data: { user: publicUser(req.user) },
  });
};

module.exports = { registerUser, loginUser, getProfile };
