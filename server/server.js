import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';
import { razorpayWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Razorpay Webhook Route – must be BEFORE express.json
app.post('/razorpay/webhook', express.raw({ type: 'application/json' }), razorpayWebhooks);

// ✅ CORS setup
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Cookie parser
app.use(cookieParser());

// ✅ JSON parser (skip raw route)
app.use((req, res, next) => {
  if (req.originalUrl === '/razorpay/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// ✅ Health check
app.get('/', (req, res) => res.send("✅ API is Working"));

// ✅ Route handlers
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
