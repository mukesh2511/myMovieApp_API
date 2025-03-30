import nodemailer from "nodemailer";
import crypto from "crypto";

// Generate a 4-digit OTP
const generateSecureOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};

// Function to send OTP via email
export const sendOtpEmail = async (email) => {
  console.log(email);
  const otp = generateSecureOTP();

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USERFORNODEMAILER,
      pass: process.env.PASSFORNODEMAILER,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.USERFORNODEMAILER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. Please do not share it with anyone.`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    return otp; // Return the generated OTP
  } catch (error) {
    console.error("Error sending email:", error);
    return null; // Return null in case of error
  }
};
