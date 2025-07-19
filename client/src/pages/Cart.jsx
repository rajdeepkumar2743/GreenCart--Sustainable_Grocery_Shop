import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) return toast.error("Please select an address");

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
        return;
      }

      // Razorpay Online Payment
      const { data } = await axios.post("/api/order/razorpay", {
        userId: user._id,
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => openRazorpay(data);
      } else {
        openRazorpay(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openRazorpay = (data) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      handler: function (response) {
        toast.success("Payment successful!");
        setCartItems({});
        navigate("/my-orders");
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: { color: "#4F46E5" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  const cartTotal = getCartAmount();
  const shippingFee = cartTotal >= 150 ? 0 : 20;
  const tax = cartArray.reduce(
    (acc, item) => acc + item.offerPrice * item.quantity * 0.04,
    0
  );
  const totalAmount = cartTotal + shippingFee + tax;

  return products.length > 0 && cartItems ? (
    <motion.div
      className="flex flex-col md:flex-row mt-16 px-4 md:px-10 lg:px-16 xl:px-24 pb-16 gap-10 bg-gradient-to-br from-[#f4f9ff] to-[#e9f0ff] min-h-screen font-[Inter]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-[#1a202c] tracking-tight">
          🛒 Your Cart{" "}
          <span className="text-sm text-[#4F46E5] font-medium ml-2">
            ({getCartCount()} Items)
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-semibold pb-3 border-b border-gray-300 mb-4">
          <p>Product</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] border-b border-gray-200 py-4 items-center text-gray-700 hover:bg-white hover:shadow-md transition rounded-xl"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center shadow-sm hover:shadow-lg"
              >
                <img
                  className="w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <p className="text-xs text-gray-500">
                  Weight: {product.weight || "N/A"}
                </p>
                <div className="flex items-center mt-1">
                  <p className="text-sm">Qty:</p>
                  <select
                    onChange={(e) =>
                      updateCartItem(product._id, Number(e.target.value))
                    }
                    value={cartItems[product._id]}
                    className="ml-2 border rounded px-2 py-1 outline-none text-sm shadow-sm"
                  >
                    {Array(
                      cartItems[product._id] > 9 ? cartItems[product._id] : 9
                    )
                      .fill("")
                      .map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center font-semibold text-gray-800">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <motion.button
              onClick={() => removeFromCart(product._id)}
              className="mx-auto p-1 rounded hover:scale-110 transition"
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6 h-6 opacity-80"
              />
            </motion.button>
          </motion.div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mt-8 text-[#4F46E5] font-semibold hover:underline flex items-center gap-2 transition-all"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="w-5 h-5"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <motion.div
        className="max-w-sm w-full bg-white shadow-xl p-6 rounded-2xl border border-gray-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-[#1f2937] mb-4">Order Summary</h2>
        <hr className="my-4 border-gray-200" />

        {/* Address Section */}
        <div className="mb-6 space-y-4 text-sm text-gray-600">
          <p className="font-semibold uppercase text-xs">Delivery Address</p>
          <p>
            {selectedAddress
              ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
              : "No address selected"}
          </p>
          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-blue-600 text-xs hover:underline"
          >
            Change
          </button>
          {showAddress && (
            <div className="bg-white shadow-lg rounded-lg border mt-2">
              {addresses.map((address, index) => (
                <p
                  key={index}
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                >
                  {address.street}, {address.city}, {address.state}, {address.country}
                </p>
              ))}
              <p
                onClick={() => navigate("/add-address")}
                className="text-blue-500 px-3 py-2 hover:bg-blue-50 cursor-pointer text-center"
              >
                + Add new address
              </p>
            </div>
          )}

          <p className="font-semibold uppercase text-xs mt-4">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        {/* Price Breakdown */}
<div className="text-sm space-y-2 text-gray-700">
  <p className="flex justify-between">
    <span>Price</span>
    <span>{currency}{cartTotal.toFixed(2)}</span>
  </p>

  <p className="flex justify-between">
    <span>Shipping Fee</span>
    <span className={shippingFee === 0 && cartArray.length > 0 ? "text-green-600" : ""}>
      {cartArray.length === 0
        ? `${currency}0`
        : shippingFee === 0
        ? "Free"
        : `${currency}${shippingFee}`}
    </span>
  </p>

  <p className="flex justify-between">
    <span>Tax (4%)</span>
    <span>{currency}{tax.toFixed(2)}</span>
  </p>

  <p className="flex justify-between font-semibold text-lg mt-3">
    <span>Total</span>
    <span>
      {currency}
      {cartArray.length === 0 ? "0.00" : totalAmount.toFixed(2)}
    </span>
  </p>
</div>

        <motion.button
          onClick={placeOrder}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 py-3 bg-[#4F46E5] text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </motion.button>
      </motion.div>
    </motion.div>
  ) : null;
};

export default Cart;
