import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', phone: '', panNumber: '', password: '',
    street: '', city: '', state: '', zip: '', country: ''
  });

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/seller/login', loginData);
      if (data.success) {
        const authRes = await axios.get("/api/seller/is-auth");
        if (authRes.data.success) {
          setIsSeller(true);
          toast.success("Login Successful");
          navigate('/seller');
        } else {
          toast.error("Auth failed after login.");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/seller/register', signupData);
      if (data.success) {
        setSignupEmail(signupData.email);
        setShowVerification(true);
        toast.success('Verification code sent to email');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) return toast.error("Enter code");
    try {
      const { data } = await axios.post('/api/seller/verify', {
        email: signupEmail,
        code: verificationCode
      });
      if (data.success) {
        toast.success("Email verified successfully");
        setShowVerification(false);
        setIsLogin(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Verification failed");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white font-[Outfit]">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Welcome Panel */}
        <div className="hidden md:flex bg-green-700 w-1/2 items-center justify-center px-10">
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="text-4xl text-6xl font-bold text-white text-center"
>
  {isLogin ? (
    <>Welcome Back,<br />Seller</>
  ) : (
    <>Welcome to GreenCart,<br />Seller</>
  )}
</motion.h1>

        </div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 bg-gray-900 p-8 md:p-14"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold text-green-500 mb-6 text-center"
            >
              {isLogin ? "Login" : "Signup"}
            </motion.p>
          </AnimatePresence>

          {/* Login Form */}
          {isLogin ? (
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
                className="input-field"
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                className="input-field"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold uppercase tracking-wider transition duration-300 shadow-md hover:shadow-lg text-base"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </motion.button>
            </motion.form>
          ) : (
            /* Signup Form */
            <motion.form
              key="signup"
              onSubmit={handleSignup}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })} className="input-field" required />
                <input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })} className="input-field" required />
              </div>
              <input type="email" name="email" placeholder="Email Address" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} className="input-field w-full" required />
              <input type="text" name="phone" placeholder="Phone" value={signupData.phone} onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })} className="input-field w-full" required />
              <input type="text" name="panNumber" placeholder="PAN Number" value={signupData.panNumber} onChange={(e) => setSignupData({ ...signupData, panNumber: e.target.value })} className="input-field w-full" required />
              <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} className="input-field w-full" required />
              <input type="text" name="street" placeholder="Street" value={signupData.street} onChange={(e) => setSignupData({ ...signupData, street: e.target.value })} className="input-field w-full" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="city" placeholder="City" value={signupData.city} onChange={(e) => setSignupData({ ...signupData, city: e.target.value })} className="input-field" required />
                <input type="text" name="state" placeholder="State" value={signupData.state} onChange={(e) => setSignupData({ ...signupData, state: e.target.value })} className="input-field" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="zip" placeholder="Zip Code" value={signupData.zip} onChange={(e) => setSignupData({ ...signupData, zip: e.target.value })} className="input-field" required />
                <input type="text" name="country" placeholder="Country" value={signupData.country} onChange={(e) => setSignupData({ ...signupData, country: e.target.value })} className="input-field" required />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold uppercase tracking-wider transition duration-300 shadow-md hover:shadow-lg text-base">
                {loading ? "Signing up..." : "Sign Up"}
              </motion.button>
            </motion.form>
          )}

          {/* Email Verification */}
          {showVerification && (
            <div className="w-full flex flex-col gap-3 mt-3">
              <p className="text-sm text-center text-gray-300">Enter the verification code sent to your email</p>
              <input type="text" placeholder="Enter code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="input-field" />
              <motion.button onClick={handleVerify} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold uppercase tracking-wider transition duration-300 shadow-md hover:shadow-lg text-sm">
                Verify Email
              </motion.button>
            </div>
          )}

          {/* Toggle Link */}
          <p className="text-center w-full text-sm text-gray-300 mt-2">
            {isLogin ? (
              <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-green-400 font-medium hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-green-400 font-medium hover:underline">Login</button></>
            )}
          </p>

          {/* Styles */}
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
        </motion.div>
      </div>
    </div>
  );
};


export default SellerLogin;
