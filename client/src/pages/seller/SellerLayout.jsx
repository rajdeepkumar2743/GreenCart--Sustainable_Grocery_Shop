import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SellerLayout = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [sellerName, setSellerName] = useState(""); // 👈 Add seller name state

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
        window.location.reload(); // clear state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Check seller authentication on mount
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (!data.success) {
        toast.error("Not Authorized");
        navigate("/seller-login");
      } else {
        setSellerName(data.seller.name); // ✅ Store seller name
        setAuthChecked(true); // ✅ Only show layout after auth check
      }
    } catch (error) {
      navigate("/seller-login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!authChecked) return null; // or show a spinner

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 md:px-8 border-b border-gray-100 py-4 bg-green-50 backdrop-blur-md shadow-lg sticky top-0 z-30"
      >
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="cursor-pointer w-32 md:w-36 drop-shadow-md hover:scale-105 transition duration-300"
          />
        </Link>
        <div className="flex items-center gap-4 text-gray-700 font-medium text-sm">
          <p className="hidden sm:block tracking-wide text-gray-800">
            Hi! {sellerName?.split(" ")[0] || "Seller"}
          </p>
          <button
            onClick={logout}
            className="border border-green-300 px-4 py-1.5 rounded-full bg-white hover:bg-green-400 hover:text-white hover:shadow-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Layout */}
      <div className="flex bg-gradient-to-tr from-[#f0fcf4] via-[#fdfdfd] to-[#e8f0ff] min-h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="md:w-64 w-16 border-r h-[95vh] bg-gray-800 border-gray-200 shadow-md text-base pt-6 flex flex-col transition-all"
        >
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 transition-all duration-200 ease-in-out font-medium
                ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                    : "hover:bg-green-100 hover:text-primary text-gray-100"
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg p-1.5 shadow-sm"
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
              </motion.div>
              <p className="md:block hidden text-sm tracking-wide">{item.name}</p>
            </NavLink>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 bg-transparent p-4 md:p-8"
        >
          <Outlet />
        </motion.div>
      </div>
    </>
  );
};

export default SellerLayout;
