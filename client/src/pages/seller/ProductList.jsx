// ✅ Updated ProductList.jsx
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductList = () => {
  const { currency, axios } = useAppContext();
  const [products, setProducts] = useState([]);

  const fetchSellerProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/seller-products');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch seller's products");
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', { id, inStock });
      if (data.success) {
        fetchSellerProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gradient-to-br from-[#f5fdf8] via-[#fdfdfd] to-[#f0f4ff]"
    >
      <div className="w-full md:p-10 p-4">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pb-4 text-2xl font-semibold text-gray-800 border-b border-gray-300 w-fit mb-4 tracking-wide"
        >
          Your Products
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center max-w-6xl w-full mx-auto rounded-xl bg-white/80 shadow-md border border-gray-200 backdrop-blur-md overflow-hidden"
        >
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-800 text-[13px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold text-left">Product</th>
                <th className="px-4 py-3 font-semibold text-left">Category</th>
                <th className="px-4 py-3 font-semibold text-left hidden md:table-cell">Selling Price</th>
                <th className="px-4 py-3 font-semibold text-left">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
              {products.map((product, index) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="px-4 py-4 flex items-center gap-4">
                    <div className="border border-gray-200 rounded-lg p-1 w-16 h-16 bg-white shadow-sm overflow-hidden">
                      <img
                        src={product.image[0]}
                        alt="Product"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <span className="truncate max-sm:hidden font-medium">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 capitalize">{product.category}</td>
                  <td className="px-4 py-4 hidden md:table-cell font-semibold text-primary">
                    {currency}{product.offerPrice}
                  </td>
                  <td className="px-4 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        onClick={() => toggleStock(product._id, !product.inStock)}
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors duration-300"></div>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductList;