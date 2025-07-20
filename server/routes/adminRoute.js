import express from 'express';
import {
  adminLogin,
  adminLogout,
  getAllUsers,
  getAllSellers,
  getAllProducts,
  getAllAddresses,
  getAllOrders,
  checkAdminAuth,
} from '../controllers/adminController.js';

import authAdmin from '../middlewares/authAdmin.js';

const router = express.Router();

// 🟢 Admin Login - No Auth Required
router.post('/login', adminLogin);

// 🔒 Routes below require admin auth
router.use(authAdmin);

// 🔴 Admin Logout
router.get('/logout', adminLogout);

// 👤 Get All Users
router.get('/users', getAllUsers);

// 🛍️ Get All Sellers
router.get('/sellers', getAllSellers);

// 📦 Get All Products
router.get('/products', getAllProducts);

// 📑 Get All Orders
router.get('/orders', getAllOrders);

// 📑 Get All addresses (Users + Sellers)
router.get('/addresses', getAllAddresses);

// ✅ Check Admin Session Validity
router.get('/check', checkAdminAuth);


export default router;
