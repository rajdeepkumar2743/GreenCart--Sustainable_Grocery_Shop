import React from 'react';
import { assets, features } from '../assets/assets';
import { motion } from 'framer-motion';

const BottomBanner = () => {
  return (
    <div className="relative mt-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#f0fdf4] via-white to-[#e0f7fa] shadow-xl transition-all duration-300">

      {/* Responsive Banner Image */}
      <motion.img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block object-cover rounded-xl"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden object-cover rounded-xl"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24 px-4">

        <motion.div
          className="bg-white/80 md:bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-xl md:max-w-md w-full border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-3xl font-extrabold text-primary mb-6 tracking-tight text-center md:text-left">
            ⭐ Why We Are the Best?
          </h1>

          {/* Features List */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 mt-5 group hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-10 md:w-11 drop-shadow-md"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-gray-500/90 text-sm mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BottomBanner;
