const nodemailer = require("nodemailer");
const env = require("../config/env");
const ApiError = require("./ApiError");

const transporter = nodemailer.createTransport({
  ...(env.email.host
    ? { host: env.email.host }
    : { service: "gmail" }),

  port: env.email.port,
  secure: env.email.secure,

  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

const sendEmail = async ({
  to,
  subject,
  message,
}) => {
  if (!env.email.user || !env.email.pass) {
    throw new ApiError(
      503,
      "Email service is not configured"
    );
  }

  await transporter.sendMail({
    from: env.email.from,
    to,
    subject,
    text: message,
  });
};

module.exports = sendEmail;