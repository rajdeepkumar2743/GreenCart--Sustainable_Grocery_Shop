import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find((item) => item.path.toLowerCase() === category);
  const filteredProducts = products.filter((product) => product.category.toLowerCase() === category);

  return (
    <motion.div
      className='mt-20 pb-16 px-4 md:px-10 lg:px-20 xl:px-32 min-h-screen bg-gradient-to-br from-[#fdfbff] via-[#f2f7ff] to-[#e9f0ff] font-[Inter]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {searchCategory && (
        <motion.div
          className='flex flex-col items-start mb-10'
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className='text-4xl font-extrabold text-gray-800 tracking-wide'>{searchCategory.text.toUpperCase()}</p>
          <div className="w-24 h-1 bg-indigo-600 rounded-full mt-2"></div>
        </motion.div>
      )}

      {filteredProducts.length > 0 ? (
        <motion.div
          className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 md:gap-8'
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className='flex items-center justify-center h-[60vh]'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className='text-2xl font-semibold text-indigo-600/80 text-center'>
            No products found in this category.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCategory;
