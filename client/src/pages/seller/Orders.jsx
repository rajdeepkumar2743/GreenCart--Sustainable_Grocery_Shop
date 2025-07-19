import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  // Fetch orders from server
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle status update
  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const { data } = await axios.put('/api/order/update-status', {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOrders(); // refresh
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gradient-to-br from-[#f6fcfa] via-[#ffffff] to-[#f0f4ff]"
    >
      <div className="md:p-10 p-4 space-y-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold text-gray-800 border-b pb-2 border-gray-300 w-fit tracking-wide"
        >
          Orders List
        </motion.h2>

        {orders.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-base">No orders found.</p>
        )}

        {orders.map((order, index) => (
          <motion.div
            key={order._id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex flex-col md:flex-row md:items-start justify-between gap-6 p-6 bg-white/80 rounded-xl shadow-md hover:shadow-xl border border-gray-200 backdrop-blur-sm transition-all duration-300"
          >
            {/* Product Info */}
            <div className="flex gap-4 max-w-80">
              <img
                className="w-14 h-14 object-contain drop-shadow-sm"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div className="flex flex-col gap-1 text-sm font-medium text-gray-800">
                {order.items.map((item, itemIndex) => (
                  <div key={item._id || itemIndex}>
                    {item?.product?.name || "Unknown Product"}{' '}
                    <span className="text-primary font-semibold">x{item.quantity || 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Info */}
            <div className="text-sm text-gray-700 space-y-0.5 max-w-xs">
              <p className="font-semibold text-black">
                {order?.address?.firstName || ''} {order?.address?.lastName || ''}
              </p>
              <p>{order?.address?.street || ''}, {order?.address?.city || ''}</p>
              <p>{order?.address?.state || ''}, {order?.address?.zipcode || ''}, {order?.address?.country || ''}</p>
              <p>{order?.address?.phone || ''}</p>
            </div>

            {/* Total Amount */}
            <p className="text-lg font-bold text-primary mt-2 md:mt-0 whitespace-nowrap">
              {currency}{order.amount}
            </p>

            {/* Payment + Status */}
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <p><span className="font-medium">Method:</span> {order.paymentType}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>
                  <span className="font-medium">Payment:</span>{' '}
                  <span className={
                    (order.isPaid || order.orderStatus === 'Delivered')
                      ? 'text-green-600 font-semibold'
                      : 'text-red-500 font-semibold'
                  }>
                    {(order.isPaid || order.orderStatus === 'Delivered') ? 'Paid' : 'Pending'}
                  </span>
                </p>
              </div>

              {/* Order Status Dropdown */}
              <div>
                <label htmlFor="status" className="block font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  id="status"
                  value={order.orderStatus || 'Order Preparing'}
                  onChange={(event) => updateStatus(event, order._id)}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="Order Preparing">Order Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Orders;
