// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL, // Your Gmail address
        pass: process.env.PASS, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,

      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
