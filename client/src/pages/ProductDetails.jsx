import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const filtered = products.filter((item) => product.category === item.category && item._id !== id);
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [products, id, product]);

  useEffect(() => {
    setThumbnail(product?.image[0] || null);
  }, [product]);

  return product && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-16 px-6 md:px-10 xl:px-28 pb-20 bg-gradient-to-br from-[#f8faff] via-[#eef2ff] to-[#eaf0ff] min-h-screen font-[Inter]"
    >
      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-sm text-gray-500 mb-4"
      >
        <Link to={"/"} className="hover:text-primary">Home</Link> /
        <Link to={"/products"} className="hover:text-primary"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary"> {product.category}</Link> /
        <span className="text-primary font-medium"> {product.name}</span>
      </motion.p>

      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        <div className="flex gap-4 md:gap-6">
          <div className="flex flex-col gap-3">
            {product.image.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                onClick={() => setThumbnail(image)}
                className={`border-2 ${thumbnail === image ? "border-primary" : "border-gray-300"} rounded cursor-pointer overflow-hidden transition`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-20 h-20 object-cover" />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border border-gray-300 rounded overflow-hidden max-w-sm md:max-w-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img src={thumbnail} alt="Selected product" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <motion.h1
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.name}
          </motion.h1>

          <div className="flex items-center gap-1 mt-2">
            {Array(5).fill('').map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
                className="w-4 h-4"
              />
            ))}
            <p className="text-sm text-gray-500 ml-2">(4)</p>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-gray-400 line-through text-base">MRP: {currency}{product.price}</p>
            <p className="text-2xl font-semibold text-indigo-600">Offer Price: {currency}{product.offerPrice}</p>
            <p className="text-sm text-gray-400">(inclusive of all taxes)</p>
          </div>

          <div className="mt-6">
            <p className="text-base font-medium text-gray-700 mb-2">About Product</p>
            <ul className="list-disc ml-5 text-gray-500/80 space-y-1 text-sm">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ backgroundColor: "#e2e8f0" }}
              onClick={() => addToCart(product._id)}
              className="w-full sm:w-1/2 py-3 bg-gray-100 text-gray-700 font-medium rounded transition"
            >
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ backgroundColor: "#5c6bc0" }}
              onClick={() => { addToCart(product._id); navigate("/cart"); }}
              className="w-full sm:w-1/2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition"
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Related Products</h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mt-2"></div>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {relatedProducts.filter((p) => p.inStock).map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { navigate('/products'); scrollTo(0, 0); }}
          className="block mx-auto mt-12 px-10 py-2.5 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-100 transition"
        >
          See More
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
