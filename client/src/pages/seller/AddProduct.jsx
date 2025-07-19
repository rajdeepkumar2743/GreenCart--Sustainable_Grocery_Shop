import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // ✅ Added for animation

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const { axios } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        toast.success(data.message);
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
     className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gradient-to-br from-[#f1fdf7] via-white to-[#eef2f9] px-2 md:px-4 py-6"

    >
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-10 max-w-xl mx-auto border border-gray-200"
      >
        <div>
          <p className="text-xl font-semibold text-gray-800 mb-3 tracking-wide">Product Image</p>
          <div className="flex flex-wrap items-center gap-4">
            {Array(4)
              .fill('')
              .map((_, index) => (
                <motion.label
                  key={index}
                  htmlFor={`image${index}`}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer transition-transform duration-200"
                >
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="w-16 h-16 object-cover border border-gray-300 rounded-lg shadow hover:shadow-md transition bg-white"
                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                    alt="upload"
                  />
                </motion.label>
              ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="product-name" className="text-base font-medium text-gray-800">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="product-description" className="text-base font-medium text-gray-800">
            Product Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="product-description"
            rows={4}
            placeholder="Type here..."
            className="outline-none py-2 px-3 rounded border border-gray-300 resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          ></textarea>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-base font-medium text-gray-800">
            Category
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            id="category"
            className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Offer Price */}
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 flex flex-col gap-1 min-w-[150px]">
            <label htmlFor="product-price" className="text-base font-medium text-gray-800">
              Product Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 min-w-[150px]">
            <label htmlFor="offer-price" className="text-base font-medium text-gray-800">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="px-8 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dull transition duration-200 w-full"
        >
          ADD
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddProduct;
