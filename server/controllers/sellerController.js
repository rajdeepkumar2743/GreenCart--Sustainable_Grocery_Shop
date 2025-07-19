import Seller from "../models/Seller.js";
import jwt from "jsonwebtoken";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import sendEmail from "../utils/sendEmail.js";

// 🔐 Create JWT
const createToken = (sellerId) =>
  jwt.sign({ id: sellerId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ Register Seller with Email Verification
export const registerSeller = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, password, panNumber,
      street, city, state, country, zip
    } = req.body;

    const existing = await Seller.findOne({ email });

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber))
      return res.json({ success: false, message: "Invalid PAN number format" });

    // 🔁 If already exists but not verified – resend code
    if (existing) {
      if (existing.isVerified) {
        return res.json({ success: false, message: "Email already registered" });
      } else {
        const code = generateVerificationCode();
        existing.verificationCode = code;
        existing.verificationExpiry = Date.now() + 10 * 60 * 1000;
        await existing.save();

        await sendEmail({
          to: email,
          subject: "🔐 Verify Your Seller Account - GreenCart",
          html: `
            <h3>Hello ${existing.name},</h3>
            <p>Use the following verification code to activate your seller account:</p>
            <h2>${code}</h2>
            <p>Expires in 10 minutes</p>
          `
        });

        return res.json({ success: true, message: "Verification code re-sent to email" });
      }
    }

    // ➕ New Seller Creation
    const verificationCode = generateVerificationCode();
    const newSeller = await Seller.create({
      name: `${firstName} ${lastName}`,
      email,
      number: phone,
      password,
      pan: panNumber,
      isVerified: false,
      verificationCode,
      verificationExpiry: Date.now() + 10 * 60 * 1000,
      address: {
        street,
        city,
        state,
        country,
        zipcode: zip,
      },
    });

    await sendEmail({
      to: email,
      subject: "🎉 Welcome to GreenCart Seller! Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f6f6f6;">
        <div style="max-width: 480px; margin: auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #27ae60;">👋 Hello ${firstName},</h2>
        <p>Thanks for registering as a seller on <strong>GreenCart</strong>.</p>
        <p>Use this verification code to activate your account:</p>
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
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Verify Seller Email
export const verifySellerEmail = async (req, res) => {
  const { email, code } = req.body;

  const seller = await Seller.findOne({ email });
  if (!seller || seller.verificationCode !== code) {
    return res.json({ success: false, message: "Invalid verification code" });
  }

  if (seller.verificationExpiry && seller.verificationExpiry < Date.now()) {
    return res.json({ success: false, message: "Verification code expired" });
  }

  seller.isVerified = true;
  seller.verificationCode = null;
  seller.verificationExpiry = null;
  await seller.save();

  res.json({ success: true, message: "Email verified successfully", seller });
};

// ✅ Seller Login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller || !(await seller.comparePassword(password))) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (!seller.isVerified) {
      return res.json({ success: false, message: "Please verify your email before login" });
    }

    const token = createToken(seller._id);

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
      },
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Logout Seller
export const sellerLogout = (req, res) => {
  res.clearCookie("sellerToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ success: true, message: "Logged Out" });
};

// ✅ Check Seller Auth
export const isSellerAuth = (req, res) => {
  res.json({ success: true, seller: req.seller });
};
