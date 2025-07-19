import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="mt-20">
      <motion.p
        className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-4 text-center md:text-left"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🛍️ Shop by <span className="text-primary">Categories</span>
      </motion.p>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 mt-8 gap-6"
        initial="hidden"
        whileInView="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            className="group cursor-pointer flex flex-col justify-center items-center text-center gap-3 py-5 px-3 rounded-xl border border-gray-200 shadow-sm bg-white/70 backdrop-blur-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
            style={{
              backgroundColor: category.bgColor,
              boxShadow: `0 4px 16px ${category.bgColor}55`,
            }}
            whileHover={{ scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="w-20 h-20 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
            />
            <p className="text-sm font-semibold text-gray-700 group-hover:text-primary tracking-wide">
              {category.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
