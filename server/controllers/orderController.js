import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import razorpayInstance from "../configs/razorpay.js";
import crypto from "crypto";



// ✅ Place Order - COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.04); // Add 4% tax

    if (amount < 150) {
      amount += 20; // Add shipping fee if order < 150
    }

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    const user = await User.findById(userId);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN");

    await sendEmail({
      to: user.email,
      subject: "Order Placed - GreenCart",
      html: getOrderEmail(
        user.name,
        order._id,
        "Order Preparing",
        totalQuantity,
        "Cash on Delivery",
        amount,
        orderDate
      ),
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Place Order - Razorpay
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let baseAmount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    let shippingFee = baseAmount < 150 ? 20 : 0;
    let tax = Math.floor(baseAmount * 0.04);
    let amount = baseAmount + tax + shippingFee;

    if (amount < 50) {
      return res.json({
        success: false,
        message: "Minimum order value must be at least ₹50 for online payments.",
      });
    }

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: order._id.toString(),
      notes: {
        userId,
        orderId: order._id.toString(),
      },
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      orderDbId: order._id,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// ✅ Stripe Webhook
export const razorpayWebhooks = async (req, res) => {
  const secret = process.env.Razorpay_Webhook_Secret;
  const signature = req.headers["x-razorpay-signature"];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).send("Invalid signature");
  }

  if (body.event === "payment.captured") {
    try {
      const orderId = body.payload.payment.entity.notes.orderId;
      const userId = body.payload.payment.entity.notes.userId;

      const order = await Order.findByIdAndUpdate(orderId, { isPaid: true }, { new: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      const user = await User.findById(userId);
      const totalQuantity = order.items.reduce((acc, item) => acc + item.quantity, 0);
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN");

      await sendEmail({
        to: user.email,
        subject: "Payment Successful - GreenCart",
        html: getOrderEmail(
          user.name,
          order._id,
          "Paid",
          totalQuantity,
          "Online Payment",
          order.amount,
          orderDate
        ),
      });
    } catch (err) {
      console.error("❌ Error in Razorpay webhook logic:", err.message);
    }
  }

  res.json({ received: true });
};

// ✅ Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address").sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Orders for Seller Only (Updated)
export const getAllOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product").populate("address").sort({ createdAt: -1 });

    const filteredOrders = orders.filter(order =>
      order.items.some(item => item.product?.sellerId?.toString() === sellerId.toString())
    );

    filteredOrders.forEach(order => {
      order.items = order.items.filter(item =>
        item.product?.sellerId?.toString() === sellerId.toString()
      );
    });

    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Order Status (Enhanced)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;

    // ✅ Mark COD as paid if delivered
    if (status === "Delivered" && order.paymentType === "COD") {
      order.isPaid = true;
    }

    await order.save();

    const user = await User.findById(order.userId);
    const totalQuantity = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN");
    const paymentMethod = order.paymentType === "COD" ? "Cash on Delivery" : "Online Payment";

    await sendEmail({
      to: user.email,
      subject: `Order Status Updated - ${status}`,
      html: getOrderEmail(
        user.name,
        order._id,
        status,
        totalQuantity,
        paymentMethod,
        order.amount,
        orderDate
      ),
    });

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Email Template
const getOrderEmail = (name, orderId, status, quantity, paymentMethod, totalAmount, orderDate) => {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.6;color:#333;background:linear-gradient(145deg,#f9f9f9,#e6f2e6);padding:30px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:600px;margin:0 auto;border:1px solid #d4d4d4;">
      <h2 style="color:#2e7d32;">Hello ${name},</h2>
      <p style="margin-top:20px;">Your order <strong style="color:#1b5e20;">#${orderId}</strong> status has been updated.</p>
      <p style="margin:10px 0;"><strong>Status:</strong> 
        <span style="color:${status.toLowerCase() === 'delivered' ? '#2e7d32' : status.toLowerCase() === 'cancelled' ? '#d32f2f' : '#f9a825'};font-weight:bold;">
          ${status}
        </span>
      </p>
      <div style="margin-top:20px;padding:15px;background-color:#f4fff6;border:1px dashed #a5d6a7;border-radius:8px;">
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
      </div>
      <hr style="margin:30px 0;border:none;border-top:1px solid #ccc;">
      <p style="font-size:15px;">Thank you for shopping with <strong style="color:#388e3c;">GreenCart</strong>!</p>
    </div>
  `;
};
