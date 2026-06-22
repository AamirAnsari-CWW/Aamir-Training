const dotenv = require("dotenv");

dotenv.config();

const requiredVariables = ["MONGO_URI", "JWT_SECRET"];

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVariables.join(", ")}`
  );
}

if (
  process.env.JWT_SECRET &&
  process.env.JWT_SECRET.length < 32
) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters"
    );
  }
  console.warn(
    "Warning: JWT_SECRET should contain at least 32 characters"
  );
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  clientUrl: process.env.CLIENT_URL || "*",

  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  },
};