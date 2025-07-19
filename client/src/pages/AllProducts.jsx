import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <motion.div
      className="min-h-screen mt-20 px-4 md:px-12 lg:px-20 xl:px-32 pb-16 bg-gradient-to-br from-[#f4fcf9] via-white to-[#eef4ff] text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center text-center mb-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wider font-[Poppins]">
          All Products
        </p>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </motion.div>

      <motion.div

        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"

        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredProducts
          .filter(product => product.inStock)
          .map((product, index) => (
            <motion.div
              key={index}
              className="transform transition duration-300 hover:-translate-y-1 hover:shadow-xl rounded-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default AllProducts;
