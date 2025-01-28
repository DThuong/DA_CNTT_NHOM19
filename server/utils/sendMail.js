const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async ({ email, html, subject }) => {
  if (!process.env.EMAIL_NAME || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Email credentials are not set in environment variables.");
  }

  if (!email) {
    throw new Error("Recipient email address must be provided.");
  }

  if (!html) {
    throw new Error("HTML content must be provided.");
  }

  if (!subject) {
    throw new Error("Email subject must be provided.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_NAME, // Email username
        pass: process.env.EMAIL_APP_PASSWORD, // Email app password
      },
    });

    const info = await transporter.sendMail({
      from: `"E-commerce 👻" <${process.env.EMAIL_NAME}>`, // Sender address
      to: email, // Receiver email
      subject: subject, // Email subject
      html: html, // HTML body content
    });

    console.log(`Email sent successfully to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
});

module.exports = {
  sendEmail,
};
