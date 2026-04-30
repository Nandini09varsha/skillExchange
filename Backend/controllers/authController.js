import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/* ================= HELPER ================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (ONLY required fields)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with JWT
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Security: always return the same message whether user exists or not
    // This prevents email enumeration attacks
    if (!user) {
      return res.status(200).json({ message: "Password reset email sent" });
    }

    // 1. Generate a raw random token (this goes in the email link)
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash it before saving to DB (so a DB breach can't be exploited)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // 3. Save the HASHED token + expiry to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // 4. Send the RAW token in the email link
    const resetUrl = `http://localhost:5173/reset-password/${rawToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your SkillSwap Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #7c3aed;">SkillSwap Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the button below. 
             This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" 
             style="display:inline-block; padding: 12px 24px; background:#7c3aed;
                    color:#fff; border-radius:8px; text-decoration:none; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color:#888; font-size:12px;">
            If you didn't request this, ignore this email. Your password won't change.
          </p>
        </div>
      `,
    });

    res.status(200).json({ message: "Password reset email sent" });

  } catch (error) {
    console.error("forgotPassword error:", error);
    // If email sending fails, clean up the token so user can try again
    if (error.message?.includes("nodemailer") || error.code === "EAUTH") {
      await User.findOneAndUpdate(
        { email: req.body.email },
        { resetPasswordToken: undefined, resetPasswordExpire: undefined }
      );
      return res.status(500).json({ message: "Failed to send email. Check your email configuration." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 1. Hash the raw token from the URL to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 2. Find user with matching hashed token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    // 3. Hash and set new password
    user.password = await bcrypt.hash(password, 10);

    // 4. Clear the reset token fields (one-time use)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};