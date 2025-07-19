// models/Seller.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  pan: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // ✅ PAN format validation
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationExpiry: Date,
}, { timestamps: true });

// ✅ Hash password before save
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password method
sellerSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
