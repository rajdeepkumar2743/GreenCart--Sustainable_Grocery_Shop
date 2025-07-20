import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Welcome, Admin");
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-[Outfit]">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
        {/* Left Side - Welcome */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-200 to-green-400 dark:from-green-700 dark:to-green-800 p-10">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-green-900 dark:text-white text-center"
          >
            Welcome Back, Admin
          </motion.h1>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
                <span className="text-green-600">Admin</span> Login
              </h2>

              <form onSubmit={loginHandler} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold uppercase tracking-wider transition duration-300 shadow hover:shadow-lg"
                >
                  {loading ? "Logging in..." : "Login"}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Input Styles */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background-color: #fff;
          font-size: 15px;
          color: #1f2937;
          transition: all 0.2s ease;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }
        .dark .input-field {
          background-color: #1f2937;
          color: #f3f4f6;
          border-color: #374151;
        }
        .input-field:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
