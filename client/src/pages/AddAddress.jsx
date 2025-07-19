import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Input Field Component (Enhanced Styles)
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none text-gray-700 bg-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm hover:shadow-md"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', { address });
      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/cart');
    }
  }, []);

  return (
    <motion.div
      className="mt-16 pb-16 px-4 sm:px-8 min-h-screen bg-gradient-to-br from-[#f8f9fc] via-[#edf1fd] to-[#e6e9ff] font-[Inter]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.p
        className="text-3xl font-extrabold text-center md:text-left text-gray-800"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        Add Shipping <span className="text-indigo-600">Address</span>
      </motion.p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10 gap-12">
        {/* Form Section */}
        <motion.div
          className="flex-1 max-w-md bg-white rounded-xl shadow-lg p-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <form onSubmit={onSubmitHandler} className="space-y-4 mt-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name" />
              <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name" />
            </div>

            <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email address" />
            <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street" />

            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" />
              <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="zipcode" type="number" placeholder="Zip code" />
              <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" />
            </div>

            <InputField handleChange={handleChange} address={address} name="phone" type="text" placeholder="Phone" />

            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold text-sm uppercase tracking-wide transition shadow-md hover:shadow-lg"
            >
              Save address
            </button>
          </form>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <img
            className="w-full max-w-sm md:mr-10 mb-10 md:mb-0 rounded-xl shadow-xl hover:scale-105 transition duration-300"
            src={assets.add_address_iamge}
            alt="Add Address"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddAddress;
