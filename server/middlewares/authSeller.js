import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized: No token found",
      });
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id).select("-password");

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "Seller not found or token invalid",
      });
    }

    req.seller = seller;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authSeller;
