import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

// 🌍 Axios Global Setup
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// 🔗 Context Creation
export const AppContext = createContext();

// 🧠 App Provider
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // 🌐 ENV & Defaults
  const currency = import.meta.env.VITE_CURRENCY;
  const [loading, setLoading] = useState(true);

  // 👥 User & Seller
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // 🛒 Cart & Products
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // ✅ Seller Auth
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ User Auth
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch {
      setUser(null);
    }
  };

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      data.success
        ? setProducts(data.products)
        : toast.error(`⚠️ ${data.message}`);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    }
  };

  // ➕ Add to Cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("🛒 Added to cart");
  };

  // 🔁 Update Quantity
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("✅ Cart updated");
  };

  // ➖ Remove Item
  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId]--;
      if (cartData[itemId] === 0) delete cartData[itemId];
      setCartItems(cartData);
      toast.success("🗑️ Removed from cart");
    }
  };

  // 🧮 Total Item Count
  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // 💰 Total Amount
  const getCartAmount = () => {
    return Math.floor(
      Object.entries(cartItems).reduce((total, [itemId, qty]) => {
        const item = products.find((p) => p._id === itemId);
        return item ? total + item.offerPrice * qty : total;
      }, 0) * 100
    ) / 100;
  };

  // 📥 Initial Data Load
  useEffect(() => {
    Promise.all([fetchUser(), fetchSeller(), fetchProducts()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // 🔁 Sync Cart with Server
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        toast.error(`🔄 Sync failed: ${error.message}`);
      }
    };

    if (user) updateCart();
  }, [cartItems]);

  // 🌍 Shared Context
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    currency,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    loading, // optional loader flag
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 📦 Hook
export const useAppContext = () => useContext(AppContext);
