import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className="mt-16 px-2 md:px-0 bg-gradient-to-br from-white via-[#f9fafb] to-[#eef4ff] rounded-xl py-10 shadow-md transition-all duration-300">
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex justify-between items-center mb-8 px-4"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            🌟 <span className="text-primary">Best Sellers</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Discover our top-rated, most popular products
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 px-4"
      >
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <motion.div
              key={index}
              className="hover:scale-[1.04] hover:shadow-2xl transition-all duration-300 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default BestSeller;
