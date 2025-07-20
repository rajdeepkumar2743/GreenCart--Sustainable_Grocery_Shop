import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
placeOrderRazorpay,
  razorpayWebhooks,
  updateOrderStatus,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.put('/update-status', authSeller, updateOrderStatus);
orderRouter.post('/razorpay/webhook', express.raw({ type: 'application/json' }), razorpayWebhooks);


export default orderRouter;