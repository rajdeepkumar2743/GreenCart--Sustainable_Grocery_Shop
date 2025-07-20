import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import SellerLogin from './components/seller/SellerLogin';
import AdminLogin from './components/admin/AdminLogin';
import Loading from './components/Loading';

import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import Contact from './pages/Contact';
import MyOrders from './pages/MyOrders';

import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';

import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/dashboard';

import { useAppContext } from './context/AppContext';

const App = () => {
  const location = useLocation();
  const { showUserLogin, isSeller } = useAppContext();

  const isSellerPath = location.pathname.includes('/seller');
  const isAdminPath = location.pathname.includes('/admin');
  const shouldUseFullWidth = isSellerPath || isAdminPath;

  return (
    <div className="text-default min-h-screen bg-gradient-to-br from-white via-[#f6f8fc] to-[#eaf0fb] text-gray-800 font-[Outfit] transition-all duration-300 ease-in-out selection:bg-indigo-200 selection:text-indigo-900">

      {/* Navbar */}
      {!shouldUseFullWidth && <Navbar />}

      {/* Login Modal */}
      {showUserLogin && <Login />}

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Outfit, sans-serif',
            borderRadius: '8px',
            background: '#fff',
            color: '#333',
            padding: '12px 16px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          },
        }}
      />

      {/* Page Transitions */}
      <main className={`${shouldUseFullWidth ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32 pt-4 md:pt-8 pb-12 md:pb-16 transition-smooth'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/products/:category" element={<ProductCategory />} />
              <Route path="/products/:category/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/add-address" element={<AddAddress />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/loader" element={<Loading />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
              </Route>

              {/* Seller Routes */}
              <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
                <Route index element={isSeller ? <AddProduct /> : null} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!shouldUseFullWidth && <Footer />}
    </div>
  );
};

export default App;
