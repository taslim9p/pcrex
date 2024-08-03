import crypto from "crypto";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js"; // Adjust the path according to your project structure
import dotenv from "dotenv";

export const sendVerifyMail = async (email, user_id, name) => {
  try {
    const token = crypto.randomBytes(20).toString("hex"); // Generate a random token
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds

    await userModel.findByIdAndUpdate(user_id, {
      verificationToken: token,
      verificationTokenExpires: expirationTime,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Verification Mail",
      html: `
                <p>Hello <strong>${name}</strong>,</p>

                <p>Please click the link below to verify your account:</p>

                <a href="http://127.0.0.1:8080/api/v1/auth/verify?token=${token}">Verify your email</a>

                <h3>Link will be Expire in 15 minuts</h3>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log("Error in sendVerifyMail:", error.message);
  }
};
