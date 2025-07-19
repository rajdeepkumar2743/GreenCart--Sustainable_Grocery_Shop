import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 backdrop-blur-2xl bg-gradient-to-br from-white/70 via-[#f0f9ff]/70 to-[#e4f1fd]/70 border-b border-gray-300 sticky top-0 z-50 shadow-xl transition-all duration-300 font-[Poppins]"
    >
      {/* Logo */}
      <NavLink to='/' onClick={() => setOpen(false)}>
        <motion.img
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="h-10 drop-shadow-lg"
          src={assets.logo}
          alt="logo"
        />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-10 text-gray-700 font-medium text-[15px]">

        {/* Seller Dashboard */}
        <NavLink
          to="/seller"
          className="px-4 py-1.5 border border-gray-300 rounded-full bg-white/90 hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
        >
          Seller Dashboard
        </NavLink>

        <NavLink to='/' className="hover:text-primary transition-all duration-300 hover:underline underline-offset-4">Home</NavLink>
        <NavLink to='/products' className="hover:text-primary transition-all duration-300 hover:underline underline-offset-4">All Product</NavLink>
        <NavLink to='/contact' className="hover:text-primary transition-all duration-300 hover:underline underline-offset-4">Contact</NavLink>

        {/* Search */}
        <motion.div
          className="hidden lg:flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-200"
          whileFocus={{ scale: 1.05 }}
        >
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 bg-transparent outline-none placeholder-gray-500 text-sm w-36 focus:w-44 transition-all duration-300"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt='search' className='w-4 h-4' />
        </motion.div>

        {/* Cart */}
        <motion.div
          onClick={() => navigate("/cart")}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer"
        >
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-md">
            {getCartCount()}
          </span>
        </motion.div>

        {/* Login/Profile */}
        {!user ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowUserLogin(true)}
            className="px-6 py-2 bg-primary hover:bg-green-500 text-white rounded-full transition-all duration-300 shadow-md"
          >
            Login
          </motion.button>
        ) : (
          <div className='relative group'>
            <img
              src={assets.profile_icon}
              className='w-10 cursor-pointer hover:scale-105 transition duration-300 drop-shadow'
              alt="profile"
            />
            <ul className='hidden group-hover:flex flex-col absolute top-11 right-0 bg-white shadow-xl border border-gray-200 py-2.5 w-36 rounded-md text-sm z-40 animate-fade-in'>
              <li onClick={() => navigate("/my-orders")} className='p-2 pl-4 hover:bg-primary/10 cursor-pointer transition'>My Orders</li>
              <li onClick={logout} className='p-2 pl-4 hover:bg-primary/10 cursor-pointer transition'>Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Right Section */}
      <div className='flex items-center gap-6 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {getCartCount()}
          </span>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt='menu' />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-[64px] left-0 w-full bg-gradient-to-br from-white via-[#f4faff] to-[#ebf3ff] shadow-md py-6 flex flex-col items-start gap-4 px-6 text-sm md:hidden border-t border-gray-200 z-40 backdrop-blur-lg"
          >
            {/* Seller Dashboard */}
            <NavLink to="/seller" onClick={() => setOpen(false)} className="hover:text-primary transition">Seller Dashboard</NavLink>
            <NavLink to="/" onClick={() => setOpen(false)} className="hover:text-primary transition">Home</NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)} className="hover:text-primary transition">All Product</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className="hover:text-primary transition">Contact</NavLink>
            {user && (
              <NavLink to="/my-orders" onClick={() => setOpen(false)} className="hover:text-primary transition">My Orders</NavLink>
            )}
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm transition shadow"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="px-6 py-2 mt-2 bg-primary hover:bg-red-500 text-white rounded-full text-sm transition shadow"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
