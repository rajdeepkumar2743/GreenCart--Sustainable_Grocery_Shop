import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainBanner = () => {
  return (
    <div className='relative overflow-hidden group'>

      {/* Banner Image */}
      <motion.img
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
        src={assets.main_banner_bg}
        alt="banner"
        className='w-full hidden md:block object-cover transition-transform duration-1000 group-hover:scale-105'
      />
      <motion.img
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
        src={assets.main_banner_bg_sm}
        alt="banner"
        className='w-full md:hidden object-cover transition-transform duration-1000 group-hover:scale-105'
      />

      {/* Overlay Text & Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24 z-10'
      >
        <div className="bg-white/70 md:bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-lg md:max-w-xl text-center md:text-left transition-all duration-500">
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold max-w-72 md:max-w-2xl leading-tight lg:leading-[3.5rem] text-gray-800 drop-shadow-md transition-all duration-500'>
            Freshness You Can Trust,
            <br />
            <span className='text-primary block mt-2'>Savings You will Love!</span>
          </h1>

          {/* CTA Buttons */}
          <div className='flex items-center justify-center md:justify-start mt-6 font-medium gap-3 flex-wrap'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/products"
                className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition-all duration-300 rounded-lg text-white shadow-xl hover:shadow-2xl'
              >
                Shop now
                <img
                  className='transition-transform duration-300 group-hover:translate-x-1 w-4'
                  src={assets.white_arrow_icon}
                  alt="arrow"
                />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/products"
                className='group hidden md:flex items-center gap-2 px-9 py-3 bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 transition rounded-lg shadow-md hover:shadow-lg'
              >
                Explore deals
                <img
                  className='transition-transform group-hover:translate-x-1 w-4'
                  src={assets.black_arrow_icon}
                  alt="arrow"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainBanner;
