import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showVerification, setShowVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(`/api/user/${state}`, {
        name, email, password
      });

      if (data.success) {
        if (state === "register") {
          setShowVerification(true);
          toast.success("Verification code sent to email");
        } else {
          navigate('/');
          setUser(data.user);
          setShowUserLogin(false);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const { data } = await axios.post("/api/user/verify-email", {
        email,
        code,
      });
      if (data.success) {
        toast.success("Email verified successfully. You can now login.");
        setShowVerification(false);
        setState("login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 right-0 bottom-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
    >
      <motion.form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] rounded-xl shadow-2xl border border-gray-100 bg-gradient-to-br from-white via-[#f9f9ff] to-[#f1f5ff] glass-card transition-all animate-slide-up"
      >
        <p className="text-2xl font-semibold m-auto text-gray-800 tracking-wide">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type your name"
              className="border border-gray-300 rounded-md w-full p-2 outline-none focus:ring-2 focus:ring-primary/50 transition duration-200 shadow-sm focus:shadow-md bg-white/90"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
            className="border border-gray-300 rounded-md w-full p-2 outline-none focus:ring-2 focus:ring-primary/50 transition duration-200 shadow-sm focus:shadow-md bg-white/90"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-sm font-medium text-gray-600 mb-1">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="********"
            className="border border-gray-300 rounded-md w-full p-2 outline-none focus:ring-2 focus:ring-primary/50 transition duration-200 shadow-sm focus:shadow-md bg-white/90"
            type="password"
            required
          />
        </div>

        {showVerification && (
          <>
            <div className="w-full">
              <p className="text-sm font-medium text-gray-600 mb-1">Verification Code</p>
              <input
                onChange={(e) => setCode(e.target.value)}
                value={code}
                placeholder="Enter 6-digit code"
                className="border border-gray-300 rounded-md w-full p-2"
                type="text"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleVerifyEmail}
              className="bg-green-600 text-white w-full py-2 rounded-md font-semibold mt-2 shadow-md"
            >
              Verify Email
            </motion.button>
          </>
        )}

        {!showVerification && (
          <>
            <p className="text-sm text-gray-600">
              {state === "register" ? "Already have an account?" : "Create an account?"}{" "}
              <span
                onClick={() => setState(state === "register" ? "login" : "register")}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Click here
              </span>
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md font-semibold text-sm tracking-wide mt-2 shadow-md"
            >
              {state === "register" ? "Create Account" : "Login"}
            </motion.button>
          </>
        )}
      </motion.form>
    </div>
  );
};

export default Login;
