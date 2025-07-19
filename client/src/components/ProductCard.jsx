import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return product && (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-tr from-white via-primary/5 to-white min-w-56 max-w-56 w-full overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/30"
    >
      {/* Product Image */}
      <div className="flex items-center justify-center h-40 px-3 bg-gradient-to-br from-gray-50 via-white to-gray-100 group-hover:scale-105 transition-all duration-300">
        <img
          className="group-hover:scale-110 transition-transform duration-300 max-h-32 drop-shadow-sm"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 text-gray-600 text-sm space-y-2">
        <p className="uppercase tracking-wide text-[11px] text-primary font-semibold">{product.category}</p>
        <p className="text-gray-800 font-bold text-base truncate tracking-tight">{product.name}</p>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-xs">
          {Array(5).fill('').map((_, i) => (
            <img key={i} className="w-4 h-4" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="rating" />
          ))}
          <p className="ml-1 text-gray-500">(4)</p>
        </div>

        {/* Price and Cart Actions */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-primary font-bold text-lg">
            {currency}{product.offerPrice}{" "}
            <span className="text-gray-400 line-through text-sm font-medium">
              {currency}{product.price}
            </span>
          </p>

          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-semibold shadow-sm"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart_icon" className="w-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-md text-sm font-semibold shadow-md">
                <button onClick={() => removeFromCart(product._id)} className="text-lg px-2 hover:text-red-500 transition">-</button>
                <span className="w-5 text-center">{cartItems[product._id]}</span>
                <button onClick={() => addToCart(product._id)} className="text-lg px-2 hover:text-green-600 transition">+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
