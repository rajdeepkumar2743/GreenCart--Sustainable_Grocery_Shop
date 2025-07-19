import User from "../models/User.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register User with verification code
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isVerified) {
      return res.json({ success: false, message: "Email already exists" });
    } else {
      const code = generateVerificationCode();
      existingUser.verificationCode = code;
      existingUser.verificationExpiry = Date.now() + 10 * 60 * 1000; // 10 min
      await existingUser.save();

      await sendEmail({
        to: email,
        subject: "🔐 Your New GreenCart Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f6f6f6;">
            <div style="max-width: 480px; margin: auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h2 style="color: #27ae60;">👋 Hello ${existingUser.name},</h2>
              <p>We noticed you haven't verified your GreenCart account yet. Use the code below to complete your registration:</p>
              <div style="font-size: 32px; font-weight: bold; background: #eafaf1; color: #2ecc71; padding: 12px 24px; border-radius: 8px; text-align: center;">
                ${code}
              </div>
              <p style="margin-top: 16px;">This code will expire in <strong>10 minutes</strong>.</p>
              <p>Thank you for joining <strong>GreenCart</strong> 🌱</p>
              <hr style="margin: 24px 0;" />
              <p style="font-size: 12px; color: #888;">If you did not request this, you can safely ignore this email.</p>
            </div>
          </div>
        `
      });

      return res.json({ success: true, message: "Verification code re-sent to email" });
    }
  }

  const verificationCode = generateVerificationCode();
  const newUser = await User.create({
    name,
    email,
    password, // Let the model hash it via pre('save')
    verificationCode,
    verificationExpiry: Date.now() + 10 * 60 * 1000,
  });

  await sendEmail({
    to: email,
    subject: "🎉 Welcome to GreenCart! Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f6f6f6;">
        <div style="max-width: 480px; margin: auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #27ae60;">👋 Hello ${name},</h2>
          <p>Thank you for registering with <strong>GreenCart</strong> – your destination for sustainable grocery shopping!</p>
          <p>Use the verification code below to activate your account:</p>
          <div style="font-size: 32px; font-weight: bold; background: #eafaf1; color: #2ecc71; padding: 12px 24px; border-radius: 8px; text-align: center;">
            ${verificationCode}
          </div>
          <p style="margin-top: 16px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p>Let’s grow green together! 🌿</p>
          <hr style="margin: 24px 0;" />
          <p style="font-size: 12px; color: #888;">If you didn’t sign up, you can ignore this message.</p>
        </div>
      </div>
    `
  });

  res.json({ success: true, message: "Verification code sent to email" });
};

// Verify email with code
export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.verificationCode !== code) {
    return res.json({ success: false, message: "Invalid verification code" });
  }

  if (user.verificationExpiry && user.verificationExpiry < Date.now()) {
    return res.json({ success: false, message: "Verification code expired" });
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationExpiry = null;
  await user.save();

  res.json({ success: true, message: "Email verified successfully", user });
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.json({ success: false, message: "Please verify your email before login" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, user: { email: user.email, name: user.name } });
};

// Check Auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
