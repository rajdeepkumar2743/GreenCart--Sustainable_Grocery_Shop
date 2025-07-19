import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Loading = () => {
  const { navigate } = useAppContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next');

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 5000);
    }
  }, [nextUrl]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 backdrop-blur-lg transition-all duration-500">
      {/* Spinner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-24 w-24 border-[5px] border-gray-300 border-t-primary shadow-xl" />
        <div className="absolute text-sm text-gray-600 font-semibold animate-pulse">
          Loading...
        </div>
      </motion.div>

      {/* Message */}
      <motion.p
        className="mt-6 text-sm text-gray-500 tracking-wide text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Please wait while we redirect you
        <span className="animate-pulse text-primary font-semibold">...</span>
      </motion.p>
    </div>
  );
};

export default Loading;
