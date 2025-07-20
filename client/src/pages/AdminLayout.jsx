import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Menu } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    document.cookie = 'adminToken=; Max-Age=0; path=/;';
    navigate('/admin');
  };

  // Hide header and sidebar on login screen
  const hideHeaderRoutes = ['/admin', '/admin/login'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#d9f5e8] via-[#f0f9ff] to-[#e5e8fa] font-[Outfit] text-gray-800 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row min-h-screen"
      >
       
        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          {!shouldHideHeader && (
            <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-md shadow-sm border-b border-gray-200">
              <div className="flex items-center justify-between px-4 md:px-8 py-3">
                <div className="flex items-center gap-2">
                  {!showSidebar && (
                    <button className="md:hidden" onClick={() => setShowSidebar(true)}>
                      <Menu className="w-6 h-6 text-green-700" />
                    </button>
                  )}
                  <h1 className="text-xl font-semibold text-green-700">Admin Dashboard</h1>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-red-400 px-4 py-1.5 rounded-full bg-white text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-lg transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className="flex-1 w-full px-4 md:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
