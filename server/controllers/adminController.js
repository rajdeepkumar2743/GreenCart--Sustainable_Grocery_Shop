// adminController.js

import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Utility: Standard Response Wrapper
const sendResponse = (res, status, success, message, data = {}) => {
  res.status(status).json({ success, message, ...data });
};

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return sendResponse(res, 401, false, 'Invalid Admin Credentials');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Admin Logged In Successfully');
  } catch (error) {
    console.error('🔴 Admin Login Error:', error);
    return sendResponse(res, 500, false, 'Server Error');
  }
};

// ✅ Admin Logout
export const adminLogout = (req, res) => {
  res.clearCookie('adminToken');
  return sendResponse(res, 200, true, 'Admin Logged Out Successfully');
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v -password');
    return sendResponse(res, 200, true, 'All Users Fetched', { users });
  } catch (error) {
    console.error('🔴 Get Users Error:', error);
    return sendResponse(res, 500, false, 'Failed to Fetch Users');
  }
};

// ✅ Get All Sellers
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-__v -password');
    return sendResponse(res, 200, true, 'All Sellers Fetched', { sellers });
  } catch (error) {
    console.error('🔴 Get Sellers Error:', error);
    return sendResponse(res, 500, false, 'Failed to Fetch Sellers');
  }
};

// ✅ Get All Addresses (Users + Sellers)
export const getAllAddresses = async (req, res) => {
  try {
    const users = await User.find().select('name email role number _id');
    const sellers = await Seller.find().select('name email role number address');
    const addresses = await Address.find();

    const userAddresses = users.map(user => {
      const userAddress = addresses.find(addr => addr.userId === user._id.toString());
      return {
        id: user._id,
        role: 'User',
        name: user.name,
        email: user.email,
        number: user.number,
        address: userAddress
          ? `${userAddress.street}, ${userAddress.city}, ${userAddress.state}, ${userAddress.country}, ${userAddress.zipcode}`
          : null,
      };
    });

    const sellerAddresses = sellers.map(seller => ({
      id: seller._id,
      role: 'Seller',
      name: seller.name,
      email: seller.email,
      number: seller.number,
      address: seller.address || null,
    }));

    const allAddresses = [...userAddresses, ...sellerAddresses];

    return sendResponse(res, 200, true, 'All Addresses Fetched', {
      addresses: allAddresses,
    });
  } catch (error) {
    console.error('🔴 Error fetching addresses:', error);
    return sendResponse(res, 500, false, 'Failed to Fetch Addresses');
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name email');
    return sendResponse(res, 200, true, 'All Products Fetched', { products });
  } catch (error) {
    console.error('🔴 Get Products Error:', error);
    return sendResponse(res, 500, false, 'Failed to Fetch Products');
  }
};

// ✅ Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.product', 'name price')
      .select('-__v');

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      userId: order.userId,
      amount: order.amount,
      cart: order.items,
      paymentMethod: order.paymentType,
      shippingInfo: order.address
        ? {
            address: `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`,
          }
        : null,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    }));

    return sendResponse(res, 200, true, 'All Orders Fetched', {
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('🔴 Get Orders Error:', error);
    return sendResponse(res, 500, false, 'Failed to Fetch Orders');
  }
};

// ✅ Check Admin Session
export const checkAdminAuth = (req, res) => {
  return sendResponse(res, 200, true, 'Admin Authorized');
};


