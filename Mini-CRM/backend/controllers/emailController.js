const sendEmail = require("../utils/sendEmail");

const sendCustomerEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  await sendEmail({
    to,
    subject,
    message,
  });

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
    data: {
      to,
      subject,
    },
  });
};

module.exports = {sendCustomerEmail,};