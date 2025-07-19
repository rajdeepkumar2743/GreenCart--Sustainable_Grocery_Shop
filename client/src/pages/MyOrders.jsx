import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Preparing': return 'bg-yellow-100 text-yellow-700';
      case 'Out for delivery': return 'bg-orange-100 text-orange-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='mt-20 pb-20 px-4 md:px-10 lg:px-20 xl:px-32 bg-gradient-to-br from-[#f9fbff] via-[#eef2ff] to-[#e3ecff] min-h-screen font-[Inter]'
    >
      <motion.div
        className='flex flex-col items-end w-max mb-8'
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <p className='text-3xl font-extrabold text-gray-800 uppercase tracking-wide'>My Orders</p>
        <div className='w-20 h-1 bg-indigo-600 rounded-full mt-1'></div>
      </motion.div>

      {myOrders.length === 0 && (
        <motion.p
          className="text-gray-500 text-center text-lg mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          You haven't placed any orders yet.
        </motion.p>
      )}

      {myOrders.map((order, index) => (
        <motion.div
          key={index}
          className='border border-gray-300 bg-white rounded-xl mb-10 p-5 shadow-md hover:shadow-xl transition-all max-w-4xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <p className='flex justify-between md:items-center text-gray-500 font-medium text-sm max-md:flex-col max-md:gap-2'>
            <span><span className="font-semibold text-gray-700">Order ID:</span> {order._id}</span>
            <span><span className="font-semibold text-gray-700">Payment:</span> {order.paymentType}</span>
            <span><span className="font-semibold text-gray-700">Total:</span> {currency}{order.amount}</span>
          </p>

          <div className="mt-4 divide-y divide-gray-200">
            {order.items.map((item, itemIndex) => (
              <div
                key={item._id || itemIndex}
                className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4"
              >
                {/* Product Info */}
                <div className='flex items-center gap-4'>
                  <div className='bg-indigo-50 p-3 rounded-lg'>
                    <img
                      src={item?.product?.image?.[0]}
                      alt="product"
                      className='w-16 h-16 object-cover rounded-md shadow-sm'
                    />
                  </div>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      {item?.product?.name}
                    </h2>
                    <p className="text-sm text-gray-500">Category: {item?.product?.category}</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className='flex flex-col gap-1 text-sm text-gray-600 md:text-right'>
                  <p><span className="font-medium">Quantity:</span> {item?.quantity || "1"}</p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </p>
                  <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Price */}
                <p className='text-indigo-600 text-lg font-semibold text-right'>
                  ₹{(item?.product?.offerPrice || 0) * (item?.quantity || 1)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MyOrders;
